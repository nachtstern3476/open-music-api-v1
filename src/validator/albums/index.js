const InvariantError = require('../../execption/InvariantError');
const { AlbumPayloadSchema, AlbumCoverPayloadSchema } = require('./scheme');

const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    },
    validateAlbumCoverPayload: (headers) => {
        const validationResult = AlbumCoverPayloadSchema.validate(headers);

        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    }
};

module.exports = AlbumsValidator;
