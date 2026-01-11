/**
 * Custom Error Classes
 * 
 * WHAT: Custom error types for different situations
 * WHY:
 *   1. Differentiate between error types
 *   2. Include HTTP status codes
 *   3. Consistent error response format
 *   4. Operational vs Programming errors
 * 
 * ALTERNATIVES:
 *   1. Throw plain Error (BAD - no status codes, no categorization)
 *   2. Use error library like 'http-errors' (OK - but less control)
 * 
 * WHY CUSTOM CLASSES:
 *   - Full control over error structure
 *   - Type-safe error handling
 *   - Can add custom properties
 */

/**
 * Base application error class
 * All custom errors should extend this
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;
  
    constructor(
      message: string,
      statusCode: number = 500,
      code: string = 'INTERNAL_ERROR',
      isOperational: boolean = true
    ) {
      super(message);
      
      this.statusCode = statusCode;
      this.code = code;
      this.isOperational = isOperational;
  
      // Maintains proper stack trace (only in V8 engines like Node)
      Error.captureStackTrace(this, this.constructor);
  
      // Set the prototype explicitly (TypeScript requirement)
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }
  
  /**
   * 400 Bad Request - Invalid input
   */
  export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
      super(message, 400, 'BAD_REQUEST');
    }
  }
  
  /**
   * 401 Unauthorized - Not authenticated
   */
  export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
      super(message, 401, 'UNAUTHORIZED');
    }
  }
  
  /**
   * 403 Forbidden - Authenticated but not allowed
   */
  export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
      super(message, 403, 'FORBIDDEN');
    }
  }
  
  /**
   * 404 Not Found - Resource doesn't exist
   */
  export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
      super(`${resource} not found`, 404, 'NOT_FOUND');
    }
  }
  
  /**
   * 409 Conflict - Resource already exists
   */
  export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
      super(message, 409, 'CONFLICT');
    }
  }
  
  /**
   * 422 Validation Error - Invalid data format
   */
  export class ValidationError extends AppError {
    public readonly errors: Record<string, string[]>;
  
    constructor(errors: Record<string, string[]>) {
      super('Validation failed', 422, 'VALIDATION_ERROR');
      this.errors = errors;
    }
  }
  
  /**
   * 429 Too Many Requests - Rate limited
   */
  export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
      super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
  }
  
  /**
   * 500 Internal Server Error - Unexpected error
   */
  export class InternalError extends AppError {
    constructor(message: string = 'Internal server error') {
      super(message, 500, 'INTERNAL_ERROR', false);
    }
  }