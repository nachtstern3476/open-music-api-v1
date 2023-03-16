const autoBind = require('auto-bind');
const config = require('./../../utils/config');

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
        const { id } = request.params;
        const oldFilename = await this._service.getAlbumCoverById(id);
        const filename = await this._storageService.writeFile(cover, cover.hapi);

        await this._storageService.unlinkFile(oldFilename);
        await this._service.addAlbumCover(id, filename);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah'
        });

        response.code(201);
        return response;
    }

    async postAlbumLikeHandler (request, h) {
        const { id } = request.params;
        const { id: userId } = request.auth.credentials;

        const action = await this._service.likeAlbum(userId, id);
        const message = action === 'INSERT' ? 'like' : 'unlike';
        const response = h.response({
            status: 'success',
            message: `Berhasil ${message} album`
        });
        response.code(201);
        return response;
    }

    async getAlbumByIdHandler (request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        if (album.coverUrl) {
            album.coverUrl = `http://${config.app.host}:${config.app.port}/albums/cover/${album.coverUrl}`;
        }

        return {
            status: 'success',
            data: { album }
        };
    }

    async getAlbumLikeHandler (request, h) {
        const { id } = request.params;
        const { likes, isCache } = await this._service.getLikeCount(id);

        const response = h.response({
            status: 'success',
            data: { likes }
        });

        if (isCache) response.header('X-Data-Source', 'cache');

        return response;
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
