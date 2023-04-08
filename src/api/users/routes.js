const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (req, h) => handler.postUserHandler(req, h),
  },
];

module.exports = routes;
