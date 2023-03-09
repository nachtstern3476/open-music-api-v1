const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const ClientError = require('../execption/ClientError');
const NotFoundError = require('../execption/NotFoundError');

class SongsService {
    constructor () {
        this._pool = new Pool();
    }

    async addSong ({ title, year, genre, performer, duration = null, albumId = null }) {
        const id = `song-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new ClientError('Gagal menambahkan lagu, harap coba lagi');
        }

        return result.rows[0].id;
    }

    async getSongs ({ title = '', performer = '' }) {
        let text = 'SELECT id, title, performer FROM songs';
        let values = [];
        if (title) {
            text = 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1';
            values = [`%${title}%`];
        }

        if (performer) {
            text = 'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1';
            values = [`%${performer}%`];
        }

        if (title && performer) {
            text = 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2';
            values = [`%${title}%`, `%${performer}%`];
        }

        const query = { text, values };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getSongById (id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id=$1',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Lagu dengan id '${id}' tidak ditemukan`);
        }

        return result.rows[0];
    }

    async updateSongById (id, { title, year, genre, performer, duration = 0, albumId = '' }) {
        const query = {
            text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, "albumId"=$6 WHERE id=$7 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Lagu dengan id '${id}' tidak ditemukan`);
        }
    }

    async deleteSongById (id) {
        const query = {
            text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Lagu dengan id '${id}' tidak ditemukan`);
        }
    }
}

module.exports = SongsService;
