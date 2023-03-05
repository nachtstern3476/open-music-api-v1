const autoBind = require('auto-bind');

class AuthenticationsHandler {
    constructor (authService, usersService, tokenManager, validator) {
        this._authService = authService;
        this._userService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        autoBind(this);
    }

    async postAuthenticationHandler (request, h) {
        this._validator.validatePostAuthenticationPayload(request.payload);

        const id = await this._userService.verifyUserCredential(request.payload);
        const accessToken = this._tokenManager.generateAccessToken({ id });
        const refreshToken = this._tokenManager.generateRefreshToken({ id });

        this._authService.addRefreshToken(refreshToken);
        const response = h.response({
            status: 'success',
            data: { accessToken, refreshToken }
        });
        response.code(201);
        return response;
    }

    async putAuthenticationHandler (request, h) {
        this._validator.validateRefreshTokenAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authService.verifyRefreshToken(refreshToken);
        const id = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({ id });
        return {
            status: 'success',
            data: { accessToken }
        };
    }

    async deleteAuthenticationHandler (request, h) {
        this._validator.validateRefreshTokenAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authService.verifyRefreshToken(refreshToken);
        await this._authService.deleteRefreshToken(refreshToken);
        return {
            status: 'success',
            message: 'Refresh token berhasil dihapus'
        };
    }
}

module.exports = AuthenticationsHandler;
