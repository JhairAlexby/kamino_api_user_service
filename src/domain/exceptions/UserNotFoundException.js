export class UserNotFoundException extends Error {
    constructor(message = 'Usuario no encontrado') {
      super(message);
      this.name = 'UserNotFoundException';
      this.statusCode = 404;
    }
  }