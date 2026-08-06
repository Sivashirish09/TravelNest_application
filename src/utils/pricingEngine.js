// =========================================================================
// TRAVELNEST CENTRALIZED PRICING ENGINE
// Realistic dynamic pricing based on destination tier, trip type, preferences
// Budget: Rs5K-15K | Standard: Rs15K-35K | Premium: Rs35K-80K | Luxury: Rs80K-2L+
// International: Rs80K-3L+
// =========================================================================

const getDestinationTierMultiplier = (destObj) => {
  if (!destObj) return 1.0;
  if (destObj.is_international) {
    const premiumIntl = ['paris', 'london', 'tokyo', 'new york', 'sydney', 'maldives', 'switzerland', 'amsterdam', 'rome', 'dubai'];
    const isPremium = premiumIntl.some(p => (destObj.name || '').toLowerCase().includes(p));
    return isPremium ? 2.8 : 2.0;
  }
  const luxuryDests = ['leh', 'ladakh', 'andaman', 'lakshadweep', 'kashmir', 'gulmarg', 'pahalgam', 'spiti', 'zanskar', 'chopta', 'valley of flowers', 'dzukou'];
  if (luxuryDests.some(l => (destObj.name || '').toLowerCase().includes(l) || (destObj.id || '').toLowerCase().includes(l))) return 1.85;

  const premiumDests = ['goa', 'jaipur', 'udaipur', 'shimla', 'manali', 'mussoorie', 'darjeeling', 'sikkim', 'gangtok', 'munnar', 'alleppey', 'rishikesh', 'nainital', 'coorg', 'kodaikanal', 'arunachal', 'meghalaya', 'kaziranga', 'hampi', 'ranthambore'];
  if (premiumDests.some(p => (destObj.name || '').toLowerCase().includes(p) || (destObj.id || '').toLowerCase().includes(p))) return 1.35;

  if ((destObj.estimated_budget_inr || 0) >= 50000) return 1.6;
  if ((destObj.estimated_budget_inr || 0) >= 25000) return 1.3;
  if ((destObj.estimated_budget_inr || 0) >= 15000) return 1.05;
  return 0.95;
};

const getTripTypeMultiplier = (tripType) => {
  const map = { 'Luxury & Spa': 1.85, 'Couple': 1.4, 'Corporate': 1.35, 'Adventure & Trek': 1.2, 'Heritage & Spiritual': 1.05, 'Family': 1.15, 'Road Trip & Biking': 1.1, 'Friends': 1.0, 'Group Tour': 0.9, 'Solo': 0.85 };
  return map[tripType] || 1.0;
};

const getHotelMultiplier = (hotelPref) => {
  if (!hotelPref) return 1.0;
  const p = hotelPref.toLowerCase();
  if (p.includes('5-star') || p.includes('luxury') || p.includes('villa')) return 1.7;
  if (p.includes('romantic') || p.includes('private')) return 1.5;
  if (p.includes('boutique') || p.includes('heritage haveli')) return 1.2;
  if (p.includes('business') || p.includes('executive')) return 1.3;
  if (p.includes('hostel') || p.includes('pilgrim')) return 0.75;
  if (p.includes('motel') || p.includes('biker')) return 0.8;
  return 1.0;
};

const getTransportCost = (destObj, transport, travelers) => {
  const tm = travelers > 2 ? Math.sqrt(travelers) * 0.9 : 1;
  if (destObj?.is_international) {
    const t = (transport || '').toLowerCase();
    return t.includes('business') ? Math.round(95000 * tm) : Math.round(55000 * tm);
  }
  if (destObj?.travel_difficulty === 'Challenging' || destObj?.travel_difficulty === 'Expert') return Math.round(18000 * tm);
  const t = (transport || '').toLowerCase();
  if (t.includes('flight') || t.includes('train')) return Math.round(4500 * tm);
  if (t.includes('cab') || t.includes('suv')) return Math.round(3500 * tm);
  if (t.includes('bike') || t.includes('biker')) return Math.round(2000 * tm);
  if (t.includes('coach') || t.includes('bus')) return Math.round(1800 * tm);
  return Math.round(3000 * tm);
};

/**
 * Calculate complete trip budget
 * @param {Object} destObj - Destination from SEED_DESTINATIONS
 * @param {number} days - Travel days
 * @param {number} travelers - Number of travelers
 * @param {string} hotelPref - Hotel preference string
 * @param {string} transport - Transport mode
 * @param {string} tripType - Trip persona
 * @returns {{ accommodation, food, transport, activities, total, perDay, currency }}
 */
export const calculateTripBudget = (destObj, days = 3, travelers = 2, hotelPref = '', transport = '', tripType = 'Couple') => {
  const safeDays = Math.max(1, Number(days) || 3);
  const safeTravelers = Math.max(1, Number(travelers) || 2);
  const destM = getDestinationTierMultiplier(destObj);
  const typeM = getTripTypeMultiplier(tripType);
  const hotelM = getHotelMultiplier(hotelPref);

  const basePerDay = destObj?.estimated_budget_inr
    ? Math.max(2500, Math.round(destObj.estimated_budget_inr / Math.max(destObj.recommended_days || 3, 1)))
    : 3500;

  const accomPerNight = Math.round(basePerDay * 0.45 * hotelM * destM * typeM);
  const roomFactor = safeTravelers <= 2 ? 1 : safeTravelers <= 4 ? 1.5 : 2;
  const accommodation = accomPerNight * safeDays * roomFactor;

  const foodPerDay = Math.round(basePerDay * 0.25 * destM);
  const foodFactor = safeTravelers <= 2 ? safeTravelers : safeTravelers * 0.85;
  const food = Math.round(foodPerDay * safeDays * foodFactor);

  const transportCost = getTransportCost(destObj, transport, safeTravelers);

  const baseActivity = destObj?.activity_cost || 1200;
  const actFactor = safeTravelers <= 1 ? 1 : safeTravelers * 0.8;
  const activities = Math.round(baseActivity * safeDays * actFactor * destM);

  const total = accommodation + food + transportCost + activities;

  return {
    accommodation: Math.round(accommodation),
    food: Math.round(food),
    transport: Math.round(transportCost),
    activities: Math.round(activities),
    total: Math.round(total),
    perDay: Math.round(total / safeDays),
    currency: 'INR'
  };
};

export const formatINR = (amount) => `\u20B9${Math.round(amount || 0).toLocaleString('en-IN')}`;

export const CURRENCIES = {
  INR: { symbol: '\u20B9', rate: 1, label: 'INR (\u20B9)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '\u20AC', rate: 0.011, label: 'EUR (\u20AC)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'AED (\u062F.\u0625)' },
  GBP: { symbol: '\u00A3', rate: 0.0095, label: 'GBP (\u00A3)' },
  SGD: { symbol: 'S$', rate: 0.016, label: 'SGD (S$)' }
};

export const formatPrice = (inrVal, currency = 'INR') => {
  const cur = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = (inrVal || 0) * cur.rate;
  if (currency === 'INR') return `\u20B9${Math.round(converted).toLocaleString('en-IN')}`;
  return `${cur.symbol}${Math.round(converted).toLocaleString()}`;
};

