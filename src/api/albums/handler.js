const ClientError = require('../../exceptions/ClientError');

class AlbumHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(req, h) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const { name, year } = req.payload;
      const albumId = await this._services.addAlbum({ name, year });
      return h
        .response({
          status: 'success',
          message: 'Album berhasil ditambahkan',
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
          message: `Terjadi kesalahan di server kami, ${error.message}`,
        })
        .code(500);
    }
  }

  async getAlbumsHandler() {
    const albums = await this._services.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const album = await this._services.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album: album,
        },
      };
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
          message: `Terjadi kesalahan di server kami, ${error.message}`,
        })
        .code(500);
    }
  }

  async putAlbumByIdHandler(req, h) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const { id } = req.params;
      await this._services.editAlbumById(id, req.payload);
      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
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
          message: `Terjadi kesalahan di server kami, ${error.message}`,
        })
        .code(500);
    }
  }

  async deleteAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._services.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(error.statusCode);
      }
      return h.response({
        status: 'fail',
        message: `Terjadi kesalahan di server kami, ${error.message}`,
      });
    }
  }
}

module.exports = AlbumHandler;
