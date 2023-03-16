const autoBind = require('auto-bind');

class AlbumsHandler {
    constructor (service, storageService, validator) {
        this._service = service;
        this._storageService = storageService;
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

    async postAlbumCoverHandler (request, h) {
        const { cover } = request.payload;

        this._validator.validateAlbumCoverPayload(cover.hapi.headers);
        const filename = await this._storageService.writeFile(cover, cover.hapi);

        const { id } = request.params;
        await this._service.addAlbumCover(id, filename);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah'
        });

        response.code(201);
        return response;
    }

    async getAlbumByIdHandler (request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        if (album.coverUrl) {
            album.coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/cover/${album.coverUrl}`;
        }

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
