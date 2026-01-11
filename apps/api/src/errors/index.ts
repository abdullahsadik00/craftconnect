/**
 * Barrel Export for Errors
 * 
 * WHAT: Re-exports all errors from a single file
 * WHY: Cleaner imports in other files
 * 
 * Instead of:
 *   import { AppError } from '../errors/AppError.js';
 *   import { NotFoundError } from '../errors/NotFoundError.js';
 * 
 * We can do:
 *   import { AppError, NotFoundError } from '../errors/index.js';
 */

export * from './AppError.ts';