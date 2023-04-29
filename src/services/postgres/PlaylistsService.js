const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { nanoid } = require('nanoid');

class PlayListsService {
  constructor(songService, collaboratorService) {
    this._pool = new Pool();
    this._songService = songService;
    this._collaboratorService = collaboratorService;
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
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    console.log(result.rows);
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

  async deleteSongInPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2',
      values: [songId, playlistId],
    };

    await this._pool.query(query);
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaboratorService.verifyCollaborator(playlistId, userId);
      } catch (error) {
        throw error;
      }
    }
  }

  async addPlaylistActivities(playlistId, userId, songId, action) {
    const id = `playlist-song-activities-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist activity gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: 'SELECT users.username, songs.title, ps_act.action, ps_act.time FROM playlist_song_activities as ps_act LEFT JOIN playlists ON playlists.id = ps_act.playlist_id LEFT JOIN playlist_songs as ps ON ps.playlist_id = playlists.id LEFT JOIN songs ON songs.id = ps_act.song_id LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        'Playlist activity gagal ditampilkan. Id tidak ditemukan'
      );
    }

    return result.rows;
  }
}

module.exports = PlayListsService;
