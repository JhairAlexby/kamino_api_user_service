import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const createFavoritesRoutes = (favoritesController) => {
  const router = Router();

  /**
   * @swagger
   * /api/favorites:
   *   post:
   *     summary: Agregar lugar a favoritos (botón Me gusta ❤️)
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - placeId
   *             properties:
   *               placeId:
   *                 type: string
   *                 format: uuid
   *     responses:
   *       200:
   *         description: Lugar agregado a favoritos
   */
  router.post('/', authMiddleware, (req, res, next) => 
    favoritesController.addFavorite(req, res, next)
  );

  /**
   * @swagger
   * /api/favorites/{placeId}:
   *   delete:
   *     summary: Quitar lugar de favoritos
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: placeId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Lugar eliminado de favoritos
   */
  router.delete('/:placeId', authMiddleware, (req, res, next) => 
    favoritesController.removeFavorite(req, res, next)
  );

  /**
   * @swagger
   * /api/visited:
   *   post:
   *     summary: Marcar lugar como visitado (botón Visitado ✓)
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - placeId
   *             properties:
   *               placeId:
   *                 type: string
   *                 format: uuid
   *     responses:
   *       200:
   *         description: Lugar marcado como visitado
   */
  router.post('/visited', authMiddleware, (req, res, next) => 
    favoritesController.addVisited(req, res, next)
  );

  /**
   * @swagger
   * /api/visited/{placeId}:
   *   delete:
   *     summary: Desmarcar lugar como visitado
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: placeId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Lugar eliminado de visitados
   */
  router.delete('/visited/:placeId', authMiddleware, (req, res, next) => 
    favoritesController.removeVisited(req, res, next)
  );

  return router;
};
