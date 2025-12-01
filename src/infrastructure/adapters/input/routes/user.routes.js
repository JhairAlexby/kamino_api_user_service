import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { ownerOrAdminMiddleware } from '../middlewares/ownerOrAdminMiddleware.js';
import { validateUuidParam } from '../middlewares/validationMiddleware.js';

export const createUserRoutes = (userController) => {
  const router = Router();

  /**
   * @swagger
   * /api/users/ml-data:
   *   get:
   *     summary: Obtener datos de usuarios para ML (sin datos sensibles)
   *     tags: [Users]
   */
  router.get('/ml-data', (req, res, next) => 
    userController.getMLData(req, res, next)
  );

  /**
   * @swagger
   * /api/users/profile:
   *   get:
   *     summary: Obtener perfil del usuario autenticado
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   */
  router.get('/profile', authMiddleware, (req, res, next) => 
    userController.getProfile(req, res, next)
  );

  /**
   * @swagger
   * /api/users/profile:
   *   put:
   *     summary: Actualizar perfil del usuario autenticado
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   */
  router.put('/profile', authMiddleware, (req, res, next) => {
    req.params.id = req.user.userId;
    userController.update(req, res, next);
  });

  /**
   * @swagger
   * /api/users/profile/tags:
   *   put:
   *     summary: Actualizar tags de preferencias del usuario
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   */
  router.put('/profile/tags', authMiddleware, (req, res, next) => 
    userController.updatePreferredTags(req, res, next)
  );

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Obtener todos los usuarios (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   */
  router.get('/', authMiddleware, adminMiddleware, (req, res, next) => 
    userController.getAllUsers(req, res, next)
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Obtener usuario por ID (PÚBLICO - sin autenticación)
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   */
  router.get('/:id', validateUuidParam('id'), (req, res, next) => 
    userController.getById(req, res, next)
  );

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Crear usuario (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   */
  router.post('/', authMiddleware, adminMiddleware, (req, res, next) => 
    userController.create(req, res, next)
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Actualizar usuario (administrador o propio usuario)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   */
  router.put('/:id', authMiddleware, ownerOrAdminMiddleware, validateUuidParam('id'), (req, res, next) => 
    userController.update(req, res, next)
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Eliminar usuario (administrador o propio usuario)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   */
  router.delete('/:id', authMiddleware, ownerOrAdminMiddleware, validateUuidParam('id'), (req, res, next) => 
    userController.delete(req, res, next)
  );

  return router;
};
