import { UnauthorizedException } from '../../../../domain/exceptions/UnauthorizedException.js';

export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Se requieren permisos de administrador');
    }
    next();
  } catch (error) {
    next(error);
  }
};