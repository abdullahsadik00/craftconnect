/**
 * Error Handling Middleware
 *
 * WHAT: Catches all errors and sends standardized response
 * WHY:
 *   1. Centralized error handling
 *   2. Consistent error format
 *   3. Logs errors for debugging
 *   4. Hides sensitive info in production
 *
 * HOW IT WORKS:
 *   1. Error thrown anywhere in app
 *   2. Express catches it
 *   3. This middleware processes it
 *   4. Sends formatted response to client
 */

import { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";
import logger from "../utils/logger.js";
// Removed: import { request } from "http"; (unused)

// ============================================
// Custom Error Classes
// ============================================

export class AppError extends Error {
    public statusCode: number;
    public code: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    public errors: Record<string, string[]>;

    constructor(message: string, errors: Record<string, string[]>) {
        super(message, 422, "VALIDATION_ERROR");
        this.errors = errors;
    }
}

// ============================================
// Error Middleware
// ============================================

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    // Log the error details
    logger.error({
        err: {
            name: err.name,
            message: err.message,
            stack: config.isDev ? err.stack : undefined,
        },
        request: {
            method: req.method,
            url: req.url,
            body: req.body,
            params: req.params,
            query: req.query,
        },
    });

    // Handle our custom AppError
    if (err instanceof AppError) {                          // ← Fixed: added space
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err instanceof ValidationError && {     // ← Fixed: added space
                    errors: err.errors 
                }),
            },
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            error: {
                code: "INVALID_TOKEN",
                message: "Invalid authentication token",
            },
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            error: {
                code: "TOKEN_EXPIRED",
                message: "Authentication token has expired",
            },
        });
    }

    // Handle Zod validation errors
    if (err.name === "ZodError") {
        return res.status(422).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                errors: (err as any).errors,                // ← Fixed: proper type assertion
            },
        });
    }

    // Handle all other errors (unknown/programming errors)
    return res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_ERROR",
            message: config.isProd 
                ? "An unexpected error occurred" 
                : err.message,
            ...(config.isDev && { stack: err.stack }),  // To be removed in production
        },
    });
};

// ============================================
// 404 Not Found Middleware
// ============================================

/**
 * 404 Not Found middleware
 * Must be placed after all routes
 */
export const notFoundMiddleware = (
    req: Request, 
    res: Response
): Response => {
    return res.status(404).json({
        success: false,
        error: {
            code: "NOT_FOUND",
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
};