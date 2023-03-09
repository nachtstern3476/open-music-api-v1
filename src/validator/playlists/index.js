const InvariantError = require('../../execption/InvariantError');
const { PostPlaylistsPayloadSchema, PlaylistSongPayloadSchema } = require('./scheme');

const PlaylistsValidator = {
    validatePostPlaylistsPayload: (payload) => {
        const validationResult = PostPlaylistsPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    },

    validatePlaylistsSongPayload: (payload) => {
        const validationResult = PlaylistSongPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    }
};

module.exports = PlaylistsValidator;
