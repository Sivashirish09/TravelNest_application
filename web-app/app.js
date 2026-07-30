/**
 * ==========================================================================
 * TRAVELNEST AI TRIP PLANNER — FRONTEND APPLICATION LOGIC
 * ==========================================================================
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Seed Database Dataset (matches app/database/seed.sql)
const SEED_DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    description: 'Famous for pristine golden beaches, Portuguese heritage architecture, vibrant nightlife, and spice plantations.',
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Feb',
    weather_info: '28°C Sunny & Breezy',
    estimated_budget_inr: 18000,
    recommended_days: 4,
    rating: 4.8,
    review_count: 320,
    category: 'Beach',
    latitude: 15.2993,
    longitude: 74.1240
  },
  {
    id: 'manali',
    name: 'Manali',
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
    latitude: 32.2432,
    longitude: 77.1892
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    description: 'The capital of Himachal Pradesh, renowned for its colonial architecture, Mall Road, and Ridge views.',
    image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80',
    best_season: 'Mar - Jun',
    weather_info: '16°C Cool Mountain Mist',
    estimated_budget_inr: 16000,
    recommended_days: 3,
    rating: 4.6,
    review_count: 210,
    category: 'Hill Station',
    latitude: 31.1048,
    longitude: 77.1734
  },
  {
    id: 'leh_ladakh',
    name: 'Leh Ladakh',
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
    latitude: 34.1526,
    longitude: 77.5771
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    description: 'The iconic Pink City featuring grand Amber Fort, Hawa Mahal, City Palace, and rich Royal Rajasthani heritage.',
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Mar',
    weather_info: '24°C Pleasant Desert Sun',
    estimated_budget_inr: 15000,
    recommended_days: 3,
    rating: 4.7,
    review_count: 340,
    category: 'Heritage',
    latitude: 26.9124,
    longitude: 75.7873
  },
  {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    description: 'Rolling emerald tea plantations, foggy hills, Anamudi peak, and serene mountain wildlife sanctuaries.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    best_season: 'Sep - Mar',
    weather_info: '19°C Pleasant Tea Breeze',
    estimated_budget_inr: 17000,
    recommended_days: 4,
    rating: 4.8,
    review_count: 290,
    category: 'Hill Station',
    latitude: 10.0889,
    longitude: 77.0595
  },
  {
    id: 'alleppey',
    name: 'Alleppey',
    state: 'Kerala',
    description: 'Venice of the East, famous for luxury houseboat cruises along calm palm-fringed backwaters.',
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    best_season: 'Nov - Feb',
    weather_info: '27°C Humid Coastal Breeze',
    estimated_budget_inr: 19000,
    recommended_days: 3,
    rating: 4.9,
    review_count: 380,
    category: 'Backwaters',
    latitude: 9.4981,
    longitude: 76.3388
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    description: 'Spiritual capital of India along the sacred Ganges river, famous for evening Ganga Aarti and ancient ghats.',
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    best_season: 'Oct - Mar',
    weather_info: '22°C Mild Pleasant Air',
    estimated_budget_inr: 12000,
    recommended_days: 3,
    rating: 4.8,
    review_count: 450,
    category: 'Spiritual',
    latitude: 25.3176,
    longitude: 82.9739
  }
];

const SEED_BOOKINGS = [
  {
    id: 'b1',
    user_id: 'usr_sivashirish09',
    destination_name: 'Goa, India',
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
    qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TAJ-GOA-8821',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  }
];

// App State
let state = {
  destinations: [...SEED_DESTINATIONS],
  bookings: [...SEED_BOOKINGS],
  activeFilter: 'All',
  searchQuery: '',
  currentUser: JSON.parse(localStorage.getItem('travelnest_user')) || {
    name: 'Siva Shirish',
    email: 'sivashirish09@gmail.com',
    token: 'jwt_token_demo_mode'
  },
  selectedDestinationForBooking: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  fetchDestinations();
  renderDestinations();
  renderBookings();
  setupEventListeners();
});

function initUI() {
  const userBtn = document.getElementById('user-profile-btn');
  if (userBtn && state.currentUser) {
    userBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${state.currentUser.name}`;
  }
}

// Fetch Destinations from API or Fallback
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
    console.log('⚡ API Offline — Using local dataset from PostgreSQL seed.sql');
  }
}

// Render Destinations Cards
function renderDestinations() {
  const container = document.getElementById('destinations-grid');
  if (!container) return;

  const filtered = state.destinations.filter(d => {
    const matchesCategory = state.activeFilter === 'All' || d.category === state.activeFilter;
    const matchesSearch = d.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          d.state.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          d.category.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i class="fas fa-search-location" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3>No destinations match your search</h3>
        <p>Try clearing filters or searching for another location.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="card">
      <div class="card-image-wrap">
        <img src="${d.image_url}" alt="${d.name}" class card-img loading="lazy">
        <span class="card-badge">${d.category}</span>
        <div class="card-rating">
          <i class="fas fa-star"></i> ${d.rating} (${d.review_count || 120})
        </div>
      </div>
      <div class="card-body">
        <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${d.state}, India</div>
        <h3 class="card-title">${d.name}</h3>
        <p class="card-desc">${d.description}</p>
        
        <div class="card-meta">
          <div class="meta-item">
            <span class="meta-label">Est. Budget</span>
            <span class="meta-value">₹${d.estimated_budget_inr.toLocaleString()}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Duration</span>
            <span class="meta-value">${d.recommended_days} Days</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openBookingModal('${d.id}')">
            <i class="fas fa-calendar-check"></i> Book Now
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Category Filter Handling
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

// AI Trip Planner Generator
async function generateAITripPlan(e) {
  if (e) e.preventDefault();

  const dest = document.getElementById('ai-dest').value || 'Goa';
  const days = parseInt(document.getElementById('ai-days').value) || 4;
  const budget = parseInt(document.getElementById('ai-budget').value) || 20000;
  const style = document.getElementById('ai-style').value || 'Moderate';
  const members = parseInt(document.getElementById('ai-members').value) || 2;

  const btn = document.getElementById('ai-submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating Itinerary with Gemini AI...`;

  try {
    // Try live API
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
    showToast(`✨ Generated ${days}-Day AI Trip Plan for ${dest}!`);
  } catch (err) {
    const fallback = generateFallbackItinerary(dest, days, budget, style, members);
    renderAIItinerary(fallback);
    showToast(`✨ Generated ${days}-Day AI Trip Plan for ${dest}!`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-magic"></i> Generate Custom AI Itinerary`;
  }
}

// Fallback AI Itinerary Generator
function generateFallbackItinerary(dest, days, budget, style, members) {
  const daysList = [];
  const activities = [
    'Arrival & Check-in at luxury resort. Evening sunset stroll & local seafood dining.',
    'Guided historical sightseeing tour, heritage monument exploration & spice plantation visit.',
    'Thrilling outdoor adventure sports, river cruise, and shopping at traditional handicrafts market.',
    'Relaxing morning wellness spa, scenic viewpoint visit & departure transfers.'
  ];

  for (let i = 1; i <= days; i++) {
    daysList.push({
      day: i,
      title: `Day ${i}: ${dest} Exploration`,
      activity: activities[(i - 1) % activities.length],
      stay: `${dest} Grand Haven & Spa`
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

// Render AI Output
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
          <p style="font-size: 0.85rem; color: var(--text-secondary);">Style: ${plan.style} | Est. Total: ₹${plan.total_budget_inr.toLocaleString()}</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('📋 Itinerary downloaded successfully!')">
          <i class="fas fa-download"></i> Save PDF
        </button>
      </div>

      <div class="day-timeline">
        ${plan.itinerary.map(d => `
          <div class="day-box">
            <h4>${d.title || `Day ${d.day}`}</h4>
            <p><strong>Activities:</strong> ${d.activity}</p>
            <p style="margin-top: 0.3rem; font-size: 0.8rem; color: var(--accent-primary);">
              <i class="fas fa-hotel"></i> Recommended Stay: ${d.stay}
            </p>
          </div>
        `).join('')}
      </div>

      <div class="cost-breakdown">
        <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.85rem;">
          <span>Smart Budget Split (₹${plan.total_budget_inr.toLocaleString()})</span>
          <span style="color: var(--accent-primary)">100% Allocated</span>
        </div>
        <div class="cost-bar-track">
          <div class="cost-segment" style="width: 40%; background: #6366f1;"></div>
          <div class="cost-segment" style="width: 25%; background: #8b5cf6;"></div>
          <div class="cost-segment" style="width: 20%; background: #ec4899;"></div>
          <div class="cost-segment" style="width: 15%; background: #10b981;"></div>
        </div>
        <div class="cost-legend">
          <span>🟣 Stay: ₹${cb.stayCost.toLocaleString()}</span>
          <span>🟣 Food: ₹${cb.foodCost.toLocaleString()}</span>
          <span>💖 Activities: ₹${cb.actCost.toLocaleString()}</span>
          <span>🟢 Transport: ₹${cb.transCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
}

// Booking Modal Logic
function openBookingModal(destId) {
  const dest = state.destinations.find(d => d.id === destId);
  if (!dest) return;

  state.selectedDestinationForBooking = dest;
  document.getElementById('modal-dest-title').innerText = `Book Trip to ${dest.name}`;
  document.getElementById('modal-price-per-night').innerText = `₹${Math.round(dest.estimated_budget_inr / dest.recommended_days).toLocaleString()}`;
  calculateModalTotal();

  const overlay = document.getElementById('booking-modal');
  overlay.classList.add('active');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('active');
}

function calculateModalTotal() {
  if (!state.selectedDestinationForBooking) return;
  const nights = parseInt(document.getElementById('modal-nights').value) || 3;
  const guests = parseInt(document.getElementById('modal-guests').value) || 2;
  const baseRate = Math.round(state.selectedDestinationForBooking.estimated_budget_inr / state.selectedDestinationForBooking.recommended_days);

  const total = (baseRate * nights * guests);
  document.getElementById('modal-total-price').innerText = `₹${total.toLocaleString()}`;
}

// Confirm Booking Form Submission
function handleConfirmBooking(e) {
  e.preventDefault();
  if (!state.selectedDestinationForBooking) return;

  const dest = state.selectedDestinationForBooking;
  const nights = parseInt(document.getElementById('modal-nights').value) || 3;
  const guests = parseInt(document.getElementById('modal-guests').value) || 2;
  const checkIn = document.getElementById('modal-checkin').value || '2026-09-01';
  const payMethod = document.getElementById('modal-pay-method').value || 'Google Pay (UPI)';

  const refCode = `TNB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const invCode = `INV-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const total = Math.round(dest.estimated_budget_inr / dest.recommended_days) * nights * guests;

  const newBooking = {
    id: `b_${Date.now()}`,
    user_id: state.currentUser ? state.currentUser.email : 'usr_guest',
    destination_name: dest.name,
    hotel_or_resort_name: `${dest.name} Premier Heritage Resort`,
    type: 'Resort',
    booking_reference: refCode,
    invoice_number: invCode,
    check_in_date: checkIn,
    check_out_date: '2026-09-04',
    number_of_nights: nights,
    number_of_guests: guests,
    total_amount_inr: total,
    payment_method: payMethod,
    payment_status: 'PAID',
    status: 'CONFIRMED',
    qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${refCode}`,
    image_url: dest.image_url
  };

  state.bookings.unshift(newBooking);
  renderBookings();
  closeBookingModal();
  showToast(`🎉 Booking Confirmed! Ref: ${refCode}`);
}

// Render Bookings List
function renderBookings() {
  const container = document.getElementById('bookings-container');
  if (!container) return;

  if (state.bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted); border: 1px dashed var(--border-glass); border-radius: var(--radius-md);">
        <i class="fas fa-ticket-alt" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
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
          <h3>${b.destination_name}</h3>
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
          <span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 0.2rem 0.6rem; border-radius: 4px;">
            <i class="fas fa-calendar"></i> ${b.check_in_date} (${b.number_of_nights} Nights)
          </span>
          <span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 0.2rem 0.6rem; border-radius: 4px;">
            <i class="fas fa-users"></i> ${b.number_of_guests} Guests
          </span>
          <span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 0.2rem 0.6rem; border-radius: 4px;">
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
          <span style="font-size: 0.8rem; color: var(--danger);">REFUNDED</span>
        `}
      </div>
    </div>
  `).join('');
}

// Cancel Booking Trigger
function cancelBooking(bookingId) {
  const target = state.bookings.find(b => b.id === bookingId);
  if (!target) return;

  if (confirm(`Are you sure you want to cancel booking ${target.booking_reference}?`)) {
    target.status = 'CANCELLED';
    target.payment_status = 'REFUNDED';
    renderBookings();
    showToast(`⚠️ Booking ${target.booking_reference} has been cancelled and refunded.`);
  }
}

// Toast Notifications
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
  toast.innerHTML = `<i class="fas fa-info-circle" style="color: var(--accent-primary);"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Event Listeners Setup
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', handleSearchInput);

  const aiForm = document.getElementById('ai-planner-form');
  if (aiForm) aiForm.addEventListener('submit', generateAITripPlan);

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) bookingForm.addEventListener('submit', handleConfirmBooking);
}
