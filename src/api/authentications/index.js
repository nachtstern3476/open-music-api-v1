const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: (server, { usersService, authService, tokenManager, validator }) => {
        const authenticationsHandler = new AuthenticationsHandler(authService, usersService, tokenManager, validator);
        server.route(routes(authenticationsHandler));
    }
};
