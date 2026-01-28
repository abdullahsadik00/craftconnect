import React from 'react';
import type { ProviderProfile, PortfolioItem, WebsiteConfig } from '../../types';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { PortfolioSection } from './PortfolioSection';
import { ContactSection } from './ContactSection';

interface WebsiteRendererProps {
  profile: ProviderProfile;
  portfolio: PortfolioItem[];
}

const DEFAULT_CONFIG: WebsiteConfig = {
  templateId: 'professional',
  themeId: 'default',
  sections: [
    { id: 'hero', type: 'hero', order: 0, isVisible: true },
    { id: 'about', type: 'about', order: 1, isVisible: true },
    { id: 'services', type: 'services', order: 2, isVisible: true },
    { id: 'portfolio', type: 'portfolio', order: 3, isVisible: true },
    { id: 'contact', type: 'contact', order: 4, isVisible: true },
  ]
};

export const WebsiteRenderer: React.FC<WebsiteRendererProps> = ({ profile, portfolio }) => {
  const config = profile.websiteConfig || DEFAULT_CONFIG;
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white font-sans">
      {sortedSections.map((section) => {
        if (!section.isVisible) return null;

        const commonProps = {
          key: section.id,
          profile,
          templateId: config.templateId,
          themeId: config.themeId,
        };

        switch (section.type) {
          case 'hero':
            return <HeroSection {...commonProps} />;
          case 'about':
            return <AboutSection {...commonProps} />;
          case 'services':
            return <ServicesSection {...commonProps} />;
          case 'portfolio':
            return <PortfolioSection {...commonProps} portfolio={portfolio} />;
          case 'contact':
            return <ContactSection {...commonProps} />;
          default:
            return null;
        }
      })}

      <footer className="bg-gray-900 text-white py-8 text-center text-sm opacity-80">
        <p>&copy; {new Date().getFullYear()} {profile.businessName}. Powered by CraftConnect.</p>
      </footer>
    </div>
  );
};
