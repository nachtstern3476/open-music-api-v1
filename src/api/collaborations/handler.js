const autoBind = require('auto-bind');
class CollaborationsHandler {
    constructor (collaborationsService, playlistsService, usersService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._usersService = usersService;
        this._validator = validator;

        autoBind(this);
    }

    async postCollaborationsHandler (request, h) {
        this._validator.validateCollaborationsPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._usersService.validateUserId(userId);
        await this._playlistsService.validatePlaylistOwner(playlistId, credentialId);
        const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

        const response = h.response({
            status: 'success',
            data: { collaborationId }
        });
        response.code(201);
        return response;
    }

    async deleteCollaborationsHandler (request, h) {
        this._validator.validateCollaborationsPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.validatePlaylistOwner(playlistId, credentialId);
        await this._collaborationsService.deleteCollaboration(playlistId, userId);

        return {
            status: 'success',
            message: 'Berhasil menghapus kolabolator playlist'
        };
    }
}
module.exports = CollaborationsHandler;
