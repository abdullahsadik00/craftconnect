/**
 * Configuration Module
 *
 * WHAT: Centralizes all application configuration
 * WHY:
 *   1. Single source of truth for settings
 *   2. Easy to change values without hunting through code
 *   3. Environment-specific settings (dev/prod)
 *   4. Validation ensures required settings exist
 *
 * ALTERNATIVE APPROACHES:
 *   1. Hardcode values (BAD - inflexible, insecure)
 *   2. Multiple config files (OK - but harder to manage)
 *   3. Use a config library like 'convict' (GOOD - more features but more complex)
 *
 * WHY THIS APPROACH:
 *   - Simple and straightforward
 *   - Type-safe with TypeScript
 *   - Works well for our project size
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Secret, SignOptions } from 'jsonwebtoken';

// Load environment variables from .env file
// This must be done before accessing process.env
dotenv.config();

// Get directory name in ES modules (different from CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type JwtConfig = {
    secret: Secret;
    expiresIn: SignOptions['expiresIn'];
    refreshSecret: Secret;
    refreshExpiresIn: SignOptions['expiresIn'];
  };
  
/**
 * Helper function to get required environment variables
 * Throws an error if the variable is missing
 */
function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

/**
 * Helper function to get optional environment variables
 */
function getOptionalEnvVar(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

/**
 * Main configuration object
 * All settings should be accessed through this object
 */
export const config = {
    // Node environment (development, production, test)
    nodeEnv: getOptionalEnvVar('NODE_ENV', 'development'),

    // Server settings
    port: parseInt(getOptionalEnvVar('PORT', '3000'), 10),
    apiVersion: getOptionalEnvVar('API_VERSION', 'v1'),

    // Paths
    rootDir: path.resolve(__dirname, '..'),
    dataDir: path.resolve(__dirname, 'data'),

    // JWT settings for authentication
    // jwt: {
    //     secret: getEnvVar('JWT_SECRET', 'default-dev-secret-change-in-production'),
    //     expiresIn: getOptionalEnvVar('JWT_EXPIRES_IN', '7d'),
    //     refreshSecret: getEnvVar('JWT_REFRESH_SECRET', 'default-refresh-secret-change'),
    //     refreshExpiresIn: getOptionalEnvVar('JWT_REFRESH_EXPIRES_IN', '30d'),
    // },
    jwt: {
        secret: getEnvVar(
          'JWT_SECRET',
          'default-dev-secret-change-in-production'
        ) as Secret,
    
        expiresIn: getOptionalEnvVar(
          'JWT_EXPIRES_IN',
          '7d'
        ) as SignOptions['expiresIn'],
    
        refreshSecret: getEnvVar(
          'JWT_REFRESH_SECRET',
          'default-refresh-secret-change'
        ) as Secret,
    
        refreshExpiresIn: getOptionalEnvVar(
          'JWT_REFRESH_EXPIRES_IN',
          '30d'
        ) as SignOptions['expiresIn'],
      } satisfies JwtConfig,
    // CORS settings
    cors: {
        origin: getOptionalEnvVar('CORS_ORIGIN', 'http://localhost:3000').split(','),
        credentials: true
    },
    // Rate limiting settings
    rateLimit: {
        windowMs: parseInt(getOptionalEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10), // default 15 minutes
        max: parseInt(getOptionalEnvVar('RATE_LIMIT_MAX', '100'), 10) // default 100 requests
    },
    // OTP settings
    otp: {
        expiryMinutes: parseInt(getOptionalEnvVar('OTP_EXPIRY_MINUTES', '10'), 10),
        length: parseInt(getOptionalEnvVar('OTP_LENGTH', '6'), 10)
    },

    // Logging settings
    log: {
        level: getOptionalEnvVar('LOG_LEVEL', 'info')
    },

    // Helper boolean flags
    isProd: getOptionalEnvVar('NODE_ENV', 'development') === 'production',
    isDev: getOptionalEnvVar('NODE_ENV', 'development') === 'development',
    isTest: getOptionalEnvVar('NODE_ENV', 'development') === 'test',
} as const;

// Type export for use in other files
export type Config = typeof config;

// Default export for convenience
export default config;