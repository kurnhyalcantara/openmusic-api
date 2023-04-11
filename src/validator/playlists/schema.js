const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongInPlaylistsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongInPlaylistsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistsPayloadSchema,
  PostSongInPlaylistsPayloadSchema,
  DeleteSongInPlaylistsPayloadSchema,
};
