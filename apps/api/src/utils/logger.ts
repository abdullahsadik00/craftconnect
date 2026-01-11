/**
 * Logger Module
 *
 * WHAT: Provides consistent logging throughout the application
 * WHY:
 *   1. Structured logs are easier to search/filter
 *   2. Different log levels for different environments
 *   3. Can add metadata (request ID, user ID, etc.)
 *   4. Production logs can be sent to monitoring services
 *
 * ALTERNATIVES:
 *   1. console.log (BAD - no structure, no levels)
 *   2. Winston (OK - popular but heavier)
 *   3. Bunyan (OK - similar to Pino)
 *
 * WHY PINO:
 *   - Fastest Node.js logger
 *   - JSON output (great for log aggregation)
 *   - Low overhead in production
 *   - Pretty printing in development
 */

import pino from 'pino';
import { config } from '../config/index.js';
import { env } from 'process';

// Create the logger instance
export const logger = pino({
    // Log level from config
    level: config.log.level,
    // Pretty print in development, JSON in production
    transport: config.isDev ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',// Human-readable timestamps
            ignore: 'pid,hostname',// Hide these fields
        },
    } : undefined,
    base: {
        env: env.NODE_ENV
    }
});

 /**
     * Usage examples:
     *
     * logger.info('Server started');
     * logger.info({ port: 5000 }, 'Server started on port');
     * logger.error({ err: error }, 'Database connection failed');
     * logger.debug({ userId: '123' }, 'Processing user request');
     *
     * Log Levels (from lowest to highest priority):
     * - trace: Very detailed debugging
     * - debug: Debugging information
     * - info: General information
     * - warn: Warning messages
     * - error: Error messages
     * - fatal: Critical errors
     */

 export default logger;