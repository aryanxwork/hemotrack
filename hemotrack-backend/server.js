require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Use alter: true for development. In production, use migrations.
    const alterSync = process.env.NODE_ENV === 'development';
    await sequelize.sync({ alter: alterSync });
    logger.info(`Database synced (alter: ${alterSync})`);

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Swagger docs available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
