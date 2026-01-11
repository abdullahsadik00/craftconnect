/**
 * Express Application Setup
 *
 * This file creates and configures the Express application.
 * It's separate from server.ts to allow testing without starting the server.
 *
 * Configuration Order Matters:
 *   1. Security middleware (helmet, cors)
 *   2. Request parsing (json, urlencoded)
 *   3. Logging (pino-http)
 *   4. Rate limiting
 *   5. API routes
 *   6. Error handling (must be last)
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';

import { config } from './config/index.ts';

import logger from './utils/logger.ts';
import routes from './routes/index.js';
import { errorMiddleware, notFoundMiddleware }from './middleware/error.middleware.js';
import { rateLimiter }from './middleware/rateLimiter.middleware.js';

/**
 * Create Express application
 */
const app: Application = express();

/**
 * ===================================
 * SECURITY MIDDLEWARE
 * ===================================
 */

/**
 * Helmet - Sets various HTTP headers for security
 *
 * What it does:
 *   - Removes X-Powered-By header (hides Express)
 *   - Sets X-Content-Type-Options: nosniff
 *   - Sets X-Frame-Options: DENY (prevents clickjacking)
 *   - Sets X-XSS-Protection header
 *   - And many more...
 *
 * Why: These headers protect against common web vulnerabilities
 */
app.use(helmet());

/**
 * CORS - Cross-Origin Resource Sharing
 *
 * What it does:
 *   - Allows/denies requests from other domains
 *   - Sets Access-Control-Allow-Origin header
 *   - Handles preflight OPTIONS requests
 *
 * Why: Browsers block cross-origin requests by default.
 *      We need to explicitly allow our frontend domain.
 *
 * Configuration:
 *   - origin: Allowed origins (from config)
 *   - credentials: Allow cookies/auth headers
 *   - methods: Allowed HTTP methods
 *   - allowedHeaders: Allowed request headers
 */

app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

/**
* ===================================
* REQUEST PARSING MIDDLEWARE
* ===================================
*/

/**
 * JSON Body Parser
 *
 * What it does:
 *   - Parses JSON request bodies
 *   - Makes parsed data available as req.body
 *
 * Options:
 *   - limit: Maximum request body size (prevents DOS attacks)
 */
app.use(express.json({ limit: '10kb' }));

/**
 * URL-Encoded Body Parser
 *
 * What it does:
 *   - Parses URL-encoded form data
 *   - Used for traditional HTML forms
 *
 * Options:
 *   - extended: true allows rich objects and arrays
 *   - limit: Maximum body size
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * ===================================
 * LOGGING MIDDLEWARE
 * ===================================
 */

/**
 * Pino HTTP Logger
 *
 * What it does:
 *   - Logs all incoming HTTP requests
 *   - Logs response status and timing
 *   - Adds request ID for tracing
 *
 * Why: Essential for debugging and monitoring
 *
 * Output (development):
 *   [12:34:56] INFO: GET /api/v1/providers 200 23ms
 *
 * Output (production):
 *   {"level":30,"time":1234567890,"req":{...},"res":{...},"responseTime":23}
 */

app.use(pinoHttp({
  logger,
  // Don't log health checks (too noisy)
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url === '/api/v1/health',
  },
  // Custom log message
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
}));

/**
* ===================================
* RATE LIMITING
* ===================================
*/

/**
 * Global Rate Limiter
 *
 * What it does:
 *   - Limits requests per IP address
 *   - Returns 429 Too Many Requests when exceeded
 *
 * Why: Prevents abuse, brute force attacks, and DOS
 *
 * Default: 100 requests per 15 minutes
 */
app.use(rateLimiter);

/**
 * ===================================
 * TRUST PROXY (for rate limiting behind reverse proxy)
 * ===================================
 */

/**
 * Trust Proxy Setting
 *
 * What it does:
 *   - Tells Express to trust X-Forwarded-* headers
 *   - Required when running behind nginx, load balancer, etc.
 *
 * Why: Without this, all requests appear to come from the proxy IP
 *
 * Note: Set to 1 for single proxy, 'loopback' for localhost only
 */
if (config.isProd) {
  app.set('trust proxy', 1);
}

/**
 * ===================================
 * API ROUTES
 * ===================================
 */

/**
 * Mount API routes under versioned path
 *
 * All API endpoints will be prefixed with /api/v1/
 * Example: /api/v1/auth/login, /api/v1/providers
 */
app.use(`/api/${config.apiVersion}`, routes);

/**
 * Root health check (outside API versioning)
 *
 * Simple endpoint for load balancers that don't know API version
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * Root endpoint - API information
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'CraftConnect API',
      version: config.apiVersion,
      documentation: `/api/${config.apiVersion}/docs`,
      health: '/health',
    },
  });
});

/**
 * ===================================
 * ERROR HANDLING
 * ===================================
 */

/**
 * 404 Not Found Handler
 *
 * Catches all requests that don't match any route
 * Must be placed after all other routes
 */
app.use(notFoundMiddleware);

/**
 * Global Error Handler
 *
 * Catches all errors thrown in the application
 * Formats errors into consistent response structure
 *
 * Must be the LAST middleware (4 parameters: err, req, res, next)
 */
app.use(errorMiddleware);

export default app;  