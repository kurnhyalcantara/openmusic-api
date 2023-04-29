const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (req, h) => handler.postCollaborationHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (req) => handler.deleteCollaborationHandler(req),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
