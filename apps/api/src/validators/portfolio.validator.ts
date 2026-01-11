/**
 * Portfolio Validation Schemas
 */

import { z } from 'zod';
import { uuidSchema } from './common.validator.js';

// Portfolio categories
const categories = [
  'Kitchen',
  'Bedroom',
  'Living Room',
  'Office',
  'Bathroom',
  'Outdoor',
  'Other',
] as const;

const categoryEnum = z.enum(categories);

/**
 * Create portfolio item
 */
export const createPortfolioSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title must be less than 100 characters'),
    category: categoryEnum.optional(),
    imageUrl: z.string().url('Invalid image URL'),
  }),
});

/**
 * Update portfolio item
 */
export const updatePortfolioSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    title: z.string().min(2).max(100).optional(),
    category: categoryEnum.optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
});

/**
 * Delete portfolio item
 */
export const deletePortfolioSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

/**
 * Reorder portfolio items
 */
export const reorderPortfolioSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: uuidSchema,
        displayOrder: z.number().int().min(0),
      })
    ),
  }),
});

// Export types
export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>['body'];
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>['body'];