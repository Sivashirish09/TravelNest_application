// =========================================================================
// TRAVELNEST COMPREHENSIVE INTERNATIONAL DESTINATIONS DATABASE (18 DESTINATIONS)
// =========================================================================

export const INTERNATIONAL_DESTINATIONS = [
  // 1. DUBAI
  {
    id: 'dubai',
    name: 'Dubai (UAE)',
    aliases: ['dubai', 'uae', 'burj khalifa', 'palm jumeirah', 'dubai marina'],
    country: 'United Arab Emirates',
    state: 'Dubai Emirate',
    category: 'City',
    description: 'City of Gold and modern superlatives featuring Burj Khalifa (world\'s tallest building), Museum of the Future, Palm Jumeirah, and luxury desert dune safaris.',
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    best_season: 'Nov - Apr',
    weather_type: 'Sunny Desert Warmth',
    weather_info: '25°C Warm Sunshine',
    estimated_budget_inr: 85000,
    accommodation_cost_per_night: 8500,
    food_cost_per_day: 2500,
    local_transport_cost: 7000,
    sightseeing_cost: 6500,
    activity_cost: 8500,
    recommended_days: 5,
    budget_level: 'Premium',
    rating: 4.9,
    review_count: 990,
    cost_tier: 'Premium',
    is_international: true,
    nearest_airport: 'Dubai International Airport (DXB)',
    nearest_railway: 'Dubai Metro (Driverless Network) & Palm Monorail',
    local_language: 'Arabic, English, Hindi',
    safety_score: 9.9,
    popularity_score: 100,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Burj Khalifa Level 148 At the Top', 'Museum of the Future Architectural Wonder', 'Dubai Desert 4x4 Dune Bashing & BBQ Camp', 'Dubai Mall & Dubai Fountain Show', 'Atlantis The Palm & Aquaventure Waterpark'],
    hotels: [
      { name: 'Burj Al Arab Jumeirah (7-Star Icon)', price_per_night: 85000, rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Private Island Jumeirah', amenities: ['All-Suite Duplexes with 24K Gold Details', 'Talise Spa 150m in Sky', 'Helipad', 'Private Luxury Beach'] },
      { name: 'JW Marriott Marquis Hotel Dubai', price_per_night: 11500, rating: 4.88, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Business Bay Near Downtown', amenities: ['World’s Tallest 5-Star Hotel Towers', 'Saray Spa with Dead Sea Pool', '12 Award-Winning Restaurants', 'Outdoor Heated Pool'] }
    ],
    resorts: [
      { name: 'Atlantis The Royal Palm Jumeirah', price_per_night: 34000, rating: 4.97, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Palm Jumeirah Crescent', amenities: ['Cloud 22 Sky Pool 90m up', 'Aquaventure Waterpark Access', 'Michelin Chef Restaurants', 'Awaken Spa'] }
    ],
    restaurants: [
      { name: 'Al Mahara at Burj Al Arab', type: 'Michelin Star Seafood Encased in a Giant Aquarium', rating: 4.95, price: '₹14,000/person', distance: 'Jumeirah' },
      { name: 'Arabian Tea House Al Fahidi', type: 'Authentic Emirati Machboos & Cardamom Karak', rating: 4.8, price: '₹1,200/person', distance: 'Al Fahidi Historical' }
    ],
    popular_activities: ['Ascending 828m Burj Khalifa for views over Arabian Gulf', 'Thrilling red dune 4x4 bashing with sandboarding and falconry', 'Strolling under the illuminated canopy of Dubai Miracle Garden'],
    local_transport_options: ['Dubai Metro', 'Dubai Tram', 'Careem / RTA Taxis', 'Palm Monorail'],
    nearby_places: [
      { name: 'Abu Dhabi Sheikh Zayed Grand Mosque', distance: '130 km', category: 'Heritage', rating: 5.0, price: 'Free entry', description: 'Architectural marvel of pure white Macedonian marble with 82 domes' }
    ]
  },

  // 2. SINGAPORE
  {
    id: 'singapore',
    name: 'Singapore',
    aliases: ['singapore', 'lion city', 'marina bay sands', 'sentosa', 'gardens by the bay'],
    country: 'Singapore',
    state: 'Singapore Island',
    category: 'City',
    description: 'The futuristic Garden City famous for Marina Bay Sands infinity pool, Gardens by the Bay Supertrees, Universal Studios Sentosa, and Michelin street hawker centers.',
    image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    best_season: 'Nov - Jun',
    weather_type: 'Tropical Clean & Green',
    weather_info: '28°C Tropical Garden Breeze',
    estimated_budget_inr: 88000,
    accommodation_cost_per_night: 9500,
    food_cost_per_day: 2200,
    local_transport_cost: 3500,
    sightseeing_cost: 7000,
    activity_cost: 7500,
    recommended_days: 5,
    budget_level: 'Premium',
    rating: 4.92,
    review_count: 920,
    cost_tier: 'Premium',
    is_international: true,
    nearest_airport: 'Singapore Changi Airport (SIN) - World’s Best Airport',
    nearest_railway: 'Singapore SMRT Mass Rapid Transit Network',
    local_language: 'English, Mandarin, Malay, Tamil',
    safety_score: 9.95,
    popularity_score: 99,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Marina Bay Sands SkyPark & Infinity Pool', 'Gardens by the Bay Supertree Grove & Cloud Forest', 'Universal Studios Singapore on Sentosa Island', 'Singapore Night Safari & Zoo', 'Jewel Changi 40m Rain Vortex Waterfall'],
    hotels: [
      { name: 'Marina Bay Sands Hotel', price_per_night: 32000, rating: 4.97, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Marina Bay Waterfront', amenities: ['World’s Largest Rooftop Infinity Pool (57th Floor)', 'Banyan Tree Spa', 'Direct Mall & Casino Access', 'LAVO Restobar'] },
      { name: 'Raffles Hotel Singapore (Legendary Colonial)', price_per_night: 38000, rating: 4.98, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Civic District', amenities: ['Birthplace of Singapore Sling Cocktail', 'Personal Butler Service', 'Raffles Spa', 'Courtyard Gardens'] }
    ],
    resorts: [
      { name: 'Capella Singapore (Sentosa Island)', price_per_night: 35000, rating: 4.96, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Sentosa Island 30-Acre Rainforest', amenities: ['Colonial & Modern Fusion Manors', 'Tiered Cascading Pools', 'Auriga Spa', 'Peacock Roaming Lawns'] }
    ],
    restaurants: [
      { name: 'Liao Fan Hawker Chan (Chinatown Complex)', type: 'World’s Most Affordable Michelin Star Soya Sauce Chicken Rice', rating: 4.7, price: '₹450/person', distance: 'Chinatown' },
      { name: 'Jumbo Seafood at Riverside Point', type: 'Famous Award-Winning Singapore Chilli Crab with Fried Buns', rating: 4.88, price: '₹3,500/person', distance: 'Clarke Quay' }
    ],
    popular_activities: ['Walking through the mist of the 35m indoor waterfall at Cloud Forest', 'Experiencing the dazzling Garden Rhapsody sound & light show at Supertree Grove', 'Riding world-class coasters at Universal Studios Sentosa'],
    local_transport_options: ['Singapore MRT (Extensive Clean Trains)', 'Grab Taxis', 'Sentosa Express Monorail'],
    nearby_places: [
      { name: 'Sentosa Island Resorts & Palawan Beach', distance: '15 min MRT/Express', category: 'Island', rating: 4.9, price: 'Free entry', description: 'Entertainment hub with beaches, S.E.A. Aquarium, and cable cars' }
    ]
  },

  // 3. PARIS (FRANCE)
  {
    id: 'france',
    name: 'Paris (France)',
    aliases: ['paris', 'france', 'city of light', 'eiffel tower', 'louvre', 'versailles'],
    country: 'France',
    state: 'Île-de-France',
    category: 'Heritage',
    description: 'City of Light and world capital of art, fashion, and gastronomy, home of the Eiffel Tower, Louvre Museum, Palace of Versailles, and glamorous French Riviera.',
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    best_season: 'Apr - Oct',
    weather_type: 'Pleasant European Temperate',
    weather_info: '18°C Sunny Parisian Breeze',
    estimated_budget_inr: 165000,
    accommodation_cost_per_night: 16000,
    food_cost_per_day: 4000,
    local_transport_cost: 14000,
    sightseeing_cost: 12000,
    activity_cost: 14000,
    recommended_days: 6,
    budget_level: 'Luxury',
    rating: 4.95,
    review_count: 990,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'Paris Charles de Gaulle (CDG) / Orly (ORY)',
    nearest_railway: 'SNCF TGV High-Speed Rail Network & Paris Métro',
    local_language: 'French, English',
    safety_score: 9.7,
    popularity_score: 100,
    ai_score: 99,
    travel_difficulty: 'Easy',
    highlights: ['Eiffel Tower Summit & Sparkling Night Illumination', 'Louvre Museum (Mona Lisa & Venus de Milo)', 'Palace of Versailles Hall of Mirrors & Royal Gardens', 'Seine River Sunset Cruise with Champagne', 'Arc de Triomphe & Champs-Élysées Walk'],
    hotels: [
      { name: 'Hôtel Plaza Athénée Paris (Dorchester Collection)', price_per_night: 68000, rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Avenue Montaigne Paris', amenities: ['Iconic Red Geranium Balconies with Eiffel Tower Views', 'Dior Spa', '3-Michelin Star Dining', 'Haute Couture Suites'] },
      { name: 'Shangri-La Paris (Former Prince Roland Bonaparte Palace)', price_per_night: 62000, rating: 4.98, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: '16th Arrondissement', amenities: ['Direct Eiffel Tower View Suites', 'Chi The Spa', 'Michelin Shang Palace'] }
    ],
    resorts: [
      { name: 'Waldorf Astoria Versailles - Trianon Palace', price_per_night: 28000, rating: 4.9, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Versailles Royal Park', amenities: ['Guerlain Spa', 'Gordon Ramsay Restaurant', 'Heated Indoor Pool'] }
    ],
    restaurants: [
      { name: 'Le Jules Verne at Eiffel Tower (2nd Floor)', type: 'Michelin Star Gastronomy 125m in the Sky', rating: 4.95, price: '₹18,000/person', distance: 'Eiffel Tower' },
      { name: 'Café de Flore Saint-Germain', type: 'Croissants, Hot Chocolate & French Onion Soup', rating: 4.75, price: '₹1,800/person', distance: 'Boulevard Saint-Germain' }
    ],
    popular_activities: ['Watching the Eiffel Tower burst into 20,000 sparkling golden lights every hour on the hour', 'Seine River glass-canopy dinner cruise tasting French wines and gourmet duck confit'],
    local_transport_options: ['Paris Métro & RER', 'TGV High-Speed Trains', 'Uber / Taxis'],
    nearby_places: [
      { name: 'Palace of Versailles', distance: '20 km', category: 'Heritage', rating: 5.0, price: '₹2,200 entry', description: 'Gilded 17th-century royal palace of Louis XIV with sprawling fountains' }
    ]
  },

  // 4. BALI (INDONESIA)
  {
    id: 'bali',
    name: 'Bali (Indonesia)',
    aliases: ['bali', 'ubud', 'seminyak', 'nusa penida', 'kuta', 'canggu'],
    country: 'Indonesia',
    state: 'Bali Province',
    category: 'Island',
    description: 'Island of the Gods famous for lush Ubud rice terraces, clifftop Uluwatu Temple, sacred water temples, Seminyak beach clubs, and Mount Batur sunrise.',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    best_season: 'Apr - Oct',
    weather_type: 'Tropical Island Breeze',
    weather_info: '27°C Tropical Island Sunshine',
    estimated_budget_inr: 68000,
    accommodation_cost_per_night: 5500,
    food_cost_per_day: 1800,
    local_transport_cost: 6500,
    sightseeing_cost: 3200,
    activity_cost: 5500,
    recommended_days: 6,
    budget_level: 'Standard',
    rating: 4.92,
    review_count: 940,
    cost_tier: 'Standard',
    is_international: true,
    nearest_airport: 'Ngurah Rai International Airport Denpasar (DPS)',
    nearest_railway: 'None (Private Drivers & Rental Scooters)',
    local_language: 'Balinese, Indonesian, English',
    safety_score: 9.8,
    popularity_score: 99,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Tegalalang Rice Terraces & Giant Bali Swing', 'Uluwatu Clifftop Temple & Kecak Sunset Fire Dance', 'Nusa Penida Kelingking T-Rex Beach Day Trip', 'Mount Batur Active Volcano Sunrise Trek', 'Tanah Lot Ocean Temple'],
    hotels: [
      { name: 'The Kayon Jungle Resort Ubud', price_per_night: 18500, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Bresela Ubud Jungle', amenities: ['Three-Tiered Jungle Infinity Pool', 'Serapung Spa', 'KePitu Fine Dining', 'Morning Yoga Pavilion'] },
      { name: 'Potato Head Suites Seminyak', price_per_night: 12000, rating: 4.88, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Petitenget Beach Seminyak', amenities: ['Beachfront Infinity Pool & Club', 'Zero-Waste Organic Dining', 'Spa', 'Sunset DJ Sessions'] }
    ],
    resorts: [
      { name: 'Ayana Resort and Spa Bali (Jimbaran)', price_per_night: 22000, rating: 4.95, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Jimbaran Clifftop', amenities: ['World-Famous Rock Bar on Clifftop', '14 Swimming Pools', 'Aquatonic Seawater Spa Pool'] }
    ],
    restaurants: [
      { name: 'Bebek Bengil (Dirty Duck) Ubud', type: 'Crispy Balinese Duck & Sambal Matah', rating: 4.8, price: '₹950/person', distance: 'Hanoman St Ubud' },
      { name: 'Rock Bar at Ayana', type: 'Sunset Cocktails & Mediterranean Tapas on Ocean Rock', rating: 4.92, price: '₹2,200/person', distance: 'Jimbaran' }
    ],
    popular_activities: ['Witnessing the spellbinding Kecak fire dance against a fiery Uluwatu cliff sunset', 'Taking speedboats to Nusa Penida island for Kelingking T-Rex cliff views'],
    local_transport_options: ['Private Day Drivers (Grab / Gojek)', 'Rental Scooters', 'Speedboats'],
    nearby_places: [
      { name: 'Nusa Penida Kelingking & Broken Beach', distance: '45 min speedboat', category: 'Adventure', rating: 4.95, price: '₹1,500 boat', description: 'Dramatic ocean cliffs and turquoise manta ray bays' }
    ]
  },

  // 5. SWITZERLAND
  {
    id: 'switzerland',
    name: 'Switzerland (Zurich & Interlaken)',
    aliases: ['switzerland', 'swiss', 'interlaken', 'zurich', 'jungfraujoch', 'zermatt', 'lucerne', 'matterhorn'],
    country: 'Switzerland',
    state: 'Swiss Confederation',
    category: 'Hill Station',
    description: 'Breathtaking alpine wonderland of snow-crowned peaks, crystal-clear glacial lakes, Jungfraujoch (Top of Europe), Matterhorn, and scenic panorama trains.',
    image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    best_season: 'May - Oct (Summer) / Dec - Mar (Skiing)',
    weather_type: 'Alpine Crisp & Pure',
    weather_info: '14°C Pure Alpine Air',
    estimated_budget_inr: 185000,
    accommodation_cost_per_night: 18000,
    food_cost_per_day: 4500,
    local_transport_cost: 22000,
    sightseeing_cost: 14000,
    activity_cost: 16000,
    recommended_days: 7,
    budget_level: 'Luxury',
    rating: 4.98,
    review_count: 990,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'Zurich Airport (ZRH) / Geneva Airport (GVA)',
    nearest_railway: 'Swiss Federal Railways (SBB) & Glacier Express',
    local_language: 'German, French, Italian, English',
    safety_score: 9.99,
    popularity_score: 100,
    ai_score: 99,
    travel_difficulty: 'Easy',
    highlights: ['Jungfraujoch 3,454m (Top of Europe) & Ice Palace', 'Matterhorn Glacier Paradise (Zermatt)', 'Glacier Express Scenic Panoramic Train Ride', 'Lake Brienz & Lake Thun Turquoise Steamer Cruises', 'Interlaken Tandem Paragliding over Jungfrau Alps'],
    hotels: [
      { name: 'Victoria-Jungfrau Grand Hotel & Spa Interlaken', price_per_night: 42000, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Höheweg Interlaken', amenities: ['150-Year 5-Star Grand Luxury', '5,500 sq m Spa Nescens', 'Jungfrau Mountain Views', 'Fine Dining La Terrasse'] },
      { name: 'The Dolder Grand Zurich', price_per_night: 54000, rating: 4.97, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Adlisberg Forest Above Zurich', amenities: ['Castle Luxury Overlooking Lake Zurich', '2-Michelin Star Dining', '4,000 sq m Japanese Spa'] }
    ],
    resorts: [
      { name: 'Bürgenstock Hotel & Alpine Spa (Lake Lucerne)', price_per_night: 58000, rating: 5.0, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: '500m Above Lake Lucerne Ridge', amenities: ['World-Famous Infinity Edge Alpine Sky Pool', '10,000 sq m Spa', 'Catamaran & Funicular Arrival'] }
    ],
    restaurants: [
      { name: 'Restaurant Schuh Interlaken', type: 'Swiss Cheese Fondue, Raclette & Swiss Chocolates', rating: 4.85, price: '₹3,200/person', distance: 'Höheweg Interlaken' },
      { name: 'Zeughauskeller Zurich', type: 'Traditional Swiss Zürcher Geschnetzeltes with Rösti', rating: 4.8, price: '₹2,800/person', distance: 'Bahnhofstrasse Zurich' }
    ],
    popular_activities: ['Riding the cogwheel train to 3,454m Jungfraujoch Top of Europe', 'Tandem paragliding high above the twin lakes of Interlaken'],
    local_transport_options: ['Swiss Travel Pass (Unlimited Trains, Buses & Lake Boats)', 'Mountain Cable Cars'],
    nearby_places: [
      { name: 'Lauterbrunnen Valley of 72 Waterfalls', distance: '12 km from Interlaken', category: 'Nature', rating: 5.0, price: 'Train access', description: 'Storybook glacial valley flanked by dramatic vertical rock cliffs' }
    ]
  },

  // 6. TOKYO (JAPAN)
  {
    id: 'japan',
    name: 'Tokyo & Kyoto (Japan)',
    aliases: ['japan', 'tokyo', 'kyoto', 'osaka', 'mt fuji', 'shinjuku', 'arashiyama'],
    country: 'Japan',
    state: 'Kanto & Kansai Regions',
    category: 'Heritage',
    description: 'Harmony of ancient traditions and futuristic innovation: neon-lit Tokyo, Mount Fuji, Kyoto’s Fushimi Inari 10,000 torii gates, bullet trains (Shinkansen), and cherry blossoms.',
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    best_season: 'Mar - May / Sep - Nov',
    weather_type: 'Crisp & Pleasant',
    weather_info: '16°C Fresh Spring / Autumn Breeze',
    estimated_budget_inr: 145000,
    accommodation_cost_per_night: 14000,
    food_cost_per_day: 3500,
    local_transport_cost: 16000,
    sightseeing_cost: 6500,
    activity_cost: 9500,
    recommended_days: 7,
    budget_level: 'Premium',
    rating: 4.98,
    review_count: 995,
    cost_tier: 'Premium',
    is_international: true,
    nearest_airport: 'Tokyo Haneda (HND) / Narita (NRT)',
    nearest_railway: 'Japan Rail Shinkansen (Bullet Train Network)',
    local_language: 'Japanese, English',
    safety_score: 9.98,
    popularity_score: 100,
    ai_score: 99,
    travel_difficulty: 'Easy',
    highlights: ['Fushimi Inari Shrine 10,000 Vermillion Torii Gates', 'Mount Fuji & Lake Kawaguchiko View', 'Shibuya Crossing (World’s Busiest Scramble) & Shinjuku', 'Arashiyama Bamboo Forest & Kinkaku-ji Golden Pavilion', '320 km/h Shinkansen Bullet Train Experience'],
    hotels: [
      { name: 'Aman Tokyo (Otemachi)', price_per_night: 65000, rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Otemachi Financial Center Tokyo', amenities: ['Panoramic Imperial Palace Views', 'Aman Spa with Onsen Baths', '30m Heated Sky Pool'] },
      { name: 'Hotel Gracery Shinjuku', price_per_night: 11500, rating: 4.75, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Kabukicho Shinjuku', amenities: ['Godzilla Terrace', 'Direct Shinjuku Station Access', 'Modern Rooms'] }
    ],
    resorts: [
      { name: 'Hoshinoya Kyoto (Arashiyama Riverside)', price_per_night: 42000, rating: 4.98, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Oi River Arashiyama', amenities: ['Riverside Ryokan', 'Kaiseki Multi-Course Haute Cuisine', 'Tatami Rooms with Cedar Wood Tubs'] }
    ],
    restaurants: [
      { name: 'Ichiran Ramen Shibuya', type: 'Solo Dining Booth Tonkotsu Ramen with Custom Broth', rating: 4.9, price: '₹950/bowl', distance: 'Shibuya Tokyo' },
      { name: 'Gion Karyo Kyoto', type: 'Traditional 10-Course Kyoto Kaiseki Banquet', rating: 4.95, price: '₹8,500/person', distance: 'Gion Kyoto' }
    ],
    popular_activities: ['Walking through the surreal towering bamboo stalks in Arashiyama Kyoto', 'Cruising at 320 km/h on Shinkansen bullet train past Mt. Fuji'],
    local_transport_options: ['Japan Rail (JR Pass & Shinkansen)', 'Tokyo Metro', 'Kyoto City Buses'],
    nearby_places: [
      { name: 'Nara Deer Park & Todai-ji Giant Buddha', distance: '45 min train from Kyoto', category: 'Heritage', rating: 4.95, price: '₹350 entry', description: 'Over 1,000 free-roaming bowing sika deer and ancient wooden temple' }
    ]
  },

  // 7. LONDON (UNITED KINGDOM)
  {
    id: 'london',
    name: 'London (United Kingdom)',
    aliases: ['london', 'uk', 'big ben', 'tower bridge', 'buckingham palace', 'westminster'],
    country: 'United Kingdom',
    state: 'England',
    category: 'Heritage',
    description: 'Historic and cosmopolitan capital on the River Thames, home to Big Ben, Buckingham Palace, Tower of London, world-class West End theatre, and British Museum.',
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    best_season: 'May - Sep',
    weather_type: 'Temperate Maritime',
    weather_info: '19°C Pleasant Summer Sunshine',
    estimated_budget_inr: 175000,
    accommodation_cost_per_night: 17000,
    food_cost_per_day: 4200,
    local_transport_cost: 12000,
    sightseeing_cost: 11000,
    activity_cost: 15000,
    recommended_days: 6,
    budget_level: 'Luxury',
    rating: 4.94,
    review_count: 980,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'London Heathrow (LHR) / Gatwick (LGW)',
    nearest_railway: 'London Underground (The Tube) & Elizabeth Line',
    local_language: 'English',
    safety_score: 9.8,
    popularity_score: 99,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Big Ben & Palace of Westminster', 'Buckingham Palace Changing of the Guard', 'Tower of London & Crown Jewels', 'London Eye Capsule Flight over Thames', 'British Museum & West End Musical Theatre'],
    hotels: [
      { name: 'The Savoy London (Fairmont)', price_per_night: 65000, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Strand Thames Riverfront', amenities: ['Edwardian & Art Deco Suites', 'Gordon Ramsay Savoy Grill', 'American Bar', 'Luxury Spa'] },
      { name: 'The Ritz London (Mayfair)', price_per_night: 72000, rating: 5.0, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Piccadilly Mayfair', amenities: ['World-Famous Traditional Afternoon Tea', 'Michelin Ritz Restaurant', 'Rivoli Bar', 'Royal Suites'] }
    ],
    resorts: [
      { name: 'The Grove Luxury Country Estate (Hertfordshire)', price_per_night: 32000, rating: 4.9, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: '300-Acre Countryside', amenities: ['18-Hole Championship Golf', 'Sequoia Luxury Spa', 'Walled Garden Pool', 'Fine Dining'] }
    ],
    restaurants: [
      { name: 'Dishoom Covent Garden', type: 'Bombay Irani Cafe Bacon Naan Roll & Black Daal', rating: 4.9, price: '₹2,200/person', distance: 'Covent Garden' },
      { name: 'Rules Restaurant Covent Garden', type: 'London’s Oldest Restaurant (1798) Prime Rib of Beef', rating: 4.85, price: '₹4,500/person', distance: 'Maiden Lane' }
    ],
    popular_activities: ['Riding the top deck of a red double-decker bus across Tower Bridge', 'Watching a world-class theatrical performance in the West End', 'Cruising along the Thames from Westminster to Greenwich Observatory'],
    local_transport_options: ['London Underground (Tube)', 'Iconic Black Cabs', 'Uber & Thames Clippers'],
    nearby_places: [
      { name: 'Windsor Castle & Stonehenge', distance: '35 km', category: 'Heritage', rating: 4.95, price: '₹3,000 tour', description: 'Oldest occupied royal castle in the world and prehistoric stone circle' }
    ]
  },

  // 8. MALDIVES
  {
    id: 'maldives',
    name: 'Maldives',
    aliases: ['maldives', 'male', 'overwater villas', 'ari atoll'],
    country: 'Maldives',
    state: 'South Asia Atolls',
    category: 'Island',
    description: 'World-famous tropical paradise of turquoise lagoons, private luxury overwater bungalows, vibrant coral reefs, and romantic underwater dining.',
    image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    best_season: 'Nov - Apr',
    weather_type: 'Tropical Lagoon Sunshine',
    weather_info: '29°C Tropical Warmth & Ocean Breeze',
    estimated_budget_inr: 125000,
    accommodation_cost_per_night: 18000,
    food_cost_per_day: 3500,
    local_transport_cost: 15000,
    sightseeing_cost: 4000,
    activity_cost: 12000,
    recommended_days: 5,
    budget_level: 'Luxury',
    rating: 4.98,
    review_count: 980,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'Velana International Airport Malé (MLE)',
    nearest_railway: 'None (Speedboat & Seaplane Transfers)',
    local_language: 'Dhivehi, English',
    safety_score: 9.9,
    popularity_score: 99,
    ai_score: 99,
    travel_difficulty: 'Easy',
    highlights: ['Luxury Overwater Villa with Glass Floor', 'Snorkeling with Manta Rays in Hanifaru Bay', 'Underwater Dining at Ithaa Undersea Restaurant', 'Private Sandbank Sunset Picnic', 'Sunset Dolphin Watching Cruise'],
    hotels: [
      { name: 'Soneva Fushi / Soneva Jani Overwater Villas', price_per_night: 48000, rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Noonu Atoll (Seaplane Access)', amenities: ['Overwater Slide into Lagoon', 'Retractable Roof for Stargazing', 'Private Infinity Pool', 'Cinema Paradiso'] },
      { name: 'Kurumba Maldives (Speedboat Access)', price_per_night: 18500, rating: 4.88, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'North Malé Atoll (10 min Speedboat)', amenities: ['Beachfront Bungalows', '8 Gourmet Restaurants', 'Veli Spa', 'Snorkeling House Reef'] }
    ],
    resorts: [
      { name: 'Anantara Veli Maldives Resort', price_per_night: 32000, rating: 4.95, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'South Malé Atoll', amenities: ['Adults-Only Overwater Bungalows', 'Balance Wellness Spa by Anantara', 'Japanese Dining Origami', 'Lagoon Water Sports'] }
    ],
    restaurants: [
      { name: 'Ithaa Undersea Restaurant Conrad', type: 'Fine Dining 5 Meters Below Ocean Surface', rating: 4.98, price: '₹18,000/person', distance: 'Rangali Island' },
      { name: 'Sea.Fire.Salt at Anantara', type: 'Overwater Grilled Wagyu & Rock Lobster', rating: 4.9, price: '₹6,500/person', distance: 'South Malé Atoll' }
    ],
    popular_activities: ['Snorkeling with whale sharks and gentle manta rays', 'Sip champagne during a private sunset sandbank dinner', 'Scuba diving along colorful coral reefs and drop-off walls'],
    local_transport_options: ['Trans Maldivian Airways Seaplanes', 'Resort Speedboats'],
    nearby_places: [
      { name: 'Hanifaru Bay UNESCO Biosphere', distance: 'Baa Atoll', category: 'Nature', rating: 5.0, price: 'Excursion', description: 'World’s largest feeding aggregation of manta rays and whale sharks' }
    ]
  },

  // 9. THAILAND
  {
    id: 'thailand',
    name: 'Thailand (Bangkok & Phuket)',
    aliases: ['thailand', 'bangkok', 'phuket', 'krabi', 'pattaya', 'phi phi islands'],
    country: 'Thailand',
    state: 'Kingdom of Thailand',
    category: 'Beach',
    description: 'Land of Smiles celebrated for ornate Grand Palace temples in Bangkok, vibrant street food, Phi Phi Islands emerald waters, and world-renowned Thai hospitality.',
    image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    best_season: 'Nov - Apr',
    weather_type: 'Tropical Coastal Breeze',
    weather_info: '28°C Warm Tropical Sunshine',
    estimated_budget_inr: 58000,
    accommodation_cost_per_night: 4200,
    food_cost_per_day: 1500,
    local_transport_cost: 5000,
    sightseeing_cost: 3500,
    activity_cost: 6500,
    recommended_days: 6,
    budget_level: 'Standard',
    rating: 4.9,
    review_count: 980,
    cost_tier: 'Standard',
    is_international: true,
    nearest_airport: 'Suvarnabhumi Airport Bangkok (BKK) / Phuket Airport (HKT)',
    nearest_railway: 'Bangkok BTS Skytrain & MRT',
    local_language: 'Thai, English',
    safety_score: 9.7,
    popularity_score: 100,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Grand Palace & Wat Pho Reclining Buddha Bangkok', 'Phi Phi Islands Speedboat & Maya Bay Snorkeling', 'Chao Phraya River Dinner Cruise', 'Phuket Big Buddha & Patong Bangla Road', 'Chatuchak Weekend Market & Street Food'],
    hotels: [
      { name: 'Mandarin Oriental Bangkok', price_per_night: 24000, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Chao Phraya Riverfront', amenities: ['145-Year Legendary Riverfront Luxury', 'The Oriental Spa', 'Riverside Terrace Dining', 'Private River Boat'] },
      { name: 'Amari Phuket (Patong Bay Oceanfront)', price_per_night: 7500, rating: 4.8, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Quiet Headland Patong Beach', amenities: ['Private Ocean Jetty & Coral Reef', 'Breeze Spa', 'Two Swimming Pools', 'La Gritta Italian Dining'] }
    ],
    resorts: [
      { name: 'Banyan Tree Phuket (Laguna Phuket)', price_per_night: 19500, rating: 4.95, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Bang Tao Bay', amenities: ['Private Pool Villas', 'Award-Winning Banyan Tree Spa', '18-Hole Championship Golf Course', 'Lagoon Dining Saffron'] }
    ],
    restaurants: [
      { name: 'Jay Fai Bangkok', type: 'Michelin-Starred Crab Meat Omelette & Drunken Seafood Noodles', rating: 4.9, price: '₹2,500/person', distance: 'Maha Chai Rd Bangkok' },
      { name: 'Thipsamai Phad Thai', type: 'Original 1939 Pad Thai Wrapped in Egg Crepe with Prawns', rating: 4.8, price: '₹400/person', distance: 'Pratu Phi Bangkok' }
    ],
    popular_activities: ['Speedboat excursion to Maya Bay and snorkeling with tropical fish', 'Traditional 2-hour Thai herbal compress massage', 'Night food tour tasting mango sticky rice, som tum, and tom yum goong'],
    local_transport_options: ['Bangkok BTS Skytrain', 'Chao Phraya Express Boats', 'Grab Taxis & Tuk-Tuks'],
    nearby_places: [
      { name: 'James Bond Island (Phang Nga Bay)', distance: '40 km from Phuket', category: 'Nature', rating: 4.9, price: '₹2,000 tour', description: 'Dramatic limestone karst towers rising vertically out of emerald water' }
    ]
  },

  // 10. ROME (ITALY)
  {
    id: 'rome',
    name: 'Rome (Italy)',
    aliases: ['rome', 'italy', 'colosseum', 'vatican', 'trevi fountain', 'pantheon'],
    country: 'Italy',
    state: 'Lazio',
    category: 'Heritage',
    description: 'The Eternal City where ancient history lives on every street corner, featuring the mighty Colosseum, Vatican City & Sistine Chapel, Trevi Fountain, and mouthwatering Italian pasta & gelato.',
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    best_season: 'Apr - Jun / Sep - Oct',
    weather_type: 'Mediterranean Sunshine',
    weather_info: '22°C Warm Mediterranean Breeze',
    estimated_budget_inr: 155000,
    accommodation_cost_per_night: 15000,
    food_cost_per_day: 3800,
    local_transport_cost: 11000,
    sightseeing_cost: 12000,
    activity_cost: 13000,
    recommended_days: 5,
    budget_level: 'Luxury',
    rating: 4.96,
    review_count: 970,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'Rome Leonardo da Vinci Fiumicino (FCO)',
    nearest_railway: 'Roma Termini & Rome Metro Network',
    local_language: 'Italian, English',
    safety_score: 9.7,
    popularity_score: 99,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['The Colosseum & Roman Forum Ancient Arena', 'Vatican Museums, St. Peter\'s Basilica & Sistine Chapel', 'Trevi Fountain Coin Toss Tradition', 'The Pantheon Architectural Wonder', 'Piazza Navona & Spanish Steps Sunset'],
    hotels: [
      { name: 'Hotel de Russie, a Rocco Forte Hotel', price_per_night: 62000, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Piazza del Popolo', amenities: ['Secret Terraced Gardens', 'De Russie Spa', 'Le Jardin de Russie Dining', 'Italian Luxury Suites'] },
      { name: 'The St. Regis Rome', price_per_night: 58000, rating: 4.95, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Via Vittorio Emanuele Orlando', amenities: ['Historic Belle Époque Palace', 'St. Regis Butler Service', 'Lumen Bar', 'Iridium Spa'] }
    ],
    resorts: [
      { name: 'Rome Cavalieri, A Waldorf Astoria Hotel', price_per_night: 35000, rating: 4.92, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Monte Mario Hilltop', amenities: ['Panoramic City Skyline Views', '3-Michelin Star La Pergola', 'Grand Spa with 3 Outdoor Pools'] }
    ],
    restaurants: [
      { name: 'Roscioli Salumeria con Cucina', type: 'Legendary Carbonara, Cacio e Pepe & Burrata', rating: 4.9, price: '₹2,800/person', distance: 'Campo de\' Fiori' },
      { name: 'Giolitti Gelateria (Est. 1900)', type: 'Original Artisanal Pistachio & Dark Chocolate Gelato', rating: 4.95, price: '₹450/cone', distance: 'Near Pantheon' }
    ],
    popular_activities: ['Tossing a coin with right hand over left shoulder into Trevi Fountain to guarantee return to Rome', 'Exploring the subterranean gladiatorial chambers under the Colosseum floor', 'Viewing Michelangelo\'s masterpiece ceiling in the Sistine Chapel'],
    local_transport_options: ['Rome Metro & Tram Network', 'Frecciarossa High-Speed Trains', 'Uber & Taxis'],
    nearby_places: [
      { name: 'Pompeii & Amalfi Coast', distance: '220 km (1 hr train)', category: 'Heritage', rating: 5.0, price: 'Train excursion', description: 'Ancient Roman city frozen in volcanic ash and dramatic Mediterranean clifftop villages' }
    ]
  },

  // 11. NEW YORK (USA)
  {
    id: 'new-york',
    name: 'New York City (USA)',
    aliases: ['new-york', 'nyc', 'manhattan', 'times square', 'central park', 'statue of liberty'],
    country: 'United States',
    state: 'New York',
    category: 'City',
    description: 'The Big Apple and cultural capital of the world, famed for Times Square neon, Broadway musicals, Central Park, Empire State Building, and diverse culinary boroughs.',
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    best_season: 'Apr - Jun / Sep - Nov',
    weather_type: 'Temperate Urban Energy',
    weather_info: '20°C Crisp City Air',
    estimated_budget_inr: 195000,
    accommodation_cost_per_night: 22000,
    food_cost_per_day: 4800,
    local_transport_cost: 12000,
    sightseeing_cost: 14000,
    activity_cost: 18000,
    recommended_days: 6,
    budget_level: 'Luxury',
    rating: 4.95,
    review_count: 990,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'John F. Kennedy (JFK) / Newark (EWR) / LaGuardia (LGA)',
    nearest_railway: 'New York Subway (MTA - 24/7 Network) & Grand Central',
    local_language: 'English',
    safety_score: 9.7,
    popularity_score: 100,
    ai_score: 99,
    travel_difficulty: 'Easy',
    highlights: ['Statue of Liberty & Ellis Island Ferry Cruise', 'Empire State Building & Summit One Vanderbilt 360 Observatory', 'Times Square & Broadway Musical Theatre Show', 'Central Park Bicycle Ride & Bethesda Terrace', 'Brooklyn Bridge Sunset Walk & DUMBO Skyline'],
    hotels: [
      { name: 'The Plaza Hotel New York (Fifth Avenue)', price_per_night: 85000, rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Central Park South & 5th Ave', amenities: ['Legendary Beaux-Arts Landmark', 'Guerlain Spa', 'The Palm Court Afternoon Tea', 'White-Glove Butler'] },
      { name: 'The Standard High Line (Meatpacking)', price_per_night: 28000, rating: 4.85, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Meatpacking District', amenities: ['Floor-to-Ceiling Hudson River Views', 'Top of the Standard Rooftop Club', 'The Standard Grill', 'Direct High Line Park Access'] }
    ],
    resorts: [
      { name: 'Equinox Hotel New York (Hudson Yards)', price_per_night: 65000, rating: 4.96, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Hudson Yards', amenities: ['Rooftop Outdoor Heated Sky Pool', 'Next-Gen Wellness Spa with Cryotherapy', 'Electric Lemon Diner'] }
    ],
    restaurants: [
      { name: 'Katz\'s Delicatessen (Est. 1888)', type: 'Legendary Mile-High Hot Pastrami on Rye with Pickles', rating: 4.9, price: '₹2,400/person', distance: 'Lower East Side' },
      { name: 'Joe\'s Pizza Greenwich Village', type: 'Classic NY Foldable Thin-Crust Cheese Pizza Slice', rating: 4.88, price: '₹400/slice', distance: 'Carmine Street' }
    ],
    popular_activities: ['Walking across the historic Brooklyn Bridge at sunset with glowing Manhattan skyline behind', 'Taking in a live Broadway musical show in the Theater District', 'Ice skating in Central Park Wollman Rink or Rockefeller Plaza in winter'],
    local_transport_options: ['NYC Subway (MTA)', 'Yellow Cabs & Uber', 'NYC Ferries on East River'],
    nearby_places: [
      { name: 'Niagara Falls', distance: '1 hr flight / 6 hrs drive', category: 'Nature', rating: 5.0, price: 'Tour pass', description: 'Massive thundering waterfalls on the US-Canada border with Maid of the Mist boat' }
    ]
  },

  // 12. AUSTRALIA (SYDNEY & MELBOURNE)
  {
    id: 'australia',
    name: 'Australia (Sydney & Melbourne)',
    aliases: ['australia', 'sydney', 'melbourne', 'opera house', 'bondi beach', 'great ocean road'],
    country: 'Australia',
    state: 'New South Wales & Victoria',
    category: 'Beach',
    description: 'Vibrant southern continent blending iconic Sydney Opera House and Harbour Bridge, Bondi Beach surf, Melbourne\'s laneway coffee culture, and Great Ocean Road 12 Apostles.',
    image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    best_season: 'Oct - Apr',
    weather_type: 'Sunny Oceanic & Mild',
    weather_info: '24°C Sunny Ocean Breeze',
    estimated_budget_inr: 185000,
    accommodation_cost_per_night: 16000,
    food_cost_per_day: 4200,
    local_transport_cost: 14000,
    sightseeing_cost: 12000,
    activity_cost: 16000,
    recommended_days: 7,
    budget_level: 'Luxury',
    rating: 4.95,
    review_count: 940,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'Sydney Kingsford Smith (SYD) / Melbourne Airport (MEL)',
    nearest_railway: 'Sydney Trains & Melbourne Tram Network (World\'s Largest)',
    local_language: 'English',
    safety_score: 9.9,
    popularity_score: 98,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Sydney Opera House Guided Architecture Tour & Harbour Ferry', 'Sydney Harbour BridgeClimb (134m Above Water)', 'Bondi to Coogee Spectacular Coastal Cliff Walk', 'Great Ocean Road 12 Apostles Helicopter Flight', 'Melbourne Famous Graffiti Laneways & Specialty Flat White Coffee'],
    hotels: [
      { name: 'Park Hyatt Sydney (The Rocks)', price_per_night: 75000, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Direct Water Edge Opposite Opera House', amenities: ['Unobstructed Opera House Balconies', 'Rooftop Heated Pool', 'The Dining Room Fine Dining', 'Private Butler'] },
      { name: 'Crown Towers Melbourne', price_per_night: 26000, rating: 4.9, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Southbank Waterfront', amenities: ['Crown Spa', '25m Indoor Heated Pool', 'Nobu & Rockpool Dining', 'River View Suites'] }
    ],
    resorts: [
      { name: 'Qualia Resort Hamilton Island (Great Barrier Reef)', price_per_night: 85000, rating: 5.0, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Great Barrier Reef Whitsundays', amenities: ['Private Plunge Pool Pavilions', 'Catseye Beach', 'Helicopter Access to Heart Reef', 'Spa Qualia'] }
    ],
    restaurants: [
      { name: 'Quay Restaurant Sydney', type: '3-Hat Fine Dining Overlooking Opera House & Harbour', rating: 4.95, price: '₹16,000/person', distance: 'Overseas Passenger Terminal' },
      { name: 'Lune Croissanterie Melbourne', type: 'World\'s Best Twice-Baked Almond & Traditional Croissants', rating: 4.95, price: '₹850/person', distance: 'Fitzroy Melbourne' }
    ],
    popular_activities: ['Climbing to the top of the Sydney Harbour Bridge for panoramic harbor views', 'Driving along the breathtaking coastal curves of the Great Ocean Road to view the 12 Apostles', 'Surfing and swimming in the saltwater infinity pool at Bondi Icebergs Club'],
    local_transport_options: ['Sydney Ferries & Trains (Opal Card)', 'Melbourne Free City Trams', 'Uber & Rental Cars'],
    nearby_places: [
      { name: 'Blue Mountains & Three Sisters', distance: '90 km from Sydney', category: 'Nature', rating: 4.95, price: 'Train access', description: 'Dramatically sculpted eucalyptus canyons with blue haze and Scenic World railway' }
    ]
  },

  // 13. MALAYSIA (KUALA LUMPUR & PENANG)
  {
    id: 'malaysia',
    name: 'Malaysia (Kuala Lumpur & Penang)',
    aliases: ['malaysia', 'kuala lumpur', 'kl', 'petronas towers', 'batu caves', 'penang'],
    country: 'Malaysia',
    state: 'Federal Territory of KL & Penang',
    category: 'City',
    description: 'Cultural melting pot celebrated for the 452m Petronas Twin Towers, colorful steps of Batu Caves, lush rainforests, Genting Highlands, and Penang UNESCO street food.',
    image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    best_season: 'Dec - Sep',
    weather_type: 'Tropical Warmth',
    weather_info: '28°C Warm Tropical Sunshine',
    estimated_budget_inr: 52000,
    accommodation_cost_per_night: 4200,
    food_cost_per_day: 1400,
    local_transport_cost: 3500,
    sightseeing_cost: 3000,
    activity_cost: 5000,
    recommended_days: 5,
    budget_level: 'Standard',
    rating: 4.88,
    review_count: 870,
    cost_tier: 'Standard',
    is_international: true,
    nearest_airport: 'Kuala Lumpur International Airport (KLIA / KLIA2)',
    nearest_railway: 'KLIA Ekspres (28 mins to center) & RapidKL LRT / MRT',
    local_language: 'Malay, English, Mandarin, Tamil',
    safety_score: 9.8,
    popularity_score: 97,
    ai_score: 96,
    travel_difficulty: 'Easy',
    highlights: ['Petronas Twin Towers Skybridge & Observation Deck', 'Batu Caves 272 Rainbow Steps & 140-ft Golden Lord Murugan', 'Bukit Bintang Shopping & Jalan Alor Night Food Street', 'Genting Highlands Cable Car & Indoor Theme Park', 'George Town Penang UNESCO Street Art & Heritage Food'],
    hotels: [
      { name: 'Mandarin Oriental Kuala Lumpur', price_per_night: 13500, rating: 4.92, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Directly Adjacent to Petronas Twin Towers', amenities: ['Infinity Pool Overlooking KLCC Park', 'The Spa at Mandarin Oriental', 'Lai Po Heen Cantonese Dining'] },
      { name: 'W Kuala Lumpur', price_per_night: 14500, rating: 4.9, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Jalan Ampang KLCC', amenities: ['WET Deck Rooftop Pool with Twin Towers View', 'AWAY Spa', 'YEN Cantonese Dining'] }
    ],
    resorts: [
      { name: 'The Datai Langkawi', price_per_night: 42000, rating: 4.98, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: '10-Million-Year-Old Langkawi Rainforest', amenities: ['Datai Bay Private Beach', 'Canopy Rainforest Villas', 'Naturalist Guided Walks', 'The Datai Spa'] }
    ],
    restaurants: [
      { name: 'Jalan Alor Street Food Stalls (KL)', type: 'BBQ Chicken Wings, Satay Skewers, Chilli Prawns & Durian', rating: 4.8, price: '₹650/person', distance: 'Bukit Bintang' },
      { name: 'Line Clear Nasi Kandar Penang', type: 'Famous Crispy Spiced Fried Chicken with Mixed Rich Curries', rating: 4.85, price: '₹350/person', distance: 'George Town Penang' }
    ],
    popular_activities: ['Climbing the 272 vibrant rainbow steps at Batu Caves past macaque monkeys', 'Walking across the 58m glass-enclosed Skybridge between the two Petronas Towers', 'Eating through open-air sizzling satay and seafood stalls on Jalan Alor'],
    local_transport_options: ['RapidKL MRT / LRT / Monorail', 'Grab Taxis (Extremely Affordable)', 'KLIA Ekspres'],
    nearby_places: [
      { name: 'Genting Highlands & SkyWorlds', distance: '50 km', category: 'Theme Park', rating: 4.8, price: '₹2,500 pass', description: 'Mountain resort city with cool air, cable car, casinos, and outdoor theme park' }
    ]
  },

  // 14. VIETNAM (HANOI & DA NANG)
  {
    id: 'vietnam',
    name: 'Vietnam (Hanoi & Da Nang)',
    aliases: ['vietnam', 'hanoi', 'da nang', 'ha long bay', 'hoi an', 'ba na hills'],
    country: 'Vietnam',
    state: 'Northern & Central Vietnam',
    category: 'Heritage',
    description: 'Emerald natural beauty, limestone karsts of UNESCO Ha Long Bay, lantern-lit streets of ancient Hoi An, Golden Bridge held by giant hands, and legendary Vietnamese pho.',
    image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    best_season: 'Feb - May / Sep - Nov',
    weather_type: 'Pleasant & Mild',
    weather_info: '23°C Pleasant Breeze',
    estimated_budget_inr: 49000,
    accommodation_cost_per_night: 3500,
    food_cost_per_day: 1200,
    local_transport_cost: 3800,
    sightseeing_cost: 3200,
    activity_cost: 5500,
    recommended_days: 6,
    budget_level: 'Budget',
    rating: 4.9,
    review_count: 830,
    cost_tier: 'Budget',
    is_international: true,
    nearest_airport: 'Noi Bai Hanoi (HAN) / Da Nang International (DAD)',
    nearest_railway: 'Reunification Express North-South Railway',
    local_language: 'Vietnamese, English',
    safety_score: 9.85,
    popularity_score: 97,
    ai_score: 97,
    travel_difficulty: 'Easy',
    highlights: ['Ha Long Bay Luxury Overnight Cruise among 1,600 Karst Islands', 'Ba Na Hills Giant Golden Hands Bridge (Da Nang)', 'Hoi An Ancient Town Floating Lanterns & Tailor Shops', 'Hanoi Old Quarter & Train Street Coffee Stalls', 'Hoan Kiem Lake & Water Puppet Theatre'],
    hotels: [
      { name: 'Sofitel Legend Metropole Hanoi (Est. 1901)', price_per_night: 26000, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'French Quarter Hanoi', amenities: ['French Colonial Grand Luxury', 'Le Spa du Metropole', 'Heated Garden Pool', 'Historic Wartime Bunker Tour'] },
      { name: 'InterContinental Danang Sun Peninsula Resort', price_per_night: 38000, rating: 4.98, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Son Tra Peninsula Monkey Mountain', amenities: ['Bill Bensley Clifftop Architecture', 'Private Beach', 'Cable Tram to Sea', 'Michelin Chef Dining La Maison 1888'] }
    ],
    resorts: [
      { name: 'Paradise Elegance Ha Long Bay Cruise', price_per_night: 18500, rating: 4.95, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Ha Long Bay Cruise Port', amenities: ['Private Balcony Sea Cabins', 'Kayaking into Hidden Caves', 'Sunset Squid Fishing', 'Vietnamese Cooking Class'] }
    ],
    restaurants: [
      { name: 'Pho Gia Truyen Bat Dan Hanoi', type: 'Original Authentic Fragrant Beef Pho (Pho Bo) with Fresh Herbs', rating: 4.9, price: '₹220/bowl', distance: 'Old Quarter Hanoi' },
      { name: 'Banh Mi 25 Hanoi', type: 'Crispy Warm Baguette with Pork Pate, Pickled Daikon & Coriander', rating: 4.88, price: '₹120/sandwich', distance: 'Hang Ca St' }
    ],
    popular_activities: ['Cruising on emerald waters through thousands of towering limestone karsts in Ha Long Bay', 'Walking on the Golden Bridge suspended 1,400m high in the clouds held by massive stone hands', 'Releasing candlelit flower lanterns on the Thu Bon River in Hoi An ancient town'],
    local_transport_options: ['Grab Taxis & GrabBikes', 'Comfortable Limousine Tourist Vans', 'Cyclos in Old Quarters'],
    nearby_places: [
      { name: 'Ninh Binh (Tam Coc / Trang An)', distance: '90 km from Hanoi', category: 'Nature', rating: 4.95, price: '₹1,500 tour', description: 'Inland Ha Long Bay with sampan boat rides through river caves and limestone peaks' }
    ]
  },

  // 15. TURKEY (ISTANBUL & CAPPADOCIA)
  {
    id: 'turkey',
    name: 'Turkey (Istanbul & Cappadocia)',
    aliases: ['turkey', 'istanbul', 'cappadocia', 'hagia sophia', 'blue mosque', 'bosphorus', 'hot air balloon'],
    country: 'Turkey',
    state: 'Marmara & Central Anatolia',
    category: 'Heritage',
    description: 'Enchanting bridge between Europe and Asia featuring Hagia Sophia, Blue Mosque, Grand Bazaar, Bosphorus cruises, and fairy-tale hot air balloon sunrises over Cappadocia cave dwellings.',
    image_url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    best_season: 'Apr - Jun / Sep - Nov',
    weather_type: 'Mild Mediterranean & Anatolian',
    weather_info: '20°C Golden Sunshine',
    estimated_budget_inr: 89000,
    accommodation_cost_per_night: 7500,
    food_cost_per_day: 2200,
    local_transport_cost: 6500,
    sightseeing_cost: 6000,
    activity_cost: 14000,
    recommended_days: 6,
    budget_level: 'Premium',
    rating: 4.94,
    review_count: 910,
    cost_tier: 'Premium',
    is_international: true,
    nearest_airport: 'Istanbul Airport (IST) / Nevsehir Cappadocia (NAV) / Kayseri (ASR)',
    nearest_railway: 'Istanbul Metro, T1 Tram & Turkish High-Speed Rail',
    local_language: 'Turkish, English',
    safety_score: 9.75,
    popularity_score: 98,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Cappadocia Sunrise Hot Air Balloon Flight over Fairy Chimneys', 'Hagia Sophia 1,500-Year Grand Dome & Blue Mosque', 'Bosphorus Sunset Yacht Cruise Between Europe & Asia', 'Grand Bazaar 4,000 Shops of Spices, Rugs & Lanterns', 'Topkapi Palace Ottoman Imperial Treasury'],
    hotels: [
      { name: 'Four Seasons Hotel Istanbul at the Bosphorus', price_per_night: 52000, rating: 4.98, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Bosphorus Strait Waterfront', amenities: ['19th-Century Ottoman Palace', 'Heated Outdoor Bosphorus Pool', 'Turkish Hammam Spa', 'Aqua Seafood Restaurant'] },
      { name: 'Museum Hotel Cappadocia (Relais & Châteaux)', price_per_night: 36000, rating: 4.98, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Uchisar Castle Slope', amenities: ['Only Relais & Châteaux in Turkey', 'Heated Cave Infinity Pool with Balloon Views', 'Authentic Cave Suites', 'Lil’a Fine Dining'] }
    ],
    resorts: [
      { name: 'Sultan Cave Suites Cappadocia', price_per_night: 18500, rating: 4.9, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Goreme Valley Center', amenities: ['Famous Rooftop Balloon Photo Terrace', 'Authentic Cave Rooms', 'Seten Anatolian Restaurant', 'Turkish Breakfast Buffet'] }
    ],
    restaurants: [
      { name: 'Hafiz Mustafa 1864 Istanbul', type: 'Fresh Pistachio Baklava, Turkish Delight & Rich Turkish Coffee', rating: 4.95, price: '₹600/person', distance: 'Sultanahmet & Taksim' },
      { name: 'Old Cappadocia Restaurant Goreme', type: 'Clay Pot Pottery Kebab (Testi Kebabi) Broken Open at Table', rating: 4.88, price: '₹950/person', distance: 'Goreme' }
    ],
    popular_activities: ['Floating at sunrise in a hot air balloon over volcanic fairy chimneys with 100 balloons in the sky', 'Sipping Turkish apple tea in the historic corridors of the Grand Bazaar', 'Taking a relaxing traditional Turkish bath and foam massage in a centuries-old marble hammam'],
    local_transport_options: ['Istanbul Metro & T1 Tramway', 'Bosphorus Ferries', 'Domestic Flights to Cappadocia'],
    nearby_places: [
      { name: 'Pamukkale Cotton Castle Thermal Travertines', distance: '1 hr flight / 4 hrs drive', category: 'Nature', rating: 4.95, price: '₹1,200 entry', description: 'Cascading snow-white terraces of mineral-rich turquoise thermal spring pools' }
    ]
  },

  // 16. GREECE (SANTORINI & ATHENS)
  {
    id: 'greece',
    name: 'Greece (Santorini & Athens)',
    aliases: ['greece', 'santorini', 'athens', 'mykonos', 'acropolis', 'oia sunset'],
    country: 'Greece',
    state: 'Attica & South Aegean Cyclades',
    category: 'Island',
    description: 'Cradle of Western Civilization and Aegean island paradise: ancient Acropolis Parthenon in Athens, whitewashed blue-domed cliff villas of Oia, and world\'s most photographed sunsets.',
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    best_season: 'Apr - Oct',
    weather_type: 'Sunny Aegean Mediterranean',
    weather_info: '25°C Crisp Aegean Breeze',
    estimated_budget_inr: 165000,
    accommodation_cost_per_night: 16000,
    food_cost_per_day: 3800,
    local_transport_cost: 11000,
    sightseeing_cost: 9500,
    activity_cost: 14000,
    recommended_days: 6,
    budget_level: 'Luxury',
    rating: 4.96,
    review_count: 960,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'Athens International (ATH) / Santorini Thira (JTR)',
    nearest_railway: 'Blue Star Ferries / SeaJets Catamarans & Athens Metro',
    local_language: 'Greek, English',
    safety_score: 9.8,
    popularity_score: 99,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Oia Blue Domes Sunset over Santorini Caldera', 'Acropolis of Athens & 2,500-Year Parthenon', 'Santorini Sunset Catamaran Sailing Cruise with Volcano Swim', 'Red Beach & Black Sand Kamari Beach', 'Plaka Historic Neighborhood & Rooftop Dining in Athens'],
    hotels: [
      { name: 'Canaves Oia Suites & Luxury Spa Santorini', price_per_night: 68000, rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Oia Cliffside Caldera', amenities: ['Private Infinity Plunge Pools Hanging off Cliff', 'Caldera Sunset Views', 'Canaves Spa in Cave', 'Infinity Pool Bar'] },
      { name: 'Hotel Grande Bretagne Athens (Luxury Collection)', price_per_night: 42000, rating: 4.96, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Syntagma Square Athens', amenities: ['Acropolis Rooftop Restaurant', 'GB Spa with Indoor Pool', 'Historic 1874 Grandeur', 'Butler Service'] }
    ],
    resorts: [
      { name: 'Grace Hotel Santorini, Auberge Resorts Collection', price_per_night: 75000, rating: 5.0, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Imerovigli Clifftop', amenities: ['World’s Most Photographed Clifftop Infinity Pool', 'Varoulko Santorini Michelin Dining', 'Private Plunge Pools'] }
    ],
    restaurants: [
      { name: 'Ammoudi Fish Tavern Santorini', type: 'Fresh Grilled Octopus, Sea Bass & Greek Feta Salad right by water', rating: 4.92, price: '₹3,500/person', distance: 'Ammoudi Bay Oia' },
      { name: 'Kostas Souvlaki Athens (Est. 1950)', type: 'Original Authentic Pork & Beef Souvlaki Pita with Spicy Red Sauce', rating: 4.88, price: '₹400/wrap', distance: 'Syntagma Athens' }
    ],
    popular_activities: ['Catamaran sunset cruise through the volcanic caldera of Santorini with fresh Greek BBQ and wine', 'Walking through the ancient marble ruins of the Parthenon in Athens', 'Wandering through the narrow whitewashed cobbled alleys of Oia during golden hour'],
    local_transport_options: ['SeaJets High-Speed Ferries', 'Santorini Local Buses & Rental ATVs', 'Athens Metro'],
    nearby_places: [
      { name: 'Mykonos Island & Little Venice', distance: '2 hrs high-speed ferry', category: 'Beach', rating: 4.9, price: 'Ferry transfer', description: 'Famous whitewashed windmills, luxury beach clubs, and vibrant party vibe' }
    ]
  },

  // 17. EGYPT (CAIRO & GIZA)
  {
    id: 'egypt',
    name: 'Egypt (Cairo & Giza)',
    aliases: ['egypt', 'cairo', 'giza', 'pyramids', 'sphinx', 'nile river', 'luxor'],
    country: 'Egypt',
    state: 'Cairo Governorate',
    category: 'Heritage',
    description: 'Timeless land of the Pharaohs and 4,500-year-old Great Pyramids of Giza, the mysterious Sphinx, Grand Egyptian Museum treasures of King Tutankhamun, and Nile cruises.',
    image_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    best_season: 'Oct - Apr',
    weather_type: 'Sunny Dry Desert',
    weather_info: '24°C Pleasant Sunshine',
    estimated_budget_inr: 82000,
    accommodation_cost_per_night: 6500,
    food_cost_per_day: 1800,
    local_transport_cost: 5500,
    sightseeing_cost: 8500,
    activity_cost: 9500,
    recommended_days: 5,
    budget_level: 'Standard',
    rating: 4.9,
    review_count: 890,
    cost_tier: 'Standard',
    is_international: true,
    nearest_airport: 'Cairo International Airport (CAI) / Sphinx Airport (SPX)',
    nearest_railway: 'Cairo Metro & Egyptian National Railways (Nile Sleeper Train)',
    local_language: 'Arabic, English',
    safety_score: 9.6,
    popularity_score: 98,
    ai_score: 97,
    travel_difficulty: 'Easy',
    highlights: ['Great Pyramid of Giza (Khufu - Last Standing Wonder) & Sphinx', 'Grand Egyptian Museum (GEM) & King Tutankhamun Gold Mask', 'Nile River Luxury Dinner Cruise with Tanoura Dance', 'Khan el-Khalili 14th-Century Historic Bazaar', 'Saqqara Step Pyramid (World\'s Oldest Stone Structure)'],
    hotels: [
      { name: 'Marriott Mena House Cairo (Direct Pyramid Views)', price_per_night: 28000, rating: 4.96, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'Directly in front of Giza Pyramids', amenities: ['Unobstructed Pyramid Views from Balconies', '139 Pavilion Dining', 'Lush Oasis Gardens', 'Outdoor Pool'] },
      { name: 'Four Seasons Hotel Cairo at Nile Plaza', price_per_night: 24000, rating: 4.92, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'Garden City Nile Waterfront', amenities: ['Panoramic Nile Views', 'Luxury Wellness Spa with Roman Bath', 'Zitouni Egyptian Diner', 'Heated Pool'] }
    ],
    resorts: [
      { name: 'Steigenberger Pyramids Cairo', price_per_night: 11500, rating: 4.75, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Alexandria Desert Road Giza', amenities: ['Pyramid View Pool', 'Lotus Spa', 'Multi-Cuisine Dining'] }
    ],
    restaurants: [
      { name: 'Koshary Abou Tarek Cairo', type: 'World-Famous Egyptian National Dish Koshary with Fried Onions & Spiced Vinegar', rating: 4.9, price: '₹180/bowl', distance: 'Downtown Cairo' },
      { name: 'Naguib Mahfouz Cafe Khan el-Khalili', type: 'Traditional Egyptian Grilled Kebabs, Pigeon & Fresh Mint Tea', rating: 4.8, price: '₹950/person', distance: 'Khan el-Khalili' }
    ],
    popular_activities: ['Riding camels across the golden desert dunes of Giza with all three Great Pyramids in frame', 'Exploring the treasures and golden sarcophagus of King Tutankhamun at the Grand Egyptian Museum', 'Cruising along the Nile on a traditional wooden felucca sailboat at sunset'],
    local_transport_options: ['Uber / Careem (Very convenient)', 'Cairo Metro', 'Guided Tour AC Buses'],
    nearby_places: [
      { name: 'Luxor Valley of the Kings & Karnak Temple', distance: '1 hr flight / Overnight train', category: 'Heritage', rating: 5.0, price: 'Tour pass', description: 'World\'s greatest open-air museum with underground royal tombs of pharaohs' }
    ]
  },

  // 18. SOUTH AFRICA (CAPE TOWN)
  {
    id: 'south-africa',
    name: 'South Africa (Cape Town)',
    aliases: ['south-africa', 'cape town', 'table mountain', 'cape of good hope', 'boulders beach'],
    country: 'South Africa',
    state: 'Western Cape',
    category: 'Nature',
    description: 'One of the world\'s most stunning coastal cities where Table Mountain meets two oceans: African penguin colonies at Boulders Beach, Cape Point, and Cape Winelands.',
    image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    best_season: 'Nov - Apr',
    weather_type: 'Sunny Mediterranean Coastal',
    weather_info: '24°C Refreshing Ocean Air',
    estimated_budget_inr: 145000,
    accommodation_cost_per_night: 14000,
    food_cost_per_day: 3500,
    local_transport_cost: 11000,
    sightseeing_cost: 9500,
    activity_cost: 14000,
    recommended_days: 6,
    budget_level: 'Luxury',
    rating: 4.95,
    review_count: 920,
    cost_tier: 'Luxury',
    is_international: true,
    nearest_airport: 'Cape Town International Airport (CPT)',
    nearest_railway: 'MyCiTi Bus Rapid Network & Metrorail',
    local_language: 'English, Afrikaans, isiXhosa',
    safety_score: 9.7,
    popularity_score: 98,
    ai_score: 98,
    travel_difficulty: 'Easy',
    highlights: ['Table Mountain 360-Degree Revolving Cable Car to 1,085m Summit', 'Boulders Beach African Penguin Colony Walk', 'Cape Point & Cape of Good Hope Oceanic Dramatic Cliffs', 'V&A Waterfront Shopping, Dining & Robben Island Ferry', 'Stellenbosch & Franschhoek Cape Winelands Tram Tour'],
    hotels: [
      { name: 'The Silo Hotel Cape Town (V&A Waterfront)', price_per_night: 75000, rating: 5.0, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', distance: 'V&A Waterfront Grain Silo', amenities: ['Pillow-Faceted Geometric Glass Windows', 'Rooftop Infinity Sky Pool', 'The Silo Spa', 'Above Zeitz MOCAA Museum'] },
      { name: 'One&Only Cape Town', price_per_night: 58000, rating: 4.96, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', distance: 'V&A Waterfront Marina', amenities: ['Private Island Suites', 'Table Mountain Views', 'Nobu Cape Town Dining', 'One&Only Spa'] }
    ],
    resorts: [
      { name: 'The Twelve Apostles Hotel and Spa', price_per_night: 32000, rating: 4.94, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', distance: 'Victoria Road Camps Bay Edge', amenities: ['Flanked by 12 Apostles Peaks & Atlantic Ocean', 'Award-Winning Rock Spa', 'Helipad', 'Sunset Leopard Bar'] }
    ],
    restaurants: [
      { name: 'The Test Kitchen / Pot Luck Club', type: 'Global Tapas with 360-degree views of Table Mountain', rating: 4.95, price: '₹4,500/person', distance: 'Old Biscuit Mill Woodstock' },
      { name: 'Codfather Seafood & Sushi Camps Bay', type: 'Fresh Catch Kingklip, Crayfish & Langoustines', rating: 4.88, price: '₹2,600/person', distance: 'Camps Bay' }
    ],
    popular_activities: ['Walking amongst wild African penguins on the white sands and granite boulders of Boulders Beach', 'Riding the rotating cable car to the flat summit of Table Mountain at sunset', 'Driving along Chapman\'s Peak Drive, one of the world\'s most spectacular marine cliff roads'],
    local_transport_options: ['Uber (Extremely widely used & safe)', 'MyCiTi Buses', 'Hop-On Hop-Off City Sightseeing Buses'],
    nearby_places: [
      { name: 'Kruger National Park Big 5 Safari', distance: '2 hrs flight', category: 'Adventure', rating: 5.0, price: 'Safari pass', description: 'World-famous game reserve with lions, leopards, rhinos, elephants, and buffalos' }
    ]
  }

  ,{
    id: 'south_korea',
    name: 'South Korea',
    aliases: ['seoul', 'busan', 'jeju'],
    country: 'South Korea',
    state: '',
    category: 'Culture',
    description: 'A vibrant country offering a mix of modern cities like Seoul and beautiful landscapes.',
    image_url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
    best_season: 'Sep - Nov',
    weather_type: 'Temperate',
    weather_info: '20°C Pleasant',
    estimated_budget_inr: 85000,
    accommodation_cost_per_night: 6000,
    food_cost_per_day: 2000,
    local_transport_cost: 1500,
    sightseeing_cost: 2000,
    activity_cost: 3000,
    recommended_days: 6,
    budget_level: 'Premium',
    rating: 4.8,
    review_count: 950,
    cost_tier: 'Premium',
    is_international: true,
    nearest_airport: 'Incheon International Airport (ICN)',
    nearest_railway: 'Seoul Station',
    local_language: 'Korean',
    safety_score: 9.5,
    popularity_score: 92,
    ai_score: 95,
    travel_difficulty: 'Easy',
    highlights: ['Gyeongbokgung Palace', 'Nami Island', 'Jeju Island', 'Myeongdong Shopping'],
    hotels: [
      { name: 'Signiel Seoul', price_per_night: 15000, rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', distance: 'City Center', amenities: ['Spa', 'Pool', 'Fine Dining'] },
      { name: 'Lotte Hotel Seoul', price_per_night: 10000, rating: 4.7, image: 'https://images.unsplash.com/photo-1542314831-c6a4d1409e5c?w=600', distance: 'City Center', amenities: ['Gym', 'Restaurant'] },
      { name: 'Ibis Myeongdong', price_per_night: 6000, rating: 4.3, image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=600', distance: 'Shopping District', amenities: ['WiFi', 'Breakfast'] }
    ]
  },
  {
    id: 'sri_lanka',
    name: 'Sri Lanka',
    aliases: ['colombo', 'kandy', 'galle'],
    country: 'Sri Lanka',
    state: '',
    category: 'Nature',
    description: 'An island nation rich in wildlife, beaches, and ancient ruins.',
    image_url: 'https://images.unsplash.com/photo-1537255152778-011e48e0293d?w=800',
    best_season: 'Dec - Mar',
    weather_type: 'Tropical',
    weather_info: '27°C Warm',
    estimated_budget_inr: 45000,
    accommodation_cost_per_night: 4000,
    food_cost_per_day: 1200,
    local_transport_cost: 1000,
    sightseeing_cost: 1500,
    activity_cost: 2000,
    recommended_days: 5,
    budget_level: 'Standard',
    rating: 4.6,
    review_count: 520,
    cost_tier: 'Standard',
    is_international: true,
    nearest_airport: 'Bandaranaike International Airport (CMB)',
    nearest_railway: 'Colombo Fort',
    local_language: 'Sinhala, Tamil',
    safety_score: 8.5,
    popularity_score: 87,
    ai_score: 89,
    travel_difficulty: 'Moderate',
    highlights: ['Sigiriya Rock', 'Temple of the Tooth', 'Yala National Park', 'Galle Fort'],
    hotels: [
      { name: 'Cinnamon Grand Colombo', price_per_night: 8000, rating: 4.8, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', distance: 'City Center', amenities: ['Pool', 'Spa'] },
      { name: 'Shangri-La Colombo', price_per_night: 12000, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-c6a4d1409e5c?w=600', distance: 'Beachfront', amenities: ['Pool', 'Gym'] },
      { name: 'Marino Beach', price_per_night: 5000, rating: 4.5, image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=600', distance: 'Marine Drive', amenities: ['Rooftop Pool', 'WiFi'] }
    ]
  },
  {
    id: 'nepal',
    name: 'Nepal',
    aliases: ['kathmandu', 'pokhara'],
    country: 'Nepal',
    state: '',
    category: 'Adventure',
    description: 'Home to the Himalayas, offering epic trekking and spiritual temples.',
    image_url: 'https://images.unsplash.com/photo-1534065476313-09419b4fcb5a?w=800',
    best_season: 'Oct - Dec',
    weather_type: 'Mountain',
    weather_info: '15°C Cool',
    estimated_budget_inr: 30000,
    accommodation_cost_per_night: 2500,
    food_cost_per_day: 800,
    local_transport_cost: 600,
    sightseeing_cost: 1000,
    activity_cost: 2000,
    recommended_days: 6,
    budget_level: 'Budget',
    rating: 4.7,
    review_count: 630,
    cost_tier: 'Budget',
    is_international: true,
    nearest_airport: 'Tribhuvan International Airport (KTM)',
    nearest_railway: '',
    local_language: 'Nepali',
    safety_score: 9.0,
    popularity_score: 88,
    ai_score: 90,
    travel_difficulty: 'Moderate',
    highlights: ['Everest Base Camp Trek', 'Pashupatinath Temple', 'Phewa Lake', 'Swayambhunath'],
    hotels: [
      { name: 'Kathmandu Marriott', price_per_night: 10000, rating: 4.8, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', distance: 'City Center', amenities: ['Pool', 'Spa'] },
      { name: 'Hotel Yak & Yeti', price_per_night: 7000, rating: 4.6, image: 'https://images.unsplash.com/photo-1542314831-c6a4d1409e5c?w=600', distance: 'Durbar Marg', amenities: ['Heritage', 'WiFi'] },
      { name: 'Thamel Boutique Hotel', price_per_night: 3000, rating: 4.4, image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=600', distance: 'Thamel', amenities: ['Restaurant', 'WiFi'] }
    ]
  },
  {
    id: 'bhutan',
    name: 'Bhutan',
    aliases: ['thimphu', 'paro'],
    country: 'Bhutan',
    state: '',
    category: 'Culture',
    description: 'A Buddhist kingdom on the Himalayas eastern edge, known for monasteries and fortresses.',
    image_url: 'https://images.unsplash.com/photo-1596700778854-3c81fb31fbf5?w=800',
    best_season: 'Oct - Dec',
    weather_type: 'Mountain',
    weather_info: '12°C Cool',
    estimated_budget_inr: 55000,
    accommodation_cost_per_night: 5000,
    food_cost_per_day: 1500,
    local_transport_cost: 1200,
    sightseeing_cost: 2000,
    activity_cost: 1500,
    recommended_days: 5,
    budget_level: 'Premium',
    rating: 4.8,
    review_count: 310,
    cost_tier: 'Premium',
    is_international: true,
    nearest_airport: 'Paro International Airport (PBH)',
    nearest_railway: '',
    local_language: 'Dzongkha',
    safety_score: 9.8,
    popularity_score: 84,
    ai_score: 92,
    travel_difficulty: 'Moderate',
    highlights: ['Tiger Nest Monastery', 'Punakha Dzong', 'Buddha Dordenma', 'Dochula Pass'],
    hotels: [
      { name: 'Taj Tashi Thimphu', price_per_night: 18000, rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', distance: 'City Center', amenities: ['Spa', 'Luxury Dining'] },
      { name: 'Le Meridien Paro', price_per_night: 15000, rating: 4.8, image: 'https://images.unsplash.com/photo-1542314831-c6a4d1409e5c?w=600', distance: 'Riverfront', amenities: ['Pool', 'Spa'] },
      { name: 'Hotel Druk', price_per_night: 7000, rating: 4.5, image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=600', distance: 'Central', amenities: ['Restaurant', 'WiFi'] }
    ]
  }

];
