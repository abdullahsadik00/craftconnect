/**
 * Inquiry Routes
 * 
 * Inquiries are messages from potential customers to providers.
 * 
 * Route Structure:
 *   POST   /inquiries           - Create inquiry (PUBLIC - customers)
 *   GET    /inquiries           - List my inquiries (providers only)
 *   GET    /inquiries/stats     - Get inquiry statistics
 *   GET    /inquiries/:id       - Get specific inquiry
 *   PUT    /inquiries/:id/status - Update inquiry status
 */

import { Router } from "express";
import inquiryController from '../controllers/inquiry.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  createInquirySchema,
  updateInquiryStatusSchema,
  listInquiriesSchema,
} from '../validators/inquiry.validator.js';

const router = Router();
/**
 * POST /inquiries
 * Create a new inquiry (PUBLIC - no auth required)
 * 
 * This is the endpoint customers use to contact providers.
 * Rate limited to prevent spam.
 * 
 * Body: {
 *   providerId: string,
 *   customerName: string,
 *   customerPhone: string,
 *   customerEmail?: string,
 *   message: string
 * }
 * 
 * Response: Created Inquiry object
 */
router.post(
    '/',
    rateLimiter, // Extra rate limiting for public endpoint
    validate(createInquirySchema),
    inquiryController.create
  );
  
  // All routes below require authentication
  router.use(authMiddleware);
  
  /**
   * GET /inquiries/stats
   * Get inquiry statistics for the authenticated provider
   * 
   * Response: {
   *   total: number,
   *   new: number,
   *   contacted: number,
   *   converted: number,
   *   rejected: number,
   *   conversionRate: number (percentage)
   * }
   * 
   * Note: This must come before /:id route to avoid conflict
   */
  router.get('/stats', inquiryController.getStats);
  
  /**
   * GET /inquiries
   * List all inquiries for the authenticated provider
   * 
   * Query Params:
   *   - page: number (default: 1)
   *   - limit: number (default: 10, max: 100)
   *   - status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED'
   * 
   * Response: Paginated list of Inquiry objects
   */
  router.get(
    '/',
    validate(listInquiriesSchema),
    inquiryController.list
  );
  
  /**
   * GET /inquiries/:id
   * Get a specific inquiry by ID
   * 
   * Params: id - Inquiry ID
   * Response: Inquiry object
   * 
   * Note: Providers can only view their own inquiries
   */
  router.get('/:id', inquiryController.getById);
  
  /**
   * PUT /inquiries/:id/status
   * Update the status of an inquiry
   * 
   * Params: id - Inquiry ID
   * Body: { status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED' }
   * Response: Updated Inquiry object
   * 
   * Status Flow:
   *   NEW -> CONTACTED (provider contacted the customer)
   *   CONTACTED -> CONVERTED (job was won)
   *   CONTACTED -> REJECTED (job was lost or not interested)
   */
  router.put(
    '/:id/status',
    validate(updateInquiryStatusSchema),
    inquiryController.updateStatus
  );
  
  export default router;  