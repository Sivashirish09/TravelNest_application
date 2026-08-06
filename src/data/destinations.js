// =========================================================================
// TRAVELNEST COMPREHENSIVE DESTINATIONS DATABASE ENGINE
// Integrates Expanded Domestic (India States & UTs) & International Hubs
// =========================================================================

import { INDIA_DESTINATIONS } from './indiaDestinations';
import { INTERNATIONAL_DESTINATIONS } from './internationalDestinations';

export const SEED_DESTINATIONS = [
  ...INDIA_DESTINATIONS,
  ...INTERNATIONAL_DESTINATIONS
];

// Helper: Normalize destination string and resolve to canonical object in database
export const findCanonicalDestination = (query) => {
  if (!query || typeof query !== 'string') return null;

  const q = query.toLowerCase().trim();

  // 1. Direct match by ID
  let match = SEED_DESTINATIONS.find(d => d.id === q);
  if (match) return match;

  // 2. Direct match by Name
  match = SEED_DESTINATIONS.find(d => d.name.toLowerCase().trim() === q);
  if (match) return match;

  // 3. Match by Aliases
  match = SEED_DESTINATIONS.find(d => d.aliases && d.aliases.some(alias => alias.toLowerCase().trim() === q));
  if (match) return match;

  // 4. Substring match by Name, State, Country, or Aliases
  match = SEED_DESTINATIONS.find(d => 
    d.name.toLowerCase().includes(q) || 
    d.state.toLowerCase().includes(q) ||
    d.country.toLowerCase().includes(q) ||
    q.includes(d.name.toLowerCase()) ||
    (d.aliases && d.aliases.some(alias => alias.toLowerCase().includes(q) || q.includes(alias.toLowerCase())))
  );

  return match || null;
};

// Helper: Get destinations filtered by region (India / International)
export const getDestinationsByRegion = (region) => {
  if (region === 'India') {
    return SEED_DESTINATIONS.filter(d => !d.is_international);
  }
  if (region === 'International') {
    return SEED_DESTINATIONS.filter(d => d.is_international);
  }
  return SEED_DESTINATIONS;
};

// Helper: Get destinations filtered by category
export const getDestinationsByCategory = (category) => {
  if (!category || category === 'All') return SEED_DESTINATIONS;
  return SEED_DESTINATIONS.filter(d => d.category.toLowerCase() === category.toLowerCase());
};

// Transit calculation exports
export { calculateRouteDistance, calculateTransitInfo } from '../utils/transitEngine';

