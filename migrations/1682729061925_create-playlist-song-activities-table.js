/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'TEXT',
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'TEXT',
    },
    user_id: {
      type: 'TEXT',
    },
    action: {
      type: 'TEXT',
    },
    time: {
      type: 'TIMESTAMP',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
