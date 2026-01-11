/**
 * Rate Limiting Middleware
 * 
 * WHAT: Limits number of requests per IP address
 * WHY:
 *   1. Prevent abuse (brute force, scraping)
 *   2. Protect server resources
 *   3. Ensure fair usage
 * 
 * HOW IT WORKS:
 *   - Tracks requests per IP in memory
 *   - Resets counter after time window
 *   - Returns 429 if limit exceeded
 * 
 * NOTE: For production, use Redis for distributed rate limiting
 */

import { Request, Response, NextFunction } from 'express';
import config from '../config/index.js';
import { RateLimitError } from '../errors/index.js';

// Store for rate limiting (in-memory)
// In production, use Redis for distributed systems
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Clean up expired entries periodically
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute

// Prevent interval from keeping process alive
cleanupInterval.unref();

/**
 * Get client IP address
 */
const getClientIp = (req: Request): string => {
  // Check for proxy headers
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = (forwarded as string).split(',');
    return ips[0].trim();
  }
  
  return req.socket.remoteAddress || 'unknown';
};

/**
 * General rate limiter
 * Default: 100 requests per 15 minutes
 */
export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.max;

  // Initialize or get existing record
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else {
    store[ip].count++;
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[ip].count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(store[ip].resetTime / 1000));

  // Check if limit exceeded
  if (store[ip].count > maxRequests) {
    const retryAfter = Math.ceil((store[ip].resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    
    throw new RateLimitError(
      `Too many requests. Please try again in ${retryAfter} seconds.`
    );
  }

  next();
};

/**
 * Stricter rate limiter for auth routes
 * 10 requests per 15 minutes
 */
export const authRateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const ip = getClientIp(req);
  const key = `auth:${ip}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else {
    store[key].count++;
  }

  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[key].count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(store[key].resetTime / 1000));

  if (store[key].count > maxRequests) {
    const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    
    throw new RateLimitError(
      `Too many login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
    );
  }

  next();
};

export default rateLimiter;