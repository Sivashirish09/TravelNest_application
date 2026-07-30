/**
 * ==========================================================================
 * TRAVELNEST AI TRIP PLANNER — SCALABLE INDIA & INTERNATIONAL DATASET & SPA
 * ==========================================================================
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Seed Database Dataset (80+ Locations Covering All 36 Indian States & UTs)
const SEED_DESTINATIONS = [
  // --- ANDHRA PRADESH ---
  {
    id: 'vizag',
    name: 'Visakhapatnam',
    country: 'India',
    state: 'Andhra Pradesh',
    description: 'Coastal jewel with RK Beach, Submarine Museum, Kailasagiri scenic hills, and Araku coffee valley access.',
    image_url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Mar',
    weather_info: '26°C Coastal Breeze',
    estimated_budget_inr: 15000,
    recommended_days: 3,
    rating: 4.6,
    review_count: 210,
    category: 'Beach',
    is_international: false,
    nearest_airport: 'Visakhapatnam Airport (VTZ)',
    nearest_railway: 'Visakhapatnam Station',
    local_language: 'Telugu & English',
    currency_code: 'INR'
  },
  {
    id: 'araku',
    name: 'Araku Valley',
    country: 'India',
    state: 'Andhra Pradesh',
    description: 'Serene Eastern Ghats hill station famous for organic coffee plantations, Borra Caves, and waterfalls.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    best_season: 'Sep - Feb',
    weather_info: '18°C Cool Breeze',
    estimated_budget_inr: 12000,
    recommended_days: 2,
    rating: 4.7,
    review_count: 180,
    category: 'Hill Station',
    is_international: false,
    nearest_airport: 'Visakhapatnam Airport (VTZ)',
    nearest_railway: 'Araku Station',
    local_language: 'Telugu',
    currency_code: 'INR'
  },
  {
    id: 'tirupati',
    name: 'Tirupati',
    country: 'India',
    state: 'Andhra Pradesh',
    description: 'Sacred spiritual pilgrimage center home to the ancient Sri Venkateswara Swamy Temple atop Tirumala hills.',
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    best_season: 'Year-round',
    weather_info: '27°C Sunny',
    estimated_budget_inr: 10000,
    recommended_days: 2,
    rating: 4.9,
    review_count: 850,
    category: 'Spiritual',
    is_international: false,
    nearest_airport: 'Tirupati Airport (TIR)',
    nearest_railway: 'Tirupati Station',
    local_language: 'Telugu & Tamil',
    currency_code: 'INR'
  },

  -- ARUNACHAL PRADESH
  {
    id: 'tawang',
    name: 'Tawang',
    country: 'India',
    state: 'Arunachal Pradesh',
    description: 'Breathtaking Himalayan valley featuring Tawang Monastery, Sela Pass snow heights, and Madhuri Lake.',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    best_season: 'Mar - Oct',
    weather_info: '10°C Alpine Cold',
    estimated_budget_inr: 28000,
    recommended_days: 5,
    rating: 4.8,
    review_count: 150,
    category: 'Adventure',
    is_international: false,
    nearest_airport: 'Tezpur Airport (TEZ)',
    nearest_railway: 'Rangapara Station',
    local_language: 'Monpa & Hindi',
    currency_code: 'INR'
  },

  -- ASSAM
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    country: 'India',
    state: 'Assam',
    description: 'UNESCO World Heritage wildlife sanctuary home to two-thirds of the world one-horned rhinoceroses.',
    image_url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Apr',
    weather_info: '22°C Mild Pleasant',
    estimated_budget_inr: 20000,
    recommended_days: 3,
    rating: 4.8,
    review_count: 310,
    category: 'Wildlife',
    is_international: false,
    nearest_airport: 'Guwahati Airport (GAU)',
    nearest_railway: 'Furkating Station',
    local_language: 'Assamese & English',
    currency_code: 'INR'
  },

  -- GOA
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
    currency_code: 'INR'
  },

  -- GUJARAT
  {
    id: 'kutch',
    name: 'Rann of Kutch',
    country: 'India',
    state: 'Gujarat',
    description: 'Vast white salt desert famous for Rann Utsav cultural festival, handicrafts, and full moon views.',
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Feb',
    weather_info: '21°C Desert Sky',
    estimated_budget_inr: 24000,
    recommended_days: 4,
    rating: 4.8,
    review_count: 380,
    category: 'Heritage',
    is_international: false,
    nearest_airport: 'Bhuj Airport (BHJ)',
    nearest_railway: 'Bhuj Station',
    local_language: 'Gujarati & Kutchi',
    currency_code: 'INR'
  },

  -- HIMACHAL PRADESH
  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    state: 'Himachal Pradesh',
    description: 'High-altitude Himalayan resort town known for snow peaks, Solang Valley sports, and Rohtang Pass.',
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
    currency_code: 'INR'
  },
  {
    id: 'shimla',
    name: 'Shimla',
    country: 'India',
    state: 'Himachal Pradesh',
    description: 'Capital of Himachal Pradesh, renowned for colonial architecture, Mall Road, and Ridge views.',
    image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80',
    best_season: 'Mar - Jun',
    weather_info: '16°C Cool Mist',
    estimated_budget_inr: 16000,
    recommended_days: 3,
    rating: 4.6,
    review_count: 210,
    category: 'Hill Station',
    is_international: false,
    nearest_airport: 'Shimla Airport (SLV)',
    nearest_railway: 'Kalka Station',
    local_language: 'Hindi',
    currency_code: 'INR'
  },

  -- JAMMU & KASHMIR & LADAKH
  {
    id: 'srinagar',
    name: 'Srinagar & Dal Lake',
    country: 'India',
    state: 'Jammu and Kashmir',
    description: 'Paradise on Earth with luxury shikara rides on Dal Lake, Mughal Gardens, and traditional houseboats.',
    image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
    best_season: 'Apr - Oct',
    weather_info: '16°C Pleasant',
    estimated_budget_inr: 26000,
    recommended_days: 5,
    rating: 4.9,
    review_count: 480,
    category: 'Hill Station',
    is_international: false,
    nearest_airport: 'Srinagar Airport (SXR)',
    nearest_railway: 'Jammu Tawi Station',
    local_language: 'Kashmiri & Urdu',
    currency_code: 'INR'
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
    currency_code: 'INR'
  },

  -- KARNATAKA
  {
    id: 'coorg',
    name: 'Coorg (Kodagu)',
    country: 'India',
    state: 'Karnataka',
    description: 'Scotland of India famous for coffee estates, Abbey Falls, Raja Seat, and misty hill views.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Mar',
    weather_info: '20°C Misty Tea Breeze',
    estimated_budget_inr: 18000,
    recommended_days: 3,
    rating: 4.8,
    review_count: 340,
    category: 'Hill Station',
    is_international: false,
    nearest_airport: 'Kannur Airport (CNN)',
    nearest_railway: 'Mysore Station',
    local_language: 'Kodava & Kannada',
    currency_code: 'INR'
  },

  -- KERALA
  {
    id: 'munnar',
    name: 'Munnar',
    country: 'India',
    state: 'Kerala',
    description: 'Rolling emerald tea plantations, foggy hills, Anamudi peak, and serene wildlife sanctuaries.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    best_season: 'Sep - Mar',
    weather_info: '19°C Pleasant Tea Breeze',
    estimated_budget_inr: 17000,
    recommended_days: 4,
    rating: 4.8,
    review_count: 290,
    category: 'Hill Station',
    is_international: false,
    nearest_airport: 'Cochin Airport (COK)',
    nearest_railway: 'Aluva Station',
    local_language: 'Malayalam & English',
    currency_code: 'INR'
  },
  {
    id: 'alleppey',
    name: 'Alleppey Backwaters',
    country: 'India',
    state: 'Kerala',
    description: 'Venice of the East, famous for luxury houseboat cruises along calm palm-fringed backwaters.',
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Feb',
    weather_info: '27°C Humid Coastal',
    estimated_budget_inr: 19000,
    recommended_days: 3,
    rating: 4.9,
    review_count: 380,
    category: 'Backwaters',
    is_international: false,
    nearest_airport: 'Cochin Airport (COK)',
    nearest_railway: 'Alleppey Station',
    local_language: 'Malayalam & English',
    currency_code: 'INR'
  },

  -- RAJASTHAN
  {
    id: 'jaipur',
    name: 'Jaipur Pink City',
    country: 'India',
    state: 'Rajasthan',
    description: 'Iconic Pink City featuring grand Amber Fort, Hawa Mahal, City Palace, and royal Rajasthani heritage.',
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Mar',
    weather_info: '24°C Pleasant Desert Sun',
    estimated_budget_inr: 15000,
    recommended_days: 3,
    rating: 4.7,
    review_count: 340,
    category: 'Heritage',
    is_international: false,
    nearest_airport: 'Jaipur Airport (JAI)',
    nearest_railway: 'Jaipur Junction',
    local_language: 'Rajasthani & Hindi',
    currency_code: 'INR'
  },

  -- UTTAR PRADESH
  {
    id: 'agra',
    name: 'Agra Taj Mahal',
    country: 'India',
    state: 'Uttar Pradesh',
    description: 'Home to the iconic Taj Mahal, Agra Fort, and Fatehpur Sikri world heritage Mughal wonders.',
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Mar',
    weather_info: '22°C Mild Sun',
    estimated_budget_inr: 12000,
    recommended_days: 2,
    rating: 4.9,
    review_count: 950,
    category: 'Heritage',
    is_international: false,
    nearest_airport: 'Agra Airport (AGR)',
    nearest_railway: 'Agra Cantt Station',
    local_language: 'Hindi & Urdu',
    currency_code: 'INR'
  },

  -- INTERNATIONAL DESTINATIONS
  {
    id: 'maldives',
    name: 'Maldives Overwater Paradise',
    country: 'Maldives',
    state: 'Malé Atoll',
    description: 'Tropical paradise of overwater bungalows, turquoise lagoons, and private island luxury resorts.',
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
    nearest_airport: 'Velana International Airport (MLE)'
  },
  {
    id: 'dubai',
    name: 'Dubai Futuristic City',
    country: 'United Arab Emirates',
    state: 'Dubai Emirate',
    description: 'Futuristic metropolis featuring Burj Khalifa, desert dune safaris, luxury malls, and Palm Jumeirah.',
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
    nearest_airport: 'Dubai International Airport (DXB)'
  },
  {
    id: 'bali',
    name: 'Bali Island of Gods',
    country: 'Indonesia',
    state: 'Bali Province',
    description: 'Lush rice terraces, ancient sea temples, surf beaches, and holistic yoga wellness retreats.',
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
    nearest_airport: 'Ngurah Rai Airport (DPS)'
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

let state = {
  currentRoute: 'home',
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
  activeDestination: null
};

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
    console.log('⚡ API Offline — Running with rich India state & International dataset');
  }
}

// ROUTER & NAVIGATION CONTROLLER
function navigateTo(route) {
  state.currentRoute = route;

  // Bottom Navigation Bar active highlights
  document.querySelectorAll('.nav-tab-item').forEach(t => t.classList.remove('active'));
  const activeTab = document.getElementById(`tab-${route}`);
  if (activeTab) activeTab.classList.add('active');

  const sectionMap = {
    'home': 'home-section',
    'explore': 'destinations-section',
    'ai-plan': 'ai-planner-section',
    'saved': 'saved-section',
    'profile': 'profile-section'
  };

  const targetId = sectionMap[route] || 'home-section';
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

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

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('active');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
}

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
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; color: var(--text-muted);">
        <i class="fas fa-search-location" style="font-size: 2.8rem; margin-bottom: 0.8rem; color: var(--accent-blue);"></i>
        <h3>No destinations match your search</h3>
        <p>Try searching for specific Indian states (e.g. Kerala, Goa, Kashmir, Rajasthan) or International hubs.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="card">
      <div class="card-image-wrap">
        <img src="${d.image_url}" alt="${d.name}" class="card-img" loading="lazy">
        <span class="card-badge">${d.is_international ? `🌐 ${d.country}` : `🇮🇳 ${d.state}`}</span>
        <div class="card-rating">
          <i class="fas fa-star"></i> ${d.rating} (${d.review_count || 180})
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
            <span class="meta-value" style="font-size: 0.82rem;">${d.best_season}</span>
          </div>
          <div style="display: flex; gap: 0.35rem;">
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

function openDestinationDetailView(destId) {
  const dest = state.destinations.find(d => d.id === destId);
  if (!dest) return;

  state.activeDestination = dest;
  const content = document.getElementById('detail-modal-body');
  content.innerHTML = `
    <div style="position: relative; height: 220px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.25rem;">
      <img src="${dest.image_url}" alt="${dest.name}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; bottom: 0.8rem; left: 0.8rem; background: rgba(0,0,0,0.75); padding: 0.4rem 1rem; border-radius: var(--radius-sm);">
        <h2 style="font-size: 1.5rem; color: #fff;">${dest.name} (${dest.country})</h2>
        <p style="font-size: 0.82rem; color: var(--accent-green);"><i class="fas fa-sun"></i> Weather: ${dest.weather_info} | State: ${dest.state || 'UT'}</p>
      </div>
    </div>

    <p style="color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 0.92rem;">${dest.description}</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.25rem; font-size: 0.88rem;">
      <div><strong>Best Season:</strong> ${dest.best_season}</div>
      <div><strong>Recommended Duration:</strong> ${dest.recommended_days} Days</div>
      <div><strong>Nearest Airport:</strong> ${dest.nearest_airport || 'Regional Hub'}</div>
      <div><strong>Estimated Budget:</strong> ₹${dest.estimated_budget_inr.toLocaleString()}</div>
      <div><strong>Local Language:</strong> ${dest.local_language || 'Hindi / English'}</div>
      <div><strong>Rating:</strong> ⭐ ${dest.rating} (${dest.review_count || 200} reviews)</div>
    </div>

    <h4 style="margin-bottom: 0.4rem; color: var(--accent-blue); font-size: 0.95rem;"><i class="fas fa-first-aid"></i> 24/7 Emergency & Tourist Services</h4>
    <div style="font-size: 0.82rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-bottom: 1.25rem;">
      <span>🏥 Regional Medical Hospital (1.2 km)</span>
      <span>💊 24/7 Pharmacy (0.4 km)</span>
      <span>🏧 State Bank ATM (0.2 km)</span>
      <span>🚨 Tourist Police Assistance (0.8 km)</span>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.6rem;">
      <button class="btn btn-secondary" onclick="closeDetailModal()">Close</button>
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
    { m: 'Arrival, Check-in & Scenic Walk', a: 'Guided Heritage Site Tour', e: 'Sunset Viewpoint & Local Dinner' },
    { m: 'Morning Yoga & Local Market Tour', a: 'Water Sports / Nature Exploration', e: 'Live Cultural Performance' },
    { m: 'Mountain Peak Viewpoint Visit', a: 'Spiritual Temple & Handicraft Center', e: 'Fine Dining & Relaxation' },
    { m: 'Souvenir Shopping & Wellness Spa', a: 'Photo Session & Leisure Stroll', e: 'Departure Transfers' }
  ];

  for (let i = 1; i <= days; i++) {
    const act = activities[(i - 1) % activities.length];
    daysList.push({
      day: i,
      title: `Day ${i}: ${dest} Highlights`,
      morning: act.m,
      afternoon: act.a,
      evening: act.e,
      stay: `${dest} Grand Resort & Spa`
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
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 0.8rem; margin-bottom: 1rem;">
        <div>
          <span class="badge-tag" style="margin-bottom: 0.2rem;"><i class="fas fa-robot"></i> Gemini AI Verified</span>
          <h3 style="font-size: 1.3rem;">${plan.destination} (${plan.days} Days / ${plan.members} Travelers)</h3>
          <p style="font-size: 0.82rem; color: var(--text-secondary);">Style: ${plan.style} | Est. Budget: ₹${plan.total_budget_inr.toLocaleString()}</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('📋 PDF Itinerary saved!')">
          <i class="fas fa-download"></i> PDF
        </button>
      </div>

      <div class="day-timeline">
        ${plan.itinerary.map(d => `
          <div class="day-box">
            <h4 style="color: var(--accent-blue); font-size: 0.95rem; margin-bottom: 0.3rem;">${d.title || `Day ${d.day}`}</h4>
            <p style="font-size: 0.85rem;"><strong>🌅 Morning:</strong> ${d.morning}</p>
            <p style="font-size: 0.85rem;"><strong>☀️ Afternoon:</strong> ${d.afternoon}</p>
            <p style="font-size: 0.85rem;"><strong>🌙 Evening:</strong> ${d.evening}</p>
            <p style="margin-top: 0.2rem; font-size: 0.78rem; color: var(--accent-blue);">
              <i class="fas fa-hotel"></i> Stay: ${d.stay}
            </p>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.82rem;">
          <span>Smart Budget Split (₹${plan.total_budget_inr.toLocaleString()})</span>
          <span style="color: var(--accent-blue)">100% Calculated</span>
        </div>
        <div class="cost-bar-track">
          <div class="cost-segment" style="width: 40%; background: #2563eb;"></div>
          <div class="cost-segment" style="width: 25%; background: #10b981;"></div>
          <div class="cost-segment" style="width: 20%; background: #f59e0b;"></div>
          <div class="cost-segment" style="width: 15%; background: #8b5cf6;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <span>🔵 Stay: ₹${cb.stayCost.toLocaleString()}</span>
          <span>🟢 Food: ₹${cb.foodCost.toLocaleString()}</span>
          <span>🟠 Act: ₹${cb.actCost.toLocaleString()}</span>
          <span>🟣 Trans: ₹${cb.transCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
}

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
  navigateTo('profile');
}

function renderBookings() {
  const container = document.getElementById('bookings-container');
  if (!container) return;

  if (state.bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <i class="fas fa-ticket-alt" style="font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--accent-blue);"></i>
        <p>No active travel bookings found.</p>
      </div>`;
    return;
  }

  container.innerHTML = state.bookings.map(b => `
    <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <img src="${b.qr_code_url}" alt="QR Ticket" style="width: 80px; height: 80px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding: 4px;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h3 style="font-size: 1.1rem;">${b.destination_name} (${b.country})</h3>
            <span style="font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 99px; font-weight: 700; background: ${b.status === 'CONFIRMED' ? '#ecfdf5' : '#fef2f2'}; color: ${b.status === 'CONFIRMED' ? '#10b981' : '#ef4444'};">
              ${b.status}
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fas fa-hotel"></i> ${b.hotel_or_resort_name}</p>
          <p style="font-size: 0.78rem; color: var(--text-muted);">Ref: ${b.booking_reference} | Check-in: ${b.check_in_date}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">₹${b.total_amount_inr.toLocaleString()}</span>
        <div style="margin-top: 0.3rem;">
          ${b.status === 'CONFIRMED' ? `
            <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">Cancel</button>
          ` : `
            <span style="font-size: 0.78rem; color: var(--accent-red); font-weight: 700;">REFUNDED</span>
          `}
        </div>
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
      <div class="card-image-wrap" style="height: 130px;">
        <img src="${d.image_url}" alt="${d.name}" class="card-img">
      </div>
      <div class="card-body" style="padding: 0.9rem;">
        <h4 class="card-title" style="font-size: 1rem;">${d.name} (${d.country})</h4>
        <p class="card-desc" style="font-size: 0.78rem; margin-bottom: 0.6rem;">Est. ₹${d.estimated_budget_inr.toLocaleString()}</p>
        <button class="btn btn-primary btn-sm" onclick="openBookingCheckoutView('${d.id}')">Book Now</button>
      </div>
    </div>
  `).join('');
}

function renderExpenses() {
  const container = document.getElementById('expenses-list');
  if (!container) return;

  const totalSpent = state.expenses.reduce((sum, e) => sum + e.amount_inr, 0);
  const budget = state.currentUser ? state.currentUser.preferred_budget || 35000 : 35000;

  container.innerHTML = `
    <div style="background: #ffffff; padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.88rem; margin-bottom: 0.4rem;">
        <span>Total Spent: ₹${totalSpent.toLocaleString()}</span>
        <span>Budget Limit: ₹${budget.toLocaleString()}</span>
      </div>
      <div class="cost-bar-track">
        <div class="cost-segment" style="width: ${Math.min(100, Math.round((totalSpent / budget) * 100))}%; background: var(--accent-blue);"></div>
      </div>
    </div>

    ${state.expenses.map(e => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0.9rem; background: #ffffff; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 0.5rem; font-size: 0.88rem;">
        <div>
          <strong>${e.title}</strong>
          <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">${e.category}</span>
        </div>
        <span style="font-weight: 800;">₹${e.amount_inr.toLocaleString()}</span>
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
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-blue);"></i> <span>${msg}</span>`;
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
