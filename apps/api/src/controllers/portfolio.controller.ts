// src/controllers/portfolio.controller.ts

/**
 * Portfolio Controller
 */

import { Request, Response, NextFunction } from 'express';
import portfolioService from '../services/portfolio.service.js';
import { 
  successResponse, 
  createdResponse, 
  noContentResponse 
} from '../utils/response.js';
import { CreatePortfolioInput, UpdatePortfolioInput } from '../validators/portfolio.validator.js';

export class PortfolioController {
  /**
   * GET /portfolio
   * Get my portfolio items
   */
  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const items = await portfolioService.getMyPortfolio(userId);
      successResponse(res, items);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /portfolio
   * Create portfolio item
   */
  create = async (
    req: Request<{}, {}, CreatePortfolioInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const item = await portfolioService.create(userId, req.body);
      createdResponse(res, item);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /portfolio/:id
   * Update portfolio item
   */
  update = async (
    req: Request<{ id: string }, {}, UpdatePortfolioInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const item = await portfolioService.update(userId, id, req.body);
      successResponse(res, item);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /portfolio/:id
   * Delete portfolio item
   */
  delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await portfolioService.delete(userId, id);
      noContentResponse(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /portfolio/reorder
   * Reorder portfolio items
   */
  reorder = async (
    req: Request<{}, {}, { items: Array<{ id: string; displayOrder: number }> }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { items } = req.body;
      const updated = await portfolioService.reorder(userId, items);
      successResponse(res, updated);
    } catch (error) {
      next(error);
    }
  };
}

export const portfolioController = new PortfolioController();
export default portfolioController;