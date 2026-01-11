/**
 * Portfolio Routes
 * 
 * All routes require authentication as only providers
 * can manage their own portfolio items.
 * 
 * Route Structure:
 *   GET    /portfolio           - List my portfolio items
 *   POST   /portfolio           - Add new portfolio item
 *   PUT    /portfolio/:id       - Update portfolio item
 *   DELETE /portfolio/:id       - Delete portfolio item
 *   PUT    /portfolio/reorder   - Reorder portfolio items
 */

import { Router } from 'express';
import portfolioController from '../controllers/portfolio.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createPortfolioSchema,
  updatePortfolioSchema,
  deletePortfolioSchema,
  reorderPortfolioSchema,
} from '../validators/portfolio.validator.js';

const router = Router();

// All portfolio routes require authentication
router.use(authMiddleware);

/**
 * GET /portfolio
 * Get all portfolio items for the authenticated provider
 * 
 * Response: Array of PortfolioItem objects sorted by displayOrder
 */
router.get('/', portfolioController.list);

/**
 * POST /portfolio
 * Create a new portfolio item
 * 
 * Body: { title: string, category?: string, imageUrl: string }
 * Response: Created PortfolioItem object
 * 
 * Note: Maximum 10 portfolio items per provider
 */
router.post(
  '/',
  validate(createPortfolioSchema),
  portfolioController.create
);

/**
 * PUT /portfolio/reorder
 * Reorder portfolio items (change display order)
 * 
 * Body: { items: [{ id: string, displayOrder: number }] }
 * Response: Updated array of PortfolioItem objects
 * 
 * Note: This must come before /:id route to avoid conflict
 */
router.put(
  '/reorder',
  validate(reorderPortfolioSchema),
  portfolioController.reorder
);

/**
 * PUT /portfolio/:id
 * Update a specific portfolio item
 * 
 * Params: id - Portfolio item ID
 * Body: { title?: string, category?: string, displayOrder?: number }
 * Response: Updated PortfolioItem object
 */
router.put(
  '/:id',
  validate(updatePortfolioSchema),
  portfolioController.update
);

/**
 * DELETE /portfolio/:id
 * Delete a portfolio item
 * 
 * Params: id - Portfolio item ID
 * Response: 204 No Content
 * 
 * Note: Remaining items are automatically reordered
 */
router.delete(
  '/:id',
  validate(deletePortfolioSchema),
  portfolioController.delete
);

export default router;