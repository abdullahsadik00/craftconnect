import React from 'react';
import type { ProviderProfile, PortfolioItem, TemplateId, ThemeId } from '../../types';
import { getTheme } from '../../lib/themes';

interface PortfolioSectionProps {
  profile: ProviderProfile;
  portfolio: PortfolioItem[];
  templateId: TemplateId;
  themeId: ThemeId;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolio, themeId }) => {
  const theme = getTheme(themeId);

  if (!portfolio || portfolio.length === 0) return null;

  return (
    <div className={`${theme.background} py-20 px-4 sm:px-6 lg:px-8`} id="portfolio">
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-3xl font-bold ${theme.text} mb-12 text-center`}>Our Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg aspect-w-16 aspect-h-12 bg-gray-200 cursor-pointer">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <span className="text-white font-semibold text-lg">{item.title}</span>
                        <span className="text-white/80 text-sm">{item.category}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
