class PlaylistsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePostPlaylistsPayload(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._services.addPlaylist(name, credentialId);

    return h
      .response({
        status: 'success',
        data: {
          playlistId,
        },
      })
      .code(201);
  }

  async postSongInPlaylistHandler(req, h) {
    this._validator.validatePostSongInPlaylistPayload(req.payload);
    const { songId } = req.payload;
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._services.verifyPlaylistOwner(playlistId, credentialId);
    await this._services.addSongToPlaylist(songId, playlistId);

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      })
      .code(201);
  }

  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlists = await this._services.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistWithSongHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._services.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this._services.getPlaylistWithSongs(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._services.verifyPlaylistOwner(playlistId, credentialId);
    await this._services.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async deleteSongInPlaylistHandler(req) {
    this._validator.validateDeleteSongInPlaylistPayload(req.payload);
    const { songId } = req.payload;
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._services.verifyPlaylistOwner(playlistId, credentialId);
    await this._services.deleteSongInPlaylist(songId);

    return {
      status: 'success',
      message: 'Lagu berhasil di hapus di playlist',
    };
  }
}

module.exports = PlaylistsHandler;