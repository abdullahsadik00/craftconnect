
import React, { useState } from 'react';
import { PROVIDER_DEMOS } from '../../data/builder-demo';
import type { ProviderDemoConfig } from '../../data/builder-demo';
import { ComponentRenderer } from './BuilderComponents';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

export const WebsitePreview: React.FC<{ className?: string }> = ({ className = "min-h-screen" }) => {
  const [selectedProviderId, setSelectedProviderId] = useState<string>(PROVIDER_DEMOS[0].id);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const selectedProvider = PROVIDER_DEMOS.find(p => p.id === selectedProviderId) || PROVIDER_DEMOS[0];

  return (
    <div className={`bg-gray-100 flex flex-col font-sans ${className}`}>

      {/* --- Control Bar --- */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Provider Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Preview Mode:
          </span>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {PROVIDER_DEMOS.map(provider => (
              <button
                key={provider.id}
                onClick={() => setSelectedProviderId(provider.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  selectedProviderId === provider.id
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {provider.category}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Controls */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            title="Mobile View"
          >
            <Smartphone className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            title="Tablet View"
          >
            <Tablet className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            title="Desktop View"
          >
            <Monitor className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* --- Preview Canvas --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-gray-200/50">
        <div
          className={`bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden ${
            viewMode === 'mobile' ? 'w-[375px] rounded-3xl border-8 border-gray-800' :
            viewMode === 'tablet' ? 'w-[768px] rounded-xl border-4 border-gray-800' :
            'w-full max-w-[1400px] rounded-lg border border-gray-200'
          }`}
          style={{ minHeight: 'calc(100vh - 140px)' }}
        >
          {/* Simulated Browser Bar for Desktop */}
          {viewMode === 'desktop' && (
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-gray-500 text-center border border-gray-200">
                craftconnect.com/{selectedProvider.id}
              </div>
            </div>
          )}

          {/* Dynamic Content Rendering */}
          <div className="h-full overflow-y-auto bg-white scroll-smooth">
            {selectedProvider.components.map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                themeColor={selectedProvider.themeColor}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
