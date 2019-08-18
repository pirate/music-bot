const messenger = require("./sources/messenger.js");

const spotify = require("./parsers/spotify.js");
const soundcloud = require("./parsers/soundcloud.js");
const applemusic = require("./parsers/applemusic.js");


const URL_REGEX = /(https?:\/\/[^\s]+)/g
const PARSEABLE_URL_PATTERNS = [
    ...spotify.URL_PATTERNS,
    ...soundcloud.URL_PATTERNS,
    ...applemusic.URL_PATTERNS,
]


// ************************ Message Handling & Parsing *************************

function handleAppleID(appleID) {
    // TODO: add apple ID to firebase: sources/messenger/{threadID}
    console.log('TODO: Add Apple ID to firebase')
}

function handleMessage(body, replyCallback) {
    const urls = message.match(URL_REGEX)
    if (!urls.length) return

    console.log('Got Message: ', body)

    // For every URL present in the messge
    for (const url of urls) {
        const url_without_scheme = url.replace(/https?:\/\//, '')

        console.log('Parsed URL: ', url_without_scheme)

        // 1. if message contains music URL, parse URL to song/album AppleID
        //    (otherwise ignore)
        const appleID = parseMusicURL(url_without_scheme)
        if (appleID) {
            // 2. add parsed apple ID to firebase: sources/messenger/{threadID}
            handleAppleID(appleID)
            
            // 3. optional: send confirmation message to group chat with song.link + 
            //    linked appleid to make it easier for everyone to find the song in their
            //    respective services, (has the side effect of helping confirm the song
            //    was matched correctly by currents, or allowing the user to fix it)

            // TODO: get http://song.link fancy url for a given appleID
            const song_link = appleID
            replyCallback("Imported to currents: " + song_link)
        }
    }
}

function parseMusicURL(url) {
    for (const [pattern, handler] of PARSEABLE_URL_PATTERNS) {
        if (url.match(pattern)) {
            return handler(url)
        }
    }
    return null
}

// ********************************* Main **************************************

function startBots() {
    messenger.Bot(handleMessage)

    // imessage.Bot(handleMessage)
    // whatsapp.Bot(handleMessage)
    // etc...
}

startBots()
