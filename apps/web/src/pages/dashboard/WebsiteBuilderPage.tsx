import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ProviderProfile, WebsiteConfig } from '../../types';
import { MOCK_PROFILE } from '../../data/mock';

export const WebsiteBuilderPage: React.FC = () => {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<WebsiteConfig>();

  const currentTemplate = watch('templateId');
  const currentTheme = watch('themeId');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(MOCK_PROFILE);

      if (MOCK_PROFILE.websiteConfig) {
        setValue('templateId', MOCK_PROFILE.websiteConfig.templateId);
        setValue('themeId', MOCK_PROFILE.websiteConfig.themeId);
        setValue('sections', MOCK_PROFILE.websiteConfig.sections);
      } else {
         // Default
        setValue('templateId', 'professional');
        setValue('themeId', 'default');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: WebsiteConfig) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updated website config:', data);

      // Update local mock object for immediate feedback in preview if we were using a real state store
      if (MOCK_PROFILE) {
          MOCK_PROFILE.websiteConfig = {
              ...MOCK_PROFILE.websiteConfig,
              ...data
          };
      }

      alert('Website settings saved!');
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Website Builder</h1>
        <a
            href={`/p/${profile?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
        >
            View Live Site &rarr;
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Template Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Choose a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['minimal', 'creative', 'professional', 'industrial'].map((t) => (
                    <label
                        key={t}
                        className={`
                            relative border-2 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors
                            ${currentTemplate === t ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}
                        `}
                    >
                        <input
                            {...register('templateId')}
                            type="radio"
                            value={t}
                            className="sr-only"
                        />
                        <div className="font-semibold capitalize text-gray-900">{t}</div>
                        <div className="text-sm text-gray-500 mt-1">
                            {t === 'minimal' && 'Clean and simple, focus on content.'}
                            {t === 'creative' && 'Bold and artistic, stands out.'}
                            {t === 'professional' && 'Trustworthy and corporate.'}
                            {t === 'industrial' && 'Strong and rugged, high contrast.'}
                        </div>
                    </label>
                ))}
            </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Choose a Color Theme</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { id: 'default', name: 'Blue', color: 'bg-blue-600' },
                    { id: 'ocean', name: 'Ocean', color: 'bg-cyan-600' },
                    { id: 'forest', name: 'Forest', color: 'bg-emerald-600' },
                    { id: 'sunset', name: 'Sunset', color: 'bg-orange-500' },
                    { id: 'dark', name: 'Dark', color: 'bg-gray-900' },
                    { id: 'berry', name: 'Berry', color: 'bg-pink-600' },
                ].map((theme) => (
                    <label
                        key={theme.id}
                        className={`
                            flex flex-col items-center cursor-pointer p-3 rounded-lg border-2 hover:bg-gray-50
                            ${currentTheme === theme.id ? 'border-blue-600' : 'border-transparent'}
                        `}
                    >
                        <input
                            {...register('themeId')}
                            type="radio"
                            value={theme.id}
                            className="sr-only"
                        />
                        <div className={`w-12 h-12 rounded-full ${theme.color} shadow-sm mb-2`}></div>
                        <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="flex justify-end">
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
};
