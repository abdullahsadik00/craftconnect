/**
 * Provider Validation Schemas
 */

import { z } from 'zod';
import { phoneSchema, uuidSchema } from './common.validator.js';
import { ServiceType } from '../types/index.js';

// Service type enum for validation
const serviceTypeEnum = z.enum([
  ServiceType.CARPENTER,
  ServiceType.INTERIOR_DESIGNER,
  ServiceType.HOME_DECOR,
  ServiceType.FURNITURE_MAKER,
]);

// Indian cities (can be expanded)
const cities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
] as const;

const cityEnum = z.enum(cities);

/**
 * Create provider profile
 */
export const createProviderSchema = z.object({
  body: z.object({
    businessName: z
      .string()
      .min(2, 'Business name must be at least 2 characters')
      .max(100, 'Business name must be less than 100 characters'),
    serviceType: serviceTypeEnum,
    city: cityEnum,
    whatsappNumber: phoneSchema,
    experienceYears: z
      .number()
      .int()
      .min(0, 'Experience cannot be negative')
      .max(50, 'Experience seems too high')
      .optional()
      .default(0),
    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .optional(),
  }),
});

/**
 * Update provider profile
 */
export const updateProviderSchema = z.object({
  body: z.object({
    businessName: z
      .string()
      .min(2)
      .max(100)
      .optional(),
    serviceType: serviceTypeEnum.optional(),
    city: cityEnum.optional(),
    whatsappNumber: phoneSchema.optional(),
    experienceYears: z.number().int().min(0).max(50).optional(),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
  }),
});

/**
 * Get provider by slug
 */
export const getProviderBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required'),
  }),
});

/**
 * List providers with filters
 */
export const listProvidersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || '1', 10)),
    limit: z
      .string()
      .optional()
      .transform((val) => parseInt(val || '10', 10)),
    city: z.string().optional(),
    serviceType: serviceTypeEnum.optional(),
    search: z.string().optional(),
    sortBy: z.enum(['profileViews', 'createdAt', 'experienceYears']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

// Export types
export type CreateProviderInput = z.infer<typeof createProviderSchema>['body'];
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>['body'];
export type ListProvidersQuery = z.infer<typeof listProvidersSchema>['query'];