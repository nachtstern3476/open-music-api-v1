const PlaylistsHandler = require('./hanlder');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: (server, { playlistsService, songsService, validator }) => {
        const playlistsHandler = new PlaylistsHandler(playlistsService, songsService, validator);
        server.route(routes(playlistsHandler));
    }
};
