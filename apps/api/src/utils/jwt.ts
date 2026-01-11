/**
 * JWT (JSON Web Token) Utilities
 * 
 * WHAT: Creates and verifies authentication tokens
 * WHY:
 *   1. Stateless authentication (no session storage needed)
 *   2. Can be verified without database lookup
 *   3. Contains user info (id, role)
 *   4. Industry standard for APIs
 * 
 * HOW JWT WORKS:
 *   1. User logs in with credentials
 *   2. Server creates a JWT with user info
 *   3. Client stores JWT (localStorage/cookie)
 *   4. Client sends JWT with every request
 *   5. Server verifies JWT and extracts user info
 * 
 * TOKEN STRUCTURE:
 *   header.payload.signature
 *   - Header: Algorithm used
 *   - Payload: User data (id, role, expiry)
 *   - Signature: Proves token wasn't tampered
 */

import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { JwtPayload, TokenPair } from '../types/auth.types.js';
import { Role } from '../types/index.js';

/**
 * Generate an access token (short-lived: 7 days)
 * Used for authenticating API requests
 */
export const generateAccessToken = (userId: string, role: Role): string => {
  const payload: JwtPayload = { userId, role };
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate a refresh token (long-lived: 30 days)
 * Used to get new access tokens without re-login
 */
export const generateRefreshToken = (userId: string, role: Role): string => {
  const payload: JwtPayload = { userId, role };
  
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Generate both tokens at once
 */
export const generateTokenPair = (userId: string, role: Role): TokenPair => {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId, role),
  };
};

/**
 * Verify an access token
 * Returns the payload if valid, throws error if invalid
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

/**
 * Verify a refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

/**
 * Decode a token without verification (useful for debugging)
 * WARNING: Don't use this for authentication!
 */
export const decodeToken = (token: string): JwtPayload | null => {
  return jwt.decode(token) as JwtPayload | null;
};

/**
 * Get token expiration time
 */
export const getTokenExpiry = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (decoded?.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiry,
};