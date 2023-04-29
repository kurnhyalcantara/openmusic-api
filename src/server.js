require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const authentications = require('./api/authentications');
const songs = require('./api/songs');
const users = require('./api/users');
const ClientError = require('./exceptions/ClientError');
const AlbumService = require('./services/postgres/AlbumService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const SongService = require('./services/postgres/SongService');
const UsersService = require('./services/postgres/UsersService');
const TokenManager = require('./tokenize/TokenManager');
const AlbumValidator = require('./validator/albums');
const AuthenticationsValidator = require('./validator/authentications');
const SongValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');
const Jwt = require('@hapi/jwt');
const PlayListsService = require('./services/postgres/PlaylistsService');
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const collaborations = require('./api/collaborations');
const CollaborationValidator = require('./validator/collaborations');

const init = async () => {
  const server = await Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: Jwt,
  });

  await server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlayListsService(
    songService,
    collaborationsService
  );

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        playlistsService,
        collaborationsService,
        validator: CollaborationValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode);
      }

      if (!response.isServer) {
        return h.continue;
      }

      return h
        .response({
          status: 'fail',
          message: 'Terjadi kegagalan di server kami.',
        })
        .code(500);
    }
    return h.continue;
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
