// src/routes/health.routes.ts

/**
 * Health Check Routes
 * 
 * These endpoints are used to check if the API is running properly.
 * Used by:
 *   - Load balancers (to route traffic)
 *   - Monitoring services (to detect downtime)
 *   - Deployment scripts (to verify deployment)
 * 
 * Route Structure:
 *   GET /health          - Basic health check
 *   GET /health/detailed - Detailed health with sub-system status
 */

import { Router } from 'express';
import healthController from '../controllers/health.controller.js';

const router = Router();

/**
 * GET /health
 * Basic health check - returns 200 if API is running
 * 
 * Response: {
 *   status: 'ok',
 *   timestamp: ISO date string,
 *   uptime: seconds since server start,
 *   environment: 'development' | 'production' | 'test'
 * }
 */
router.get('/', healthController.check);

/**
 * GET /health/detailed
 * Detailed health check - includes sub-system status
 * 
 * Response: {
 *   status: 'healthy' | 'unhealthy',
 *   timestamp: ISO date string,
 *   uptime: seconds,
 *   checks: {
 *     api: 'ok' | 'error',
 *     database: 'ok' | 'error'
 *   },
 *   memory: {
 *     used: '50 MB',
 *     total: '100 MB'
 *   }
 * }
 * 
 * Returns 503 if any check fails
 */
router.get('/detailed', healthController.detailed);

export default router;