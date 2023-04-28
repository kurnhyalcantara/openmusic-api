const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { nanoid } = require('nanoid');

class PlayListsService {
  constructor(songService) {
    this._pool = new Pool();
    this._songService = songService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan.');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1 ',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const playlist = await this._pool.query(query);
    if (!playlist.rows.length) {
      throw new NotFoundError('Gagal mendapatkan playlist. Id tidak ditemukan');
    }

    if (playlist.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak dapat mengakses resource ini');
    }
  }

  async addSongToPlaylist(songId, playlistId) {
    const song = await this._songService.getSongById(songId);
    if (!song) {
      throw new NotFoundError('Gagal menambahkan lagu. Id tidak ditemukan');
    }
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylistWithSongs(playlistId) {
    const queryGetPlaylist = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [playlistId],
    };
    const playlist = await this._pool.query(queryGetPlaylist);
    if (!playlist.rows.length) {
      throw new NotFoundError('Gagal menampilkan playlist. Id tidak ditemukan');
    }

    const queryGetSongInPlaylist = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN playlist_songs ON playlist_songs.song_id = songs.id AND playlist_songs.playlist_id = $1',
      values: [playlistId],
    };
    const songs = await this._pool.query(queryGetSongInPlaylist);

    return {
      ...playlist.rows[0],
      songs: songs.rows,
    };
  }

  async deleteSongInPlaylist(songId) {
    const queryGetSongInPlaylist = {
      text: `SELECT songs FROM playlists WHERE songs @> '[{"id": $1 }]'`,
      values: [songId],
    };
    const songs = await this._pool.query(queryGetSongInPlaylist);
    const query = {
      text: 'SELECT ARRAY_REMOVE(songs, $1) FROM playlists',
      values: [songs.rows],
    };

    await this._pool.query(query);
  }
}

module.exports = PlayListsService;
