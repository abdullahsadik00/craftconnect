/**
 * Inquiry Validation Schemas
 */

import { z } from 'zod';
import { phoneSchema, emailSchema, uuidSchema } from './common.validator.js';
import { InquiryStatus } from '../types/index.js';

const inquiryStatusEnum = z.enum([
  InquiryStatus.NEW,
  InquiryStatus.CONTACTED,
  InquiryStatus.CONVERTED,
  InquiryStatus.REJECTED,
]);

/**
 * Create inquiry (customer submits inquiry to provider)
 */
export const createInquirySchema = z.object({
  body: z.object({
    providerId: uuidSchema,
    customerName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    customerPhone: phoneSchema,
    customerEmail: emailSchema.optional().or(z.literal('')),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message is too long'),
  }),
});

/**
 * Update inquiry status
 */
export const updateInquiryStatusSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    status: inquiryStatusEnum,
  }),
});

/**
 * List inquiries with filters
 */
export const listInquiriesSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || '1', 10)),
    limit: z
      .string()
      .optional()
      .transform((val) => parseInt(val || '10', 10)),
    status: inquiryStatusEnum.optional(),
  }),
});

// Export types
export type CreateInquiryInput = z.infer<typeof createInquirySchema>['body'];
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>['body'];
// export type ListInquiriesQuery = z.infer<typeof listInquiriesSchema>['query'];