/**
 * Validation Middleware
 * 
 * WHAT: Validates request data against Zod schemas
 * WHY:
 *   1. Ensure data is in correct format
 *   2. Prevent invalid data from reaching controllers
 *   3. Provide clear error messages
 *   4. Type-safe validated data
 * 
 * HOW IT WORKS:
 *   1. Zod schema validates req.body, req.query, req.params
 *   2. If valid, passes to next middleware
 *   3. If invalid, throws ValidationError
 */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors/index.js';

/**
 * Create validation middleware from Zod schema
 * 
 * Usage:
 *   router.post('/users', validate(createUserSchema), createUser);
 * 
 * Schema should validate: { body, query, params }
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Transform Zod errors into our format
        const errors: Record<string, string[]> = {};

        error.errors.forEach((err) => {
          // Get field path (e.g., 'body.email' -> 'email')
          const path = err.path.slice(1).join('.');
          
          if (!errors[path]) {
            errors[path] = [];
          }
          
          errors[path].push(err.message);
        });

        next(new ValidationError(errors));
      } else {
        next(error);
      }
    }
  };
};

export default validate;