const autoBind = require('auto-bind');

class AlbumsHandler {
    constructor (service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postAlbumHandler (request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const albumId = await this._service.addAlbum(request.payload);

        const response = h.response({
            status: 'success',
            data: { albumId }
        });

        response.code(201);
        return response;
    }

    async getAlbumByIdHandler (request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
            status: 'success',
            data: { album }
        };
    }

    async putAlbumByIdHandler (request) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;
        await this._service.updateAlbumById(id, request.payload);
        return {
            status: 'success',
            message: 'Berhasil memperbarui album'
        };
    }

    async deleteAlbumByIdHandler (request) {
        const { id } = request.params;
        await this._service.deleteAlbumById(id);
        return {
            status: 'success',
            message: 'Berhasil menghapus album'
        };
    }
}

module.exports = AlbumsHandler;
