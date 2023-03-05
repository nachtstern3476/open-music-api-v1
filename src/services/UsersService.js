const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const ClientError = require('../execption/ClientError');
const InvariantError = require('../execption/InvariantError');
const AuthenticationError = require('../execption/AuthenticationError');

class UsersService {
    constructor () {
        this._pool = new Pool();
    }

    async addUser ({ username, password, fullname }) {
        await this.checkDuplicateUsername(username);

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname]
        };

        const result = await this._pool.query(query).catch(e => {
            throw new ClientError('Gagal menambahkan user, harap coba lagi');
        });

        return result.rows[0].id;
    }

    async checkDuplicateUsername (username) {
        const query = {
            text: 'SELECT * FROM users WHERE username=$1',
            values: [username]
        };

        const result = await this._pool.query(query);
        if (result.rowCount > 0) {
            throw new InvariantError('Gagal menambahkan user. Username telah digunakan');
        }
    }

    async verifyUserCredential ({ username, password }) {
        const query = {
            text: 'SELECT * FROM users WHERE username=$1',
            values: [username]
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new AuthenticationError('Kredensial yang anda berikan salah');
        }

        const { id, password: hashedPassword } = result.rows[0];
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            throw new AuthenticationError('Kredensial yang anda berikan salah');
        }

        return id;
    }
}

module.exports = UsersService;
