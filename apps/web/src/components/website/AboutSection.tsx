import React from 'react';
import type { ProviderProfile, TemplateId, ThemeId } from '../../types';
import { getTheme } from '../../lib/themes';

interface AboutSectionProps {
  profile: ProviderProfile;
  templateId: TemplateId;
  themeId: ThemeId;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, themeId }) => {
  const theme = getTheme(themeId);

  return (
    <div className={`${theme.background} py-20 px-4 sm:px-6 lg:px-8`} id="about">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12`}>
            <h2 className={`text-3xl font-bold ${theme.text} mb-4`}>About Us</h2>
            <div className={`h-1 w-20 mx-auto ${theme.primary}`}></div>
        </div>

        <div className={`prose prose-lg mx-auto ${theme.text} opacity-90 text-center leading-relaxed`}>
          <p>{profile.description}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className={`p-6 rounded-lg ${theme.secondary}`}>
                <div className={`text-4xl font-bold ${theme.accent} mb-2`}>100%</div>
                <div className={`${theme.muted}`}>Satisfaction</div>
            </div>
            <div className={`p-6 rounded-lg ${theme.secondary}`}>
                <div className={`text-4xl font-bold ${theme.accent} mb-2`}>24/7</div>
                <div className={`${theme.muted}`}>Support</div>
            </div>
            <div className={`p-6 rounded-lg ${theme.secondary}`}>
                <div className={`text-4xl font-bold ${theme.accent} mb-2`}>50+</div>
                <div className={`${theme.muted}`}>Projects Done</div>
            </div>
        </div>
      </div>
    </div>
  );
};
