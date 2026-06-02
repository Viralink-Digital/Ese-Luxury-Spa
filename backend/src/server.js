// src/server.js
import 'dotenv/config';
import app from './app.js';
import { connectDB } from './utils/db.js';
import { startCronJobs } from './jobs/cron.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await connectDB();
    logger.info('✅ Database connected');

    startCronJobs();
    logger.info('✅ Cron jobs started');

    app.listen(PORT, () => {
      logger.info(`🚀 Ese Luxury API running on port ${PORT}`);
      logger.info(`📚 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error('❌ Bootstrap failed:', err);
    process.exit(1);
  }
}

bootstrap();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});
