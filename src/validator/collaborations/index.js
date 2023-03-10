const InvariantError = require('../../execption/InvariantError');
const { CollaborationsPayloadSchema } = require('./schema');

const CollaborationsValidator = {
    validateCollaborationsPayload: (payload) => {
        const validator = CollaborationsPayloadSchema.validate(payload);
        if (validator.error) {
            throw new InvariantError('Request data tidak valid');
        }
    }
};

module.exports = CollaborationsValidator;
