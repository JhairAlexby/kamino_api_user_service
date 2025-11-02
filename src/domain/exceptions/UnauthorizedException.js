export class UnauthorizedException extends Error {
    constructor(message = 'No autorizado') {
      super(message);
      this.name = 'UnauthorizedException';
      this.statusCode = 403;
    }
  }