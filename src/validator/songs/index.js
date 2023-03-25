const InvariantError = require('../../exceptions/InvariantError');
const SongPayloadSchema = require('./schema');

const SongValidator = {
  validateSongSchema: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator;
