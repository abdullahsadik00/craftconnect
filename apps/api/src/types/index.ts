/**
 * Type Definitions
 * 
 * WHAT: TypeScript interfaces for our data structures
 * WHY:
 *   1. Type safety throughout the application
 *   2. IDE autocomplete and error detection
 *   3. Self-documenting code
 *   4. Refactoring becomes safer
 */

// ============================================
// ENUMS
// ============================================

export enum Role {
    PROVIDER = 'PROVIDER',
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
}

export enum ServiceType {
    CARPENTER = 'CARPENTER',
    INTERIOR_DESIGNER = 'INTERIOR_DESIGNER',
    HOME_DECOR = 'HOME_DECOR',
    FURNITURE_MAKER = 'FURNITURE_MAKER'
}

export enum InquiryStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    CONVERTED = 'CONVERTED',
    REJECTED = 'REJECTED'
}

export enum OtpType {
    LOGIN = 'LOGIN',
    REGISTER = 'REGISTER',
    RESET_PASSWORD = 'RESET_PASSWORD'
}

// ============================================
// DATABASE MODELS
// ============================================

/**
 * User model - represents an authenticated user
 */

export interface User {
    id: string;
    email: string | null;
    phoneNumber: string | null;
    passwordHash: string | null;
    role: Role;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
}

/**
 * Provider model - represents a service provider profile
 */
export interface Provider {
    id: string;
    userId: string;
    businessName: string;
    slug: string;
    serviceType: ServiceType;
    city: string;
    whatsappNumber: string;
    experienceYears: number;
    description: string | null;
    isVerified: boolean;
    isActive: boolean;
    profileViews: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Portfolio item model - represents a work sample
 */
export interface PortfolioItem {
    id: string;
    providerId: string;
    imageUrl: string;
    description: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    category: string | null;
}

/**
 * Inquiry model - represents a customer inquiry
 */
export interface Inquiry {
    id: string;
    providerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    message: string;
    status: InquiryStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInquiryInput {
    providerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    message: string;
}

/**
 * OTP model - for phone/email verification
 */
export interface Otp {
    id: string;
    userId: string;
    code: string;
    type: OtpType;
    expiresAt: string;
    createdAt: string;
    verified: boolean;
    attempts: number;
}

/**
 * Session model - for refresh tokens
 */
export interface Session {
    id: string;
    userId: string;
    refreshToken: string;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: string;
    expiresAt: string;
}

// ============================================
// API TYPES
// ============================================

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    }
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code: number;
        error?: Record<string, string[]>;
    }
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ============================================
// REQUEST TYPES
// ============================================

export interface CreateUserInput {
    email?: string;
    phoneNumber?: string;
    password: string;
    role: Role;
}

export interface CreateProviderInput {
    userId: string;
    businessName: string;
    serviceType: ServiceType;
    city: string;
    whatsappNumber: string;
    experienceYears?: number;
    description?: string;
}

export interface UpdateProviderInput {
    businessName?: string;
    serviceType?: ServiceType;
    city?: string;
    whatsappNumber?: string;
    experienceYears?: number;
    description?: string;
    isActive?: boolean;
}

export interface CreatePortfolioItemInput {
    title: string;
    category?: string;
    imgUrl: string;
    description?: string;
}