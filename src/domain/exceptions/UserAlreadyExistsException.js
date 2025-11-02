export class UserAlreadyExistsException extends Error {
    constructor(message = 'El usuario ya existe') {
      super(message);
      this.name = 'UserAlreadyExistsException';
      this.statusCode = 409;
    }
  }