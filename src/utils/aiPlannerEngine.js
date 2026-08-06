// =========================================================================
// TRAVELNEST ADVANCED AI SMART TRIP PLANNER & ITINERARY SYNTHESIS ENGINE
// Universal Destination Intelligence, Multi-Day AI Schedule, Weather,
// Crowd Prediction, Local Foods, Hidden Gems, Hotels, Transport, & Firestore
// =========================================================================

import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { SEED_DESTINATIONS, findCanonicalDestination } from '../data/destinations';
import { calculateTransitInfo } from './transitEngine';

/**
 * Universal Destination Resolver
 * Resolves canonical or automatically synthesizes a rich destination object
 * for ANY location (e.g. Ongole, Chirala, Vijayawada, Paris, My Village, etc.)
 */
export const resolveOrCreateDestination = (destInput) => {
  if (!destInput || typeof destInput !== 'string') {
    destInput = 'Araku Valley';
  }

  const trimmed = destInput.trim();
  const canonical = findCanonicalDestination(trimmed);
  if (canonical) return canonical;

  // Format capitalized name
  const name = trimmed.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const lower = name.toLowerCase();

  // Detect Region / Category heuristics
  let state = 'Andhra Pradesh';
  let country = 'India';
  let is_international = false;
  let category = 'Nature & Cultural';

  // International Check
  const intlKeywords = ['paris', 'london', 'tokyo', 'dubai', 'singapore', 'bali', 'bangkok', 'rome', 'switzerland', 'maldives', 'new york', 'sydney', 'phuket', 'zurich', 'amsterdam', 'nepal', 'bhutan', 'sri lanka'];
  if (intlKeywords.some(k => lower.includes(k))) {
    is_international = true;
    country = 'International';
    state = 'Global Hub';
    category = 'International Gateway';
  } else if (['ongole', 'chirala', 'vijayawada', 'guntur', 'tenali', 'rajahmundry', 'kakinada', 'tirupati', 'visakhapatnam', 'nellore', 'kadapa', 'kurnool', 'bhimavaram', 'machilipatnam', 'eluru', 'ananthapur', 'chittoor', 'araku'].some(k => lower.includes(k))) {
    state = 'Andhra Pradesh';
    category = ['chirala', 'machilipatnam', 'visakhapatnam', 'nellore'].some(k => lower.includes(k)) ? 'Coastal & Beach' : (lower.includes('araku') ? 'Hill Station' : 'Heritage & City');
  } else if (['hyderabad', 'warangal', 'karimnagar', 'nizamabad', 'khammam', 'secunderabad'].some(k => lower.includes(k))) {
    state = 'Telangana';
    category = 'Heritage & City';
  } else if (['chennai', 'madurai', 'ooty', 'kodaikanal', 'rameswaram', 'coimbatore', 'kanchipuram', 'thanjavur'].some(k => lower.includes(k))) {
    state = 'Tamil Nadu';
    category = ['ooty', 'kodaikanal'].some(k => lower.includes(k)) ? 'Hill Station' : 'Cultural & Heritage';
  } else if (['bengaluru', 'mysore', 'coorg', 'hampi', 'gokarna', 'chikmagalur', 'mangalore', 'udupi'].some(k => lower.includes(k))) {
    state = 'Karnataka';
    category = ['coorg', 'chikmagalur'].some(k => lower.includes(k)) ? 'Hill Station' : ['gokarna', 'mangalore', 'udupi'].some(k => lower.includes(k)) ? 'Coastal & Beach' : 'Heritage & Nature';
  } else if (['munnar', 'alleppey', 'kochi', 'wayanad', 'varkala', 'kovalam', 'thekkady', 'kumarakom'].some(k => lower.includes(k))) {
    state = 'Kerala';
    category = ['munnar', 'wayanad'].some(k => lower.includes(k)) ? 'Hill Station' : 'Backwaters & Coastal';
  } else if (['goa', 'panaji', 'calangute', 'baga', 'anjuna', 'palolem'].some(k => lower.includes(k))) {
    state = 'Goa';
    category = 'Beach & Nightlife';
  } else if (['mumbai', 'pune', 'lonavala', 'mahabaleshwar', 'nashik', 'alibaug', 'shirdi'].some(k => lower.includes(k))) {
    state = 'Maharashtra';
    category = 'Scenic & City';
  } else if (['jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'pushkar', 'mount abu'].some(k => lower.includes(k))) {
    state = 'Rajasthan';
    category = 'Royal Heritage & Desert';
  } else if (['delhi', 'agra', 'varanasi', 'mathura', 'vrindavan', 'lucknow', 'ayodhya'].some(k => lower.includes(k))) {
    state = 'North India';
    category = 'Spiritual & Heritage';
  } else if (['manali', 'shimla', 'dharamshala', 'kasol', 'spiti', 'jibhi', 'bir billing'].some(k => lower.includes(k))) {
    state = 'Himachal Pradesh';
    category = 'Snow & Mountain Adventure';
  } else if (['rishikesh', 'haridwar', 'mussoorie', 'nainital', 'kedarnath', 'badrinath', 'auli'].some(k => lower.includes(k))) {
    state = 'Uttarakhand';
    category = 'Spiritual & Himalayan Trek';
  } else if (['leh', 'ladakh', 'nubra', 'pangong', 'srinagar', 'gulmarg', 'pahalgam', 'sonamarg'].some(k => lower.includes(k))) {
    state = 'Jammu, Kashmir & Ladakh';
    category = 'Himalayan Paradise';
  } else {
    state = 'India Regional';
    category = 'Scenic Destination';
  }

  // Curated Images matching category
  const images = {
    'Coastal & Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'Hill Station': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'Heritage & City': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    'Backwaters & Coastal': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    'Beach & Nightlife': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    'Royal Heritage & Desert': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    'Snow & Mountain Adventure': 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1200&q=80',
    'International Gateway': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'default': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
  };

  const image = images[category] || images.default;

  return {
    id,
    name,
    state,
    country,
    is_international,
    category,
    image,
    rating: 4.8,
    reviews_count: 1250,
    estimated_budget_inr: is_international ? 85000 : 15000,
    recommended_days: 3,
    travel_difficulty: 'Easy',
    safety_score: 9.8,
    weather_type: 'Pleasant & Moderate',
    weather_info: 'Mild breeze and clear skies (22°C - 30°C)',
    best_season: 'October to March (Ideal Weather)',
    description: `${name} is a captivating destination in ${state}, celebrated for picturesque landscapes, vibrant culture, authentic regional delicacies, and warm local hospitality.`,
    highlights: [
      `${name} Central Promenade & Heritage Quarter`,
      `Scenic Landmark & Nature Viewpoint of ${name}`,
      `Historic Spiritual Temple & Cultural Sanctuary`,
      `Vibrant Local Artisan Market & Food Street`
    ],
    popular_activities: [
      `Guided walking tour of ${name} historic landmarks`,
      `Sampling authentic local specialties at famous eateries`,
      `Panoramic sunset photography and nature walk`,
      `Artisanal handicraft and regional souvenir shopping`
    ],
    is_synthesized: true
  };
};

/**
 * Generate 3 Budget, 3 Premium, and 3 Luxury Hotels/Resorts specifically tailored to destination
 */
export const generateDestinationHotels = (destName, state = '') => {
  const clean = (destName || 'Destination').replace(/[^a-zA-Z0-9\s]/g, '').trim();

  return {
    budgetHotels: [
      {
        id: `h_b1_${clean}`,
        name: `Treebo Trend Grand Inn ${clean}`,
        tier: 'Budget',
        rating: 4.4,
        reviews: 320,
        pricePerNight: 1650,
        amenities: ['Free High-Speed Wi-Fi', 'Complimentary Breakfast', 'AC Deluxe Room', '24/7 Front Desk'],
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
        badge: 'Top Value Choice'
      },
      {
        id: `h_b2_${clean}`,
        name: `Hotel ${clean} Residency & Suites`,
        tier: 'Budget',
        rating: 4.3,
        reviews: 210,
        pricePerNight: 1950,
        amenities: ['Central City Location', 'Room Service', 'King Bed', 'Power Backup'],
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
        badge: 'Family Friendly'
      },
      {
        id: `h_b3_${clean}`,
        name: `Zostel / Backpackers Haven ${clean}`,
        tier: 'Budget',
        rating: 4.6,
        reviews: 480,
        pricePerNight: 1200,
        amenities: ['Community Lounge', 'Cafe & Workstation', 'High-Speed Wi-Fi', 'Guided Tours'],
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
        badge: 'Solo & Youth Favorite'
      }
    ],
    premiumHotels: [
      {
        id: `h_p1_${clean}`,
        name: `Radisson Blu Hotel & Convention ${clean}`,
        tier: 'Premium',
        rating: 4.8,
        reviews: 840,
        pricePerNight: 5500,
        amenities: ['Infinity Swimming Pool', 'Multi-Cuisine Restaurant', 'Fitness Center', 'Executive Club Lounge'],
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
        badge: 'Best Luxury Stay'
      },
      {
        id: `h_p2_${clean}`,
        name: `The Fern Royal Orchid ${clean}`,
        tier: 'Premium',
        rating: 4.7,
        reviews: 610,
        pricePerNight: 4800,
        amenities: ['Eco-Certified Luxury', 'Rooftop Bar & Grill', 'Spa & Jacuzzi', 'Airport Shuttle'],
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        badge: 'Couples Top Pick'
      },
      {
        id: `h_p3_${clean}`,
        name: `Lemon Tree Premier ${clean}`,
        tier: 'Premium',
        rating: 4.65,
        reviews: 530,
        pricePerNight: 4200,
        amenities: ['Citrus Cafe Buffet', 'Swimming Pool', 'Plush Ergonomic Rooms', 'Valet Parking'],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
        badge: 'Business & Leisure'
      }
    ],
    resorts: [
      {
        id: `h_r1_${clean}`,
        name: `Taj Symphony Eco-Resort & Spa ${clean}`,
        tier: 'Resort',
        rating: 4.95,
        reviews: 1120,
        pricePerNight: 12500,
        amenities: ['Private Plunge Pool Villas', 'Signature Ayurvedic Spa', 'Ocean/Scenic Valley View', 'Fine Dining Pavilions'],
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80',
        badge: 'Ultra Luxury 5-Star'
      },
      {
        id: `h_r2_${clean}`,
        name: `Club Mahindra Wilderness & Lagoon ${clean}`,
        tier: 'Resort',
        rating: 4.85,
        reviews: 790,
        pricePerNight: 9500,
        amenities: ['Private Lake / Forest Access', 'Outdoor Campfire & Stargazing', 'Adventure Sports', 'Kids Club'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        badge: 'Family Vacation Paradise'
      },
      {
        id: `h_r3_${clean}`,
        name: `The Serene Heritage Palace & Estate ${clean}`,
        tier: 'Resort',
        rating: 4.9,
        reviews: 670,
        pricePerNight: 11000,
        amenities: ['Royal Courtyard Dining', 'Private Balconies', 'Infinity Lagoon Pool', 'Curated Village Walk'],
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
        badge: 'Heritage & Romance'
      }
    ]
  };
};

/**
 * Regional Food Recommendations Database (3-5 famous foods with pricing & diet tags)
 */
export const getLocalFoodRecommendations = (destName, state = '') => {
  const d = (destName || '').toLowerCase();

  // Hyderabad
  if (d.includes('hyderabad')) {
    return [
      { name: 'Hyderabadi Mutton Dum Biryani', category: 'Signature Main', diet: 'Non-Vegetarian', averagePrice: '₹280 – ₹420', desc: 'Slow-cooked aromatic basmati rice infused with saffron, tender marinated goat meat, and royal spices.', bestSpot: 'Paradise / Bawarchi / Cafe Bahar', icon: '🍚' },
      { name: 'Irani Chai with Osmania Biscuits', category: 'Iconic Beverage', diet: 'Vegetarian', averagePrice: '₹30 – ₹60', desc: 'Creamy, slow-brewed cardamom tea paired with signature melt-in-mouth salty-sweet biscuits.', bestSpot: 'Nimrah Cafe & Bakery (Charminar)', icon: '☕' },
      { name: 'Haleem with Fried Onions & Cashews', category: 'Royal Delicacy', diet: 'Non-Vegetarian', averagePrice: '₹220 – ₹350', desc: 'Rich porridge of pounded wheat, lentils, ghee, and tender meat garnished with cashews and mint.', bestSpot: 'Pista House / Shah Ghouse', icon: '🍲' },
      { name: 'Mirchi Ka Salan & Double Ka Meetha', category: 'Dessert & Side', diet: 'Vegetarian', averagePrice: '₹120 – ₹180', desc: 'Tangy peanut-sesame-chili gravy followed by golden saffron bread pudding soaked in rabri.', bestSpot: 'Shadab / Grand Hotel', icon: '🍮' }
    ];
  }

  // Araku Valley
  if (d.includes('araku')) {
    return [
      { name: 'Araku Bamboo Chicken (Bongu Chicken)', category: 'Tribal Specialty', diet: 'Non-Vegetarian', averagePrice: '₹250 – ₹380', desc: 'Tender chicken marinated in wild forest herbs and cooked inside a bamboo stalk over hot coals with zero oil.', bestSpot: 'Tribal Stalls along Padmapuram Road & Chaparai', icon: '🎋' },
      { name: 'Organic Araku Filter Coffee', category: 'Award-Winning Brew', diet: 'Vegetarian', averagePrice: '₹40 – ₹80', desc: 'Single-origin shade-grown Arabica organic coffee brewed fresh with creamy farm milk.', bestSpot: 'Araku Coffee Museum & Tribe Cafe', icon: '☕' },
      { name: 'Madugula Halwa & Teepi Gavvalu', category: 'Traditional Sweet', diet: 'Vegetarian', averagePrice: '₹140 – ₹220', desc: 'Pure wheat milk halwa cooked with pure country ghee and crunchy cashew nuts.', bestSpot: 'Local Araku Market Halwa Shops', icon: '🍮' },
      { name: 'Rayalaseema Ragi Sangati with Natukodi Pulusu', category: 'Traditional Feast', diet: 'Non-Vegetarian', averagePrice: '₹200 – ₹320', desc: 'Nutritious finger-millet balls served with fiery spicy country chicken broth and pure ghee.', bestSpot: 'Haritha Valley View Restaurant', icon: '🍲' }
    ];
  }

  // Ongole
  if (d.includes('ongole')) {
    return [
      { name: 'Ongole Spicy Royyala Iguru (Prawns Fry)', category: 'Coastal Specialty', diet: 'Non-Vegetarian', averagePrice: '₹260 – ₹390', desc: 'Fresh local coastal prawns sautéed in caramelized shallots, fiery green chilies, and curry leaves.', bestSpot: 'Mourya Coastal Diner & Kothapatnam Beach Stalls', icon: '🍤' },
      { name: 'Gongura Natukodi Chicken Curry', category: 'Regional Main', diet: 'Non-Vegetarian', averagePrice: '₹220 – ₹340', desc: 'Country chicken simmered in tangy, iron-rich sorrel leaves paste and stone-ground spices.', bestSpot: 'Sri Kanya / Ruchi Grand', icon: '🍗' },
      { name: 'Ulava Charu with Butter & Hot Rice', category: 'Traditional Comfort', diet: 'Vegetarian', averagePrice: '₹120 – ₹180', desc: 'Velvety horse gram slow-reduction broth served piping hot with fresh dollops of farm butter.', bestSpot: 'Traditional Andhra Bhojanam Centers', icon: '🍲' },
      { name: 'Ongole Ghee Sweets & Mysore Pak', category: 'Sweet Indulgence', diet: 'Vegetarian', averagePrice: '₹150 – ₹240', desc: 'Pure buffalo milk ghee mysore pak and sweet khoya sweets famous across Prakasham district.', bestSpot: 'Venkateswara Swamy Sweets Ongole', icon: '🍬' }
    ];
  }

  // Chirala
  if (d.includes('chirala')) {
    return [
      { name: 'Chirala Fresh Chepala Vepudu (Fish Fry)', category: 'Coastal Seafood', diet: 'Non-Vegetarian', averagePrice: '₹200 – ₹320', desc: 'Fresh catch from Vodarevu beach marinated in red chili, turmeric, and garlic, shallow-fried to crispy perfection.', bestSpot: 'Vodarevu Beach Seafood Huts & Highway Shacks', icon: '🐟' },
      { name: 'Crab Roast Masala (Peethala Vepudu)', category: 'Shellfish Delicacy', diet: 'Non-Vegetarian', averagePrice: '₹280 – ₹450', desc: 'Spicy black pepper and coriander coated ocean crabs with thick onion-tomato masala.', bestSpot: 'Sagar Coastal Mess Chirala', icon: '🦀' },
      { name: 'Prawns Biryani (Royyala Pulao)', category: 'Aromatic Rice', diet: 'Non-Vegetarian', averagePrice: '₹240 – ₹360', desc: 'Juicy local prawns layered with fragrant seeraga samba rice and roasted cashews.', bestSpot: 'Hotel Annapurna & Coastal Highway Diners', icon: '🍚' },
      { name: 'Natukodi Pulusu with Garelu (Vada)', category: 'Breakfast / Dinner', diet: 'Non-Vegetarian', averagePrice: '₹180 – ₹260', desc: 'Crispy lentil vadas dipped in fiery, pepper-infused country chicken gravy.', bestSpot: 'Chirala Bypass Food Court', icon: '🥘' }
    ];
  }

  // Vijayawada
  if (d.includes('vijayawada')) {
    return [
      { name: 'Crispy Punugulu with Coconut-Ginger Chutney', category: 'Legendary Street Snack', diet: 'Vegetarian', averagePrice: '₹40 – ₹80', desc: 'Golden deep-fried batter dumplings served hot with spicy peanut and ginger chutneys.', bestSpot: 'Besant Road & Benz Circle Food Stalls', icon: '🥟' },
      { name: 'Godavari Chepala Pulusu', category: 'River Fish Curry', diet: 'Non-Vegetarian', averagePrice: '₹220 – ₹340', desc: 'Fresh river fish cooked in a tangy raw mango and tamarind gravy with green chilies.', bestSpot: 'Crossroads Restaurant / Sweet Magic', icon: '🐟' },
      { name: 'Guntur Gongura Mutton with Ghee Rice', category: 'Spicy Main', diet: 'Non-Vegetarian', averagePrice: '₹320 – ₹480', desc: 'Tender mutton pieces infused with crushed Gongura leaves and fiery red chili powder.', bestSpot: 'Garuda / Minerva Grand Vijayawada', icon: '🍖' },
      { name: 'Bandar Laddu & Ghee Jalebi', category: 'Traditional Dessert', diet: 'Vegetarian', averagePrice: '₹120 – ₹190', desc: 'Glistening pure ghee sweets crafted with stone-ground besan and aromatic cardamom.', bestSpot: 'Kalanikethan & Sweet Magic Outlets', icon: '🍮' }
    ];
  }

  // Tirupati
  if (d.includes('tirupati')) {
    return [
      { name: 'Authentic Ghee Podi Dosa & Vada', category: 'Sacred Breakfast', diet: 'Vegetarian', averagePrice: '₹60 – ₹110', desc: 'Crispy golden dosas smothered in stone-ground spicy gunpowder and pure aromatic ghee.', bestSpot: 'Hotel Bliss / Woodys / Maurya', icon: '🥞' },
      { name: 'Tirupati Temple Sweet Pongal (Chakkara Pongali)', category: 'Temple Delicacy', diet: 'Vegetarian', averagePrice: '₹80 – ₹140', desc: 'Rich rice and moong dal preparation cooked in jaggery syrup, cardamom, cashews, and ghee.', bestSpot: 'Heritage Food Courts around Alipiri', icon: '🍯' },
      { name: 'Rayalaseema Spicy Ragi Mudda with Veg Pulusu', category: 'Healthy Heritage', diet: 'Vegetarian', averagePrice: '₹120 – ₹180', desc: 'Steaming finger-millet balls served with spicy tamarind drumstick pulusu.', bestSpot: 'Sri Venkateswara Canteen', icon: '🍲' },
      { name: 'Piping Hot Filter Coffee in Brass Davarah', category: 'Iconic Beverage', diet: 'Vegetarian', averagePrice: '₹30 – ₹50', desc: 'Frothy freshly brewed chicory coffee served in traditional South Indian brass cups.', bestSpot: 'Kumbakonam Degree Coffee Outlets', icon: '☕' }
    ];
  }

  // Goa
  if (d.includes('goa')) {
    return [
      { name: 'Goan Kingfish Curry with Red Rice', category: 'Coastal Classic', diet: 'Non-Vegetarian', averagePrice: '₹320 – ₹460', desc: 'Fresh Surmai fish simmered in a coconut-kokum tamarind curry with hints of red spices.', bestSpot: 'Fisherman\'s Wharf / Martin\'s Corner', icon: '🐟' },
      { name: 'Prawn Balchão & Garlic Butter Squid', category: 'Portuguese-Goan', diet: 'Non-Vegetarian', averagePrice: '₹350 – ₹520', desc: 'Fiery and tangy palm vinegar and fiery chili infused delicacy with fresh garlic butter seafood.', bestSpot: 'Mum\'s Kitchen Panaji', icon: '🍤' },
      { name: 'Traditional Bebinca Layered Cake', category: 'Iconic Dessert', diet: 'Vegetarian', averagePrice: '₹140 – ₹220', desc: '16-layer baked delicacy made with coconut milk, egg yolk, and nutmeg.', bestSpot: 'Infantaria Bakery Baga', icon: '🍰' },
      { name: 'Fresh Kokum Soda & Sol Kadi Cooler', category: 'Tropical Beverage', diet: 'Vegetarian', averagePrice: '₹60 – ₹100', desc: 'Digestive tangy kokum cooler with coconut milk, fresh mint and roasted cumin.', bestSpot: 'Beach Shack Chillout Bars', icon: '🍹' }
    ];
  }

  // Default regional food generator for any custom destination
  return [
    { name: `Authentic ${destName} Royal Special Thali`, category: 'Heritage Meal', diet: 'Vegetarian', averagePrice: '₹160 – ₹280', desc: `Wholesome platter featuring slow-cooked lentils, seasonal vegetables, local curries, flatbreads, and aromatic rice.`, bestSpot: `Top-rated heritage diners and thali houses in ${destName}`, icon: '🍱' },
    { name: `Signature ${destName} Spiced Grill / Curry`, category: 'Chef Specialty', diet: 'Non-Vegetarian', averagePrice: '₹240 – ₹380', desc: `Locally sourced fresh proteins cooked with stone-ground heirloom spice blends and caramelized onions.`, bestSpot: `Popular traditional restaurants in ${destName}`, icon: '🍲' },
    { name: `Fresh Morning Breakfast & Artisan Chai`, category: 'Morning Energy', diet: 'Vegetarian', averagePrice: '₹50 – ₹90', desc: `Steaming hot local breakfast items paired with freshly brewed regional tea/coffee.`, bestSpot: `Central market cafes and breakfast hubs`, icon: '☕' },
    { name: `Artisanal Sweets & Regional Bakery Snacks`, category: 'Local Sweets', diet: 'Vegetarian', averagePrice: '₹110 – ₹190', desc: `Pure ghee traditional confections and crunchy afternoon savories crafted by master confectioners.`, bestSpot: `Historic sweet shops in ${destName} bazaar`, icon: '🍬' }
  ];
};

/**
 * AI Safety Tips & Emergency Intelligence
 */
export const getAISafetyTips = (destName, state = '') => {
  const clean = (destName || 'Destination').replace(/[^a-zA-Z0-9\s]/g, '').trim();

  return {
    safetyScore: 9.8,
    safetyLevel: 'Verified Safe & Tourist Friendly',
    emergencyNumbers: [
      { service: 'National Emergency', number: '112', icon: '🚨' },
      { service: 'Police Assistance', number: '100 / 112', icon: '👮' },
      { service: 'Medical Ambulance', number: '108 / 102', icon: '🚑' },
      { service: 'Women Safety Helpline', number: '1091 / 181', icon: '🛡️' },
      { service: 'Tourist Helpline (24x7)', number: '1363', icon: '🧭' }
    ],
    safeTravelTips: [
      'Keep certified digital copies of photo IDs and hotel booking QR vouchers readily accessible on your phone.',
      'Use verified prepaid taxis, registered app cabs (Ola/Uber), or hotel concierge transit for airport/railway transfers.',
      'Carry adequate bottled drinking water, sun protection (SPF 50), and maintain basic hydration during walking tours.',
      'Avoid unlit secluded trails after 10:30 PM and prefer well-patrolled tourist promenade zones.'
    ],
    womenSafetyTips: [
      '24/7 dedicated Pink Police patrols and tourist help desks are active across major transit hubs.',
      'Always share live trip/cab location with emergency contacts using the TravelNest SOS feature.',
      'Opt for verified 3-Star+ hotels & heritage resorts with 24-hour reception and CCTV security.'
    ],
    nearestHospital: `${clean} Multi-Specialty General Hospital & Trauma Care (~2.4 km)`,
    nearestPoliceStation: `${clean} Central Tourist Police Station & Outpost (~1.5 km)`
  };
};

/**
 * Hidden Gems & Offbeat Attractions Generator
 */
export const getHiddenGems = (destName, state = '') => {
  return [
    {
      name: `Secret Sunrise Point & Pine Trail at ${destName}`,
      distance: '3.5 km from center',
      desc: 'An untouched panoramic vantage point overlooking valleys/coastline, ideal for peaceful morning meditation and sunrise photography away from regular tourist crowds.',
      tip: 'Visit at 5:45 AM for golden hour mist views.',
      icon: '🌄'
    },
    {
      name: `Heritage Artisan Hamlet & Pottery Enclave`,
      distance: '6.2 km from center',
      desc: 'Centuries-old community of master weavers, stone carvers, and brass artisans where you can witness live heritage craft making.',
      tip: 'Buy authentic souvenirs directly from master artisans.',
      icon: '🎨'
    },
    {
      name: `Hidden Freshwater Spring / Forest Canopy Walk`,
      distance: '8.8 km from center',
      desc: 'A tranquil secluded natural spring surrounded by ancient trees and melodious bird species, perfect for a rejuvenating afternoon picnic.',
      tip: 'Carry eco-friendly water bottles; zero plastic zone.',
      icon: '🌿'
    },
    {
      name: `Twilight Heritage Walk & Ancient Stepwell Ruins`,
      distance: '2.1 km from center',
      desc: 'Intricately carved medieval stone architectural marvel that illuminates with ambient lighting at dusk.',
      tip: 'Best visited with a local history guide between 5:30 PM - 7:00 PM.',
      icon: '🏛️'
    }
  ];
};

/**
 * Nearby Attractions by Radius (< 5km, 5-10km, 10-20km)
 */
export const getNearbyAttractionsByRadius = (destName) => {
  return {
    within5km: [
      { name: `${destName} Central Clock Tower & Heritage Market`, category: 'Culture & Shopping', time: '10 mins transit', entry: 'Free Entry' },
      { name: `Historic Spiritual Temple & Sacred Garden`, category: 'Spiritual Heritage', time: '12 mins transit', entry: 'Free / ₹50 Special' },
      { name: `Panoramic City Viewpoint & Promenade`, category: 'Nature & Scenic', time: '15 mins transit', entry: 'Free Entry' }
    ],
    within10km: [
      { name: `Ancient Hilltop Fort & Defense Ramparts`, category: 'Historic Monument', time: '20 mins transit', entry: '₹100 / Person' },
      { name: `Scenic Lake Boating & Bird Watching Sanctuary`, category: 'Eco Tourism', time: '22 mins transit', entry: '₹150 Boat Ride' },
      { name: `Organic Spice Farm & Herbal Garden`, category: 'Agro Tourism', time: '25 mins transit', entry: '₹200 Guided Tour' }
    ],
    within20km: [
      { name: `Pristine Secluded Waterfall / River Rapids`, category: 'Adventure & Trek', time: '35 mins transit', entry: '₹50 Forest Pass' },
      { name: `Traditional Coastal Mangrove / Forest Safari Camp`, category: 'Wildlife & Safari', time: '40 mins transit', entry: '₹450 Safari' },
      { name: `Historic Buddhist / Archaeological Excavation Caves`, category: 'Ancient Heritage', time: '45 mins transit', entry: '₹100 ASI Ticket' }
    ]
  };
};

/**
 * Multi-Day Dynamic Weather & Crowd Generator
 */
export const generateMultiDayWeather = (destObj, startDateStr, days = 3) => {
  const baseDate = startDateStr ? new Date(startDateStr) : new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weatherIcons = {
    'Sunny & Clear': '☀️',
    'Mild Clouds & Breezy': '⛅',
    'Pleasant Mountain Air': '🌤️',
    'Tropical Warm Sun': '🌞',
    'Light Evening Drizzle': '🌦️',
    'Gentle Coastal Wind': '🌬️'
  };

  const conditionList = ['Sunny & Clear', 'Mild Clouds & Breezy', 'Pleasant Mountain Air', 'Tropical Warm Sun', 'Gentle Coastal Wind'];

  const forecast = [];
  for (let i = 0; i < days; i++) {
    const cur = new Date(baseDate);
    cur.setDate(baseDate.getDate() + i);

    const condition = conditionList[i % conditionList.length];
    const highTemp = 28 + (i % 4);
    const lowTemp = 20 + (i % 3);
    const rainChance = Math.min(30, 5 + (i * 4));
    const humidity = 50 + (i * 3);

    forecast.push({
      dayNumber: i + 1,
      dateFormatted: `${dayNames[cur.getDay()]}, ${monthNames[cur.getMonth()]} ${cur.getDate()}`,
      condition,
      icon: weatherIcons[condition] || '☀️',
      highTemp: `${highTemp}°C`,
      lowTemp: `${lowTemp}°C`,
      rainChance: `${rainChance}%`,
      humidity: `${humidity}%`,
      uvIndex: 'Moderate (UV 4-5)',
      clothing: 'Light cottons, sunglasses, and comfortable walking shoes'
    });
  }

  const crowdLevel = days >= 5 ? 'Medium' : 'Low';

  return {
    forecast,
    temperature: '24°C – 31°C',
    rainChance: '12%',
    bestTimeToVisit: destObj?.best_season || 'October to March (Pleasant & Clear Skies)',
    sunrise: '05:48 AM',
    sunset: '06:22 PM',
    weatherRecommendation: 'Pleasant and moderate sunny weather with light refreshing breezes. Perfect conditions for outdoor photography, sightseeing, and nature exploration.',
    climateSummary: {
      bestMonth: 'October to March (Pleasant temperatures & low humidity)',
      worstMonth: 'May to June (Peak summer heat)',
      averageTemp: '24°C - 31°C',
      rainChanceOverall: '12% Average Precipitation',
      humidityOverall: '52% Moderate Humidity'
    },
    crowdPrediction: {
      level: crowdLevel,
      badgeColor: crowdLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Moderate tourist footfall with minimal wait times at prominent landmarks.',
      bestVisitingHours: '07:00 AM – 10:30 AM & 04:30 PM – 07:00 PM',
      peakHours: '11:30 AM – 03:30 PM (Ideal for indoor dining, museum visits, or relaxation)'
    }
  };
};

/**
 * Transport Options Comparison Matrix
 */
export const calculateTransportMatrix = (source, destName, distanceKm, currency = 'INR') => {
  const dist = Math.max(50, Number(distanceKm) || 350);

  return [
    {
      id: 'mode_bus',
      name: 'Volvo Multi-Axle AC Sleeper Bus',
      icon: '🚌',
      estimatedTime: dist < 300 ? `${Math.round(dist / 50)} hrs` : `${Math.round(dist / 45)} hrs (Overnight)`,
      estimatedCostINR: Math.round(dist * 2.8 + 400),
      highlights: 'Reclining berths, charging points, blanket & water bottle, overnight convenience',
      frequency: 'Every 45 mins from central bus terminal'
    },
    {
      id: 'mode_train',
      name: 'Vande Bharat / Express Superfast Train',
      icon: '🚆',
      estimatedTime: `${Math.max(2, Math.round(dist / 65))} hrs`,
      estimatedCostINR: Math.round(dist * 2.2 + 350),
      highlights: 'Scenic countryside views, onboard pantry meals, ultra-smooth ride, zero traffic',
      frequency: 'Multiple daily direct connections'
    },
    {
      id: 'mode_flight',
      name: 'Commercial Airline (Direct / 1-Stop)',
      icon: '✈️',
      estimatedTime: dist < 500 ? '1 hr 15 mins Flight' : '2 hrs 20 mins Flight',
      estimatedCostINR: dist < 400 ? 3800 : Math.round(dist * 6.5 + 2500),
      highlights: 'Fastest transit, airport lounge access, 15 kg check-in baggage included',
      frequency: 'Daily departures'
    },
    {
      id: 'mode_cab',
      name: 'Private AC Cab / Chauffeur Sedan',
      icon: '🚖',
      estimatedTime: `${Math.max(2, Math.round(dist / 55))} hrs`,
      estimatedCostINR: Math.round(dist * 12 + 800),
      highlights: 'Doorstep pickup, customized photo stops, toll charges included, private AC comfort',
      frequency: 'Available on-demand 24/7'
    },
    {
      id: 'mode_selfdrive',
      name: 'Self-Drive Highway SUV / Cruiser',
      icon: '🚗',
      estimatedTime: `${Math.max(2, Math.round(dist / 60))} hrs`,
      estimatedCostINR: Math.round(dist * 7.5 + 1200),
      highlights: 'Complete travel freedom, fuel & Fastag enabled, unlimited flexibility',
      frequency: 'Instant vehicle handover at source hub'
    }
  ];
};

/**
 * AI Dynamic Comprehensive Budget Breakdown
 */
export const calculateAIBudgetBreakdown = (destObj, days = 3, travelers = 2, selectedTier = 'Standard') => {
  const d = Math.max(1, Number(days) || 3);
  const t = Math.max(1, Number(travelers) || 2);

  let accomRate = 4500;
  let foodRate = 1200;
  let transitRate = 2200;
  let localTravelRate = 800;
  let ticketRate = 600;
  let shoppingRate = 800;

  if (selectedTier === 'Budget') {
    accomRate = 1800;
    foodRate = 700;
    transitRate = 1200;
    localTravelRate = 450;
    ticketRate = 350;
    shoppingRate = 400;
  } else if (selectedTier === 'Luxury') {
    accomRate = 12000;
    foodRate = 3200;
    transitRate = 6500;
    localTravelRate = 2000;
    ticketRate = 1500;
    shoppingRate = 2500;
  }

  const roomFactor = t <= 2 ? 1 : Math.ceil(t / 2);
  const accommodation = accomRate * d * roomFactor;
  const food = foodRate * d * t;
  const transport = transitRate * Math.sqrt(t);
  const localTravel = localTravelRate * d;
  const tickets = ticketRate * d * t;
  const shopping = shoppingRate * t;
  const subtotal = accommodation + food + transport + localTravel + tickets + shopping;
  const emergencyBuffer = Math.round(subtotal * 0.10); // 10% contingency buffer
  const grandTotal = subtotal + emergencyBuffer;

  return {
    tier: selectedTier,
    transport: Math.round(transport),
    hotel: Math.round(accommodation),
    accommodation: Math.round(accommodation),
    food: Math.round(food),
    localTravel: Math.round(localTravel),
    entryTickets: Math.round(tickets),
    tickets: Math.round(tickets),
    shopping: Math.round(shopping),
    emergencyFund: Math.round(emergencyBuffer),
    emergencyBuffer: Math.round(emergencyBuffer),
    totalBudget: Math.round(grandTotal),
    grandTotal: Math.round(grandTotal),
    perPerson: Math.round(grandTotal / t),
    perDay: Math.round(grandTotal / d)
  };
};

/**
 * 3-Tier Budget Optimizer Data
 */
export const getBudgetOptimizerTiers = (destObj, days = 3, travelers = 2) => {
  return {
    budget: calculateAIBudgetBreakdown(destObj, days, travelers, 'Budget'),
    standard: calculateAIBudgetBreakdown(destObj, days, travelers, 'Standard'),
    luxury: calculateAIBudgetBreakdown(destObj, days, travelers, 'Luxury')
  };
};

/**
 * Dynamic AI Day-by-Day Itinerary Synthesis (1 to 15+ Days)
 * Exact day-count scheduling with Morning, Afternoon, Evening, Dinner,
 * Nearby Attraction, Approximate Budget, Travel Distance, and Recommended Transport.
 */
export const generateDynamicDaySchedule = (destObj, dayNumber, totalDays, tripType, hotelPref) => {
  const destName = destObj.name || 'Destination';
  const dailyCost = Math.round((destObj.estimated_budget_inr || 15000) / totalDays);

  const themes = [
    {
      title: `Arrival, Heritage Quarter & Golden Sunset Promenade`,
      focus: 'Heritage & Orientation',
      morningSite: `${destName} Central Heritage Quarter & Clock Tower`,
      morningDesc: `Check-in, refresh, and embark on a relaxed guided walking tour exploring historical architecture, stone facades, and cultural foundation of ${destName}.`,
      breakfast: `Royal Breakfast at ${hotelPref || 'Resort Cafe'} — Steaming Filter Coffee & Regional Delicacies`,
      lunch: `Authentic Regional Lunch at Heritage Mess — Signature Thali & Chef Specials`,
      afternoonAct: `Interactive Artisan Crafts & Museum Tour — Witness master craftsmen at work and explore ancient relics.`,
      teaBreak: `Afternoon High Tea at Iconic Market Tea House — Special Masala Chai paired with fresh savories.`,
      eveningSite: `Panoramic Sunset Viewpoint & Lake/Coastal Promenade`,
      eveningDesc: `Watch the sunset paint the horizon in golden hues, followed by a leisurely stroll along the vibrant illuminated promenade.`,
      dinner: `Traditional Candlelight Dinner at Top-Rated Regional Diner — Authentic spice-roasted specialties.`,
      nearbyAttraction: `${destName} Botanical Flower Park & Royal Stepwell (3.5 km)`,
      distance: '~12 km local transit',
      recommendedTransport: 'Private AC Cab / Chauffeur Sedan',
      bestTime: '07:30 AM - 11:00 AM (Cool Morning Hours)',
      tip: 'Keep your identity card handy and wear comfortable walking footwear for the heritage trail.'
    },
    {
      title: `Scenic Nature Exploration, Panoramic Peaks & Local Bazaars`,
      focus: 'Nature & Landscapes',
      morningSite: `${destName} Grand Viewpoint & Botanical Valley`,
      morningDesc: `Breathe in fresh morning breeze from the highest elevation in ${destName}. Enjoy pristine panoramic vistas and lush natural flora.`,
      breakfast: `Fresh Garden Breakfast at Hilltop Cafe — Organic Fruit Platters & Warm Oven Bakes`,
      lunch: `Country-Style Farmhouse Lunch — Fresh Farm-to-Table Curries with Homemade Breads`,
      afternoonAct: `Nature Eco-Walk & Hidden Waterfall Trail — Moderate scenic hike crossing natural streams and pine forest paths.`,
      teaBreak: `Scenic Viewpoint Tea Pitstop — Fresh Ginger Cardamom Tea with hot roasted corn / banana fritters.`,
      eveningSite: `Vibrant Night Bazaar & Souvenir Street`,
      eveningDesc: `Explore buzzing local market stalls, bargain for handloom textiles, authentic spices, handcrafted wooden toys, and artisanal sweets.`,
      dinner: `Barbecue & Sizzling Claypot Dinner at Rooftop Lounge with acoustic ambient music.`,
      nearbyAttraction: `Pristine Secluded Waterfall & Pine Forest Trail (7.8 km)`,
      distance: '~18 km local transit',
      recommendedTransport: 'Scenic Route 4x4 Jeep / Cab',
      bestTime: '06:30 AM - 10:30 AM (Ideal for photography)',
      tip: 'Carry a lightweight windcheater jacket and keep camera batteries fully charged.'
    },
    {
      title: `Spiritual Sanctuary, Cultural Immersion & Culinary Trail`,
      focus: 'Culture & Spirituality',
      morningSite: `Ancient Sacred Temple & Peaceful Meditation Sanctuary`,
      morningDesc: `Experience serene morning spiritual rituals, intricate Dravidian/Nagara stone carvings, and tranquil prayer courtyards.`,
      breakfast: `Traditional Temple Canteen / Heritage Hall — Crispy Ghee Dosa & Sweet Pongal`,
      lunch: `Specialty Coastal / Mountain Feasts at Celebrated Local Restaurant`,
      afternoonAct: `Culinary Tasting Trail & Spice Plantation Tour — Learn secret recipes and aromatic spice harvesting from local masters.`,
      teaBreak: `Artisanal Coffee & Baker Pitstop — Single-origin brew paired with fresh local pastries.`,
      eveningSite: `Cultural Music & Light Show at Historic Fort Amphitheatre`,
      eveningDesc: `Enthralling 45-minute multimedia narration detailing the bravery and glorious history of ${destName}.`,
      dinner: `Grand Farewell Feast with Multi-Course Regional Platter and chef-crafted desserts.`,
      nearbyAttraction: `Historic Hilltop Fort & Archaeological Caves (11.2 km)`,
      distance: '~15 km local transit',
      recommendedTransport: 'Auto Rickshaw & Heritage Walking Route',
      bestTime: '08:00 AM - 11:30 AM (Peaceful morning darshan)',
      tip: 'Dress modestly when entering spiritual sanctuaries; footwear stands are available at the entrance.'
    },
    {
      title: `Adventure Excursion, Water Cascades & Thrill Sports`,
      focus: 'Outdoor Adventure',
      morningSite: `${destName} Valley Rapids / Forest Adventure Zone`,
      morningDesc: `Thrill-seeking morning with zip-lining, river crossing, bamboo rafting, and guided boulder climbing under expert supervision.`,
      breakfast: `High-Energy Campers Breakfast — Protein Omelettes / Sprouts Salad, Hot Parathas & Fresh Juice`,
      lunch: `Riverside Picnic Feast — Woodfire Cooked Biryani & Fresh Salads by the Water`,
      afternoonAct: `Off-Road 4x4 Jeep Safari / Mountain Biking Trail through dense wilderness terrains.`,
      teaBreak: `Jungle Canopy Tea Point — Herbal Lemongrass Brew with crisp savory snacks.`,
      eveningSite: `Campfire Gathering & Stargazing Session`,
      eveningDesc: `Unwind under crystal clear night skies with acoustic guitar jams, constellation mapping, and roasted marshmallows.`,
      dinner: `Campfire Charcoal Barbecue & Tandoori Feast under the open starlit sky.`,
      nearbyAttraction: `Wild River Gorge & Canopy Suspension Bridge (14.5 km)`,
      distance: '~24 km local transit',
      recommendedTransport: 'Open-top 4x4 Adventure Jeep',
      bestTime: '07:00 AM - 01:00 PM (Best for outdoor thrill sports)',
      tip: 'Apply SPF 50 sunscreen generously and wear quick-dry outdoor activewear.'
    },
    {
      title: `Secret Villages, Organic Farms & Relaxed Leisure`,
      focus: 'Slow Travel & Leisure',
      morningSite: `Picturesque Eco-Village & Living Heritage Compound`,
      morningDesc: `Experience unhurried rustic life, interact with welcoming village elders, and stroll through organic orchards and paddy fields.`,
      breakfast: `Warm Rural Breakfast — Steamed Rice Cakes with Chutneys & Fresh Farm Dairy Milk`,
      lunch: `Claypot Traditional Village Meal served on eco-friendly banana leaves with pure ghee.`,
      afternoonAct: `Pottery Wheel Workshop & Handloom Weaving Masterclass with local artisans.`,
      teaBreak: `Village Banyan Tree Tea Stall — Clay Kulhad Chai with freshly fried pakoras.`,
      eveningSite: `Serene Riverbank / Coastal Sunset Cruise`,
      eveningDesc: `Gentle boat cruise gliding across calm backwaters/lake as dusk settles with calming water reflections.`,
      dinner: `Waterfront Dining with Live Traditional Folk Music and gourmet regional specialties.`,
      nearbyAttraction: `Organic Fruit Orchards & Honey Bee Apiary (6.0 km)`,
      distance: '~14 km local transit',
      recommendedTransport: 'Eco-Friendly Electric Buggy & Walking Stroll',
      bestTime: '08:30 AM - 12:00 PM',
      tip: 'Support the village economy by picking up fresh organic honey and handmade cotton weaves.'
    },
    {
      title: `Artisanal Handicrafts, Local Museum & High Viewpoint`,
      focus: 'Arts & Landscapes',
      morningSite: `${destName} Tribal Heritage Museum & Handloom Weavers Gallery`,
      morningDesc: `Discover regional artifacts, ancient tribal weapons, handmade brass cast works, and century-old textiles.`,
      breakfast: `Artisan Bakery Breakfast — Cinnamon Rolls, Poha, and Fresh Mango Lassi`,
      lunch: `Royal Grand Thali with 12 Unique Traditional Delicacies and Fresh Chutneys`,
      afternoonAct: `Scenic Valley Cable Car / Ropeway Ride across breathtaking deep ravines.`,
      teaBreak: `Valley-Edge Cafe — Special Cardamom Herbal Infusions and hot potato cutlets.`,
      eveningSite: `Twilight Observation Deck & Starlight Promenade`,
      eveningDesc: `Panoramic telescope gazing looking over the twinkling lights of the entire district valley.`,
      dinner: `Traditional Claypot Handi Feast with fragrant saffron pulao and sweet gulab jamun.`,
      nearbyAttraction: `Ancient Mountain Pass & Historical Watchtower (16.0 km)`,
      distance: '~16 km local transit',
      recommendedTransport: 'Private AC Taxi & Ropeway Gondola',
      bestTime: '09:00 AM - 01:30 PM',
      tip: 'Ropeway tickets can be booked faster via digital QR pass at the lower terminal.'
    },
    {
      title: `Grand Finale: Sunrise Excursion, Souvenirs & Farewell Celebration`,
      focus: 'Memories & Departure',
      morningSite: `Golden Dawn Sunrise Point & Bird Sanctuary`,
      morningDesc: `Final morning golden hour spectacle watching dawn mist clear over dramatic landscapes.`,
      breakfast: `Celebration Buffet Breakfast at Resort Terrace — Chef Special Waffles, Dosas & Espresso`,
      lunch: `Farewell Feast with Celebrated Regional Curries and Dessert Platter`,
      afternoonAct: `Grand Souvenir Shopping at Central Craft Emporium — Pure silk fabrics, spices, and handmade brass decor.`,
      teaBreak: `Signature Farewell High Tea with Artisanal Cookies and Royal Chai.`,
      eveningSite: `Relaxed Departure Prep & Evening Leisure Stroll`,
      eveningDesc: `Pack memories, collect souvenir gift hampers, and prepare for smooth onward departure transit.`,
      dinner: `Gourmet Multi-Cuisine Farewell Dinner with Candlelit Terrace Setup.`,
      nearbyAttraction: `Central Craft Emporium & Silk Village (2.0 km)`,
      distance: '~10 km local transit',
      recommendedTransport: 'Pre-Arranged Luxury Airport/Station Chauffeur Transfer',
      bestTime: '05:30 AM - 09:30 AM (Unforgettable sunrise view)',
      tip: 'Keep all boarding passes, digital QR tickets, and souvenir invoices organized for smooth checkout.'
    }
  ];

  const tIdx = (dayNumber - 1) % themes.length;
  const theme = themes[tIdx];

  return {
    dayNumber,
    dayTitle: `Day ${dayNumber}: ${theme.title}`,
    focus: theme.focus,
    // Morning Section
    morning: `${theme.morningSite} — ${theme.morningDesc}`,
    morningAttraction: theme.morningSite,
    morningDetails: theme.morningDesc,
    breakfastPlace: theme.breakfast,
    breakfast: theme.breakfast,
    // Afternoon Section
    afternoon: `${theme.afternoonAct} | Lunch: ${theme.lunch}`,
    afternoonActivity: theme.afternoonAct,
    lunchPlace: theme.lunch,
    lunch: theme.lunch,
    teaBreak: theme.teaBreak,
    // Evening Section
    evening: `${theme.eveningSite} — ${theme.eveningDesc}`,
    eveningAttraction: theme.eveningSite,
    eveningDetails: theme.eveningDesc,
    // Dinner Section
    dinner: theme.dinner,
    dinnerPlace: theme.dinner,
    // Night Stay
    nightStay: hotelPref || `${destName} Selected Luxury Resort / Hotel`,
    // Specific Day Details
    nearbyAttraction: theme.nearbyAttraction,
    approximateBudget: dailyCost,
    estimatedDailyCost: dailyCost,
    travelDistance: theme.distance,
    googleMapDistance: theme.distance,
    recommendedTransport: theme.recommendedTransport,
    travelTime: '~25-35 mins local transit',
    bestTimeToVisit: theme.bestTime,
    travelTips: theme.tip
  };
};

/**
 * Generate Complete Multi-Day AI Itinerary (1 to 15+ Days)
 */
export const generateFullAITripPlan = (source, destInput, days = 3, travelers = 2, tripType = 'Couple', hotelPref = '', transport = '', startDate = '') => {
  const destObj = resolveOrCreateDestination(destInput);
  const safeDays = Math.max(1, Number(days) || 3);
  const safeTravelers = Math.max(1, Number(travelers) || 2);
  const sDate = startDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const transitInfo = calculateTransitInfo(source, destObj.name);
  const distanceKm = transitInfo.distanceKm || 350;

  const hotels = generateDestinationHotels(destObj.name, destObj.state);
  const foodRecs = getLocalFoodRecommendations(destObj.name, destObj.state);
  const hiddenGems = getHiddenGems(destObj.name, destObj.state);
  const nearbyAttractions = getNearbyAttractionsByRadius(destObj.name);
  const weatherData = generateMultiDayWeather(destObj, sDate, safeDays);
  const safetyTips = getAISafetyTips(destObj.name, destObj.state);
  const transportMatrix = calculateTransportMatrix(source, destObj.name, distanceKm);
  const budgetBreakdown = calculateAIBudgetBreakdown(destObj, safeDays, safeTravelers, 'Standard');
  const budgetOptimizer = getBudgetOptimizerTiers(destObj, safeDays, safeTravelers);

  // Generate exact day by day schedule
  const dailyPlan = [];
  for (let i = 1; i <= safeDays; i++) {
    dailyPlan.push(generateDynamicDaySchedule(destObj, i, safeDays, tripType, hotelPref));
  }

  // Similar Destinations ("You May Also Like")
  const similarDestinations = SEED_DESTINATIONS
    .filter(d => d.id !== destObj.id && (d.category === destObj.category || d.state === destObj.state || !d.is_international))
    .slice(0, 5)
    .map(d => ({
      id: d.id,
      name: d.name,
      state: d.state || d.country,
      image: d.image,
      rating: d.rating,
      category: d.category,
      estimated_budget_inr: d.estimated_budget_inr || 14000
    }));

  return {
    id: `trip_plan_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
    source,
    destination: destObj.name,
    destId: destObj.id,
    destObj,
    startDate: sDate,
    duration: safeDays,
    days: safeDays,
    travelers: safeTravelers,
    tripType,
    hotelPref: hotelPref || hotels.resorts[0]?.name || 'Luxury Resort',
    transport: transport || 'Private AC Cab / SUV',
    distanceKm,
    routeInfo: transitInfo,
    hotels,
    foodRecommendations: foodRecs,
    safetyTips,
    hiddenGems,
    nearbyAttractions,
    weather: weatherData,
    crowdPrediction: weatherData.crowdPrediction,
    transportMatrix,
    budget: budgetBreakdown.grandTotal,
    budgetBreakdown,
    budgetOptimizer,
    dailyPlan,
    similarDestinations,
    createdAt: new Date().toISOString()
  };
};

/**
 * Save Generated Trip Plan to Firestore `tripPlans` Collection
 */
export const saveTripPlanToFirestore = async (plan, uid = null) => {
  const tripPlanPayload = {
    uid: uid || 'guest_user',
    source: plan.source,
    destination: plan.destination,
    destId: plan.destId || plan.destination.toLowerCase(),
    tripType: plan.tripType,
    duration: plan.duration || plan.days,
    budget: plan.budget,
    budgetBreakdown: plan.budgetBreakdown || {},
    dailyPlan: plan.dailyPlan || [],
    weather: plan.weather || {},
    safetyTips: plan.safetyTips || {},
    foodRecommendations: plan.foodRecommendations || [],
    hotel: plan.hotelPref,
    transport: plan.transport,
    startDate: plan.startDate,
    travelers: plan.travelers,
    createdAt: serverTimestamp()
  };

  // LocalStorage cache for immediate seamless recall
  try {
    const existing = JSON.parse(localStorage.getItem('travelnest_saved_tripplans') || '[]');
    localStorage.setItem('travelnest_saved_tripplans', JSON.stringify([
      { id: plan.id, ...tripPlanPayload, createdAtStr: new Date().toISOString() },
      ...existing.slice(0, 19)
    ]));
  } catch (e) {}

  // Firestore save
  try {
    const docRef = await addDoc(collection(db, 'tripPlans'), tripPlanPayload);
    return docRef.id;
  } catch (err) {
    console.warn("Firestore tripPlans save warning (offline fallback active):", err.message);
    return plan.id;
  }
};

/**
 * Fetch Saved Trip Plans for Current User from Firestore
 */
export const fetchUserTripPlans = async (uid) => {
  if (!uid || uid === 'guest_user') {
    try {
      return JSON.parse(localStorage.getItem('travelnest_saved_tripplans') || '[]');
    } catch (e) {
      return [];
    }
  }

  try {
    const q = query(
      collection(db, 'tripPlans'),
      where('uid', '==', uid)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const plans = [];
      snapshot.forEach(doc => {
        plans.push({ id: doc.id, ...doc.data() });
      });
      return plans;
    }
  } catch (err) {
    console.warn("Firestore tripPlans fetch warning:", err.message);
  }

  // Fallback to local storage
  try {
    const all = JSON.parse(localStorage.getItem('travelnest_saved_tripplans') || '[]');
    return all.filter(p => p.uid === uid || p.uid === 'guest_user');
  } catch (e) {
    return [];
  }
};

/**
 * AI Travel Insights Helper Exports
 */
export const generateDynamicWeatherAndCrowd = (destObj, startDateStr, days = 5) => {
  return generateMultiDayWeather(destObj, startDateStr, days);
};

export const generateNearbyAttractions = (destName) => {
  return getNearbyAttractionsByRadius(destName);
};

export const generateFoodRecommendations = (destName, state = '') => {
  return getLocalFoodRecommendations(destName, state);
};
