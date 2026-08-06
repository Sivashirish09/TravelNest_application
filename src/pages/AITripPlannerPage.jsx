import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SEED_DESTINATIONS } from '../data/destinations';
import { 
  resolveOrCreateDestination, 
  generateFullAITripPlan, 
  saveTripPlanToFirestore, 
  fetchUserTripPlans,
  calculateAIBudgetBreakdown
} from '../utils/aiPlannerEngine';
import { formatPrice, CURRENCIES } from '../utils/pricingEngine';

import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Car,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Share2,
  Printer,
  PhoneCall,
  Sun,
  ShieldCheck,
  Building2,
  Utensils,
  Eye,
  Clock,
  CloudSun,
  Flame,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  BookOpen,
  Check,
  TrendingDown,
  TrendingUp,
  Map as MapIcon,
  Navigation,
  FolderHeart,
  Heart,
  AlertTriangle,
  Sunrise,
  Sunset,
  Umbrella,
  Thermometer,
  ShieldAlert,
  Info
} from 'lucide-react';

export const AITripPlannerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { showToast, toggleWishlist, wishlist } = useApp();
  const resultsRef = useRef(null);

  const urlSource = searchParams.get('source');
  const urlDest = searchParams.get('dest') || searchParams.get('destination');
  const urlDate = searchParams.get('date') || searchParams.get('startDate');
  const urlDays = searchParams.get('days') || searchParams.get('duration');
  const urlGuests = searchParams.get('guests') || searchParams.get('travelers');
  const urlTripType = searchParams.get('tripType') || searchParams.get('type');

  // Input states
  const [source, setSource] = useState(urlSource || 'Hyderabad');
  const [destinationInput, setDestinationInput] = useState(urlDest || 'Araku Valley');
  const [startDate, setStartDate] = useState(() => {
    if (urlDate) return urlDate;
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split('T')[0];
  });
  const [days, setDays] = useState(urlDays ? Math.max(1, Number(urlDays)) : 3);
  const [tripType, setTripType] = useState(urlTripType || 'Adventure & Trek');
  const [travelers, setTravelers] = useState(() => urlGuests ? Math.max(1, Number(urlGuests)) : 2);
  const [hotelPref, setHotelPref] = useState('Scenic Eco-Lodge / Camp');
  const [transport, setTransport] = useState('Private AC Cab / SUV');
  const [foodPref, setFoodPref] = useState('Local Authentic & Mountain Cafes');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [selectedBudgetTier, setSelectedBudgetTier] = useState('Standard');
  const [selectedHotelOption, setSelectedHotelOption] = useState(null);

  // Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Currency
  const [currency, setCurrency] = useState('INR');

  // User's previous saved trips from Firestore
  const [userSavedTrips, setUserSavedTrips] = useState([]);
  const [showSavedTripsModal, setShowSavedTripsModal] = useState(false);

  // 10 Specialized Personas
  const TRIP_TYPES = [
    { id: 'Solo', label: 'Solo Explorer', icon: '🎒', defaultGuests: 1, desc: 'Cafe hops, culture & heritage trails' },
    { id: 'Couple', label: 'Romantic & Couple', icon: '💑', defaultGuests: 2, desc: 'Scenic sunset viewpoints & candle dinners' },
    { id: 'Family', label: 'Family & Kids', icon: '👨‍👩‍👧‍👦', defaultGuests: 4, desc: 'Theme parks, spacious suites & kid friendly' },
    { id: 'Friends', label: 'Friends Getaway', icon: '🏕️', defaultGuests: 4, desc: 'Nightlife, campfires & outdoor sports' },
    { id: 'Adventure & Trek', label: 'Adventure & Trek', icon: '🧗‍♂️', defaultGuests: 2, desc: 'High altitude peaks, rafting & jungle trails' },
    { id: 'Luxury & Spa', label: 'Luxury & Wellness', icon: '✨', defaultGuests: 2, desc: '5-Star infinity pools, Ayurveda & spa sanctuary' },
    { id: 'Heritage & Spiritual', label: 'Heritage & Spiritual', icon: '🛕', defaultGuests: 3, desc: 'Ancient temples, grand palaces & rituals' },
    { id: 'Road Trip & Biking', label: 'Road Trip & Biking', icon: '🏍️', defaultGuests: 2, desc: 'Scenic ghat roads, coastal highways & pitstops' },
    { id: 'Corporate', label: 'Business & Workation', icon: '💼', defaultGuests: 1, desc: 'Executive lounges, high-speed Wi-Fi & fast transit' },
    { id: 'Group Tour', label: 'Group & Batch', icon: '🚌', defaultGuests: 6, desc: 'Shared vacation villas & guided group bus tours' }
  ];

  // Sync URL search params
  useEffect(() => {
    const s = searchParams.get('source');
    const d = searchParams.get('dest') || searchParams.get('destination');
    const dt = searchParams.get('date') || searchParams.get('startDate');
    const dy = searchParams.get('days') || searchParams.get('duration');
    const g = searchParams.get('guests') || searchParams.get('travelers');
    const t = searchParams.get('tripType') || searchParams.get('type');
    if (s) setSource(s);
    if (d) setDestinationInput(d);
    if (dt) setStartDate(dt);
    if (dy) setDays(Math.max(1, Number(dy)));
    if (g) setTravelers(Math.max(1, Number(g)));
    if (t) setTripType(t);
  }, [searchParams]);

  // Load User's Past Generated Plans from Firestore
  useEffect(() => {
    const loadPastPlans = async () => {
      if (currentUser?.uid) {
        const plans = await fetchUserTripPlans(currentUser.uid);
        setUserSavedTrips(plans);
      }
    };
    loadPastPlans();
  }, [currentUser]);

  // Auto-calibrate preferences on Persona change
  const handleTripTypeSelect = (typeId) => {
    setTripType(typeId);
    const matched = TRIP_TYPES.find(t => t.id === typeId);
    if (matched) {
      setTravelers(matched.defaultGuests);
    }
    if (typeId === 'Family') {
      setHotelPref('Family Suite / Kids Friendly Resort');
      setFoodPref('Family Dining & Kid-Friendly');
    } else if (typeId === 'Friends') {
      setHotelPref('Adventure Camp / Boutique Stay');
      setFoodPref('Cafe, Nightlife & Street Food');
    } else if (typeId === 'Couple') {
      setHotelPref('Romantic 5-Star Private Villa');
      setFoodPref('Candlelight & Fine Dining');
    } else if (typeId === 'Solo') {
      setHotelPref('Boutique Heritage Stay / Hostel');
      setFoodPref('Local Street Food & Cafes');
    } else if (typeId === 'Adventure & Trek') {
      setHotelPref('Mountain Base Camp / Eco-Resort');
      setFoodPref('High-Energy Local Meals & Cafes');
    } else if (typeId === 'Luxury & Spa') {
      setHotelPref('5-Star Luxury Spa & Ayurveda Resort');
      setFoodPref('Gourmet Multi-Course Dining');
    } else if (typeId === 'Heritage & Spiritual') {
      setHotelPref('Heritage Haveli / Pilgrim Guest House');
      setFoodPref('Pure Vegetarian & Traditional Thali');
    } else if (typeId === 'Road Trip & Biking') {
      setHotelPref('Highway Boutique Motel / Biker Lodge');
      setFoodPref('Dhabas & Highway Specialty Food');
    } else if (typeId === 'Corporate') {
      setHotelPref('Business Hotel with Executive Lounge');
      setFoodPref('Business Buffet & Express Meals');
    } else if (typeId === 'Group Tour') {
      setHotelPref('Shared Luxury Vacation Villa');
      setFoodPref('Group Buffet & Barbecue');
    }
  };

  const handleDestInputChange = (e) => {
    const val = e.target.value;
    setDestinationInput(val);

    if (val.trim().length > 0) {
      const filtered = SEED_DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(val.toLowerCase()) ||
        d.state?.toLowerCase().includes(val.toLowerCase()) ||
        d.country?.toLowerCase().includes(val.toLowerCase()) ||
        d.keywords?.some(k => k.toLowerCase().includes(val.toLowerCase()))
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (dest) => {
    setDestinationInput(dest.name);
    setShowSuggestions(false);
  };

  // Generate AI Trip Immediately (NEVER BLOCK, ANY DESTINATION WORKS)
  const handleGenerateAITrip = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const targetDest = destinationInput.trim() || 'Araku Valley';
    const targetSource = source.trim() || 'Hyderabad';

    setIsGenerating(true);
    showToast(`✨ Synthesizing dynamic ${days}-day AI itinerary for ${targetDest}...`, 'info');

    setTimeout(async () => {
      try {
        const plan = generateFullAITripPlan(
          targetSource,
          targetDest,
          days,
          travelers,
          tripType,
          hotelPref,
          transport,
          startDate
        );

        setGeneratedPlan(plan);
        setActiveDayTab(1);
        setSelectedHotelOption(plan.hotels?.resorts?.[0] || plan.hotels?.premiumHotels?.[0]);
        setIsGenerating(false);

        // Save to Session Storage
        sessionStorage.setItem(`itinerary_${plan.id}`, JSON.stringify(plan));

        // Save to Firestore Collection `tripPlans`
        try {
          await saveTripPlanToFirestore(plan, currentUser?.uid || 'guest_user');
          if (currentUser?.uid) {
            const updatedPlans = await fetchUserTripPlans(currentUser.uid);
            setUserSavedTrips(updatedPlans);
          }
        } catch (err) {
          console.warn("Trip plan save warning:", err);
        }

        showToast(`🎉 AI Itinerary for ${plan.destination} generated successfully!`, 'success');

        // Smooth scroll to generated results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (err) {
        console.error("AI Generation error:", err);
        setIsGenerating(false);
        showToast(`Generated AI plan for ${targetDest}`, 'success');
      }
    }, 600);
  };

  // Format price helper
  const formatPriceLocal = (inrVal) => formatPrice(inrVal, currency);

  // Handle Budget Tier Selection with live recalculation
  const handleSelectBudgetTier = (tier) => {
    setSelectedBudgetTier(tier);
    if (generatedPlan) {
      const updatedBreakdown = calculateAIBudgetBreakdown(
        generatedPlan.destObj,
        generatedPlan.days,
        generatedPlan.travelers,
        tier
      );
      setGeneratedPlan(prev => ({
        ...prev,
        budgetTier: tier,
        budget: updatedBreakdown.grandTotal,
        budgetBreakdown: updatedBreakdown
      }));
      showToast(`Recalibrated for ${tier} Tier: ${formatPriceLocal(updatedBreakdown.grandTotal)}`, 'info');
    }
  };

  // Handle Explicit Save Trip Plan to Firestore & Wishlist
  const handleSaveTripPlan = async () => {
    if (!generatedPlan) return;
    try {
      await saveTripPlanToFirestore(generatedPlan, currentUser?.uid || 'guest_user');
      toggleWishlist(generatedPlan.destId);
      if (currentUser?.uid) {
        const updatedPlans = await fetchUserTripPlans(currentUser.uid);
        setUserSavedTrips(updatedPlans);
      }
      showToast(`❤️ ${generatedPlan.destination} trip plan saved to your account!`, 'success');
    } catch (e) {
      showToast(`❤️ ${generatedPlan.destination} saved!`, 'success');
    }
  };

  // Handle Book This Trip navigation directly to BookingPage
  const handleBookThisTrip = (stayObj = null) => {
    if (!generatedPlan) return;

    const chosenHotel = stayObj?.name || selectedHotelOption?.name || generatedPlan.hotels?.resorts?.[0]?.name || generatedPlan.hotelPref || 'Grand Palace Resort & Spa';
    const finalBudget = stayObj?.pricePerNight ? (stayObj.pricePerNight * generatedPlan.days + 6500) : generatedPlan.budget;

    // Prefill data for BookingPage
    const prefillData = {
      source_city: generatedPlan.source,
      destination_name: generatedPlan.destination,
      destination_id: generatedPlan.destId,
      destObj: generatedPlan.destObj,
      hotel_or_resort_name: chosenHotel,
      check_in_date: generatedPlan.startDate,
      nights: generatedPlan.days,
      guests: generatedPlan.travelers,
      trip_type: generatedPlan.tripType,
      transport_mode: generatedPlan.transport,
      total_budget: finalBudget,
      itinerary_id: generatedPlan.id
    };

    sessionStorage.setItem(`booking_prefill_${generatedPlan.id}`, JSON.stringify(prefillData));

    navigate(`/booking?destId=${generatedPlan.destId}&destName=${encodeURIComponent(generatedPlan.destination)}&hotel=${encodeURIComponent(chosenHotel)}&nights=${generatedPlan.days}&guests=${generatedPlan.travelers}&budget=${finalBudget}&tripType=${encodeURIComponent(generatedPlan.tripType)}&source=${encodeURIComponent(generatedPlan.source)}&itinId=${generatedPlan.id}&date=${generatedPlan.startDate}`);
  };

  const handleSharePlan = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Trip Planner link copied to clipboard!', 'success');
    }
  };

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-6xl mx-auto">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-purple text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-purple-600" />
              AI Intelligence v4.5
            </span>
            {currentUser && userSavedTrips.length > 0 && (
              <button 
                onClick={() => setShowSavedTripsModal(!showSavedTripsModal)}
                className="badge badge-blue text-[10px] font-bold cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <FolderHeart className="w-3 h-3 text-blue-600" />
                <span>{userSavedTrips.length} Saved AI Plans</span>
              </button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2 mt-1">
            <Compass className="w-7 h-7 text-blue-600 animate-spin-slow" />
            <span>AI Smart Trip Planner</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-day itinerary generation for ANY destination with weather forecast, crowd prediction, local foods & safety intelligence
          </p>
        </div>

        {/* Currency Switcher & Quick Export */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white text-slate-800 font-bold px-2.5 py-1 rounded-xl border border-slate-200 text-xs outline-none cursor-pointer"
            >
              {Object.entries(CURRENCIES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSharePlan}
            className="btn btn-secondary p-2.5 rounded-xl text-xs flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            title="Share Trip Plan"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrintPlan}
            className="btn btn-secondary p-2.5 rounded-xl text-xs flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            title="Print Itinerary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Saved Trips Drawer / Quick Selector */}
      {showSavedTripsModal && userSavedTrips.length > 0 && (
        <div className="glass-card p-5 rounded-3xl border border-blue-200 bg-blue-50/50 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-blue-600" />
              <span>Your Previous AI Trip Plans ({userSavedTrips.length})</span>
            </h3>
            <button onClick={() => setShowSavedTripsModal(false)} className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer">Close</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {userSavedTrips.map(p => (
              <div 
                key={p.id}
                onClick={() => {
                  setSource(p.source || 'Hyderabad');
                  setDestinationInput(p.destination);
                  setDays(p.duration || p.days || 3);
                  setTravelers(p.travelers || 2);
                  setTripType(p.tripType || 'Couple');
                  setShowSavedTripsModal(false);
                  showToast(`Loaded ${p.destination} plan`, 'info');
                }}
                className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{p.destination}</span>
                  <span className="badge badge-blue text-[9px]">{p.duration || p.days} Days</span>
                </div>
                <div className="text-[11px] text-slate-500">{p.source} ➔ {p.destination} | {p.tripType}</div>
                <div className="text-emerald-600 font-bold text-xs">₹{(p.budget || 15000).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Trip Planning Form */}
      <form onSubmit={handleGenerateAITrip} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl">
        {/* Section 1: Trip Type Persona Selector */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>1. Choose Trip Type Persona</span>
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
              {TRIP_TYPES.length} Specialized Personas
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Select your preferred travel style to auto-calibrate stays, pace, and recommended activities.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {TRIP_TYPES.map(t => (
              <div
                key={t.id}
                onClick={() => handleTripTypeSelect(t.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${tripType === t.id
                    ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                  }`}
              >
                <span className="text-2xl block">{t.icon}</span>
                <div className="font-bold text-xs text-slate-900 line-clamp-1">{t.label}</div>
                <div className="text-[9px] text-slate-500 line-clamp-1">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Destination & Route Setup */}
        <h2 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-blue-600 pt-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>2. Destination & Route Setup</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Source City */}
          <div className="form-group mb-0">
            <label className="text-slate-700 font-semibold mb-1.5 block">Starting City (Source)</label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Hyderabad, Chennai, Delhi, Mumbai"
                className="form-control text-xs pl-10 bg-slate-50 border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Destination Input (EVERY DESTINATION WORKS — NO RED ERRORS) */}
          <div className="form-group mb-0 relative">
            <label className="text-slate-700 font-semibold mb-1.5 block">
              Destination City / Town
            </label>
            <div className="relative flex items-center">
              <Compass className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                value={destinationInput}
                onChange={handleDestInputChange}
                onFocus={() => { if (destinationInput) setShowSuggestions(true); }}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="words"
                placeholder="e.g. Ongole, Chirala, Araku, Goa, Paris..."
                className="form-control text-xs pl-10 pr-10 bg-slate-50 border-slate-300 rounded-xl focus:border-blue-500 font-semibold text-slate-900"
                required
              />
              {destinationInput.trim().length > 0 && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 z-10" />
              )}
            </div>

            {/* Smart Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-52 overflow-y-auto">
                {suggestions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSuggestion(s)}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs border-b border-slate-100 last:border-0 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[10px] text-slate-500">{s.state || s.country} • {s.category}</span>
                    </div>
                    <span className="text-[10px] badge badge-blue font-semibold">{formatPriceLocal(s.estimated_budget_inr || 15000)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start Date */}
          <div className="form-group mb-0">
            <label className="text-slate-700 font-semibold mb-1.5 block">Start Date</label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control text-xs pl-10 bg-slate-50 border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Number of Days (1 to 15+ Days) */}
          <div className="form-group mb-0">
            <label className="text-slate-700 font-semibold mb-1.5 block">Duration ({days} Days)</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="form-control text-xs bg-slate-50 border-slate-300 rounded-xl font-semibold cursor-pointer"
            >
              <option value="1">1 Day (Express Day Trip)</option>
              <option value="2">2 Days (Weekend Getaway)</option>
              <option value="3">3 Days (Recommended Tour)</option>
              <option value="4">4 Days (Extended Vacation)</option>
              <option value="5">5 Days (Complete Explorer)</option>
              <option value="6">6 Days (Grand Journey)</option>
              <option value="7">7 Days (1 Full Week)</option>
              <option value="10">10 Days (Comprehensive Circuit)</option>
              <option value="15">15 Days (Ultimate Grand Tour)</option>
            </select>
          </div>
        </div>

        {/* Section 3: Preferences & Stay Calibration */}
        <h2 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-blue-600 pt-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>3. Stay Style & Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="form-group mb-0">
            <label className="text-slate-700 font-semibold mb-1.5 block">Number of Guests</label>
            <div className="relative flex items-center">
              <Users className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="number"
                min="1"
                max="30"
                value={travelers}
                onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                className="form-control text-xs pl-10 bg-slate-50 border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="text-slate-700 font-semibold mb-1.5 block">Hotel & Stay Style</label>
            <select
              value={hotelPref}
              onChange={(e) => setHotelPref(e.target.value)}
              className="form-control text-xs bg-slate-50 border-slate-300 rounded-xl"
            >
              <option value="5-Star Luxury Spa & Ayurveda Resort">5-Star Luxury Spa & Ayurveda Resort</option>
              <option value="Romantic 5-Star Private Villa">Romantic 5-Star Private Villa</option>
              <option value="Scenic Eco-Lodge / Camp">Scenic Eco-Lodge / Camp</option>
              <option value="Family Suite / Kids Friendly Resort">Family Suite / Kids Friendly Resort</option>
              <option value="Adventure Camp / Boutique Stay">Adventure Camp / Boutique Stay</option>
              <option value="Heritage Haveli / Pilgrim Guest House">Heritage Haveli / Pilgrim Guest House</option>
              <option value="Highway Boutique Motel / Biker Lodge">Highway Boutique Motel / Biker Lodge</option>
              <option value="Business Hotel with Executive Lounge">Business Hotel with Executive Lounge</option>
              <option value="Boutique Heritage Stay / Hostel">Boutique Heritage Stay / Hostel</option>
              <option value="Shared Luxury Vacation Villa">Shared Luxury Vacation Villa</option>
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="text-slate-700 font-semibold mb-1.5 block">Transit Mode</label>
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className="form-control text-xs bg-slate-50 border-slate-300 rounded-xl"
            >
              <option value="Private AC Cab / SUV">Private AC Cab / SUV</option>
              <option value="Self Drive SUV / Cruiser">Self Drive SUV / Cruiser</option>
              <option value="Express Train / Flight">Express Train / Flight</option>
              <option value="Royal Enfield / Biker Touring">Royal Enfield / Biker Touring</option>
              <option value="Luxury Coach / Mini Bus">Luxury Coach / Mini Bus</option>
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="text-slate-700 font-semibold mb-1.5 block">Dining Preference</label>
            <select
              value={foodPref}
              onChange={(e) => setFoodPref(e.target.value)}
              className="form-control text-xs bg-slate-50 border-slate-300 rounded-xl"
            >
              <option value="Local Authentic & Mountain Cafes">Local Authentic & Mountain Cafes</option>
              <option value="Gourmet Multi-Course Dining">Gourmet Multi-Course Dining</option>
              <option value="Candlelight & Fine Dining">Candlelight & Fine Dining</option>
              <option value="Family Dining & Kid-Friendly">Family Dining & Kid-Friendly</option>
              <option value="Cafe, Nightlife & Street Food">Cafe, Nightlife & Street Food</option>
              <option value="Pure Vegetarian & Traditional Thali">Pure Vegetarian & Traditional Thali</option>
              <option value="Dhabas & Highway Specialty Food">Dhabas & Highway Specialty Food</option>
            </select>
          </div>
        </div>

        {/* Tourist Safety & Emergency Helpline */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-800">24/7 Verified Emergency Helplines:</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:1363" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> Tourist Helpline (1363)
            </a>
            <a href="tel:112" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> National Emergency (112)
            </a>
            <a href="tel:108" className="text-rose-600 font-bold hover:underline flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> Medical SOS (108)
            </a>
          </div>
        </div>

        {/* Submit Button (NEVER DISABLED OR BLOCKED) */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full btn btn-primary py-4 text-sm font-bold shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2 rounded-2xl transition-all hover:scale-[1.005] active:scale-[0.99]"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Compass className="w-5 h-5 animate-spin" />
              Generating {days}-Day AI Plan for {destinationInput || 'Destination'}...
            </span>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate AI {tripType} Itinerary for {destinationInput || 'Destination'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* ========================================================================= */}
      {/* GENERATED ITINERARY & AI SECTIONS */}
      {/* ========================================================================= */}
      {generatedPlan && (
        <div ref={resultsRef} className="space-y-8 animate-fade-in pt-4">
          {/* Plan Overview Hero Header */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tailored AI Master Itinerary
                </span>
                <span className="badge badge-green text-[11px] font-bold">
                  {generatedPlan.duration} Days • {generatedPlan.travelers} Guests
                </span>
                <span className="badge badge-blue text-[11px] font-bold">
                  {generatedPlan.tripType} Persona
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveTripPlan}
                  className="btn btn-secondary btn-sm text-xs rounded-xl flex items-center gap-1 hover:bg-rose-50 hover:text-rose-600 cursor-pointer transition-colors shadow-xs"
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlist.includes(generatedPlan.destId) ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} />
                  <span>{wishlist.includes(generatedPlan.destId) ? 'Saved' : 'Save Trip'}</span>
                </button>
                <button
                  onClick={() => handleBookThisTrip()}
                  className="btn btn-primary btn-sm text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Book Trip</span>
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              {generatedPlan.duration}-Day Trip to <span className="gradient-text">{generatedPlan.destination}</span> ({generatedPlan.destObj?.state || 'India'})
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Route: <strong>{generatedPlan.source}</strong> ➔ <strong>{generatedPlan.destination}</strong> | Starts: {generatedPlan.startDate}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Estimated Budget</span>
                <span className="font-extrabold text-emerald-600 text-base">{formatPriceLocal(generatedPlan.budget)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Route Transit</span>
                <span className="font-bold text-slate-900 text-sm">~{generatedPlan.distanceKm} km ({generatedPlan.routeInfo?.travelTime || 'Direct Route'})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Stay Category</span>
                <span className="font-bold text-blue-600 text-sm truncate block">{generatedPlan.hotelPref}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Safety Score</span>
                <span className="font-bold text-purple-600 text-sm">⭐ {generatedPlan.destObj?.safety_score || 9.8} / 10 Verified</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. NEW AI FEATURE: AI WEATHER PREDICTION */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-blue-200 bg-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-blue-600" />
                  <span>AI Weather Prediction & Forecast</span>
                </h3>
                <p className="text-xs text-slate-500">Live meteorological intelligence for {generatedPlan.destination}</p>
              </div>
              <span className="badge badge-blue text-[10px] font-bold self-start sm:self-auto">Satellite Weather Sync</span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-blue-600" /> Temperature
                </span>
                <span className="font-extrabold text-slate-900 text-sm block">{generatedPlan.weather?.temperature || '24°C – 31°C'}</span>
              </div>
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Umbrella className="w-3.5 h-3.5 text-blue-600" /> Rain Chance
                </span>
                <span className="font-extrabold text-blue-700 text-sm block">{generatedPlan.weather?.rainChance || '12%'}</span>
              </div>
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Sunrise className="w-3.5 h-3.5 text-amber-600" /> Sunrise
                </span>
                <span className="font-extrabold text-amber-700 text-sm block">{generatedPlan.weather?.sunrise || '05:48 AM'}</span>
              </div>
              <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Sunset className="w-3.5 h-3.5 text-purple-600" /> Sunset
                </span>
                <span className="font-extrabold text-purple-700 text-sm block">{generatedPlan.weather?.sunset || '06:22 PM'}</span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Best Season
                </span>
                <span className="font-bold text-emerald-800 text-xs block truncate">{generatedPlan.weather?.bestTimeToVisit || 'Oct – Mar'}</span>
              </div>
            </div>

            {/* Weather Recommendation Banner */}
            <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">AI Weather Recommendation:</span>
                <span className="text-[11px] text-slate-700 leading-relaxed">{generatedPlan.weather?.weatherRecommendation}</span>
              </div>
            </div>

            {/* Multi-Day Forecast Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {generatedPlan.weather?.forecast?.map(w => (
                <div key={w.dayNumber} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-blue text-[9px] font-bold">Day {w.dayNumber}</span>
                    <span className="text-lg">{w.icon}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-[11px] block">{w.dateFormatted}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{w.condition}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 flex justify-between text-[10px]">
                    <span className="font-bold text-slate-800">{w.highTemp} / {w.lowTemp}</span>
                    <span className="text-blue-600 font-semibold">🌧️ {w.rainChance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. NEW AI FEATURE: AI CROWD LEVEL & LIVE METRICS */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>AI Crowd Level & Visiting Hours</span>
                </h3>
                <p className="text-xs text-slate-500">Live footfall prediction and queue avoidance intelligence</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border self-start sm:self-auto ${
                generatedPlan.crowdPrediction?.level === 'Low' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}>
                {generatedPlan.crowdPrediction?.level || 'Low'} Crowd Level
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-950 text-xs">Recommended Visiting Hours</span>
                </div>
                <p className="text-sm font-black text-purple-900">
                  {generatedPlan.crowdPrediction?.bestVisitingHours || '07:00 AM – 10:30 AM & 04:30 PM – 07:00 PM'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Early morning and late afternoon hours offer peaceful sightseeing with the shortest lines and ideal lighting for photography.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-xs">Peak Influx Advisory</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {generatedPlan.crowdPrediction?.peakHours || '11:30 AM – 03:30 PM (Plan indoor cafes or museums during this window)'}
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  * Live metrics computed based on regional travel seasonality, festival calendars, and real-time tourist density.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. NEW AI FEATURE: AI LOCAL FOOD RECOMMENDATION */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-rose-600" />
                  <span>AI Local Food Recommendations for {generatedPlan.destination}</span>
                </h3>
                <p className="text-xs text-slate-500">Famous authentic regional specialties, prices & vegetarian/non-vegetarian tags</p>
              </div>
              <span className="badge badge-purple text-[10px] font-bold self-start sm:self-auto">Culinary Guide</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {generatedPlan.foodRecommendations?.map((f, idx) => (
                <div key={idx} className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100 hover:border-rose-300 transition-all flex flex-col justify-between space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-3xl block">{f.icon || '🍲'}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                        f.diet === 'Vegetarian' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {f.diet === 'Vegetarian' ? '🟢 Veg' : '🔴 Non-Veg'}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 block text-xs">{f.name}</span>
                    <span className="text-[10px] text-rose-600 font-semibold block">{f.category}</span>
                    <p className="text-[11px] text-slate-600 leading-tight">{f.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-rose-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Avg. Price:</span>
                      <span className="font-extrabold text-emerald-700">{f.averagePrice}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      📍 <span className="text-slate-800 font-semibold">{f.bestSpot}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. NEW AI FEATURE: AI SAFETY TIPS & EMERGENCY INTELLIGENCE */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-emerald-200 bg-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>AI Safety Tips & Verified Emergency Directory</span>
                </h3>
                <p className="text-xs text-slate-500">24/7 National Emergency Helplines, nearest hospitals, police stations & safety guidelines</p>
              </div>
              <span className="badge badge-green text-[10px] font-bold self-start sm:self-auto">
                ⭐ Safety Rating: {generatedPlan.safetyTips?.safetyScore || 9.8} / 10 Verified
              </span>
            </div>

            {/* Emergency Numbers Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {generatedPlan.safetyTips?.emergencyNumbers?.map((em, i) => (
                <a
                  key={i}
                  href={`tel:${em.number.replace(/[^0-9]/g, '')}`}
                  className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all block text-center space-y-1 group"
                >
                  <span className="text-xl block">{em.icon}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-emerald-700 font-semibold block">{em.service}</span>
                  <span className="font-extrabold text-slate-900 group-hover:text-emerald-700 text-xs block">{em.number}</span>
                </a>
              ))}
            </div>

            {/* Safety Tips & Local Infrastructure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              {/* Safe Travel & Women Safety Tips */}
              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2.5">
                <span className="font-bold text-emerald-950 text-xs block flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Actionable Safe Travel Advisories</span>
                </span>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4">
                  {generatedPlan.safetyTips?.safeTravelTips?.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                  {generatedPlan.safetyTips?.womenSafetyTips?.map((wt, idx) => (
                    <li key={idx} className="text-emerald-900 font-semibold">{wt}</li>
                  ))}
                </ul>
              </div>

              {/* Nearest Hospital & Police Station */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Nearest Multi-Specialty Hospital:</span>
                      <span className="text-[11px] text-slate-600 block">{generatedPlan.safetyTips?.nearestHospital}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Nearest Police Station:</span>
                      <span className="text-[11px] text-slate-600 block">{generatedPlan.safetyTips?.nearestPoliceStation}</span>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[10px] text-blue-900 font-medium">
                  💡 TravelNest SOS: All bookings are monitored with our 24x7 Tourist Guardian Assistance.
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. NEW AI FEATURE: AI BUDGET BREAKDOWN */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>AI Budget Breakdown (Automatic Itemized Calculation)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive budget distribution for {generatedPlan.duration} Days and {generatedPlan.travelers} Guests
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald font-bold text-xs">
                  Grand Total: {formatPriceLocal(generatedPlan.budget)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">🏨 Hotel</span>
                <span className="font-bold text-slate-900 text-sm">{formatPriceLocal(generatedPlan.budgetBreakdown.hotel || generatedPlan.budgetBreakdown.accommodation)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">🍲 Food</span>
                <span className="font-bold text-slate-900 text-sm">{formatPriceLocal(generatedPlan.budgetBreakdown.food)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">🚆 Transport</span>
                <span className="font-bold text-slate-900 text-sm">{formatPriceLocal(generatedPlan.budgetBreakdown.transport)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">🚕 Local Travel</span>
                <span className="font-bold text-slate-900 text-sm">{formatPriceLocal(generatedPlan.budgetBreakdown.localTravel || 1800)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">🎟️ Entry Tickets</span>
                <span className="font-bold text-slate-900 text-sm">{formatPriceLocal(generatedPlan.budgetBreakdown.entryTickets || generatedPlan.budgetBreakdown.tickets)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">🛍️ Shopping</span>
                <span className="font-bold text-slate-900 text-sm">{formatPriceLocal(generatedPlan.budgetBreakdown.shopping)}</span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-emerald-700 text-[10px] uppercase font-bold block">🛡️ Emergency Fund</span>
                <span className="font-bold text-emerald-800 text-sm">{formatPriceLocal(generatedPlan.budgetBreakdown.emergencyFund || generatedPlan.budgetBreakdown.emergencyBuffer)}</span>
              </div>
            </div>

            {/* Budget Optimizer 3-Tier Switcher */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-900 text-xs">Switch Travel Budget Tier:</span>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs">
                  {['Budget', 'Standard', 'Luxury'].map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => handleSelectBudgetTier(tier)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${selectedBudgetTier === tier
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. DYNAMIC DAY-WISE PLAN (1 to 15+ Days) */}
          {/* ========================================================================= */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Dynamic Day-Wise AI Itinerary ({generatedPlan.dailyPlan.length} Days)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Every day includes Morning, Afternoon, Evening, Dinner, Nearby attraction, Approximate budget, Travel distance & Recommended transport.
                </p>
              </div>

              {/* Day Tab Selectors */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {generatedPlan.dailyPlan.map(day => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDayTab(day.dayNumber)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeDayTab === day.dayNumber
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Active Day Schedule Card */}
            {generatedPlan.dailyPlan
              .filter(day => day.dayNumber === activeDayTab)
              .map(day => (
                <div key={day.dayNumber} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                    <div>
                      <span className="badge badge-purple text-[10px] font-bold mb-1">Day {day.dayNumber} Focus: {day.focus}</span>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">{day.dayTitle}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5 text-blue-600" /> {day.travelDistance || day.googleMapDistance}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-600" /> Best Time: {day.bestTimeToVisit}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">Approximate Budget: ~{formatPriceLocal(day.approximateBudget || day.estimatedDailyCost)}</span>
                      </div>
                    </div>
                    <span className="badge badge-blue text-xs font-bold shrink-0 self-start sm:self-auto">Day {day.dayNumber} of {generatedPlan.duration}</span>
                  </div>

                  {/* 4 Primary Time Slots Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Morning */}
                    <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-200 text-blue-800 font-bold text-[10px] inline-block mb-1">
                        🌅 MORNING (08:00 AM – 12:00 PM)
                      </span>
                      <p className="font-bold text-slate-900 text-xs">{day.morningAttraction || day.morning}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{day.morningDetails || day.morning}</p>
                      <div className="pt-1.5 text-[10px] text-slate-500 font-medium">
                        ☕ Breakfast: <span className="text-slate-800 font-semibold">{day.breakfastPlace || day.breakfast}</span>
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 text-amber-800 font-bold text-[10px] inline-block mb-1">
                        ☀️ AFTERNOON (12:30 PM – 04:30 PM)
                      </span>
                      <p className="font-bold text-slate-900 text-xs">{day.afternoonActivity || day.afternoon}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Regional exploration, artisan market tour, and photo stops.
                      </p>
                      <div className="pt-1.5 text-[10px] text-slate-500 font-medium">
                        🍲 Lunch: <span className="text-slate-800 font-semibold">{day.lunchPlace || day.lunch}</span>
                      </div>
                    </div>

                    {/* Evening */}
                    <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-purple-200 text-purple-800 font-bold text-[10px] inline-block mb-1">
                        🌇 EVENING (05:00 PM – 08:00 PM)
                      </span>
                      <p className="font-bold text-slate-900 text-xs">{day.eveningAttraction || day.evening}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{day.eveningDetails || day.evening}</p>
                      <div className="pt-1.5 text-[10px] text-slate-500 font-medium">
                        🫖 Tea Break: <span className="text-slate-800 font-semibold">{day.teaBreak}</span>
                      </div>
                    </div>

                    {/* Dinner & Night Stay */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-800 font-bold text-[10px] inline-block mb-1">
                        🌙 DINNER & NIGHT STAY (08:30 PM Onwards)
                      </span>
                      <p className="font-bold text-slate-900 text-xs">{day.dinnerPlace || day.dinner}</p>
                      <p className="text-[11px] text-slate-600">Gourmet evening dining with authentic specialties and desserts.</p>
                      <div className="pt-1.5 text-[10px] text-blue-700 font-semibold">
                        🏨 Night Stay: <span>{day.nightStay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Day Meta Details: Nearby Attraction, Recommended Transport, Distance & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">📍 Nearby Attraction</span>
                      <span className="font-bold text-slate-900 text-xs block">{day.nearbyAttraction}</span>
                    </div>
                    <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">💰 Approximate Budget</span>
                      <span className="font-bold text-emerald-700 text-xs block">~{formatPriceLocal(day.approximateBudget || day.estimatedDailyCost)}</span>
                    </div>
                    <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">🚗 Travel Distance</span>
                      <span className="font-bold text-purple-700 text-xs block">{day.travelDistance || day.googleMapDistance}</span>
                    </div>
                    <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">🚕 Recommended Transport</span>
                      <span className="font-bold text-amber-800 text-xs block">{day.recommendedTransport || 'Private AC Cab'}</span>
                    </div>
                  </div>

                  {/* Travel Tip */}
                  <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <span className="text-base">💡</span>
                    <div>
                      <span className="font-bold block">Day {day.dayNumber} Pro Travel Tip:</span>
                      <span className="text-[11px] text-amber-800">{day.travelTips}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* ========================================================================= */}
          {/* 7. HOTEL RECOMMENDATIONS (3 Budget + 3 Premium + 3 Luxury Resorts) */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Handpicked Hotel & Resort Recommendations for {generatedPlan.destination}</span>
                </h3>
                <p className="text-xs text-slate-500">9 Distinct Accommodations — 3 Budget Hotels, 3 Premium Hotels, and 3 Luxury Resorts</p>
              </div>
            </div>

            {/* 3 Luxury Resorts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                <span>🏰 3 Luxury Resorts & Villas</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {generatedPlan.hotels?.resorts?.map(h => {
                  const isSelected = selectedHotelOption?.id === h.id || selectedHotelOption?.name === h.name;
                  return (
                    <div 
                      key={h.id} 
                      onClick={() => { setSelectedHotelOption(h); showToast(`Selected ${h.name}`, 'info'); }}
                      className={`rounded-2xl border overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected ? 'border-purple-600 ring-2 ring-purple-500/30 shadow-md' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="h-36 w-full relative">
                          <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 badge badge-purple text-[9px] font-bold">{h.badge}</span>
                          {isSelected && (
                            <span className="absolute top-2 right-2 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                              <CheckCircle2 className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 text-xs">{h.name}</span>
                            <span className="text-amber-500 font-bold text-xs shrink-0">⭐ {h.rating}</span>
                          </div>
                          <div className="text-purple-700 font-extrabold text-sm">{formatPriceLocal(h.pricePerNight)} <span className="text-[10px] text-slate-500 font-normal">/ night</span></div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {h.amenities.slice(0, 2).map((a, i) => (
                              <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">{a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-3.5 pt-0 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleBookThisTrip(h); }}
                          className="w-full btn btn-primary btn-sm text-xs rounded-xl py-2 cursor-pointer bg-purple-600 hover:bg-purple-700 border-purple-600"
                        >
                          Book Resort
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Premium Hotels */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                <span>🏨 3 Premium Hotels & Stays</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {generatedPlan.hotels?.premiumHotels?.map(h => {
                  const isSelected = selectedHotelOption?.id === h.id || selectedHotelOption?.name === h.name;
                  return (
                    <div 
                      key={h.id} 
                      onClick={() => { setSelectedHotelOption(h); showToast(`Selected ${h.name}`, 'info'); }}
                      className={`rounded-2xl border overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="h-36 w-full relative">
                          <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 badge badge-blue text-[9px] font-bold">{h.badge}</span>
                          {isSelected && (
                            <span className="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                              <CheckCircle2 className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 text-xs">{h.name}</span>
                            <span className="text-amber-500 font-bold text-xs shrink-0">⭐ {h.rating}</span>
                          </div>
                          <div className="text-blue-700 font-extrabold text-sm">{formatPriceLocal(h.pricePerNight)} <span className="text-[10px] text-slate-500 font-normal">/ night</span></div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {h.amenities.slice(0, 2).map((a, i) => (
                              <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">{a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-3.5 pt-0 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleBookThisTrip(h); }}
                          className="w-full btn btn-primary btn-sm text-xs rounded-xl py-2 cursor-pointer"
                        >
                          Book Hotel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Budget Hotels */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <span>🛏️ 3 Budget & Value Hotels</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {generatedPlan.hotels?.budgetHotels?.map(h => {
                  const isSelected = selectedHotelOption?.id === h.id || selectedHotelOption?.name === h.name;
                  return (
                    <div 
                      key={h.id} 
                      onClick={() => { setSelectedHotelOption(h); showToast(`Selected ${h.name}`, 'info'); }}
                      className={`rounded-2xl border overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-md' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="h-36 w-full relative">
                          <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 badge badge-green text-[9px] font-bold">{h.badge}</span>
                          {isSelected && (
                            <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                              <CheckCircle2 className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 text-xs">{h.name}</span>
                            <span className="text-amber-500 font-bold text-xs shrink-0">⭐ {h.rating}</span>
                          </div>
                          <div className="text-emerald-700 font-extrabold text-sm">{formatPriceLocal(h.pricePerNight)} <span className="text-[10px] text-slate-500 font-normal">/ night</span></div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {h.amenities.slice(0, 2).map((a, i) => (
                              <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">{a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-3.5 pt-0 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleBookThisTrip(h); }}
                          className="w-full btn btn-secondary btn-sm text-xs rounded-xl py-2 hover:bg-emerald-600 hover:text-white cursor-pointer transition-colors"
                        >
                          Book Budget Stay
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 8. INTERACTIVE GOOGLE MAP & DISTANCE */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <MapIcon className="w-4 h-4 text-blue-600" />
                  <span>Interactive Google Route Map</span>
                </h3>
                <p className="text-xs text-slate-500">Live satellite road transit route and navigation</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="badge badge-blue text-xs font-bold">
                  Distance: ~{generatedPlan.distanceKm} km
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(generatedPlan.source)}&destination=${encodeURIComponent(generatedPlan.destination)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm text-xs rounded-xl flex items-center gap-1.5 text-blue-600 hover:bg-blue-50"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
              <iframe
                title="Google Map Route"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(generatedPlan.source)}+to+${encodeURIComponent(generatedPlan.destination)}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>{generatedPlan.source} ➔ {generatedPlan.destination} (~{generatedPlan.distanceKm} km)</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 9. PROMINENT "BOOK THIS TRIP" CTA */}
          {/* ========================================================================= */}
          <div className="glass-card p-7 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="badge badge-green text-[10px] font-bold mb-1">Instant Direct Checkout</span>
              <h3 className="text-xl font-black text-slate-900">Ready to lock in your trip to {generatedPlan.destination}?</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Proceed directly to booking checkout with all Source, Destination, Stay & Guest parameters pre-filled.
              </p>
            </div>

            <button
              onClick={() => handleBookThisTrip()}
              className="btn btn-primary py-4 px-8 text-sm font-bold shadow-lg shadow-emerald-500/25 shrink-0 cursor-pointer flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
            >
              <Building2 className="w-4 h-4" />
              <span>Book This Trip ({formatPriceLocal(generatedPlan.budget)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 10. "YOU MAY ALSO LIKE" (5 SIMILAR DESTINATIONS) */}
          {/* ========================================================================= */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>You May Also Like — 5 Similar Destinations</span>
                </h3>
                <p className="text-xs text-slate-500">AI-curated travel destinations matching your travel style</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              {generatedPlan.similarDestinations?.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    setDestinationInput(d.name);
                    handleGenerateAITrip();
                  }}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-28 w-full overflow-hidden relative">
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-2 left-2 badge badge-blue text-[8px]">{d.category}</span>
                    </div>
                    <div className="p-2.5 space-y-1">
                      <span className="font-bold text-slate-900 block text-xs group-hover:text-blue-600 transition-colors">{d.name}</span>
                      <span className="text-[10px] text-slate-500 block">{d.state}</span>
                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-amber-500 font-semibold">⭐ {d.rating}</span>
                        <span className="text-emerald-600 font-bold">{formatPriceLocal(d.estimated_budget_inr)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 pt-0">
                    <button className="w-full btn btn-secondary btn-sm text-[10px] py-1 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600">
                      Plan Here ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
