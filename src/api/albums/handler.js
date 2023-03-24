const ClientError = require('../../exceptions/ClientError');

class AlbumHandler {
  constructor(services) {
    this._services = services;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
  }

  async postAlbumHandler(req, h) {
    try {
      const { name, year } = req.payload;
      const albumId = await this._services.addAlbum({ name, year });
      return h
        .response({
          status: 'success',
          data: {
            albumId: albumId,
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
          message: error.message,
        })
        .code(500);
    }
  }
}

module.exports = AlbumHandler;
