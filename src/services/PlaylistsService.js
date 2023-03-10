const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const ClientError = require('../execption/ClientError');
const NotFoundError = require('../execption/NotFoundError');
const AuthorizationError = require('../execption/AuthorizationError');

class PlaylistsService {
    constructor (collaborationsService) {
        this._pool = new Pool();
        this._collaborationService = collaborationsService;
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
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                WHERE playlists.owner=$1 OR collaborations.user_id=$1`,
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
            text: 'INSERT INTO playlist_songs (playlist_id, song_id) VALUES($1, $2) RETURNING id',
            values: [playlistId, songId]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new ClientError('Gagal menambahkan lagu, harap coba lagi');
        }
    }

    async getPlaylistSongs (id) {
        const queryPlaylists = {
            text: `SELECT playlists.id, playlists.name, users.username
                FROM playlists
                LEFT JOIN users ON playlists.owner = users.id
                WHERE playlists.id=$1`,
            values: [id]
        };

        const querySongs = {
            text: `SELECT songs.id, songs.title, songs.performer
                FROM songs
                LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
                WHERE playlist_songs.playlist_id =$1`,
            values: [id]
        };

        const resultPlaylists = await this._pool.query(queryPlaylists);
        const resultSongs = await this._pool.query(querySongs);

        resultPlaylists.rows[0].songs = resultSongs.rows;
        return resultPlaylists.rows[0];
    }

    async deletePlaylistSong (id, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
            values: [id, songId]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new ClientError('Gagal menghapus lagu dari playlist, harap coba lagi');
        }
    }

    async validatePlaylistAccess (playlistId, userId) {
        try {
            await this.validatePlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            try {
                await this._collaborationService.validateCollabolator(playlistId, userId);
            } catch {
                throw error;
            }
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
