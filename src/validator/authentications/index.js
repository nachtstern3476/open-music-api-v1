const InvariantError = require('../../execption/InvariantError');
const { PostAuthenticationPayloadSchema, RefreshTokenAuthenticationPayloadSchema } = require('./scheme');

const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const validationResult = PostAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    },

    validateRefreshTokenAuthenticationPayload: (payload) => {
        const validationResult = RefreshTokenAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    }
};

module.exports = AuthenticationsValidator;
