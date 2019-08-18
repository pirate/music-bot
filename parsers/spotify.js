
// https://open.spotify.com/playlist/68QbTIMkw3Gl6Uv4PJaeTQ
const PLAYLIST_URL_REGEX = /open\.spotify\.com\/playlist\/.+/g

// TODO
const ALBUM_URL_REGEX = /open\.spotify\.com\/album\/.+/g
const SONG_URL_REGEX = /open\.spotify\.com\/song\/.+/g

const handlePlaylistURL = (url) => {
    console.log('[+] Got Spotify Playlist URL:', url)
}

const handleAlbumURL = (url) => {
    console.log('[+] Got Spotify Album URL:', url)
}

const handleSongURL = (url) => {
    console.log('[+] Got Spotify Song URL:', url)
}


const URL_PATTERNS = [
    [PLAYLIST_URL_REGEX, handlePlaylistURL],
    [ALBUM_URL_REGEX, handleAlbumURL],
    [SONG_URL_REGEX, handleSongURL],
]
