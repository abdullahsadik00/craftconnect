/**
 * Common Validation Schemas
 * 
 * WHAT: Reusable validation rules
 * WHY:
 *   1. DRY - Don't Repeat Yourself
 *   2. Consistent validation across endpoints
 *   3. Easy to update validation rules
 */

import { z } from 'zod';

// Indian phone number regex (10 digits starting with 6-9)
export const phoneRegex = /^[6-9]\d{9}$/;

// Email regex
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common field schemas
export const phoneSchema = z
  .string()
  .regex(phoneRegex, 'Invalid phone number. Must be 10 digits starting with 6-9');

export const emailSchema = z
  .string()
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const uuidSchema = z
  .string()
  .uuid('Invalid ID format');

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d+$/, 'OTP must contain only numbers');

// Pagination schemas
export const paginationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || '1', 10))
      .pipe(z.number().min(1)),
    limit: z
      .string()
      .optional()
      .transform((val) => parseInt(val || '10', 10))
      .pipe(z.number().min(1).max(100)),
  }),
});

// ID parameter schema
export const idParamSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

// Slug parameter schema
export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required'),
  }),
});