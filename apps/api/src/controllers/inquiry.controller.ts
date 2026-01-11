/**
 * Inquiry Controller
 */

import { Request, Response, NextFunction } from 'express';
import inquiryService, { ListInquiriesParams } from '../services/inquiry.service.js';
import { 
  successResponse, 
  createdResponse,
  paginatedResponse 
} from '../utils/response.js';
import { CreateInquiryInput, UpdateInquiryStatusInput } from '../validators/inquiry.validator.js';
import { InquiryStatus } from '../types/index.js';

export class InquiryController {
  /**
   * POST /inquiries
   * Create inquiry (public - from customers)
   */
  create = async (
    req: Request<{}, {}, CreateInquiryInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const inquiry = await inquiryService.create(req.body);
      createdResponse(res, inquiry);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /inquiries
   * Get my inquiries (provider only)
   */
  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const params: ListInquiriesParams = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        status: req.query.status as InquiryStatus,
      };

      const result = await inquiryService.getMyInquiries(userId, params);
      
      paginatedResponse(res, result.data, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /inquiries/:id
   * Get inquiry by ID
   */
  getById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const inquiry = await inquiryService.getById(userId, id);
      successResponse(res, inquiry);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /inquiries/:id/status
   * Update inquiry status
   */
  updateStatus = async (
    req: Request<{ id: string }, {}, UpdateInquiryStatusInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { status } = req.body;
      const inquiry = await inquiryService.updateStatus(userId, id, status);
      successResponse(res, inquiry);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /inquiries/stats
   * Get inquiry statistics
   */
  getStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const stats = await inquiryService.getStats(userId);
      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  };
}

export const inquiryController = new InquiryController();
export default inquiryController;