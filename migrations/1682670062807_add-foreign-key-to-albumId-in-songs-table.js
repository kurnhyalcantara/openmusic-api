/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql("INSERT INTO albums VALUES('single', 'single', 1970, '0', '0') ");
  pgm.addConstraint(
    'songs',
    'fk_songs.album_id_albums.id',
    'FOREIGN KEY(album_id) REFERENCES albums(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
  pgm.sql("DELETE FROM albums WHERE id = 'single'");
};
