# music-bot
A facebook messenger bot that listens for music links in chats and converts them to Apple Music IDs.


## Quickstart

1. Copy `secrets.env.default` to `secrets.env` and add your FB bot user's login email and password inside of it
2. Install all the dependencies with `npm install` or `yarn install`
3. Run the messenger bot with `bash -c 'source secrets.env; node server.js'`


## Config

Settings are configured via environment variables, for convenience they are stored in the untracked `secrets.env` file:

```dotenv
FB_EMAIL=emailUsedToSignInToFacebook@example.com
FB_PASS=faceBookPasswordHere
```


## Architecture

- Bot server entrypoint:
    + `server.js`

- Listeners for different types of chat rooms:
    + `sources/messenger.js`
    + TODO: iMessage, WhatsApp, WeChat, etc.

- Parsers for different types of music urls:
    + `parsers/spotify.js`
    + `parsers/applemusic.js`
    + `parsers/soundcloud.js`
    + TODO: bandcamp, youtube, etc.
