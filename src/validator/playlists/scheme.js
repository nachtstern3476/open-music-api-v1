const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
    name: Joi.string().required()
});

const PlaylistSongPayloadSchema = Joi.object({
    songId: Joi.string().required()
});

module.exports = { PostPlaylistsPayloadSchema, PlaylistSongPayloadSchema };
