/**
 * Inquiry Service
 * 
 * WHAT: Business logic for customer inquiries
 */

import db from './database.service.js';
import { generateId } from '../utils/id.js';
import { NotFoundError, ForbiddenError } from '../errors/index.js';
import { 
  Provider, 
  Inquiry, 
  InquiryStatus, 
  CreateInquiryInput,
  PaginatedResult 
} from '../types/index.js';
import logger from '../utils/logger.js';

export interface ListInquiriesParams {
  page: number;
  limit: number;
  status?: InquiryStatus;
}

export class InquiryService {
  /**
   * Create an inquiry (public - from customers)
   */
  async create(data: CreateInquiryInput): Promise<Inquiry> {
    // Verify provider exists and is active
    const provider = await db.findById<Provider>('providers', data.providerId);

    if (!provider || !provider.isActive) {
      throw new NotFoundError('Provider');
    }

    const now = new Date().toISOString();
    const inquiry: Inquiry = {
      id: generateId(),
      providerId: data.providerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      message: data.message,
      status: InquiryStatus.NEW,
      createdAt: now,
      updatedAt: now,
    };

    await db.create('inquiries', inquiry);

    logger.info(
      { inquiryId: inquiry.id, providerId: data.providerId },
      'New inquiry created'
    );

    // TODO: Notify provider (email/push notification)

    return inquiry;
  }

  /**
   * Get inquiries for current provider
   */
  async getMyInquiries(
    userId: string,
    params: ListInquiriesParams
  ): Promise<PaginatedResult<Inquiry>> {
    const { page, limit, status } = params;

    const provider = await this.getProviderByUserId(userId);

    // Get all inquiries for this provider
    let inquiries = await db.findWhere<Inquiry>(
      'inquiries',
      (i) => i.providerId === provider.id
    );

    // Filter by status if provided
    if (status) {
      inquiries = inquiries.filter((i) => i.status === status);
    }

    // Sort by created date (newest first)
    inquiries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const total = inquiries.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: inquiries.slice(start, end),
      page,
      limit,
      total,
      totalPages,
    };
  }

  /**
   * Get inquiry by ID
   */
  async getById(userId: string, inquiryId: string): Promise<Inquiry> {
    const provider = await this.getProviderByUserId(userId);

    const inquiry = await db.findById<Inquiry>('inquiries', inquiryId);

    if (!inquiry) {
      throw new NotFoundError('Inquiry');
    }

    if (inquiry.providerId !== provider.id) {
      throw new ForbiddenError('You can only view your own inquiries');
    }

    return inquiry;
  }

  /**
   * Update inquiry status
   */
  async updateStatus(
    userId: string,
    inquiryId: string,
    status: InquiryStatus
  ): Promise<Inquiry> {
    const provider = await this.getProviderByUserId(userId);

    const inquiry = await db.findById<Inquiry>('inquiries', inquiryId);

    if (!inquiry) {
      throw new NotFoundError('Inquiry');
    }

    if (inquiry.providerId !== provider.id) {
      throw new ForbiddenError('You can only update your own inquiries');
    }

    const updated = await db.update<Inquiry>('inquiries', inquiryId, {
      status,
      updatedAt: new Date().toISOString(),
    });

    logger.info({ inquiryId, status }, 'Inquiry status updated');

    return updated!;
  }

  /**
   * Get inquiry statistics for provider
   */
  async getStats(userId: string): Promise<{
    total: number;
    new: number;
    contacted: number;
    converted: number;
    rejected: number;
    conversionRate: number;
  }> {
    const provider = await this.getProviderByUserId(userId);

    const inquiries = await db.findWhere<Inquiry>(
      'inquiries',
      (i) => i.providerId === provider.id
    );

    const stats = {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === InquiryStatus.NEW).length,
      contacted: inquiries.filter((i) => i.status === InquiryStatus.CONTACTED).length,
      converted: inquiries.filter((i) => i.status === InquiryStatus.CONVERTED).length,
      rejected: inquiries.filter((i) => i.status === InquiryStatus.REJECTED).length,
      conversionRate: 0,
    };

    if (stats.total > 0) {
      stats.conversionRate = Math.round((stats.converted / stats.total) * 100);
    }

    return stats;
  }

  /**
   * Helper: Get provider by user ID
   */
  private async getProviderByUserId(userId: string): Promise<Provider> {
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === userId
    );

    if (!provider) {
      throw new NotFoundError('Provider profile');
    }

    return provider;
  }
}

export const inquiryService = new InquiryService();
export default inquiryService;