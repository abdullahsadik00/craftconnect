import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ProviderProfile, PortfolioItem } from '../types';
import { MOCK_PROFILE, MOCK_PORTFOLIO } from '../data/mock';
import { WebsiteRenderer } from '../components/website/WebsiteRenderer';

export const ProviderPublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (slug) {
      fetchProvider();
      fetchPortfolio();
    }
  }, [slug]);

  const fetchProvider = async () => {
    try {
      // Mock fetch
      await new Promise(resolve => setTimeout(resolve, 500));
      setProvider(MOCK_PROFILE);
    } catch (error) {
      console.error('Failed to fetch provider', error);
    }
  };

  const fetchPortfolio = async () => {
      // Mock fetch
      setPortfolio(MOCK_PORTFOLIO);
  };

  if (!provider) return <div className="text-center py-12">Loading or Provider not found...</div>;

  return <WebsiteRenderer profile={provider} portfolio={portfolio} />;
};
