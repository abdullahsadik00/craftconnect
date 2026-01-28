import type { User, ProviderProfile, PortfolioItem, Inquiry, InquiryStats } from '../types';

export const MOCK_USER: User = {
  id: 'user-1',
  email: 'provider@example.com',
  role: 'PROVIDER',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_AUTH_RESPONSE = {
  user: MOCK_USER,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

export const MOCK_PROFILE: ProviderProfile = {
  id: 'provider-1',
  userId: 'user-1',
  businessName: "John's Plumbing",
  slug: 'johns-plumbing',
  description: 'Expert plumbing services for residential and commercial needs. We have been serving the area for over 10 years with dedication and quality.',
  serviceType: 'PLUMBER',
  phone: '555-0123',
  email: 'john@plumbing.com',
  address: '123 Main St, Cityville',
  isActive: true,
  isVerified: true,
  websiteConfig: {
    templateId: 'professional',
    themeId: 'ocean',
    sections: [
      { id: 'hero', type: 'hero', order: 0, isVisible: true },
      { id: 'about', type: 'about', order: 1, isVisible: true },
      { id: 'services', type: 'services', order: 2, isVisible: true },
      { id: 'portfolio', type: 'portfolio', order: 3, isVisible: true },
      { id: 'contact', type: 'contact', order: 4, isVisible: true }
    ]
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'item-1',
    providerId: 'provider-1',
    title: 'Modern Kitchen Renovation',
    category: 'Renovation',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-2',
    providerId: 'provider-1',
    title: 'Bathroom Leak Fix',
    category: 'Repair',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-3',
    providerId: 'provider-1',
    title: 'Pipe Installation',
    category: 'Installation',
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    providerId: 'provider-1',
    customerName: 'Alice Smith',
    customerPhone: '555-9876',
    customerEmail: 'alice@example.com',
    message: 'I need a quote for a leaky faucet in my kitchen.',
    status: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inq-2',
    providerId: 'provider-1',
    customerName: 'Bob Jones',
    customerPhone: '555-5432',
    message: 'Do you do emergency repairs on weekends? My water heater broke.',
    status: 'CONTACTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inq-3',
    providerId: 'provider-1',
    customerName: 'Charlie Brown',
    customerPhone: '555-1111',
    message: 'Looking for a full bathroom remodel.',
    status: 'CONVERTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const MOCK_STATS: InquiryStats = {
  total: 15,
  new: 5,
  contacted: 8,
  converted: 2,
  rejected: 0,
  conversionRate: 13.3
};
