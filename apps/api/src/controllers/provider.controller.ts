/**
 * Provider Controller
 */

import { Request, Response, NextFunction } from 'express';
import providerService, { ListProvidersParams } from '../services/provider.service.js';
import {
  successResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse
} from '../utils/response.js';
import { CreateProviderInput, UpdateProviderInput } from '../validators/provider.validator.js';

export class ProviderController {
  /**
   * GET /providers
   * List all providers with filters
   */
  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const params: ListProvidersParams = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        city: req.query.city as string,
        serviceType: req.query.serviceType as string,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await providerService.list(params);

      paginatedResponse(res, result.data, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /providers/slug/:slug
   * Get provider by slug (public profile)
   */
  getBySlug = async (
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const viewerId = req.user?.id;
      const provider = await providerService.getBySlug(slug, viewerId);
      successResponse(res, provider);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /providers/me
   * Get current user's provider profile
   */
  getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const provider = await providerService.getByUserId(userId);
      successResponse(res, provider);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /providers
   * Create provider profile
   */
  create = async (
    req: Request<{}, {}, CreateProviderInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const provider = await providerService.create(userId, { ...req.body, userId });
      createdResponse(res, provider);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /providers/me
   * Update current user's provider profile
   */
  update = async (
    req: Request<{}, {}, UpdateProviderInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const provider = await providerService.update(userId, req.body);
      successResponse(res, provider);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /providers/me
   * Delete current user's provider profile
   */
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      await providerService.delete(userId);
      noContentResponse(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /providers/me/toggle-active
   * Toggle provider active status
   */
  toggleActive = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const provider = await providerService.toggleActive(userId);
      successResponse(res, provider);
    } catch (error) {
      next(error);
    }
  };
}

export const providerController = new ProviderController();
export default providerController;