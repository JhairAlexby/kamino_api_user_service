import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { PostgresUserRepository } from './infrastructure/adapters/output/persistence/PostgresUserRepository.js';
import { BcryptPasswordHasher } from './infrastructure/adapters/output/security/BcryptPasswordHasher.js';
import { JwtTokenGenerator } from './infrastructure/adapters/output/security/JwtTokenGenerator.js';
import { AuthController } from './infrastructure/adapters/input/controllers/AuthController.js';
import { UserController } from './infrastructure/adapters/input/controllers/UserController.js';
import { createAuthRoutes } from './infrastructure/adapters/input/routes/auth.routes.js';
import { createUserRoutes } from './infrastructure/adapters/input/routes/user.routes.js';
import { errorMiddleware } from './infrastructure/adapters/input/middlewares/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './infrastructure/config/swagger.config.js';

export const createApp = () => {
  const app = express();

  // Middlewares de seguridad
  app.use(helmet());
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  }));

  // Cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas solicitudes, intenta más tarde'
  });
  app.use(limiter);

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Dependencias
  const userRepository = new PostgresUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenGenerator = new JwtTokenGenerator();

  // Controladores
  const authController = new AuthController(userRepository, passwordHasher, tokenGenerator);
  const userController = new UserController(userRepository, passwordHasher);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Kamino Users API'
  }));
  // Rutas
  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/users', createUserRoutes(userController));

  // Manejo de errores
  app.use(errorMiddleware);

  return app;
};
