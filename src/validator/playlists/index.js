const InvariantError = require('../../exceptions/InvariantError');
const {
  PostPlaylistsPayloadSchema,
  PostSongInPlaylistsPayloadSchema,
  DeleteSongInPlaylistsPayloadSchema,
} = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistsPayload: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongInPlaylistPayload: (payload) => {
    const validationResult = PostSongInPlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteSongInPlaylistPayload: (payload) => {
    const validationResult =
      DeleteSongInPlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
