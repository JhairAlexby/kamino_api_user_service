import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

export const createUserRoutes = (userController) => {
  const router = Router();

  router.get('/profile', authMiddleware, (req, res, next) => 
    userController.getProfile(req, res, next)
  );

  router.get('/admin-only', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'ruta solo para administradores' });
  });

  return router;
};
