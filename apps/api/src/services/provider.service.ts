/**
 * Provider Service
 * 
 * WHAT: Business logic for provider profiles
 * WHY: Separates data logic from HTTP handling
 */

import db from './database.service.js';
import { generateId } from '../utils/id.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../errors/index.js';
import { 
  Provider, 
  PortfolioItem,
  CreateProviderInput, 
  UpdateProviderInput,
  PaginatedResult 
} from '../types/index.js';
import logger from '../utils/logger.js';

export interface ListProvidersParams {
  page: number;
  limit: number;
  city?: string;
  serviceType?: string;
  search?: string;
  sortBy?: 'profileViews' | 'createdAt' | 'experienceYears';
  sortOrder?: 'asc' | 'desc';
}

export class ProviderService {
  /**
   * List providers with filters and pagination
   */
  async list(params: ListProvidersParams): Promise<PaginatedResult<Provider & { portfolioItems: PortfolioItem[] }>> {
    const { page, limit, city, serviceType, search, sortBy = 'profileViews', sortOrder = 'desc' } = params;

    // Get all active providers
    let providers = await db.findWhere<Provider>(
      'providers',
      (p) => p.isActive
    );

    // Apply filters
    if (city) {
      providers = providers.filter((p) => p.city.toLowerCase() === city.toLowerCase());
    }

    if (serviceType) {
      providers = providers.filter((p) => p.serviceType === serviceType);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      providers = providers.filter(
        (p) =>
          p.businessName.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    providers.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortBy) {
        case 'profileViews':
          aVal = a.profileViews;
          bVal = b.profileViews;
          break;
        case 'experienceYears':
          aVal = a.experienceYears;
          bVal = b.experienceYears;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          aVal = a.profileViews;
          bVal = b.profileViews;
      }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    // Calculate pagination
    const total = providers.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    // Slice for pagination
    const paginatedProviders = providers.slice(start, end);

    // Get portfolio items for each provider
    const allPortfolios = await db.findAll<PortfolioItem>('portfolios');
    
    const providersWithPortfolio = paginatedProviders.map((provider) => {
      const portfolioItems = allPortfolios
        .filter((item) => item.providerId === provider.id)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 4); // Get first 4 images for preview
      
      return {
        ...provider,
        portfolioItems,
      };
    });

    return {
      data: providersWithPortfolio,
      page,
      limit,
      total,
      totalPages,
    };
  }

  /**
   * Get provider by slug (public profile)
   */
  async getBySlug(slug: string, viewerId?: string): Promise<Provider & { portfolioItems: PortfolioItem[] }> {
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.slug === slug && p.isActive
    );

    if (!provider) {
      throw new NotFoundError('Provider');
    }

    // Get portfolio items
    const portfolioItems = await db.findWhere<PortfolioItem>(
      'portfolios',
      (item) => item.providerId === provider.id
    );

    // Sort by display order
    portfolioItems.sort((a, b) => a.displayOrder - b.displayOrder);

    // Increment view count if not viewing own profile
    if (provider.userId !== viewerId) {
      await db.update<Provider>('providers', provider.id, {
        profileViews: provider.profileViews + 1,
      });
    }

    return {
      ...provider,
      portfolioItems,
    };
  }

  /**
   * Get provider by user ID (for dashboard)
   */
  async getByUserId(userId: string): Promise<Provider & { portfolioItems: PortfolioItem[] }> {
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === userId
    );

    if (!provider) {
      throw new NotFoundError('Provider profile');
    }

    // Get portfolio items
    const portfolioItems = await db.findWhere<PortfolioItem>(
      'portfolios',
      (item) => item.providerId === provider.id
    );

    portfolioItems.sort((a, b) => a.displayOrder - b.displayOrder);

    return {
      ...provider,
      portfolioItems,
    };
  }

  /**
   * Create provider profile
   */
  async create(userId: string, data: CreateProviderInput): Promise<Provider> {
    // Check if user already has a provider profile
    const existing = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === userId
    );

    if (existing) {
      throw new ConflictError('Provider profile already exists');
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(data.businessName);

    const now = new Date().toISOString();
    const provider: Provider = {
      id: generateId(),
      userId,
      businessName: data.businessName,
      slug,
      serviceType: data.serviceType,
      city: data.city,
      whatsappNumber: data.whatsappNumber,
      experienceYears: data.experienceYears || 0,
      description: data.description || null,
      isVerified: false,
      isActive: true,
      profileViews: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.create('providers', provider);

    logger.info({ providerId: provider.id, userId }, 'Provider profile created');

    return provider;
  }

  /**
   * Update provider profile
   */
  async update(userId: string, data: UpdateProviderInput): Promise<Provider> {
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === userId
    );

    if (!provider) {
      throw new NotFoundError('Provider profile');
    }

    const updates: Partial<Provider> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const updated = await db.update<Provider>('providers', provider.id, updates);

    if (!updated) {
      throw new NotFoundError('Provider profile');
    }

    logger.info({ providerId: provider.id }, 'Provider profile updated');

    return updated;
  }

  /**
   * Delete provider profile
   */
  async delete(userId: string): Promise<void> {
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === userId
    );

    if (!provider) {
      throw new NotFoundError('Provider profile');
    }

    // Delete portfolio items
    await db.deleteWhere<PortfolioItem>(
      'portfolios',
      (item) => item.providerId === provider.id
    );

    // Delete provider
    await db.delete('providers', provider.id);

    logger.info({ providerId: provider.id }, 'Provider profile deleted');
  }

  /**
   * Toggle active status
   */
  async toggleActive(userId: string): Promise<Provider> {
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === userId
    );

    if (!provider) {
      throw new NotFoundError('Provider profile');
    }

    const updated = await db.update<Provider>('providers', provider.id, {
      isActive: !provider.isActive,
      updatedAt: new Date().toISOString(),
    });

    return updated!;
  }
}

export const providerService = new ProviderService();
export default providerService;