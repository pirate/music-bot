
// https://soundcloud.com/fandangoberlin/slipperycrisps
const PLAYLIST_URL_REGEX = /soundcloud\.com\/playlist\/.+/g
// TODO
const ALBUM_URL_REGEX = /soundcloud\.com\/album\/.+/g
const SONG_URL_REGEX = /soundcloud\.com\/song\/.+/g



const handlePlaylistURL = (url) => {
    console.log('[+] Got SoundCloud Playlist URL:', url)
}

const handleAlbumURL = (url) => {
    console.log('[+] Got SoundCloud Album URL:', url)
}

const handleSongURL = (url) => {
    console.log('[+] Got SoundCloud Song URL:', url)
}



export const URL_PATTERNS = [
    [PLAYLIST_URL_REGEX, handlePlaylistURL],
    [ALBUM_URL_REGEX, handleAlbumURL],
    [SONG_URL_REGEX, handleSongURL],
]
