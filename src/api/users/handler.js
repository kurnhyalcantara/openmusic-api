class UsersHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
  }

  async postUserHandler(req, h) {
    this._validator.validateUserSchema(req.payload);
    const { username, password, fullname } = req.payload;

    const userId = await this._services.addUser({
      username,
      password,
      fullname,
    });

    return h
      .response({
        status: 'success',
        data: {
          userId,
        },
      })
      .code(201);
  }
}

module.exports = UsersHandler;
