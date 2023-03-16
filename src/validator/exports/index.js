const InvariantError = require('./../../execption/InvariantError');
const { ExportPlaylistPayloadSchema } = require('./scheme');

const ExportValidator = {
    validateExportPayload: (payload) => {
        const validationResult = ExportPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError('Request data tidak valid');
        }
    }
};

module.exports = ExportValidator;
