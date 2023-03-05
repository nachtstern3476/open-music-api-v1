const InvariantError = require('../../execption/InvariantError');
const { UserPayloadSchema } = require('./scheme');

const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    }
};

module.exports = UsersValidator;
