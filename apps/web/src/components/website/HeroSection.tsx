import React from 'react';
import type { ProviderProfile, TemplateId, ThemeId } from '../../types';
import { getTheme } from '../../lib/themes';

interface HeroSectionProps {
  profile: ProviderProfile;
  templateId: TemplateId;
  themeId: ThemeId;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, templateId, themeId }) => {
  const theme = getTheme(themeId);

  // Minimal Template
  if (templateId === 'minimal') {
    return (
      <div className={`${theme.background} py-20 px-4 sm:px-6 lg:px-8 text-center`}>
        {profile.profileImage && (
          <img
            src={profile.profileImage}
            alt={profile.businessName}
            className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-sm"
          />
        )}
        <h1 className={`text-4xl font-light tracking-tight ${theme.text} mb-4`}>
          {profile.businessName}
        </h1>
        <p className={`text-xl ${theme.muted} max-w-2xl mx-auto`}>
          {profile.serviceType}
        </p>
      </div>
    );
  }

  // Creative Template
  if (templateId === 'creative') {
    return (
      <div className={`${theme.primary} text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative`}>
        <div className="absolute inset-0 opacity-10 bg-pattern-dots"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-left">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                    {profile.serviceType}
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {profile.businessName}
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                    Professional services tailored to your needs.
                </p>
            </div>
            {profile.profileImage && (
                <div className="md:w-1/2 mt-10 md:mt-0 flex justify-end">
                     <div className="relative">
                        <div className="absolute inset-0 bg-white/20 transform rotate-6 rounded-3xl"></div>
                        <img
                            src={profile.profileImage}
                            alt={profile.businessName}
                            className="relative w-80 h-80 object-cover rounded-3xl shadow-2xl transform -rotate-3 transition-transform hover:rotate-0"
                        />
                     </div>
                </div>
            )}
        </div>
      </div>
    );
  }

  // Industrial Template
  if (templateId === 'industrial') {
    return (
      <div className="bg-gray-900 text-white py-24 px-4 relative">
        {profile.coverImage && (
            <div className="absolute inset-0">
                <img src={profile.coverImage} className="w-full h-full object-cover opacity-30" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-4 border-l-8 border-yellow-500 pl-6">
                {profile.businessName}
            </h1>
            <p className="text-xl text-gray-300 pl-8 uppercase tracking-widest font-semibold">
                {profile.serviceType} Services
            </p>
        </div>
      </div>
    );
  }

  // Professional Template (Default)
  return (
    <div className={`${theme.secondary} py-20 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
            <h1 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
            {profile.businessName}
            </h1>
            <p className={`text-xl ${theme.muted} mb-8`}>
            Providing top-quality {profile.serviceType.toLowerCase()} services with professionalism and care.
            </p>
            <div className="flex gap-4">
                <a href="#contact" className={`${theme.primary} text-white px-8 py-3 rounded-md font-medium shadow-lg hover:opacity-90 transition-opacity`}>
                    Get a Quote
                </a>
                <a href="#portfolio" className={`bg-white ${theme.text} px-8 py-3 rounded-md font-medium shadow border border-gray-200 hover:bg-gray-50 transition-colors`}>
                    View Work
                </a>
            </div>
        </div>
        {profile.profileImage && (
            <div className="md:w-1/2">
                <img
                    src={profile.profileImage}
                    alt={profile.businessName}
                    className="w-full h-96 object-cover rounded-lg shadow-xl"
                />
            </div>
        )}
      </div>
    </div>
  );
};
