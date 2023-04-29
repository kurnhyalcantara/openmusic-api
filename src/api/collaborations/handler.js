class CollaborationHandler {
  constructor(playlistsService, collaborationsService, validator) {
    this._playlistServices = playlistsService;
    this._collaborationsService = collaborationsService;
    this._validator = validator;
  }

  async postCollaborationHandler(req, h) {
    this._validator.validateCollaborationSchema(req.payload);
    const { playlistId, userId } = req.payload;
    const { id: credentialsId } = req.auth.credentials;

    await this._playlistServices.verifyPlaylistOwner(playlistId, credentialsId);
    const collaborationId = await this._collaborationsService.addCollaborator(
      playlistId,
      userId
    );

    return h
      .response({
        status: 'success',
        data: {
          collaborationId,
        },
      })
      .code(201);
  }

  async deleteCollaborationHandler(req) {
    this._validator.validateCollaborationSchema(req.payload);
    const { playlistId, userId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistServices.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaborator(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationHandler;
