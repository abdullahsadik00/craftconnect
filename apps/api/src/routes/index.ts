/**
 * Main Routes Aggregator
 *
 * This file combines all route modules into a single router.
 * It defines the base path for each route group.
 *
 * API Structure:
 *   /api/v1/auth/*      - Authentication routes
 *   /api/v1/providers/* - Provider profile routes
 *   /api/v1/portfolio/* - Portfolio management routes
 *   /api/v1/inquiries/* - Customer inquiry routes
 *   /api/v1/health/*    - Health check routes (also at /health)
 *
 * Why This Structure:
 *   1. Versioning (/v1/) allows future API versions without breaking existing clients
 *   2. Resource-based URLs follow REST conventions
 *   3. Modular routes make code easier to maintain
 */

import { Router } from 'express';
import authRoutes from './auth.routes.ts';
import providerRoutes from './provider.routes.ts';
import portfolioRoutes from './portfolio.routes';
import inquiryRoutes from './inquiry.routes';
import healthRoutes from './health.routes';

const router = Router();

// Authentication: register, login, logout, token refresh
router.use('/auth', authRoutes);

// Provider profiles: CRUD operations for service providers
router.use('/providers', providerRoutes);

// Portfolio: manage provider's work samples/images
router.use('/portfolio', portfolioRoutes);

// Inquiries: customer messages to providers
router.use('/inquiries', inquiryRoutes);

// Health checks: API status monitoring
router.use('/health', healthRoutes);

/**
 * API Documentation endpoint (future)
 *
 * TODO: Add Swagger/OpenAPI documentation
 * router.use('/docs', swaggerRoutes);
 */

export default router;