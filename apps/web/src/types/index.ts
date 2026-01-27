export type UserRole = 'USER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string;
  serviceType: string; // e.g., 'PLUMBER', 'ELECTRICIAN'
  phone: string;
  email: string;
  address?: string;
  website?: string;
  isActive: boolean;
  isVerified: boolean;
  profileImage?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  providerId: string;
  title: string;
  category: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';

export interface Inquiry {
  id: string;
  providerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  rejected: number;
  conversionRate: number;
}
