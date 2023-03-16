require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./utils/config');

const albums = require('./api/albums');
const AlbumsValidator = require('./validator/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const StorageService = require('./services/storage/StorageService');

const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

const users = require('./api/users');
const UsersValidator = require('./validator/users');
const UsersService = require('./services/postgres/UsersService');

const TokenManager = require('./tokenize/TokenManager');
const authentications = require('./api/authentications');
const AuthenticationsValidator = require('./validator/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');

const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistService = require('./services/postgres/PlaylistsService');

const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');

const ActivitiesService = require('./services/postgres/ActivitiesService');

const _exports = require('./api/exports');
const ExportsValidator = require('./validator/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');

const ClientError = require('./execption/ClientError');
const CacheService = require('./services/redis/CacheService');
const init = async () => {
    const cacheService = new CacheService();
    const albumsService = new AlbumsService(cacheService);
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistService(collaborationsService);
    const activitiesService = new ActivitiesService();
    const storageService = new StorageService(path.resolve(__dirname, 'uploads/images'));

    const server = Hapi.server({
        host: config.app.host,
        port: config.app.port,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.register([
        {
            plugin: Jwt
        },
        {
            plugin: Inert
        }
    ]);

    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id
            }
        })
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                storageService,
                validator: AlbumsValidator
            }
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            }
        },
        {
            plugin: authentications,
            options: {
                usersService,
                authService: authenticationsService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator
            }
        },
        {
            plugin: playlists,
            options: {
                playlistsService,
                songsService,
                activitiesService,
                validator: PlaylistsValidator
            }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                usersService,
                validator: CollaborationsValidator
            }
        },
        {
            plugin: _exports,
            options: {
                playlistsService,
                service: ProducerService,
                validator: ExportsValidator
            }
        }
    ]);

    server.ext('onPreResponse', function (request, h) {
        const { response } = request;
        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                });

                newResponse.code(response.code);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server'
            });

            newResponse.code(500);
            console.log(response);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
