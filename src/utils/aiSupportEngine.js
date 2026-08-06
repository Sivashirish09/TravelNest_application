// =========================================================================
// TRAVELNEST AI CUSTOMER SUPPORT TRAVEL INTELLIGENCE ENGINE
// Comprehensive Natural Language Travel Assistant
// =========================================================================

import { SEED_DESTINATIONS, findCanonicalDestination } from '../data/destinations';

export const SUPPORT_CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'booking', label: 'Trip & Hotel Booking' },
  { id: 'itinerary', label: 'AI Itinerary Planner' },
  { id: 'budget', label: 'Budget & Cost Guidance' },
  { id: 'recommendations', label: 'Destination Ideas' },
  { id: 'weather', label: 'Weather & Best Seasons' },
  { id: 'transport', label: 'Flights & Transport' },
  { id: 'cancellation', label: 'Refunds & Cancellation' }
];

export const QUICK_PROMPTS = [
  'Best time to visit Leh Ladakh and budget?',
  'Suggest top luxury resorts in Maldives',
  'How do I cancel my trip and get a full refund?',
  'Top attractions and hotels in Goa',
  'How does the AI itinerary generator work?',
  'Flight guidance and nearest airport for Ooty'
];

export const processSupportQuery = (userQuery, conversationHistory = []) => {
  const q = userQuery.toLowerCase().trim();

  // 1. Identify if a specific destination is mentioned
  const destination = findCanonicalDestination(q);

  // 2. Intent Detection
  const isRefundOrCancel = q.includes('cancel') || q.includes('refund') || q.includes('cancellation') || q.includes('policy');
  const isTicketOrQR = q.includes('ticket') || q.includes('qr') || q.includes('pass') || q.includes('barcode') || q.includes('voucher');
  const isHotelOrResort = q.includes('hotel') || q.includes('resort') || q.includes('stay') || q.includes('villa') || q.includes('room') || q.includes('accommodation');
  const isBudgetOrCost = q.includes('budget') || q.includes('cost') || q.includes('price') || q.includes('expense') || q.includes('how much') || q.includes('cheap') || q.includes('luxury');
  const isWeatherOrSeason = q.includes('weather') || q.includes('season') || q.includes('climate') || q.includes('temperature') || q.includes('when to visit') || q.includes('best time') || q.includes('rain') || q.includes('winter') || q.includes('summer');
  const isTransportOrFlight = q.includes('transport') || q.includes('flight') || q.includes('train') || q.includes('airport') || q.includes('railway') || q.includes('how to reach') || q.includes('cab') || q.includes('drive');
  const isAttractionOrSightseeing = q.includes('attraction') || q.includes('sightseeing') || q.includes('places to see') || q.includes('visit') || q.includes('highlights') || q.includes('things to do') || q.includes('activities');
  const isItinerary = q.includes('itinerary') || q.includes('plan') || q.includes('ai plan') || q.includes('generator') || q.includes('day 1') || q.includes('schedule');
  const isBookingHelp = q.includes('how to book') || q.includes('book trip') || q.includes('booking process') || q.includes('reservation');

  // Specific Destination Context
  if (destination) {
    if (isHotelOrResort) {
      const hotelsList = destination.hotels?.map(h => `• **${h.name}** (₹${h.price_per_night?.toLocaleString()}/night, ⭐ ${h.rating}) — ${h.amenities?.slice(0, 2).join(', ')}`).join('\n') || 'Top rated luxury boutique stays available.';
      const resortsList = destination.resorts?.map(r => `• **${r.name}** (₹${r.price_per_night?.toLocaleString()}/night, ⭐ ${r.rating}) — ${r.amenities?.slice(0, 2).join(', ')}`).join('\n') || 'Scenic eco-resorts available.';

      return {
        reply: `Here are the premier verified hotels & resorts in **${destination.name} (${destination.state || destination.country})**:\n\n**Hotels:**\n${hotelsList}\n\n**Luxury & Boutique Resorts:**\n${resortsList}\n\n💡 *Tip: You can book these instantly from the "Explore Destinations" or "AI Trip Planner" tabs with instant QR confirmation!*`,
        relatedDestination: destination,
        actionType: 'BOOKING_LINK'
      };
    }

    if (isWeatherOrSeason) {
      return {
        reply: `☀️ **Weather & Best Season for ${destination.name}:**\n\n• **Best Season to Visit:** ${destination.best_season}\n• **Current Weather Type:** ${destination.weather_type}\n• **Typical Climate:** ${destination.weather_info}\n• **Ideal Trip Duration:** ${destination.recommended_days} Days\n\n💡 *Travel Advisory: Pack light breathable cottons for coastal destinations or thermals and windcheaters for high-altitude mountain locations like ${destination.name}.*`,
        relatedDestination: destination,
        actionType: 'WEATHER_INFO'
      };
    }

    if (isBudgetOrCost) {
      return {
        reply: `💰 **Realistic Budget Breakdown for ${destination.name} (${destination.recommended_days} Days / Person):**\n\n• **Estimated Total Budget:** ₹${destination.estimated_budget_inr?.toLocaleString()} (${destination.budget_level} Tier)\n• **Stay / Accommodation:** ~₹${destination.accommodation_cost_per_night?.toLocaleString()} per night\n• **Daily Meals & Food:** ~₹${destination.food_cost_per_day?.toLocaleString()} per day\n• **Sightseeing & Entry Passes:** ~₹${destination.sightseeing_cost?.toLocaleString()}\n• **Activities & Excursions:** ~₹${destination.activity_cost?.toLocaleString()}\n• **Local Transit:** ~₹${destination.local_transport_cost?.toLocaleString()}\n\n💡 *TravelNest lets you customize your budget tier (Weekend, Budget, Standard, Premium, Luxury) to match your spending preference!*`,
        relatedDestination: destination,
        actionType: 'BUDGET_CALC'
      };
    }

    if (isTransportOrFlight) {
      return {
        reply: `✈️ **How to Reach & Transport for ${destination.name}:**\n\n• **Nearest Airport:** ${destination.nearest_airport || 'Major International / Domestic Airport'}\n• **Nearest Railway Station:** ${destination.nearest_railway || 'Major Railway Terminal'}\n• **Local Transport:** ${(destination.local_transport_options || ['Taxis / Cabs', 'Rental Scooters / Cars', 'Public Transit']).join(', ')}\n• **Local Languages:** ${destination.local_language || 'English, Local Language'}\n• **Safety Rating:** ⭐ ${destination.safety_score || 9.8} / 10\n\n💡 *All TravelNest itineraries include optimal transit routes and local ride-hailing suggestions.*`,
        relatedDestination: destination,
        actionType: 'TRANSPORT_INFO'
      };
    }

    if (isAttractionOrSightseeing) {
      const spots = destination.highlights?.map((h, i) => `${i + 1}. **${h}**`).join('\n') || 'Historic landmarks and natural wonders.';
      const nearby = destination.nearby_places?.map(p => `• **${p.name}** (${p.distance}) — ${p.description}`).join('\n') || '';

      return {
        reply: `🌟 **Top Attractions & Sightseeing in ${destination.name}:**\n\n${spots}\n\n${nearby ? `**Nearby Excursions & Day Trips:**\n${nearby}\n\n` : ''}💡 *Our AI Trip Planner automatically sequences these attractions by geographic proximity to save you travel time.*`,
        relatedDestination: destination,
        actionType: 'ATTRACTIONS'
      };
    }

    // Default detailed overview for the mentioned destination
    return {
      reply: `✨ **Destination Guide: ${destination.name} (${destination.state || destination.country})**\n\n${destination.description}\n\n• **Best Season:** ${destination.best_season}\n• **Estimated Budget:** ₹${destination.estimated_budget_inr?.toLocaleString()} (${destination.recommended_days} Days, ${destination.budget_level})\n• **Key Highlights:** ${destination.highlights?.slice(0, 3).join(', ')}\n• **Nearest Airport:** ${destination.nearest_airport}\n• **Safety Score:** ⭐ ${destination.safety_score}/10\n\nWould you like me to show you nearby hotels, weather updates, or generate an AI itinerary for ${destination.name}?`,
      relatedDestination: destination,
      actionType: 'DESTINATION_OVERVIEW'
    };
  }

  // Generic Intent Matching
  if (isRefundOrCancel) {
    return {
      reply: `🛡️ **TravelNest 100% Refund & Cancellation Policy:**\n\n1. **Zero Cancellation Fee:** Free cancellation is supported for trips cancelled at least 24 hours prior to check-in.\n2. **How to Cancel:** Navigate to **"My Trips"** in the sidebar, locate your booking card, and click the red **"Cancel Booking"** button.\n3. **Instant Status Tracking:** Cancelled bookings immediately move to the **"Cancelled Trips"** tab for clear tracking.\n4. **Refund Timeline:** 100% of the booking amount is automatically refunded to your original payment method within **2 to 3 business days**.\n5. **Audit Trail:** A cancellation & refund receipt notification is permanently saved to your Notifications inbox.`,
      actionType: 'POLICY'
    };
  }

  if (isTicketOrQR) {
    return {
      reply: `🎟️ **Digital QR Ticket & Boarding Pass Guide:**\n\n• Every confirmed booking receives a unique **TravelNest Reference (TN-REF-XXXXXX)** and a high-resolution **QR Pass**.\n• Go to **"My Trips"** -> click **"View Details"** or **"Download Ticket"**.\n• You can show the digital QR code directly from your smartphone at hotel check-in desks and excursion boarding gates.\n• Works offline after your trip is saved!`,
      actionType: 'TICKET_INFO'
    };
  }

  if (isItinerary) {
    return {
      reply: `🤖 **How the TravelNest AI Trip Planner Works:**\n\n1. **Enter Details:** Select your starting city (e.g. Hyderabad, Mumbai, Delhi) and your dream destination.\n2. **Customize Preferences:** Choose your trip duration, travel dates, companion group (Solo, Couple, Family, Friends), and interest tags (Beaches, Heritage, Adventure, Nightlife).\n3. **Select Budget Tier:** Choose from *Weekend (₹5k-₹15k)*, *Budget (₹15k-₹35k)*, *Standard (₹35k-₹75k)*, *Premium (₹75k-₹1.5L)*, or *Luxury (₹1.5L+)*.\n4. **One-Click Generation:** Our AI crafts a comprehensive day-by-day itinerary with morning, afternoon, and evening activities, verified hotels, nearby restaurants, and transit options!\n5. **Instant Booking:** Confirm the complete itinerary in one click with secure digital invoicing.`,
      actionType: 'ITINERARY_GUIDE'
    };
  }

  if (isBookingHelp) {
    return {
      reply: `📦 **Step-by-Step Trip & Hotel Booking Guide:**\n\n1. Go to **"Explore"** or **"Plan Trip"** in the navigation menu.\n2. Browse domestic destinations across 36 Indian States & UTs, or International hubs (Maldives, Bali, Dubai, Switzerland, Japan, etc.).\n3. Click on any destination to view verified hotels, luxury resorts, local activities, and cost estimates.\n4. Click **"Book Trip Now"**, choose your preferred stay option, verify traveler details, and select your payment method (UPI, GPay, Credit/Debit Card).\n5. Your booking is confirmed instantly with real-time Firestore persistence and notification alerts!`,
      actionType: 'BOOKING_GUIDE'
    };
  }

  if (isBudgetOrCost) {
    return {
      reply: `📊 **TravelNest Dynamic Budget Tiers & Price Guidance:**\n\nWe provide 5 realistic, transparent cost tiers based on real-world Indian and international travel data:\n\n• 🎒 **Weekend Getaway (₹5,000 – ₹15,000):** Perfect for 2-3 day escapes (Pondicherry, Mahabalipuram, Lonavala, Coorg).\n• 🌿 **Budget Explorer (₹15,000 – ₹35,000):** 4-5 days with quality boutique hotels and local dining (Goa, Hampi, Varanasi, Ooty).\n• 🌟 **Standard Vacation (₹35,000 – ₹75,000):** 5-7 days with 4-star stays, guided tours, and comfortable flights (Kashmir, Kerala, Bali, Thailand).\n• 💎 **Premium Holiday (₹75,000 – ₹1,50,000):** 5-star heritage palaces and private cabs (Dubai, Singapore, Leh Ladakh, Udaipur).\n• 👑 **Ultra Luxury (₹1,50,000+):** Overwater villas, private charters, and Michelin gastronomy (Maldives, Switzerland, Paris, Aman Tokyo).\n\nAsk me about the budget for any specific destination (e.g., *"Budget for Maldives"* or *"Cost of 4 days in Goa"*).`,
      actionType: 'BUDGET_OVERVIEW'
    };
  }

  if (isWeatherOrSeason) {
    return {
      reply: `⛅ **Seasonal Travel Calendar & Weather Guide:**\n\n• **Winter & Pleasant Months (Oct – Mar):** Best for Goa beaches, Rajasthan heritage palaces (Jaipur, Udaipur), Kerala backwaters, Dubai, and the Maldives.\n• **Summer Mountain Escapes (Apr – Jun):** Best for Himachal (Manali, Shimla), Uttarakhand (Rishikesh, Nainital), Ladakh, Kashmir, and Swiss Alps.\n• **Monsoon Magic (Jul – Sep):** Breathtaking greenery in Western Ghats, Munnar tea hills, Meghalaya waterfalls, and Coorg coffee estates.\n• **Autumn Serenity (Sep – Nov):** Ideal for Japan foliage, French Riviera, Bali, and Sikkim.\n\nTell me which destination you'd like weather predictions for!`,
      actionType: 'WEATHER_CALENDAR'
    };
  }

  if (isTransportOrFlight) {
    return {
      reply: `🛫 **Flight & Transport Guidance:**\n\n• TravelNest provides nearest airport IATA codes, railway junction details, and road transit routes for every destination in our database.\n• For major international destinations (Dubai DXB, Maldives MLE, Bali DPS, Singapore SIN, Zurich ZRH), direct flights operate daily from Delhi (DEL), Mumbai (BOM), Hyderabad (HYD), and Bengaluru (BLR).\n• For hill stations (Ooty, Munnar, Leh), our app recommends connected airport hubs and scenic mountain cab transfers.`,
      actionType: 'TRANSPORT_OVERVIEW'
    };
  }

  // Fallback intelligent response
  return {
    reply: `👋 Hello! I am your **TravelNest AI Travel Support Assistant**.\n\nI can help you with:\n• ✈️ **Trip & Hotel Bookings** (36 Indian States/UTs + Global Destinations)\n• 💰 **Realistic Budget Planning** (Weekend to Ultra-Luxury breakdowns)\n• ⛅ **Weather & Best Travel Seasons** (Real-time climate guidance)\n• 🌟 **Top Attractions & Nearby Resorts** (Handpicked local highlights)\n• 🛡️ **Zero-Fee Cancellation & 100% Refunds** (Instant policy help)\n• 🎟️ **Digital QR Tickets & Invoices**\n\nTry asking: *"What is the best time to visit Leh Ladakh?"*, *"Show luxury resorts in Maldives"*, or *"How do I cancel my trip?"*`,
    actionType: 'GENERAL_ASSIST'
  };
};
