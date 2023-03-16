const autoBind = require('auto-bind');

class ExportsHandler {
    constructor (playlistService, service, validator) {
        this._service = service;
        this._playlistService = playlistService;
        this._validator = validator;

        autoBind(this);
    }

    async postExportPlaylistHandler (request, h) {
        this._validator.validateExportPayload(request.payload);

        const { id: userId } = request.auth.credentials;
        const { playlistId } = request.params;
        await this._playlistService.validatePlaylistAccess(playlistId, userId);

        const message = { playlistId, userId, targetEmail: request.payload.targetEmail };

        await this._service.sendMessage('export:playlists', JSON.stringify(message));
        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda sedang kami proses'
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;
