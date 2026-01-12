/**
 * Server Entry Point
 *
 * This is the main file that starts the server.
 * It initializes all required services and starts listening for requests.
 *
 * Startup Sequence:
 *   1. Load environment variables (dotenv)
 *   2. Initialize database (create JSON files if needed)
 *   3. Start Express server
 *   4. Log startup information
 *
 * Shutdown Sequence:
 *   1. Receive SIGTERM/SIGINT signal
 *   2. Stop accepting new connections
 *   3. Wait for existing requests to complete
 *   4. Close database connections
 *   5. Exit process
 */

// Load environment variables FIRST (before any other imports)
import 'dotenv/config';

import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import db from './services/database.service.js';

/**
 * Server instance (stored for graceful shutdown)
 */
let server: ReturnType<typeof app.listen>;

/**
 * Start the server
 *
 * This function:
 *   1. Initializes the JSON database
 *   2. Starts the HTTP server
 *   3. Logs startup information
 */
async function startServer(): Promise<void> {
  try {
    // ===================================
    // INITIALIZE DATABASE
    // ===================================

    /**
     * Initialize JSON database
     * Creates data directory and empty JSON files if they don't exist
     */
    logger.info('Initializing database...');
    await db.initialize();
    logger.info('✅ Database initialized successfully');

    // ===================================
    // START HTTP SERVER
    // ===================================

    /**
     * Start listening for HTTP requests
     *
     * The callback runs once the server is ready
     */
    server= app.listen(config.port, ()=> {
      // Log startup information
      logger.info('='.repeat(50));
      logger.info('🚀 CraftConnect API Server Started');
      logger.info('='.repeat(50));
      logger.info(`📍 URL: http://localhost:${config.port}`);
      logger.info(`📍 API: http://localhost:${config.port}/api/${config.apiVersion}`);
      logger.info(`🏥 Health: http://localhost:${config.port}/health`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`📝 Log Level: ${config.log.level}`);
      logger.info('='.repeat(50));

      // Development-only information
      if (config.isDev) {
        logger.info('📚 Available Endpoints:');
        logger.info('   POST /api/v1/auth/register/email');
        logger.info('   POST /api/v1/auth/register/phone');
        logger.info('   POST /api/v1/auth/login/email');
        logger.info('   POST /api/v1/auth/login/phone');
        logger.info('   POST /api/v1/auth/verify-otp');
        logger.info('   GET  /api/v1/providers');
        logger.info('   GET  /api/v1/providers/slug/:slug');
        logger.info('   POST /api/v1/inquiries');
        logger.info('   ... and more');
        logger.info('='.repeat(50));
      }
    });

    // ===================================
    // ERROR HANDLERS
    // ===================================

    /**
     * Handle server errors
     *
     * Common errors:
     *   - EADDRINUSE: Port already in use
     *   - EACCES: Permission denied (ports < 1024 need root)
     */
    server.on('error', (error: NodeJS.ErrnoException)=> {
      if (error.code=== 'EADDRINUSE') {
        logger.error(`❌ Port ${config.port} is already in use`);
        logger.error('   Try: kill the process using that port, or use a different port');
      }else if (error.code=== 'EACCES') {
        logger.error(`❌ Permission denied for port ${config.port}`);
        logger.error('   Try: use a port > 1024, or run with sudo');
      }else {
        logger.error({ error },'❌ Server error');
      }
      process.exit(1);
    });

  }catch (error) {
    logger.error({ error },'❌ Failed to start server');
    process.exit(1);
  }
}

/**
 * Graceful Shutdown
 *
 * This function handles clean shutdown when the process receives
 * termination signals (SIGTERM, SIGINT).
 *
 * Steps:
 *   1. Stop accepting new connections
 *   2. Wait for existing requests to complete (with timeout)
 *   3. Clean up resources
 *   4. Exit process
 *
 * Why: Prevents data loss and ensures requests complete properly
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`\n${signal} received. Starting graceful shutdown...`);

  // Create shutdown timeout
  const shutdownTimeout = setTimeout(()=> {
    logger.error('Shutdown timeout exceeded. Forcing exit.');
    process.exit(1);
  },30000);// 30 second timeout

  try {
    // Stop accepting new connections
    if (server) {
      await new Promise<void>((resolve,reject)=> {
        server.close((err)=> {
          if (err)reject(err);
          else resolve();
        });
      });
      logger.info('✅ HTTP server closed');
    }

    // Clean up database (clear cache, etc.)
    db.clearCache();
    logger.info('✅ Database connections closed');

    // Clear timeout and exit
    clearTimeout(shutdownTimeout);
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);

  }catch (error) {
    logger.error({ error },'❌ Error during shutdown');
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
}

/**
 * ===================================
 * PROCESS EVENT HANDLERS
 * ===================================
 */

/**
 * SIGTERM - Termination signal
 *
 * Sent by:
 *   - Docker/Kubernetes when stopping container
 *   - Process managers (PM2, systemd)
 *   - kill command (without -9)
 */
process.on('SIGTERM', ()=> gracefulShutdown('SIGTERM'));

/**
 * SIGINT - Interrupt signal
 *
 * Sent by:
 *   - Ctrl+C in terminal
 *   - IDE stop button
 */
process.on('SIGINT', ()=> gracefulShutdown('SIGINT'));

/**
 * Uncaught Exception Handler
 *
 * Catches errors that weren't handled anywhere in the code.
 * This is a last resort - ideally all errors should be caught.
 *
 * IMPORTANT: After an uncaught exception, the process state is
 * undefined. We log and exit to prevent undefined behavior.
 */
process.on('uncaughtException', (error: Error)=> {
  logger.fatal({ error },'💀 Uncaught Exception - Shutting down');
  process.exit(1);
});

/**
 * Unhandled Promise Rejection Handler
 *
 * Catches rejected promises that weren't handled with .catch()
 * or try/catch in async functions.
 */
process.on('unhandledRejection', (reason: unknown)=> {
  logger.error({ reason },'⚠️ Unhandled Promise Rejection');
  // Don't exit here - let the application continue
  // In production, you might want to track these for debugging
});

/**
 * ===================================
 * START THE SERVER
 * ===================================
 */

startServer();
