const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: (server, { services, validator }) => {
    const usersHandler = new UsersHandler(services, validator);
    server.route(routes(usersHandler));
  },
};
