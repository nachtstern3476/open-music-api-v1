const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../execption/InvariantError');

class ActivitiesService {
    constructor () {
        this._pool = new Pool();
    }

    async addActivities (userId, playlistId, songId, action) {
        const id = `activity-${nanoid(16)}`;
        const time = new Date().toISOString();

        const query = {
            text: 'INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, userId, playlistId, songId, action, time]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw InvariantError('Gagal menambahkan aktivitas');
        }
    }

    async getActivities (playlistId) {
        const query = {
            text: `SELECT activities.action, activities.time, users.username, songs.title
            FROM activities
            LEFT JOIN users ON activities.user_id = users.id
            LEFT JOIN songs ON activities.song_id = songs.id
            WHERE playlist_id = $1`,
            values: [playlistId]
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = ActivitiesService;
