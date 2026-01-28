import React from 'react';
import type { ProviderProfile, TemplateId, ThemeId } from '../../types';
import { getTheme } from '../../lib/themes';

interface ServicesSectionProps {
  profile: ProviderProfile;
  templateId: TemplateId;
  themeId: ThemeId;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ themeId }) => {
  const theme = getTheme(themeId);

  // Mock services list since it's not in the profile yet
  const services = [
    { title: 'Consultation', desc: 'Expert advice for your needs.' },
    { title: 'Installation', desc: 'Professional installation services.' },
    { title: 'Maintenance', desc: 'Regular upkeep and support.' },
    { title: 'Repairs', desc: 'Quick and reliable fixes.' },
  ];

  return (
    <div className={`${theme.secondary} py-20 px-4 sm:px-6 lg:px-8`} id="services">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16`}>
            <span className={`uppercase tracking-wider text-sm font-semibold ${theme.accent}`}>What We Do</span>
            <h2 className={`text-3xl font-bold ${theme.text} mt-2`}>Our Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
                <div key={index} className={`${theme.background} p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-gray-200`}>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>{service.title}</h3>
                    <p className={`${theme.muted}`}>{service.desc}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
