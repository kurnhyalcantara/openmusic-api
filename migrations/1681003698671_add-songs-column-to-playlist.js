/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('playlists', {
    songs: {
      type: 'jsonb[]',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('playlists', 'songs');
};
