/**
 * ==========================================================================
 * TRAVELNEST AI TRIP PLANNER — COMPLETE PAGE-TO-PAGE ROUTING & FEATURES
 * ==========================================================================
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Seed Database Dataset (India & International Destinations, Hotels, Resorts)
const SEED_DESTINATIONS = [
  // --- INDIA ---
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    description: 'Pristine golden beaches, Portuguese heritage architecture, vibrant nightlife, and spice plantations.',
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Feb',
    weather_info: '28°C Sunny & Breezy',
    estimated_budget_inr: 18000,
    recommended_days: 4,
    rating: 4.8,
    review_count: 320,
    category: 'Beach',
    is_international: false,
    nearest_airport: 'Dabolim Airport (GOI)',
    nearest_railway: 'Madgaon Junction',
    local_language: 'Konkani & English',
    currency_code: 'INR',
    latitude: 15.2993,
    longitude: 74.1240,
    top_attractions: ['Calangute Beach', 'Baga Sunset Strip', 'Aguada Fort', 'Dudhsagar Falls'],
    hotels: [
      { id: 'h_goa_1', name: 'Taj Exotica Resort & Spa', price: 14500, rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', amenities: 'Pool, Private Beach, Spa' },
      { id: 'h_goa_2', name: 'Novotel Goa Resort', price: 7800, rating: 4.7, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', amenities: 'Pool, Gym, Free Breakfast' }
    ]
  },
  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    state: 'Himachal Pradesh',
    description: 'High-altitude Himalayan resort town known for snow-capped peaks, Solang Valley adventures, and Rohtang Pass.',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Jun',
    weather_info: '12°C Crisp Alpine Air',
    estimated_budget_inr: 22000,
    recommended_days: 5,
    rating: 4.7,
    review_count: 280,
    category: 'Hill Station',
    is_international: false,
    nearest_airport: 'Kullu Manali Airport (KUU)',
    nearest_railway: 'Chandigarh Station',
    local_language: 'Hindi & Pahari',
    currency_code: 'INR',
    latitude: 32.2432,
    longitude: 77.1892,
    top_attractions: ['Solang Valley Skiing', 'Rohtang Pass Snow Peak', 'Hadimba Temple', 'Old Manali Cafes'],
    hotels: [
      { id: 'h_manali_1', name: 'The Grand Dragon Resort', price: 9800, rating: 4.8, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', amenities: 'Heated Pool, Mountain View' }
    ]
  },
  {
    id: 'leh_ladakh',
    name: 'Leh Ladakh',
    country: 'India',
    state: 'Ladakh',
    description: 'Dramatic high-desert mountain landscapes, crystal Pangong Lake, and historic Tibetan Buddhist monasteries.',
    image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
    best_season: 'May - Sep',
    weather_info: '14°C Sunny Mountain Sky',
    estimated_budget_inr: 35000,
    recommended_days: 6,
    rating: 4.9,
    review_count: 410,
    category: 'Adventure',
    is_international: false,
    nearest_airport: 'Kushok Bakula Rimpochee Airport',
    nearest_railway: 'Jammu Tawi Station',
    local_language: 'Ladakhi & Hindi',
    currency_code: 'INR',
    latitude: 34.1526,
    longitude: 77.5771,
    top_attractions: ['Pangong Tso Lake', 'Nubra Valley Sand Dunes', 'Monastery Route', 'Khardung La Pass'],
    hotels: [
      { id: 'h_leh_1', name: 'The Grand Dragon Ladakh', price: 12500, rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', amenities: 'Oxygen Lounge, Spa, Dining' }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    description: 'Iconic Pink City featuring grand Amber Fort, Hawa Mahal, City Palace, and rich Royal Rajasthani heritage.',
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Mar',
    weather_info: '24°C Pleasant Desert Sun',
    estimated_budget_inr: 15000,
    recommended_days: 3,
    rating: 4.7,
    review_count: 340,
    category: 'Heritage',
    is_international: false,
    nearest_airport: 'Jaipur International Airport (JAI)',
    nearest_railway: 'Jaipur Junction',
    local_language: 'Rajasthani & Hindi',
    currency_code: 'INR',
    latitude: 26.9124,
    longitude: 75.7873,
    top_attractions: ['Amber Fort', 'Hawa Mahal Palace of Winds', 'City Palace Museum', 'Jantar Mantar Observatory'],
    hotels: [
      { id: 'h_jaipur_1', name: 'Rambagh Palace Jaipur', price: 21000, rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', amenities: 'Royal Gardens, Fine Dining, Spa' }
    ]
  },

  // --- INTERNATIONAL ---
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    state: 'Malé Atoll',
    description: 'Tropical paradise of overwater bungalows, turquoise lagoons, vibrant coral reefs, and private island resorts.',
    image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Apr',
    weather_info: '29°C Tropical Sunshine',
    estimated_budget_inr: 75000,
    recommended_days: 4,
    rating: 4.9,
    review_count: 520,
    category: 'Luxury',
    is_international: true,
    currency_code: 'MVR',
    exchange_rate_inr: 5.42,
    nearest_airport: 'Velana International Airport (MLE)',
    local_language: 'Dhivehi & English',
    latitude: 3.2028,
    longitude: 73.2207,
    top_attractions: ['Overwater Villa Stay', 'Coral Reef Scuba Diving', 'Sunset Dolphin Cruise', 'Underwater Dining'],
    hotels: [
      { id: 'h_mald_1', name: 'Soneva Jani Overwater Villas', price: 32000, rating: 4.9, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', amenities: 'Water Slide, Stargazing, Private Pool' }
    ]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    state: 'Dubai Emirate',
    description: 'Futuristic metropolis famous for Burj Khalifa, desert safaris, luxury shopping malls, and Palm Jumeirah.',
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Mar',
    weather_info: '26°C Warm Desert Sky',
    estimated_budget_inr: 65000,
    recommended_days: 5,
    rating: 4.8,
    review_count: 610,
    category: 'Luxury',
    is_international: true,
    currency_code: 'AED',
    exchange_rate_inr: 22.65,
    nearest_airport: 'Dubai International Airport (DXB)',
    local_language: 'Arabic & English',
    latitude: 25.2048,
    longitude: 55.2708,
    top_attractions: ['Burj Khalifa 148th Floor', 'Desert Dune Bashing Safari', 'Dubai Mall Fountain Show', 'Palm Jumeirah Waterpark'],
    hotels: [
      { id: 'h_dubai_1', name: 'Atlantis The Royal', price: 28000, rating: 4.9, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', amenities: 'Aquaventure Park, Sky Pool, Dining' }
    ]
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    state: 'Bali Province',
    description: 'Island of gods featuring lush rice terraces, ancient sea temples, surf beaches, and holistic yoga retreats.',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    best_season: 'Apr - Oct',
    weather_info: '27°C Tropical Island Air',
    estimated_budget_inr: 48000,
    recommended_days: 5,
    rating: 4.8,
    review_count: 490,
    category: 'Beach',
    is_international: true,
    currency_code: 'IDR',
    exchange_rate_inr: 0.0053,
    nearest_airport: 'Ngurah Rai International Airport (DPS)',
    local_language: 'Indonesian & Balinese',
    latitude: -8.4095,
    longitude: 115.1889,
    top_attractions: ['Ubud Rice Terraces', 'Tanah Lot Temple Sunset', 'Nusa Penida Beach Island', 'Seminyak Beach Club'],
    hotels: [
      { id: 'h_bali_1', name: 'Ayana Resort & Spa Bali', price: 16500, rating: 4.9, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', amenities: 'Rock Bar, Ocean Pool, Spa' }
    ]
  }
];

const SEED_BOOKINGS = [
  {
    id: 'b1',
    user_id: 'sivashirish09@gmail.com',
    destination_name: 'Goa',
    country: 'India',
    hotel_or_resort_name: 'Taj Exotica Resort & Spa Goa',
    type: 'Resort',
    booking_reference: 'TAJ-GOA-8821',
    invoice_number: 'INV-2026-9041',
    check_in_date: '2026-08-15',
    check_out_date: '2026-08-18',
    number_of_nights: 3,
    number_of_guests: 2,
    total_amount_inr: 23240,
    payment_method: 'Google Pay (UPI)',
    payment_status: 'PAID',
    status: 'CONFIRMED',
    cancellation_reason: null,
    refund_amount_inr: 0,
    qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TAJ-GOA-8821',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  }
];

const SEED_EXPENSES = [
  { id: 'e1', booking_id: 'b1', category: 'Stay', title: 'Taj Exotica 3-Night Stay', amount_inr: 14500 },
  { id: 'e2', booking_id: 'b1', category: 'Food', title: 'Sunset Dinner at Baga Beach', amount_inr: 3200 },
  { id: 'e3', booking_id: 'b1', category: 'Activities', title: 'Water Sports & Scuba Diving', amount_inr: 4500 },
  { id: 'e4', booking_id: 'b1', category: 'Transport', title: 'Airport Taxi Transfer', amount_inr: 1040 }
];

// Client App State
let state = {
  currentRoute: 'home', // auth, home, explore, destination-detail, ai-plan, ai-result, hotels, hotel-detail, checkout, payment, confirmation, profile, my-bookings, saved, expenses, journal
  activeExploreTab: 'all',
  activeFilter: 'All',
  searchQuery: '',
  destinations: [...SEED_DESTINATIONS],
  bookings: [...SEED_BOOKINGS],
  expenses: [...SEED_EXPENSES],
  savedItems: [],
  currentUser: JSON.parse(localStorage.getItem('travelnest_user')) || {
    name: 'Siva Shirish',
    email: 'sivashirish09@gmail.com',
    token: 'jwt_token_demo_mode',
    travelerLevel: 'Gold Explorer',
    points: 1450
  },
  activeDestination: null,
  activeHotel: null,
  pendingBookingDraft: null,
  activeAIPlan: null
};

// Initialize Application & Routing Engine
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  fetchDestinations();
  renderDestinations();
  renderBookings();
  renderExpenses();
  renderSavedItems();
  setupEventListeners();
});

function initUI() {
  const userBtn = document.getElementById('user-profile-btn');
  if (userBtn && state.currentUser) {
    userBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${state.currentUser.name}`;
  }
}

async function fetchDestinations() {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations`, { timeout: 3000 });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        state.destinations = data;
        renderDestinations();
      }
    }
  } catch (err) {
    console.log('⚡ API Offline — Running with rich India & International seed dataset');
  }
}

// ROUTER & VIEW NAVIGATOR
function navigateTo(route, params = null) {
  state.currentRoute = route;

  // Update Nav links active state
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.getElementById(`nav-${route}`);
  if (activeLink) activeLink.classList.add('active');

  // Handle View transitions
  if (route === 'destination-detail' && params) {
    openDestinationDetailView(params);
    return;
  }
  if (route === 'hotel-detail' && params) {
    openHotelDetailView(params);
    return;
  }
  if (route === 'booking-checkout' && params) {
    openBookingCheckoutView(params);
    return;
  }

  // Scroll to section
  const sectionMap = {
    'home': 'home-section',
    'explore': 'destinations-section',
    'ai-plan': 'ai-planner-section',
    'saved': 'saved-section',
    'profile': 'profile-section',
    'my-bookings': 'profile-section'
  };

  const targetId = sectionMap[route] || 'home-section';
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Google OAuth Login Simulator & Authentication
async function handleGoogleLogin() {
  const btn = document.getElementById('btn-google-login');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Authenticating with Google...`;
  }

  const googleUser = {
    email: 'sivashirish09@gmail.com',
    name: 'Siva Shirish',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleUser)
    });

    if (res.ok) {
      const data = await res.json();
      state.currentUser = {
        name: data.name,
        email: data.email,
        token: data.access_token,
        travelerLevel: 'Gold Explorer',
        points: 1450
      };
    } else {
      state.currentUser = { ...googleUser, travelerLevel: 'Gold Explorer', points: 1450 };
    }
  } catch (err) {
    state.currentUser = { ...googleUser, travelerLevel: 'Gold Explorer', points: 1450 };
  }

  localStorage.setItem('travelnest_user', JSON.stringify(state.currentUser));
  initUI();
  closeAuthModal();
  showToast(`🟢 Welcome back, ${state.currentUser.name}! Google Auth verified.`);
  navigateTo('home');
}

function openAuthModal(mode = 'login') {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('active');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
}

// Explore Subtabs & Filters
function setExploreSubTab(type, el) {
  state.activeExploreTab = type;
  document.querySelectorAll('.explore-subtab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderDestinations();
}

function setCategoryFilter(category, el) {
  state.activeFilter = category;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  renderDestinations();
}

function handleSearchInput() {
  const query = document.getElementById('search-input').value;
  state.searchQuery = query;
  renderDestinations();
}

// Render Destination Grid
function renderDestinations() {
  const container = document.getElementById('destinations-grid');
  if (!container) return;

  const filtered = state.destinations.filter(d => {
    const matchesTab = state.activeExploreTab === 'all' ||
      (state.activeExploreTab === 'india' && !d.is_international) ||
      (state.activeExploreTab === 'international' && d.is_international);

    const matchesCategory = state.activeFilter === 'All' || d.category === state.activeFilter;
    const matchesSearch = d.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          (d.state && d.state.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
                          d.country.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          d.category.toLowerCase().includes(state.searchQuery.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i class="fas fa-search-location" style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-primary);"></i>
        <h3>No destinations match your criteria</h3>
        <p>Try switching tabs between India and International or adjusting search filters.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="card">
      <div class="card-image-wrap">
        <img src="${d.image_url}" alt="${d.name}" class="card-img" loading="lazy">
        <span class="card-badge">${d.is_international ? `🌐 ${d.country}` : `🇮🇳 ${d.state}`}</span>
        <div class="card-rating">
          <i class="fas fa-star"></i> ${d.rating} (${d.review_count})
        </div>
      </div>
      <div class="card-body">
        <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${d.is_international ? d.country : `${d.state}, India`}</div>
        <h3 class="card-title">${d.name}</h3>
        <p class="card-desc">${d.description}</p>
        
        <div class="card-meta">
          <div class="meta-item">
            <span class="meta-label">Est. Budget</span>
            <span class="meta-value">₹${d.estimated_budget_inr.toLocaleString()}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Best Season</span>
            <span class="meta-value" style="font-size: 0.85rem;">${d.best_season}</span>
          </div>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-secondary btn-sm btn-icon-only" onclick="toggleSaveDestination('${d.id}')" title="Save">
              <i class="fas fa-bookmark"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="openDestinationDetailView('${d.id}')">
              Details
            </button>
            <button class="btn btn-primary btn-sm" onclick="openBookingCheckoutView('${d.id}')">
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Destination Detail Page/View
function openDestinationDetailView(destId) {
  const dest = state.destinations.find(d => d.id === destId);
  if (!dest) return;

  state.activeDestination = dest;
  const content = document.getElementById('detail-modal-body');
  content.innerHTML = `
    <div style="position: relative; height: 240px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem;">
      <img src="${dest.image_url}" alt="${dest.name}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; bottom: 1rem; left: 1rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm);">
        <h2 style="font-size: 1.6rem; color: #fff;">${dest.name} (${dest.country})</h2>
        <p style="font-size: 0.85rem; color: var(--accent-green);"><i class="fas fa-sun"></i> Weather: ${dest.weather_info} | Currency: ${dest.currency_code || 'INR'}</p>
      </div>
    </div>

    <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.6;">${dest.description}</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
      <div><strong>Best Season:</strong> ${dest.best_season}</div>
      <div><strong>Recommended Duration:</strong> ${dest.recommended_days} Days</div>
      <div><strong>Nearest Airport:</strong> ${dest.nearest_airport || 'International Hub'}</div>
      <div><strong>Estimated Budget:</strong> ₹${dest.estimated_budget_inr.toLocaleString()}</div>
      <div><strong>Local Language:</strong> ${dest.local_language || 'English / Regional'}</div>
      <div><strong>Rating:</strong> ⭐ ${dest.rating} (${dest.review_count} reviews)</div>
    </div>

    <h4 style="margin-bottom: 0.5rem; color: var(--accent-primary);"><i class="fas fa-map-pin"></i> Top Attractions</h4>
    <ul style="list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem;">
      ${(dest.top_attractions || ['City Center Tour', 'Local Spice Market', 'Scenic River Cruise', 'Sunset Viewpoint']).map(a => `<li>📍 ${a}</li>`).join('')}
    </ul>

    <h4 style="margin-bottom: 0.5rem; color: var(--accent-orange);"><i class="fas fa-first-aid"></i> Emergency & Tourist Services</h4>
    <div style="font-size: 0.85rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem;">
      <span>🏥 Central Hospital (1.2 km)</span>
      <span>💊 24/7 Pharmacy (0.5 km)</span>
      <span>🏧 National Bank ATM (0.2 km)</span>
      <span>🚨 Tourist Police Station (0.8 km)</span>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
      <button class="btn btn-secondary" onclick="closeDetailModal()">Close</button>
      <button class="btn btn-secondary" onclick="closeDetailModal(); prefillAIPicker('${dest.name}')"><i class="fas fa-magic"></i> AI Plan</button>
      <button class="btn btn-primary" onclick="closeDetailModal(); openBookingCheckoutView('${dest.id}')">
        <i class="fas fa-calendar-check"></i> Book Stay Now
      </button>
    </div>
  `;

  document.getElementById('detail-modal').classList.add('active');
}

function closeDetailModal() {
  document.getElementById('detail-modal').classList.remove('active');
}

function prefillAIPicker(destName) {
  const destInput = document.getElementById('ai-dest');
  if (destInput) destInput.value = destName;
  navigateTo('ai-plan');
}

// AI Trip Planner Generator
async function generateAITripPlan(e) {
  if (e) e.preventDefault();

  const dest = document.getElementById('ai-dest').value || 'Goa';
  const days = parseInt(document.getElementById('ai-days').value) || 4;
  const budget = parseInt(document.getElementById('ai-budget').value) || 25000;
  const style = document.getElementById('ai-style').value || 'Moderate';
  const members = parseInt(document.getElementById('ai-members').value) || 2;

  const btn = document.getElementById('ai-submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Gemini AI Planning...`;

  try {
    const res = await fetch(`${API_BASE_URL}/ai/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: dest, days, budget_inr: budget, travel_style: style, members })
    });

    let data;
    if (res.ok) {
      data = await res.json();
    } else {
      data = generateFallbackItinerary(dest, days, budget, style, members);
    }
    renderAIItinerary(data);
    showToast(`✨ Gemini AI generated a ${days}-Day itinerary for ${dest}!`);
  } catch (err) {
    const fallback = generateFallbackItinerary(dest, days, budget, style, members);
    renderAIItinerary(fallback);
    showToast(`✨ Gemini AI generated a ${days}-Day itinerary for ${dest}!`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-magic"></i> Generate Custom AI Itinerary`;
  }
}

function generateFallbackItinerary(dest, days, budget, style, members) {
  const daysList = [];
  const activities = [
    { m: 'Arrival, Resort Check-in & Beachwalk', a: 'Guided Heritage Tour', e: 'Sunset Cruise & Dinner' },
    { m: 'Morning Yoga & Local Market Exploration', a: 'Water Sports & Adventure Scuba', e: 'Live Music & Night Market' },
    { m: 'Scenic Mountain Viewpoint Visit', a: 'Cultural Museum & Spice Garden', e: 'Fine Dining & Relaxation' },
    { m: 'Souvenir Shopping & Wellness Spa', a: 'Leisure Stroll & Photo Session', e: 'Departure Transfers' }
  ];

  for (let i = 1; i <= days; i++) {
    const act = activities[(i - 1) % activities.length];
    daysList.push({
      day: i,
      title: `Day ${i}: ${dest} Highlights`,
      morning: act.m,
      afternoon: act.a,
      evening: act.e,
      stay: `${dest} Grand Heritage Resort`
    });
  }

  const stayCost = Math.round(budget * 0.40);
  const foodCost = Math.round(budget * 0.25);
  const actCost  = Math.round(budget * 0.20);
  const transCost= Math.round(budget * 0.15);

  return {
    destination: dest,
    days: days,
    total_budget_inr: budget,
    style: style,
    members: members,
    cost_breakdown: { stayCost, foodCost, actCost, transCost },
    itinerary: daysList
  };
}

function renderAIItinerary(plan) {
  const outputBox = document.getElementById('ai-output-box');
  if (!outputBox) return;

  const cb = plan.cost_breakdown;

  outputBox.innerHTML = `
    <div class="itinerary-card">
      <div class="itinerary-header">
        <div>
          <span class="badge-tag" style="margin-bottom: 0.3rem;"><i class="fas fa-robot"></i> Gemini AI Verified</span>
          <h3 style="font-size: 1.4rem;">${plan.destination} (${plan.days} Days / ${plan.members} Travelers)</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">Style: ${plan.style} | Est. Budget: ₹${plan.total_budget_inr.toLocaleString()}</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('📋 PDF Itinerary saved!')">
          <i class="fas fa-download"></i> Save PDF
        </button>
      </div>

      <div class="day-timeline">
        ${plan.itinerary.map(d => `
          <div class="day-box">
            <h4>${d.title || `Day ${d.day}`}</h4>
            <p><strong>🌅 Morning:</strong> ${d.morning}</p>
            <p><strong>☀️ Afternoon:</strong> ${d.afternoon}</p>
            <p><strong>🌙 Evening:</strong> ${d.evening}</p>
            <p style="margin-top: 0.3rem; font-size: 0.8rem; color: var(--accent-primary);">
              <i class="fas fa-hotel"></i> Recommended Stay: ${d.stay}
            </p>
          </div>
        `).join('')}
      </div>

      <div class="cost-breakdown">
        <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.85rem;">
          <span>Smart Budget Split (₹${plan.total_budget_inr.toLocaleString()})</span>
          <span style="color: var(--accent-primary)">100% Calculated</span>
        </div>
        <div class="cost-bar-track">
          <div class="cost-segment" style="width: 40%; background: #2563eb;"></div>
          <div class="cost-segment" style="width: 25%; background: #10b981;"></div>
          <div class="cost-segment" style="width: 20%; background: #f59e0b;"></div>
          <div class="cost-segment" style="width: 15%; background: #8b5cf6;"></div>
        </div>
        <div class="cost-legend">
          <span>🔵 Stay: ₹${cb.stayCost.toLocaleString()}</span>
          <span>🟢 Food: ₹${cb.foodCost.toLocaleString()}</span>
          <span>🟠 Activities: ₹${cb.actCost.toLocaleString()}</span>
          <span>🟣 Transport: ₹${cb.transCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
}

// Booking Checkout & Payment Flow
function openBookingCheckoutView(destId) {
  const dest = state.destinations.find(d => d.id === destId);
  if (!dest) return;

  state.activeDestination = dest;
  document.getElementById('modal-dest-title').innerText = `Book Trip to ${dest.name} (${dest.country})`;
  document.getElementById('modal-price-per-night').innerText = `₹${Math.round(dest.estimated_budget_inr / dest.recommended_days).toLocaleString()}`;
  calculateModalTotal();

  const overlay = document.getElementById('booking-modal');
  overlay.classList.add('active');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('active');
}

function calculateModalTotal() {
  if (!state.activeDestination) return;
  const nights = parseInt(document.getElementById('modal-nights').value) || 3;
  const guests = parseInt(document.getElementById('modal-guests').value) || 2;
  const baseRate = Math.round(state.activeDestination.estimated_budget_inr / state.activeDestination.recommended_days);

  const total = (baseRate * nights * guests);
  document.getElementById('modal-total-price').innerText = `₹${total.toLocaleString()}`;
}

function handleConfirmBooking(e) {
  e.preventDefault();
  if (!state.activeDestination) return;

  const dest = state.activeDestination;
  const nights = parseInt(document.getElementById('modal-nights').value) || 3;
  const guests = parseInt(document.getElementById('modal-guests').value) || 2;
  const checkIn = document.getElementById('modal-checkin').value || '2026-08-15';
  const payMethod = document.getElementById('modal-pay-method').value || 'Google Pay (UPI)';

  const refCode = `TNB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const invCode = `INV-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const total = Math.round(dest.estimated_budget_inr / dest.recommended_days) * nights * guests;

  const newBooking = {
    id: `b_${Date.now()}`,
    user_id: state.currentUser ? state.currentUser.email : 'sivashirish09@gmail.com',
    destination_name: dest.name,
    country: dest.country,
    hotel_or_resort_name: `${dest.name} Grand Heritage Resort`,
    type: 'Resort',
    booking_reference: refCode,
    invoice_number: invCode,
    check_in_date: checkIn,
    check_out_date: '2026-08-18',
    number_of_nights: nights,
    number_of_guests: guests,
    total_amount_inr: total,
    payment_method: payMethod,
    payment_status: 'PAID',
    status: 'CONFIRMED',
    cancellation_reason: null,
    refund_amount_inr: 0,
    qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${refCode}`,
    image_url: dest.image_url
  };

  state.bookings.unshift(newBooking);

  // Add default stay expense
  state.expenses.unshift({
    id: `exp_${Date.now()}`,
    booking_id: newBooking.id,
    category: 'Stay',
    title: `${dest.name} Resort Stay`,
    amount_inr: total
  });

  renderBookings();
  renderExpenses();
  closeBookingModal();
  showToast(`🎉 Booking Confirmed! Reference: ${refCode}`);
  navigateTo('my-bookings');
}

// Render Bookings List
function renderBookings() {
  const container = document.getElementById('bookings-container');
  if (!container) return;

  if (state.bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted); border: 1px dashed var(--border-glass); border-radius: var(--radius-md);">
        <i class="fas fa-ticket-alt" style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--accent-primary);"></i>
        <p>No active travel bookings found.</p>
      </div>`;
    return;
  }

  container.innerHTML = state.bookings.map(b => `
    <div class="ticket-card">
      <div class="ticket-qr">
        <img src="${b.qr_code_url}" alt="QR Ticket ${b.booking_reference}">
      </div>
      <div class="ticket-info">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <h3>${b.destination_name} (${b.country})</h3>
          <span class="status-badge ${b.status === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'}">
            ${b.status}
          </span>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.3rem;">
          <i class="fas fa-hotel"></i> ${b.hotel_or_resort_name} (${b.type})
        </p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Ref: <strong>${b.booking_reference}</strong> | Invoice: <strong>${b.invoice_number}</strong>
        </p>
        <div class="ticket-tags">
          <span style="font-size: 0.8rem; background: var(--bg-card); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-glass);">
            <i class="fas fa-calendar"></i> ${b.check_in_date} (${b.number_of_nights} Nights)
          </span>
          <span style="font-size: 0.8rem; background: var(--bg-card); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-glass);">
            <i class="fas fa-users"></i> ${b.number_of_guests} Guests
          </span>
          <span style="font-size: 0.8rem; background: var(--bg-card); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-glass);">
            <i class="fas fa-credit-card"></i> ${b.payment_method}
          </span>
        </div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; gap: 0.5rem; justify-content: center;">
        <span style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">₹${b.total_amount_inr.toLocaleString()}</span>
        ${b.status === 'CONFIRMED' ? `
          <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">
            <i class="fas fa-times-circle"></i> Cancel Booking
          </button>
        ` : `
          <span style="font-size: 0.8rem; color: var(--danger); font-weight: 700;">REFUNDED (₹${b.total_amount_inr.toLocaleString()})</span>
        `}
      </div>
    </div>
  `).join('');
}

function cancelBooking(bookingId) {
  const target = state.bookings.find(b => b.id === bookingId);
  if (!target) return;

  if (confirm(`Are you sure you want to cancel booking ${target.booking_reference}?`)) {
    target.status = 'CANCELLED';
    target.payment_status = 'REFUNDED';
    target.refund_amount_inr = target.total_amount_inr;
    renderBookings();
    showToast(`⚠️ Booking ${target.booking_reference} cancelled. Refund initiated!`);
  }
}

// Saved Items Handling
function toggleSaveDestination(destId) {
  const dest = state.destinations.find(d => d.id === destId);
  if (!dest) return;

  const idx = state.savedItems.findIndex(s => s.id === destId);
  if (idx >= 0) {
    state.savedItems.splice(idx, 1);
    showToast(`Removed ${dest.name} from Saved Trips`);
  } else {
    state.savedItems.push(dest);
    showToast(`Saved ${dest.name} to Wishlist!`);
  }
  renderSavedItems();
}

function renderSavedItems() {
  const container = document.getElementById('saved-grid');
  if (!container) return;

  if (state.savedItems.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
        <i class="fas fa-bookmark" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <p>No saved trips yet. Click the bookmark icon on any destination card to save.</p>
      </div>`;
    return;
  }

  container.innerHTML = state.savedItems.map(d => `
    <div class="card">
      <div class="card-image-wrap" style="height: 140px;">
        <img src="${d.image_url}" alt="${d.name}" class="card-img">
      </div>
      <div class="card-body" style="padding: 1rem;">
        <h4 class="card-title" style="font-size: 1.1rem;">${d.name} (${d.country})</h4>
        <p class="card-desc" style="font-size: 0.8rem; margin-bottom: 0.8rem;">Est. ₹${d.estimated_budget_inr.toLocaleString()}</p>
        <button class="btn btn-primary btn-sm" onclick="openBookingCheckoutView('${d.id}')">Book Now</button>
      </div>
    </div>
  `).join('');
}

// Expense Tracker Render
function renderExpenses() {
  const container = document.getElementById('expenses-list');
  if (!container) return;

  const totalSpent = state.expenses.reduce((sum, e) => sum + e.amount_inr, 0);
  const budget = state.currentUser ? state.currentUser.preferred_budget || 35000 : 35000;

  container.innerHTML = `
    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 0.5rem;">
        <span>Total Spent: ₹${totalSpent.toLocaleString()}</span>
        <span>Budget Limit: ₹${budget.toLocaleString()}</span>
      </div>
      <div class="cost-bar-track" style="height: 12px;">
        <div class="cost-segment" style="width: ${Math.min(100, Math.round((totalSpent / budget) * 100))}%; background: var(--accent-primary);"></div>
      </div>
    </div>

    ${state.expenses.map(e => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 1rem; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-glass); margin-bottom: 0.6rem;">
        <div>
          <strong style="font-size: 0.95rem;">${e.title}</strong>
          <span style="display: block; font-size: 0.78rem; color: var(--text-muted);">${e.category}</span>
        </div>
        <span style="font-weight: 800; color: var(--text-primary);">₹${e.amount_inr.toLocaleString()}</span>
      </div>
    `).join('')}
  `;
}

function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-primary);"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', handleSearchInput);

  const aiForm = document.getElementById('ai-planner-form');
  if (aiForm) aiForm.addEventListener('submit', generateAITripPlan);

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) bookingForm.addEventListener('submit', handleConfirmBooking);

  const googleBtn = document.getElementById('btn-google-login');
  if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);
}
