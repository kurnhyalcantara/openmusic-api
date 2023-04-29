const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: (
    server,
    { playlistsService, collaborationsService, validator }
  ) => {
    const collaborationsHandler = new CollaborationHandler(
      playlistsService,
      collaborationsService,
      validator
    );
    server.route(routes(collaborationsHandler));
  },
};
