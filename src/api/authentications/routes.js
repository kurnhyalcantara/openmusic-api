const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (req, h) => handler.postAuthenticationsHandler(req, h),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (req) => handler.putAuthenticationsHandler(req),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (req) => handler.deleteAuthenticationsHandler(req),
  },
];

module.exports = routes;
