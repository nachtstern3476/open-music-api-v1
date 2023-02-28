const InvariantError = require('../../execption/InvariantError');
const { AlbumPayloadSchema } = require('./scheme');

const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload);

        if (!validationResult) {
            throw new InvariantError('Data tidak valid');
        }
    }
};

module.exports = AlbumsValidator;
