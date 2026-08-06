// =========================================================================
// ROUTE DISTANCE & TRANSIT ESTIMATION ENGINE
// Calculates distance, estimated transit time, suggested transport, and cost
// =========================================================================

const CITY_COORDINATES = {
  // South India
  'chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'mahabalipuram': { lat: 12.6269, lng: 80.1927, state: 'Tamil Nadu' },
  'ooty': { lat: 11.4102, lng: 76.6950, state: 'Tamil Nadu' },
  'kodaikanal': { lat: 10.2381, lng: 77.4892, state: 'Tamil Nadu' },
  'madurai': { lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
  'rameswaram': { lat: 9.2876, lng: 79.3129, state: 'Tamil Nadu' },
  'kanyakumari': { lat: 8.0883, lng: 77.5385, state: 'Tamil Nadu' },
  'coimbatore': { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  'pondicherry': { lat: 11.9416, lng: 79.8083, state: 'Puducherry' },
  'munnar': { lat: 10.0889, lng: 77.0595, state: 'Kerala' },
  'alleppey': { lat: 9.4981, lng: 76.3388, state: 'Kerala' },
  'kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'varkala': { lat: 8.7379, lng: 76.7163, state: 'Kerala' },
  'wayanad': { lat: 11.6854, lng: 76.1320, state: 'Kerala' },
  'thekkady': { lat: 9.6025, lng: 77.1645, state: 'Kerala' },
  'kovalam': { lat: 8.4004, lng: 76.9787, state: 'Kerala' },
  'coorg': { lat: 12.3375, lng: 75.8069, state: 'Karnataka' },
  'chikmagalur': { lat: 13.3161, lng: 75.7720, state: 'Karnataka' },
  'mysore': { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'gokarna': { lat: 14.5479, lng: 74.3188, state: 'Karnataka' },
  'hampi': { lat: 15.3350, lng: 76.4600, state: 'Karnataka' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  'araku_valley': { lat: 18.3273, lng: 82.8775, state: 'Andhra Pradesh' },

  // West India & Islands
  'goa': { lat: 15.2993, lng: 74.1240, state: 'Goa' },
  'mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'lonavala': { lat: 18.7557, lng: 73.4091, state: 'Maharashtra' },
  'mahabaleshwar': { lat: 17.9259, lng: 73.6577, state: 'Maharashtra' },
  'andaman_nicobar': { lat: 11.6234, lng: 92.7265, state: 'Andaman & Nicobar' },
  'lakshadweep': { lat: 10.5667, lng: 72.6417, state: 'Lakshadweep' },

  // North India
  'jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'udaipur': { lat: 24.5854, lng: 73.7125, state: 'Rajasthan' },
  'jodhpur': { lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
  'jaisalmer': { lat: 26.9157, lng: 70.9083, state: 'Rajasthan' },
  'delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'agra': { lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
  'varanasi': { lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
  'rishikesh': { lat: 30.0869, lng: 78.2676, state: 'Uttarakhand' },
  'manali': { lat: 32.2432, lng: 77.1892, state: 'Himachal Pradesh' },
  'shimla': { lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
  'spiti_valley': { lat: 32.2461, lng: 78.0349, state: 'Himachal Pradesh' },
  'leh_ladakh': { lat: 34.1526, lng: 77.5771, state: 'Ladakh' },
  'srinagar': { lat: 34.0837, lng: 74.7973, state: 'Jammu & Kashmir' },
  'amritsar': { lat: 31.6340, lng: 74.8723, state: 'Punjab' },

  // East & Northeast India (including Bihar)
  'bodh_gaya': { lat: 24.6951, lng: 84.9913, state: 'Bihar' },
  'bodhgaya': { lat: 24.6951, lng: 84.9913, state: 'Bihar' },
  'bihar': { lat: 25.0961, lng: 85.3131, state: 'Bihar' },
  'patna': { lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  'darjeeling': { lat: 27.0410, lng: 88.2663, state: 'West Bengal' },
  'gangtok': { lat: 27.3389, lng: 88.6065, state: 'Sikkim' },
  'shillong': { lat: 25.5788, lng: 91.8933, state: 'Meghalaya' },
  'kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },

  // International
  'dubai_uae': { lat: 25.2048, lng: 55.2708, state: 'Dubai Emirate' }
};

// Haversine formula to compute approximate distance between 2 cities in km
export const calculateRouteDistance = (sourceName, destName) => {
  if (!sourceName || !destName) return { distanceKm: 450, isLocal: false, travelTime: '1 hr 15 mins Flight', suggestedMode: 'Flight + Taxi', estimatedTransitCost: 4500 };

  const sNorm = sourceName.toLowerCase().trim();
  const dNorm = destName.toLowerCase().trim();

  // If same city or state local trip
  if (sNorm === dNorm || (sNorm.length > 3 && dNorm.includes(sNorm)) || (dNorm.length > 3 && sNorm.includes(dNorm))) {
    return {
      distanceKm: 0,
      isLocal: true,
      travelTime: '30 mins (Local Cab / Metro)',
      suggestedMode: 'City Cab / Auto / Metro',
      estimatedTransitCost: 400
    };
  }

  // Find coordinates matching string
  const findCoord = (str) => {
    for (const key of Object.keys(CITY_COORDINATES)) {
      if (str.includes(key) || key.includes(str)) {
        return CITY_COORDINATES[key];
      }
    }
    return null;
  };

  const sCoord = findCoord(sNorm) || { lat: 17.3850, lng: 78.4867 }; // default Hyderabad if unknown source
  const dCoord = findCoord(dNorm) || { lat: 13.0827, lng: 80.2707 }; // default Chennai if unknown dest

  const R = 6371; // Radius of earth in km
  const dLat = (dCoord.lat - sCoord.lat) * (Math.PI / 180);
  const dLng = (dCoord.lng - sCoord.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(sCoord.lat * (Math.PI / 180)) *
      Math.cos(dCoord.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c * 1.25); // Road / flight multiplier

  let travelTime = '1 hr 15 mins (Direct Flight)';
  let suggestedMode = 'Flight + Airport Taxi';
  let estimatedTransitCost = 4500;

  if (distanceKm < 350) {
    travelTime = `${Math.max(2, Math.round(distanceKm / 50))} hours (Private Taxi / Bus)`;
    suggestedMode = 'Private AC SUV / Express Volvo';
    estimatedTransitCost = 2500;
  } else if (distanceKm < 800) {
    travelTime = `1 hr 20 mins Flight / ${Math.round(distanceKm / 60)} hrs Express Train`;
    suggestedMode = 'Direct Flight or Vande Bharat Express';
    estimatedTransitCost = 4200;
  } else {
    travelTime = `2 hrs 30 mins Flight / ${Math.round(distanceKm / 55)} hrs Train`;
    suggestedMode = 'Connecting Flight / Superfast Train';
    estimatedTransitCost = 7500;
  }

  return {
    distanceKm,
    isLocal: false,
    travelTime,
    suggestedMode,
    estimatedTransitCost
  };
};

export const calculateTransitInfo = calculateRouteDistance;

