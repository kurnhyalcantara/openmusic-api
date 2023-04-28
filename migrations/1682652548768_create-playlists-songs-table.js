/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'TEXT',
      references: 'playlists(id)',
      onCascade: true,
    },
    song_id: {
      type: 'TEXT',
      references: 'songs(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist-songs');
};
