const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: '_exports',
    version: '1.0.0',
    register: (server, { playlistsService, service, validator }) => {
        const exportsHanlder = new ExportsHandler(playlistsService, service, validator);

        server.route(routes(exportsHanlder));
    }
};
