
const InvariantError = require('../../execption/InvariantError');
const { SongPayloadSchema } = require('./scheme');

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload);
        console.log(validationResult);
        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    }
};

module.exports = SongsValidator;
