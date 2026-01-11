/**
 * Authentication Middleware
 * 
 * WHAT: Verifies JWT and attaches user to request
 * WHY:
 *   1. Protect routes from unauthenticated access
 *   2. Extract user info for controllers
 *   3. Role-based access control
 * 
 * FLOW:
 *   1. Extract token from Authorization header
 *   2. Verify token signature
 *   3. Check if user exists
 *   4. Attach user to request
 *   5. Pass to next middleware
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import db from '../services/database.service.js';
import { User, Role } from '../types/index.js';

/**
 * Require authentication
 * Use this for routes that need a logged-in user
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authentication token provided');
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user exists
    const user = await db.findById<User>('users', decoded.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication
 * User info is attached if token is valid, but not required
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = verifyAccessToken(token);
        const user = await db.findById<User>('users', decoded.userId);

        if (user) {
          req.user = {
            id: user.id,
            role: user.role,
          };
        }
      } catch {
        // Token invalid, continue without auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Require specific role(s)
 * Use after authMiddleware
 * 
 * Example: router.get('/admin', authMiddleware, requireRole(Role.ADMIN), handler)
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};

/**
 * Require provider profile
 * Checks if the authenticated user has a provider profile
 */
export const requireProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const provider = await db.findOne<{ id: string; userId: string }>(
      'providers',
      (p) => p.userId === req.user!.id
    );

    if (!provider) {
      throw new ForbiddenError('Provider profile required');
    }

    next();
  } catch (error) {
    next(error);
  }
};