const fs = require("fs");
const login = require("facebook-chat-api");

const spotify = require("./parsers/spotify.js");
const soundcloud = require("./parsers/soundcloud.js");
const applemusic = require("./parsers/applemusic.js");


const FB_EMAIL = process.env.FB_EMAIL
const FB_PASS = process.env.FB_PASS
const CACHE_FILE = 'session_cache.json'

const URL_REGEX = /(https?:\/\/[^\s]+)/g
const PARSEABLE_URL_PATTERNS = [
    ...spotify.URL_PATTERNS,
    ...soundcloud.URL_PATTERNS,
    ...applemusic.URL_PATTERNS,
]

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
                handleMessage(api, event)
                break;
            case "event":
                console.log("Event: ", event)
                break;
        }
    });
}


// ************************ Message Handling & Parsing *************************

function handleMessage(api, {body, threadID}) {
    const urls = message.match(URL_REGEX)
    if (!urls.length) return

    // For every URL present in the messge
    for (const url of urls) {
        const url_without_scheme = url.replace(/https?:\/\//, '')

        // 1. if message contains music URL, parse URL to song/album AppleID
        //    (otherwise ignore)
        const appleID = parseMusicURL(url_without_scheme)
        if (appleID) {
            // 2. add parsed apple ID to firebase: sources/messenger/{threadID}
            importAppleid(appleID)
            
            // 3. optional: send confirmation message to group chat with song.link + 
            //    linked appleid to make it easier for everyone to find the song in their
            //    respective services, (has the side effect of helping confirm the song
            //    was matched correctly by currents, or allowing the user to fix it)
            sendConfirmationMessage(appleID, threadID)
        }
    }

    api.sendMessage("TEST BOT: " + body, threadID)
}

function parseMusicURL(url) {
    for (const [pattern, handler] of PARSEABLE_URL_PATTERNS) {
        if (url.match(pattern)) {
            return handler(url)
        }
    }
    return null
}

function importAppleID(appleID) {
    // TODO: add apple ID to firebase: sources/messenger/{threadID}
    console.log('TODO: Add Apple ID to firebase')
}

function sendConfirmationMessage(appleID, threadID)
    // TODO: get http://song.link fancy url for a given appleID
    const song_link = appleID

    // post link to group chat
    api.sendMessage("Imported to currents: " + song_link, threadID)
}


// ********************************* Main **************************************

function main() {
    login(getBotCredentials(), (err, api) => {
        if(err) return console.error(err);

        setBotCredentials(api)
        startBotListening(api, handleMessage)
    });
}

main()
