/**
 * Health Check Controller
 * 
 * WHAT: Endpoint to check if API is running
 * WHY: Used by monitoring tools and load balancers
 */

import { Request, Response } from 'express';
import { successResponse } from '../utils/response.js';
import db from '../services/database.service.js';

export class HealthController {
  /**
   * GET /health
   * Basic health check
   */
  check = async (req: Request, res: Response): Promise<void> => {
    successResponse(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  };

  /**
   * GET /health/detailed
   * Detailed health check with database status
   */
  detailed = async (req: Request, res: Response): Promise<void> => {
    const checks = {
      api: 'ok',
      database: 'ok',
    };

    try {
      // Try to read from database
      await db.findAll('users');
    } catch {
      checks.database = 'error';
    }

    const isHealthy = Object.values(checks).every((v) => v === 'ok');

    res.status(isHealthy ? 200 : 503).json({
      success: true,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        },
      },
    });
  };
}

export const healthController = new HealthController();
export default healthController;