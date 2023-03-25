const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (req, h) => handler.postSongHandler(req, h),
  },
];

module.exports = routes;
