const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor (playlistsService, songsService, validator) {
        this._playlistsService = playlistsService;
        this._songsService = songsService;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistsHandler (request, h) {
        this._validator.validatePostPlaylistsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { name } = request.payload;

        const playlistId = await this._playlistsService.addPlaylist(name, credentialId);
        const response = h.response({
            status: 'success',
            data: { playlistId }
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler (request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._playlistsService.getPlaylists(credentialId);
        return {
            status: 'success',
            data: { playlists }
        };
    }

    async deletePlaylistsHandler (request) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistsService.validatePlaylistOwner(playlistId, credentialId);
        await this._playlistsService.deletePlaylist(playlistId);

        return {
            status: 'success',
            message: 'Berhasil menghapus playlist'
        };
    }

    async postPlaylistsSongsHandler (request, h) {
        await this._validator.validatePlaylistsSongPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        await this._playlistsService.validatePlaylistAccess(playlistId, credentialId);

        const { songId } = request.payload;
        await this._songsService.getSongById(songId);
        await this._playlistsService.addPlaylistsSong(playlistId, songId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menambahkan lagu ke playlist'
        });
        response.code(201);
        return response;
    }

    async getPlaylistsSongsHandler (request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        await this._playlistsService.validatePlaylistAccess(playlistId, credentialId);

        const playlist = await this._playlistsService.getPlaylistSongs(playlistId);
        return {
            status: 'success',
            data: { playlist }
        };
    }

    async deletePlaylistsSongsHandler (request, h) {
        await this._validator.validatePlaylistsSongPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._playlistsService.validatePlaylistAccess(playlistId, credentialId);
        await this._playlistsService.deletePlaylistSong(playlistId, songId);

        return {
            status: 'success',
            message: 'Berahasil menghapus lagu dari playlists'
        };
    }
}

module.exports = PlaylistsHandler;
