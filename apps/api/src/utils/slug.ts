/**
 * Slug Generation Utilities
 * 
 * WHAT: Create URL-friendly strings from business names
 * WHY:
 *   1. Clean URLs (craftconnect.com/kumar-carpentry)
 *   2. SEO friendly
 *   3. Human readable
 * 
 * EXAMPLE:
 *   "Kumar's Carpentry Works!" → "kumars-carpentry-works"
 */

import db from '../services/database.service.js';
import { Provider } from '../types/index.js';

/**
 * Generate a slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate a unique slug (checks database)
 */
export const generateUniqueSlug = async (businessName: string): Promise<string> => {
  const baseSlug = generateSlug(businessName);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Check if slug exists
    const existing = await db.findOne<Provider>('providers', (p) => p.slug === slug);

    if (!existing) {
      return slug;
    }

    // Add counter and try again
    slug = `${baseSlug}-${counter}`;
    counter++;

    // Safety check to prevent infinite loop
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
};

export default {
  generateSlug,
  generateUniqueSlug,
};