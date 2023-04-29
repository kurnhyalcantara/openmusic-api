/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'TEXT',
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'TEXT',
      references: 'users(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
