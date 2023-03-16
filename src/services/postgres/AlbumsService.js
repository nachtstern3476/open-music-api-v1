const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../execption/InvariantError');
const NotFoundError = require('../../execption/NotFoundError');

class AlbumsService {
    constructor (cacheService) {
        this._pool = new Pool();
        this._cache = cacheService;
    }

    async addAlbum ({ name, year }) {
        const id = `album-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, year]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('Gagal menambahkan album, harap coba lagi');
        }

        return result.rows[0].id;
    }

    async addAlbumCover (id, filename) {
        const query = {
            text: 'UPDATE albums SET cover=$1 WHERE id=$2',
            values: [filename, id]
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Gagal menambahkan cover album, harap coba lagi');
        }
    }

    async getAlbumCoverById (id) {
        const query = {
            text: 'SELECT cover FROM albums WHERE id=$1',
            values: [id]
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError(`Album dengan id '${id}' tidak ditemukan`);
        }

        return result.rows[0].cover;
    }

    async likeAlbum (userId, albumId) {
        const checkForAlbum = {
            text: 'SELECT * FROM albums WHERE id=$1',
            values: [albumId]
        };

        const checkAlbum = await this._pool.query(checkForAlbum);
        if (!checkAlbum.rowCount) {
            throw new NotFoundError(`Album dengan id '${albumId}' tidak ditemukan`);
        }

        const checkForLike = {
            text: 'SELECT * FROM album_likes WHERE user_id=$1',
            values: [userId]
        };

        const checkLike = await this._pool.query(checkForLike);
        const query = {
            text: '',
            values: [userId, albumId]
        };

        if (checkLike.rowCount) {
            query.text = 'DELETE FROM album_likes WHERE user_id=$1 AND album_id=$2';
        } else {
            query.text = 'INSERT INTO album_likes (user_id, album_id) VALUES($1, $2)';
        }

        const result = await this._pool.query(query);
        await this._cache.delete(`albumLikes:${albumId}`);
        return result.command;
    }

    async getAlbumById (id) {
        const query = {
            text: 'SELECT *, cover AS "coverUrl" FROM albums WHERE id=$1',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Album dengan id '${id}' tidak ditemukan`);
        }

        const songQuery = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id=$1',
            values: [id]
        };

        const songs = await this._pool.query(songQuery);
        result.rows[0].songs = songs.rows;
        return result.rows[0];
    }

    async getLikeCount (id) {
        try {
            const likes = await this._cache.get(`albumLikes:${id}`);

            return { likes: parseInt(likes), isCache: true };
        } catch (error) {
            const query = {
                text: 'SELECT * FROM album_likes WHERE album_id=$1',
                values: [id]
            };

            const { rowCount } = await this._pool.query(query);
            await this._cache.set(`albumLikes:${id}`, rowCount);
            return { likes: rowCount, isCache: false };
        }
    }

    async updateAlbumById (id, { name, year }) {
        const query = {
            text: 'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
            values: [name, year, id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Album dengan id '${id}' tidak ditemukan`);
        }
    }

    async deleteAlbumById (id) {
        const query = {
            text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError(`Album dengan id '${id}' tidak ditemukan`);
        }
    }
}

module.exports = AlbumsService;
