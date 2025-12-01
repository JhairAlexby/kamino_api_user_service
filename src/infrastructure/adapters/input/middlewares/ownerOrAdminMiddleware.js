import { UnauthorizedException } from '../../../../domain/exceptions/UnauthorizedException.js';

/**
 * Middleware que permite acceso si:
 * - El usuario es admin, O
 * - El usuario está accediendo a su propio recurso
 */
export const ownerOrAdminMiddleware = (req, res, next) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.userId;
    const userRole = req.user.role;

    // Si es admin, permitir todo
    if (userRole === 'ADMIN') {
      return next();
    }

    // Si no es admin, verificar que esté accediendo a su propio recurso
    if (requestedUserId !== currentUserId) {
      throw new UnauthorizedException('Solo puedes modificar tu propio perfil');
    }

    next();
  } catch (error) {
    next(error);
  }
};
