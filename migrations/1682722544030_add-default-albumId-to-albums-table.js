/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(
    "INSERT INTO albums VALUES ('single', 'Single Album', 1970, '0', '0')"
  );
};

exports.down = (pgm) => {
  pgm.sql("DELETE FROM albums WHERE id = 'single'");
};
