import type { ThemeId } from '../types';

export const THEMES: Record<ThemeId, {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}> = {
  default: {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-100',
    accent: 'text-blue-600',
    background: 'bg-white',
    text: 'text-gray-900',
    muted: 'text-gray-500'
  },
  ocean: {
    primary: 'bg-cyan-600',
    secondary: 'bg-cyan-50',
    accent: 'text-cyan-600',
    background: 'bg-white',
    text: 'text-slate-900',
    muted: 'text-slate-500'
  },
  forest: {
    primary: 'bg-emerald-600',
    secondary: 'bg-emerald-50',
    accent: 'text-emerald-600',
    background: 'bg-stone-50',
    text: 'text-stone-900',
    muted: 'text-stone-500'
  },
  sunset: {
    primary: 'bg-orange-500',
    secondary: 'bg-orange-50',
    accent: 'text-orange-500',
    background: 'bg-white',
    text: 'text-gray-900',
    muted: 'text-gray-500'
  },
  dark: {
    primary: 'bg-white',
    secondary: 'bg-gray-800',
    accent: 'text-white',
    background: 'bg-gray-900',
    text: 'text-white',
    muted: 'text-gray-400'
  },
  berry: {
    primary: 'bg-pink-600',
    secondary: 'bg-pink-50',
    accent: 'text-pink-600',
    background: 'bg-white',
    text: 'text-gray-900',
    muted: 'text-gray-500'
  }
};

export const getTheme = (id: ThemeId) => THEMES[id] || THEMES.default;
