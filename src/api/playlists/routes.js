const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistsHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistsHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistsSongsHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistsSongsHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistsSongsHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    }
];

module.exports = routes;
