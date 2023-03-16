const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postAlbumCoverHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000
            }
        }
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postAlbumLikeHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumByIdHandler
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getAlbumLikeHandler
    },
    {
        method: 'GET',
        path: '/albums/cover/{param}',
        handler: {
            directory: {
                path: 'src/uploads/images'
            }
        }
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumByIdHandler
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumByIdHandler
    }
];

module.exports = routes;
