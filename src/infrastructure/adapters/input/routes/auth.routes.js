import { Router } from 'express';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const createAuthRoutes = (authController) => {
  const router = Router();

  router.post('/register', validateRegister, (req, res, next) => 
    authController.register(req, res, next)
  );

  router.post('/login', validateLogin, (req, res, next) => 
    authController.login(req, res, next)
  );

  router.post('/logout', authMiddleware, (req, res, next) => 
    authController.logout(req, res, next)
  );

  return router;
};