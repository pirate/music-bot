
// https://music.apple.com/us/album/fear-inoculum/1475686696
const ALBUM_URL_REGEX = /msuic\.apple\.com\/..\/album\/.+/g
// TODO
const PLAYLIST_URL_REGEX = /msuic\.apple\.com\/playlist\/.+/g
const SONG_URL_REGEX = /msuic\.apple\.com\/song\/.+/g



const handlePlaylistURL = (url) => {
    console.log('[+] Got Apple Music Playlist URL:', url)
}

const handleAlbumURL = (url) => {
    console.log('[+] Got Apple Music Album URL:', url)
}

const handleSongURL = (url) => {
    console.log('[+] Got Apple Music Song URL:', url)
}



export const URL_PATTERNS = [
    [PLAYLIST_URL_REGEX, handlePlaylistURL],
    [ALBUM_URL_REGEX, handleAlbumURL],
    [SONG_URL_REGEX, handleSongURL],
]
