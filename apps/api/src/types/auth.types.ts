/**
 * Authentication specific types
 */

import { Role } from ".";

// import { Role }from './index.js';

/**
 * JWT payload structure
 */
export interface JwtPayload {
    userId: string;
    role: Role;
    iat?: number;
    exp?: number;
}

/**
 * Token pair (access + refresh)
 */
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

/**
 * Login/Register response
 */
export interface AuthResponse {
    tokens: TokenPair;
    user: {
        id: string;
        email: string | null;
        role: Role;
        phoneNumber: string | null;
        isVerified: boolean;
    },
    hasProvider: boolean;
}

/**
 * OTP verification response
 */
export interface OtpVerifyResponse {
    message: string;
    veified: boolean;
}

/**
 * Express Request with user attached (after auth middleware)
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: Role;
            };
        }
    }
}