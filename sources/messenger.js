const fs = require("fs");
const login = require("facebook-chat-api");

const SECRETS_FILE = './secrets.env'
const CACHE_FILE = './session_cache.json'

// **************************** Bot Boilerplate ********************************

function loadConfig(path) {
    const config = {}
    for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
        const [key, value] = line.split('=')
        if (key.length) {
            config[key] = value
        }
    }
    return config
}

function getBotCredentials() {
    try {
        const cached_session = fs.readFileSync(CACHE_FILE, 'utf8')
        return {appState: JSON.parse(cached_session)}
    } catch(e) {
        const config = loadConfig(SECRETS_FILE)
        if (!config.FB_PASS || !config.FB_EMAIL) {
            console.log('You must define FB_EMAIL=... FB_PASS=... in:', SECRETS_FILE)
            throw 'Secrets not configured.'
        }
        return {email: config.FB_EMAIL, password: config.FB_PASS}
    }
}

function setBotCredentials(api) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(api.getAppState()))
}

function startBotListening(api, handleMessage) {
    api.setOptions({listenEvents: true})

    const stopListeningCallback = api.listen((err, event) => {
        if (err) return console.error(err)
        api.markAsRead(event.threadID, (err) => {
            if(err) console.error(err)
        });

        switch(event.type) {
            case "message":
                if (event.body === '/stop') {
                    api.sendMessage("Goodbye...", event.threadID)
                    return stopListeningCallback()
                }
                const replyCallback = (body) => {
                    api.sendMessage(body, event.threadID)
                }
                handleMessage(event.body, replyCallback)
                break;
            case "event":
                console.log("Event: ", event)
                break;
        }
    });
}


exports.Bot = function(handleMessage) {
    login(getBotCredentials(), (err, api) => {
        if(err) return console.error(err);

        setBotCredentials(api)
        startBotListening(api, handleMessage)
    });
}
