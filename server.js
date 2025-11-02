import { createApp } from './src/app.js';
import { testConnection } from './src/infrastructure/config/database.config.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    
    const app = createApp();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();