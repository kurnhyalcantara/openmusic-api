const ClientError = require('../../exceptions/ClientError');

class SongHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
  }

  async postSongHandler(req, h) {
    try {
      this._validator.validateSongSchema(req.payload);
      const {
        title,
        year,
        genre,
        performer,
        duration = 0,
        albumId = '',
      } = req.payload;

      const songId = await this._services.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });
      return h
        .response({
          status: 'success',
          data: {
            songId: songId,
          },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(error.statusCode);
      }
      return h
        .response({
          status: 'fail',
          message: `Terjadi kesalahan di sisi server: ${error.message}`,
        })
        .code(500);
    }
  }
}

module.exports = SongHandler;
