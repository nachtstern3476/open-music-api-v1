const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const ClientError = require('../execption/ClientError');
const NotFoundError = require('../execption/NotFoundError');

class AlbumsService {
    constructor () {
        this._pool = new Pool();
    }

    async addAlbum ({ name, year }) {
        const id = `album-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, year]
        };

        const result = await this._pool.query(query).catch(e => {
            throw new ClientError('Gagal menambahkan album, harap coba lagi');
        });

        return result.rows[0].id;
    }

    async getAlbumById (id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id=$1',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Album dengan id '${id}' tidak ditemukan`);
        }

        const songQuery = {
            text: 'SELECT id, title, performer FROM songs WHERE "albumId"=$1',
            values: [id]
        };

        const songs = await this._pool.query(songQuery);
        result.rows[0].songs = songs.rows;
        return result.rows[0];
    }

    async updateAlbumById (id, { name, year }) {
        const query = {
            text: 'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
            values: [name, year, id]
        };

        const result = await this._pool.query(query).catch(e => {
            throw new ClientError('Gagal memperbarui album, harap coba lagi');
        });

        if (!result.rowCount) {
            throw new NotFoundError(`Album dengan id '${id}' tidak ditemukan`);
        }
    }

    async deleteAlbumById (id) {
        const query = {
            text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query).catch(e => {
            throw new ClientError('Gagal menghapus album, harap coba lagi');
        });

        if (!result.rowCount) {
            throw new NotFoundError(`Album dengan id '${id}' tidak ditemukan`);
        }
    }
}

module.exports = AlbumsService;
