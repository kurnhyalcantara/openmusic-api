const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (req, h) => handler.postAuthenticationsHandler(req, h),
  },
];

module.exports = routes;
