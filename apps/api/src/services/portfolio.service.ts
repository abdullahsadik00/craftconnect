/**
 * Portfolio Service
 * 
 * WHAT: Business logic for portfolio items
 */

import db from './database.service.js';
import { generateId } from '../utils/id.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../errors/index.js';
import { Provider, PortfolioItem, CreatePortfolioItemInput } from '../types/index.js';
import logger from '../utils/logger.js';

const MAX_PORTFOLIO_ITEMS = 10;

export class PortfolioService {
  /**
   * Get all portfolio items for current user's provider
   */
  async getMyPortfolio(userId: string): Promise<PortfolioItem[]> {
    const provider = await this.getProviderByUserId(userId);

    const items = await db.findWhere<PortfolioItem>(
      'portfolios',
      (item) => item.providerId === provider.id
    );

    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Get portfolio items for a provider
   */
  async getByProviderId(providerId: string): Promise<PortfolioItem[]> {
    const items = await db.findWhere<PortfolioItem>(
      'portfolios',
      (item) => item.providerId === providerId
    );

    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Create portfolio item
   */
  async create(userId: string, data: CreatePortfolioItemInput): Promise<PortfolioItem> {
    const provider = await this.getProviderByUserId(userId);

    // Check limit
    const existingCount = await db.count<PortfolioItem>(
      'portfolios',
      (item) => item.providerId === provider.id
    );

    if (existingCount >= MAX_PORTFOLIO_ITEMS) {
      throw new BadRequestError(
        `Maximum ${MAX_PORTFOLIO_ITEMS} portfolio items allowed`
      );
    }

    const item: PortfolioItem = {
      id: generateId(),
      providerId: provider.id,
      imageUrl: data.imgUrl,
      title: data.title,
      category: data.category || null,
      displayOrder: existingCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: data.description || '',
    };

    await db.create('portfolios', item);

    logger.info({ portfolioId: item.id, providerId: provider.id }, 'Portfolio item created');

    return item;
  }

  /**
   * Update portfolio item
   */
  async update(
    userId: string,
    itemId: string,
    data: Partial<CreatePortfolioItemInput & { displayOrder: number }>
  ): Promise<PortfolioItem> {
    const provider = await this.getProviderByUserId(userId);

    const item = await db.findById<PortfolioItem>('portfolios', itemId);

    if (!item) {
      throw new NotFoundError('Portfolio item');
    }

    if (item.providerId !== provider.id) {
      throw new ForbiddenError('You can only update your own portfolio items');
    }

    const updated = await db.update<PortfolioItem>('portfolios', itemId, {
      title: data.title,
      category: data.category,
      displayOrder: data.displayOrder,
    });

    return updated!;
  }

  /**
   * Delete portfolio item
   */
  async delete(userId: string, itemId: string): Promise<void> {
    const provider = await this.getProviderByUserId(userId);

    const item = await db.findById<PortfolioItem>('portfolios', itemId);

    if (!item) {
      throw new NotFoundError('Portfolio item');
    }

    if (item.providerId !== provider.id) {
      throw new ForbiddenError('You can only delete your own portfolio items');
    }

    await db.delete('portfolios', itemId);

    // Reorder remaining items
    const remaining = await db.findWhere<PortfolioItem>(
      'portfolios',
      (i) => i.providerId === provider.id
    );

    remaining.sort((a, b) => a.displayOrder - b.displayOrder);

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].displayOrder !== i) {
        await db.update<PortfolioItem>('portfolios', remaining[i].id, { displayOrder: i });
      }
    }

    logger.info({ portfolioId: itemId }, 'Portfolio item deleted');
  }

  /**
   * Reorder portfolio items
   */
  async reorder(
    userId: string,
    items: Array<{ id: string; displayOrder: number }>
  ): Promise<PortfolioItem[]> {
    const provider = await this.getProviderByUserId(userId);

    // Verify all items belong to this provider
    for (const item of items) {
      const existing = await db.findById<PortfolioItem>('portfolios', item.id);

      if (!existing) {
        throw new NotFoundError(`Portfolio item ${item.id}`);
      }

      if (existing.providerId !== provider.id) {
        throw new ForbiddenError('You can only reorder your own portfolio items');
      }

      await db.update<PortfolioItem>('portfolios', item.id, { displayOrder: item.displayOrder });
    }

    return this.getMyPortfolio(userId);
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
      throw new NotFoundError('Provider profile. Please create one first.');
    }

    return provider;
  }
}

export const portfolioService = new PortfolioService();
export default portfolioService;