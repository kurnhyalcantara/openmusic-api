const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (req, h) => handler.postSongHandler(req, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: () => handler.getSongsHandler(),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (req) => handler.getSongByIdHandler(req),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (req) => handler.putSongByIdHandler(req),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (req) => handler.deleteSongByIdHandler(req),
  },
];

module.exports = routes;
