class SongHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
  }

  async postSongHandler(req, h) {
    this._validator.validateSongSchema(req.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration = 0,
      albumId = 'single',
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
  }

  async getSongsHandler(req) {
    const { title, performer } = req.query;
    let songs = await this._services.getSongs();
    if (title) {
      const titleSearch = await songs.filter((song) =>
        Object.values(song).some((value) =>
          value.toString().toLowerCase().includes(title.toLowerCase())
        )
      );
      songs = titleSearch;
    }
    if (performer) {
      const performerSearch = await songs.filter((song) =>
        Object.values(song).some((value) =>
          value.toString().toLowerCase().includes(performer.toLowerCase())
        )
      );
      songs = performerSearch;
    }

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;
    const song = await this._services.getSongById(id);
    return {
      status: 'success',
      data: {
        song: song,
      },
    };
  }

  async putSongByIdHandler(req) {
    this._validator.validateSongSchema(req.payload);
    const { id } = req.params;
    await this._services.editSongById(id, req.payload);
    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;
    await this._services.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongHandler;
