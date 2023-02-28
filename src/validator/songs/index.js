
const InvariantError = require('../../execption/InvariantError');
const { songPayloadSchema } = require('./scheme');

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult = songPayloadSchema.validate(payload);

        if (!validationResult) {
            throw new InvariantError();
        }
    }
};

module.exports = SongsValidator;
