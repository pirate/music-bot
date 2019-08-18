
const FB_EMAIL = process.env.FB_EMAIL
const FB_PASS = process.env.FB_PASS
const CACHE_FILE = 'session_cache.json'

// **************************** Bot Boilerplate ********************************

function getBotCredentials() {
    try {
        const cached_session = fs.readFileSync(CACHE_FILE, 'utf8')
        return {appState: JSON.parse(cached_session)}
    } catch(e) {
        if (!FB_PASS || !FB_EMAIL) {
            // Hint: you can store these in secrets.env and source that file before running
            console.log('You must define FB_EMAIL=... FB_PASS=... as environment variables')
            throw 'Secrets not configured.'
        }
        return {email: FB_EMAIL, password: FB_PASS}
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


export function Bot(handleMessage) {
    login(getBotCredentials(), (err, api) => {
        if(err) return console.error(err);

        setBotCredentials(api)
        startBotListening(api, handleMessage)
    });
}
