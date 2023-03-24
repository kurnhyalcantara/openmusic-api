const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service }) => {
    const albumHandler = new AlbumHandler(service);
    server.route(routes(albumHandler));
  },
};
