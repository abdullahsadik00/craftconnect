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

export type TemplateId = 'minimal' | 'creative' | 'professional' | 'industrial';
export type ThemeId = 'default' | 'ocean' | 'forest' | 'sunset' | 'dark' | 'berry';

export interface WebsiteSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'portfolio' | 'contact';
  order: number;
  isVisible: boolean;
  title?: string;
  content?: string;
}

export interface WebsiteConfig {
  templateId: TemplateId;
  themeId: ThemeId;
  sections: WebsiteSection[];
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
  websiteConfig?: WebsiteConfig;
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
