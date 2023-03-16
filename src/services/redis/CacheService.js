const redis = require('redis');
const config = require('./../../utils/config');

class CacheService {
    constructor () {
        this._client = redis.createClient({
            socket: {
                host: config.redis.server
            }
        });

        this._client.on('error', (error) => {
            console.log(error);
        });

        this._client.connect();
    }

    async get (key) {
        const result = await this._client.get(key);
        if (result === null) throw new Error('Cache tidak ditemukan');

        return result;
    }

    async set (key, values, expirationInSecond = 1800) {
        await this._client.set(key, values, {
            EX: expirationInSecond
        });
    }

    delete (key) {
        this._client.del(key);
    }
}

module.exports = CacheService;
