const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const ClientError = require('../execption/ClientError');
const NotFoundError = require('../execption/NotFoundError');
const AuthorizationError = require('../execption/AuthorizationError');

class PlaylistsService {
    constructor () {
        this._pool = new Pool();
    }

    async addPlaylist (name, owner) {
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new ClientError('Gagal menambahkan playlist, harap coba lagi');
        }

        return result.rows[0].id;
    }

    async getPlaylists (owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
                FROM playlists
                LEFT JOIN users ON users.id = playlists.owner
                WHERE owner=$1`,
            values: [owner]
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deletePlaylist (id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Playlist dengan id '${id}' tidak ditemukan`);
        }
    }

    async addPlaylistsSong (playlistId, songId) {
        const query = {
            text: 'INSERT INTO playlists_songs (playlist_id, song_id) VALUES($1, $2) RETURNING id',
            values: [playlistId, songId]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new ClientError('Gagal menambahkan lagu, harap coba lagi');
        }
    }

    async getPlaylistSongs (id) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
                LEFT JOIN playlists_songs
                ON songs.id = playlists_songs.song_id
                WHERE playlists_songs.playlist_id = $1`,
            values: [id]
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getPlaylistsById (id, owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
                FROM playlists
                LEFT JOIN users ON users.id = playlists.owner
                WHERE playlists.id=$1 AND playlists.owner=$2`,
            values: [id, owner]
        };

        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async deletePlaylistSong (id, songId) {
        const query = {
            text: 'DELETE FROM playlists_songs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
            values: [id, songId]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new ClientError('Gagal menghapus lagu dari playlist, harap coba lagi');
        }
    }

    async validatePlaylistOwner (id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Playlist dengan id '${id}' tidak ditemukan`);
        }

        const playlist = result.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = PlaylistsService;
