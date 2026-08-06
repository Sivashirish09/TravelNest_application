import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SEED_DESTINATIONS } from '../data/destinations';
import {
  Search, MapPin, Calendar, Users, IndianRupee,
  Star, Heart, Map as MapIcon, Filter,
  X, ChevronDown, Check, Compass
} from 'lucide-react';

export const ExplorePage = () => {
  const { destinations, wishlist, toggleWishlist } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // --- SEARCH BAR STATE ---
  const [currentCity, setCurrentCity] = useState('Hyderabad');
  const [destSearch, setDestSearch] = useState(searchParams.get('search') || '');
  const [travelDates, setTravelDates] = useState('');
  const [numDays, setNumDays] = useState('');
  const [numTravelers, setNumTravelers] = useState('');
  const [budgetVal, setBudgetVal] = useState('');

  // Autocomplete state
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [destSuggestions, setDestSuggestions] = useState([]);

  // --- FILTER STATE ---
  const [activeFilters, setActiveFilters] = useState([]);

  // Sidebar states
  const [budgetRange, setBudgetRange] = useState([]);
  const [customBudgetMin, setCustomBudgetMin] = useState(5000);
  const [customBudgetMax, setCustomBudgetMax] = useState(200000);
  const [durationFilters, setDurationFilters] = useState([]);
  const [tripTypes, setTripTypes] = useState([]);
  const [destTypes, setDestTypes] = useState([]);
  const [travelStyles, setTravelStyles] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [hotelPrefs, setHotelPrefs] = useState([]);
  const [transportPrefs, setTransportPrefs] = useState([]);
  const [smartFilters, setSmartFilters] = useState([]);

  const [region, setRegion] = useState('All'); // All, India, International
  const [subRegion, setSubRegion] = useState([]);

  // Sorting
  const [sortBy, setSortBy] = useState('Recommended');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [compareList, setCompareList] = useState([]);

  // --- CONSTANTS ---
  const BUDGET_RANGES = ['₹5,000–₹10,000', '₹10,000–₹20,000', '₹20,000–₹40,000', '₹40,000–₹70,000', '₹70,000–₹1,00,000', '₹1,00,000–₹1,50,000', '₹1,50,000–₹2,00,000+'];
  const DURATIONS = ['1–2 Days', '3–5 Days', '6–7 Days', '8–14 Days', '15+ Days'];
  const TRIP_TYPES = ['Solo', 'Couple', 'Family', 'Friends', 'Business', 'Adventure', 'Group', 'Luxury'];
  const DEST_TYPES = ['Beach', 'Mountain', 'Hill Station', 'Heritage', 'Wildlife', 'Adventure', 'City', 'Island', 'Pilgrimage', 'Nature', 'Desert', 'Cultural'];
  const TRAVEL_STYLES = ['Relaxed', 'Balanced', 'Adventure', 'Luxury', 'Budget', 'Backpacking', 'Photography', 'Food & Culture', 'Spiritual', 'Romantic'];
  const SEASONS = ['Summer', 'Monsoon', 'Winter', 'Spring', 'Autumn', 'Best Available Season'];
  const HOTEL_PREFS = ['Budget', 'Standard', 'Premium', 'Luxury', 'Resort', 'Villa', 'Hostel'];
  const TRANSPORT = ['Flight', 'Train', 'Bus', 'Car', 'Bike', 'Mixed'];
  const SMART_FILTERS = ['Rating 4.5+', 'Safety Score 9+', 'Low Crowd Level', 'Pleasant Weather', 'Family Friendly', 'Couples Friendly', 'Adventure Score', 'Accessibility', 'Pet Friendly', 'Beach Access', 'Mountain View', 'Pool', 'Wi-Fi', 'Breakfast Included'];
  const SUB_REGIONS = ['North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India', 'Islands'];
  const SORT_OPTIONS = ['Recommended', 'Lowest Price', 'Highest Price', 'Highest Rated', 'Most Popular', 'Shortest Trip', 'Longest Trip', 'Best Value', 'Best for Families', 'Best for Couples', 'Best for Adventure', 'Luxury'];
  const CHIP_FILTERS = ['India', 'International', 'Under ₹10K', '₹10K–₹25K', '₹25K–₹50K', '₹50K+', 'Weekend', '5 Days', '7 Days', 'Beach', 'Mountain', 'Adventure', 'Luxury', 'Family', 'Couple'];

  // --- AUTOCOMPLETE LOGIC ---
  useEffect(() => {
    if (destSearch.trim().length > 0) {
      const q = destSearch.toLowerCase();
      const matches = destinations.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
      );
      setDestSuggestions(matches.slice(0, 5));
      setShowDestSuggestions(true);
    } else {
      setDestSuggestions([]);
      setShowDestSuggestions(false);
    }
  }, [destSearch, destinations]);

  const handleSelectDest = (destName) => {
    setDestSearch(destName);
    setShowDestSuggestions(false);
  };

  // --- FILTER HELPERS ---
  const addFilter = (type, value) => {
    const id = `${type}-${value}`;
    if (!activeFilters.find(f => f.id === id)) {
      setActiveFilters([...activeFilters, { id, type, value }]);
    }
  };

  const removeFilter = (id) => {
    setActiveFilters(activeFilters.filter(f => f.id !== id));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setBudgetRange([]);
    setDurationFilters([]);
    setTripTypes([]);
    setDestTypes([]);
    setTravelStyles([]);
    setSeasons([]);
    setHotelPrefs([]);
    setTransportPrefs([]);
    setSmartFilters([]);
    setRegion('All');
    setSubRegion([]);
    setCustomBudgetMin(5000);
    setCustomBudgetMax(200000);
    setDestSearch('');
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const params = new URLSearchParams();
    if (currentCity) params.set('source', currentCity);
    if (destSearch) params.set('dest', destSearch);
    if (travelDates) params.set('date', travelDates);
    if (numTravelers) params.set('guests', numTravelers);
    navigate(`/planner?${params.toString()}`);
  };

  // Update specific state lists based on activeFilters
  useEffect(() => {
    setBudgetRange(activeFilters.filter(f => f.type === 'budgetRange').map(f => f.value));
    setDurationFilters(activeFilters.filter(f => f.type === 'duration').map(f => f.value));
    setTripTypes(activeFilters.filter(f => f.type === 'tripType').map(f => f.value));
    setDestTypes(activeFilters.filter(f => f.type === 'destType').map(f => f.value));
    setTravelStyles(activeFilters.filter(f => f.type === 'travelStyle').map(f => f.value));
    setSeasons(activeFilters.filter(f => f.type === 'season').map(f => f.value));
    setHotelPrefs(activeFilters.filter(f => f.type === 'hotelPref').map(f => f.value));
    setTransportPrefs(activeFilters.filter(f => f.type === 'transport').map(f => f.value));
    setSmartFilters(activeFilters.filter(f => f.type === 'smartFilter').map(f => f.value));
    setSubRegion(activeFilters.filter(f => f.type === 'subRegion').map(f => f.value));

    const regionFilter = activeFilters.find(f => f.type === 'region');
    setRegion(regionFilter ? regionFilter.value : 'All');
  }, [activeFilters]);

  const handleCheckbox = (type, value) => {
    const id = `${type}-${value}`;
    if (activeFilters.find(f => f.id === id)) {
      removeFilter(id);
    } else {
      // If it's region, we only allow one region
      if (type === 'region') {
        let newFilters = activeFilters.filter(f => f.type !== 'region');
        newFilters.push({ id, type, value });
        setActiveFilters(newFilters);
      } else {
        addFilter(type, value);
      }
    }
  };

  const handleChipClick = (chip) => {
    if (chip === 'India') handleCheckbox('region', 'India');
    if (chip === 'International') handleCheckbox('region', 'International');
    if (chip === 'Under ₹10K') handleCheckbox('budgetRange', '₹5,000–₹10,000');
    if (chip === '₹10K–₹25K') { handleCheckbox('budgetRange', '₹10,000–₹20,000'); handleCheckbox('budgetRange', '₹20,000–₹40,000'); }
    if (chip === '₹25K–₹50K') { handleCheckbox('budgetRange', '₹20,000–₹40,000'); handleCheckbox('budgetRange', '₹40,000–₹70,000'); }
    if (chip === '₹50K+') handleCheckbox('budgetRange', '₹70,000–₹1,00,000');
    if (chip === 'Weekend') handleCheckbox('duration', '1–2 Days');
    if (chip === '5 Days') handleCheckbox('duration', '3–5 Days');
    if (chip === '7 Days') handleCheckbox('duration', '6–7 Days');
    if (['Beach', 'Mountain'].includes(chip)) handleCheckbox('destType', chip);
    if (['Adventure', 'Luxury', 'Family', 'Couple'].includes(chip)) handleCheckbox('tripType', chip);
  };

  // --- FILTERING LOGIC ---
  const filtered = useMemo(() => {
    return destinations.filter(d => {
      // 1. Search
      if (destSearch) {
        const q = destSearch.toLowerCase();
        if (!(d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) || d.country.toLowerCase().includes(q))) {
          return false;
        }
      }

      // 2. Region
      if (region === 'India' && d.is_international) return false;
      if (region === 'International' && !d.is_international) return false;

      // SubRegion for India
      if (region === 'India' && subRegion.length > 0) {
        let mappedSubRegion = '';
        const south = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana'];
        const north = ['Delhi', 'Himachal Pradesh', 'Uttarakhand', 'Punjab', 'Uttar Pradesh', 'Haryana', 'Jammu & Kashmir', 'Ladakh'];
        const west = ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan'];
        const east = ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'];
        const ne = ['Assam', 'Arunachal Pradesh', 'Meghalaya', 'Sikkim', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'];
        const isl = ['Andaman & Nicobar Islands', 'Lakshadweep'];

        if (south.includes(d.state)) mappedSubRegion = 'South India';
        else if (north.includes(d.state)) mappedSubRegion = 'North India';
        else if (west.includes(d.state)) mappedSubRegion = 'West India';
        else if (east.includes(d.state)) mappedSubRegion = 'East India';
        else if (ne.includes(d.state)) mappedSubRegion = 'Northeast India';
        else if (isl.includes(d.state)) mappedSubRegion = 'Islands';
        else mappedSubRegion = 'Central India'; // MP, Chhattisgarh

        if (!subRegion.includes(mappedSubRegion)) return false;
      }

      // 3. Custom Budget Slider
      if (d.estimated_budget_inr < customBudgetMin || d.estimated_budget_inr > customBudgetMax) return false;

      // 4. Budget Range checkboxes
      if (budgetRange.length > 0) {
        const cost = d.estimated_budget_inr;
        const matches = budgetRange.some(range => {
          if (range === '₹5,000–₹10,000' && cost >= 5000 && cost <= 10000) return true;
          if (range === '₹10,000–₹20,000' && cost > 10000 && cost <= 20000) return true;
          if (range === '₹20,000–₹40,000' && cost > 20000 && cost <= 40000) return true;
          if (range === '₹40,000–₹70,000' && cost > 40000 && cost <= 70000) return true;
          if (range === '₹70,000–₹1,00,000' && cost > 70000 && cost <= 100000) return true;
          if (range === '₹1,00,000–₹1,50,000' && cost > 100000 && cost <= 150000) return true;
          if (range === '₹1,50,000–₹2,00,000+' && cost > 150000) return true;
          return false;
        });
        if (!matches) return false;
      }

      // 5. Duration
      if (durationFilters.length > 0) {
        const days = d.recommended_days;
        const matches = durationFilters.some(range => {
          if (range === '1–2 Days' && days <= 2) return true;
          if (range === '3–5 Days' && days >= 3 && days <= 5) return true;
          if (range === '6–7 Days' && days >= 6 && days <= 7) return true;
          if (range === '8–14 Days' && days >= 8 && days <= 14) return true;
          if (range === '15+ Days' && days >= 15) return true;
          return false;
        });
        if (!matches) return false;
      }

      // 6. Dest Types (Category)
      if (destTypes.length > 0) {
        let matched = false;
        if (destTypes.includes(d.category)) matched = true;
        // Fuzzier matching for missing explicit categories
        if (destTypes.includes('Mountain') && d.category === 'Hill Station') matched = true;
        if (destTypes.includes('Cultural') && d.category === 'Heritage') matched = true;
        if (destTypes.includes('Nature') && d.category === 'Nature & Wildlife') matched = true;
        if (destTypes.includes('Island') && d.category === 'Beach' && d.state.includes('Island')) matched = true;
        if (!matched) return false;
      }

      // 7. Trip Types (Derived)
      if (tripTypes.length > 0) {
        const matches = tripTypes.some(type => {
          if (type === 'Family') return (d.safety_score >= 9.0 && d.category !== 'Adventure');
          if (type === 'Couple') return (['Beach', 'Hill Station', 'Nature & Wildlife', 'Heritage'].includes(d.category) && d.safety_score >= 9.0);
          if (type === 'Solo' || type === 'Backpacking') return (d.budget_level === 'Budget' || d.category === 'Adventure');
          if (type === 'Luxury') return (['High-Cost', 'Premium', 'Luxury International'].includes(d.cost_tier));
          if (type === 'Adventure') return (d.category === 'Adventure' || d.category === 'Nature & Wildlife' || d.category === 'Hill Station');
          return true; // Fallback for others
        });
        if (!matches) return false;
      }

      // 8. Smart Filters (Derived)
      if (smartFilters.length > 0) {
        const matches = smartFilters.every(sf => {
          if (sf === 'Rating 4.5+') return d.rating >= 4.5;
          if (sf === 'Safety Score 9+') return d.safety_score >= 9.0;
          if (sf === 'Low Crowd Level') return (d.popularity_score || 95) < 90;
          if (sf === 'Family Friendly') return d.safety_score >= 9.0;
          if (sf === 'Couples Friendly') return d.safety_score >= 9.0;
          if (sf === 'Beach Access') return d.category === 'Beach';
          if (sf === 'Mountain View') return d.category === 'Hill Station';
          return true; // Fallback
        });
        if (!matches) return false;
      }

      return true;
    });
  }, [destSearch, region, subRegion, customBudgetMin, customBudgetMax, budgetRange, durationFilters, destTypes, tripTypes, smartFilters, destinations]);

  // --- SORTING ---
  const sortedDestinations = useMemo(() => {
    let sorted = [...filtered];
    switch (sortBy) {
      case 'Lowest Price': sorted.sort((a, b) => a.estimated_budget_inr - b.estimated_budget_inr); break;
      case 'Highest Price': sorted.sort((a, b) => b.estimated_budget_inr - a.estimated_budget_inr); break;
      case 'Highest Rated': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'Most Popular': sorted.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0)); break;
      case 'Shortest Trip': sorted.sort((a, b) => a.recommended_days - b.recommended_days); break;
      case 'Longest Trip': sorted.sort((a, b) => b.recommended_days - a.recommended_days); break;
      case 'Best Value': sorted.sort((a, b) => (b.rating / b.estimated_budget_inr) - (a.rating / a.estimated_budget_inr)); break;
      case 'Best for Families': sorted.sort((a, b) => (b.safety_score || 0) - (a.safety_score || 0)); break;
      case 'Best for Couples': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break; // Approximation
      case 'Luxury': sorted.sort((a, b) => b.estimated_budget_inr - a.estimated_budget_inr); break;
      case 'Recommended':
      default:
        sorted.sort((a, b) => (b.ai_score || 95) - (a.ai_score || 95));
        break;
    }
    return sorted;
  }, [filtered, sortBy]);

  const toggleCompare = (destId) => {
    if (compareList.includes(destId)) {
      setCompareList(compareList.filter(id => id !== destId));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 destinations at a time.');
        return;
      }
      setCompareList([...compareList, destId]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-sans">

      {/* --- 1. HERO & SEARCH AREA --- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full blur-3xl -z-10 opacity-60 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mb-2">Find Your Perfect Trip</h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">Search, filter and compare destinations based on your travel preferences</p>
        </div>

        <div className="glass-card bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row flex-wrap gap-3 items-center justify-center mx-auto max-w-5xl shadow-inner">
          {/* Current Location */}
          <div className="flex-1 min-w-[160px] w-full relative flex items-center">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Current Location"
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              className="w-full text-xs sm:text-sm py-2.5 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Destination with Autocomplete */}
          <div className="flex-1 min-w-[160px] w-full relative flex items-center">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Destination"
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              onFocus={() => { if (destSearch) setShowDestSuggestions(true); }}
              className="w-full text-xs sm:text-sm py-2.5 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {/* Autocomplete Dropdown */}
            {showDestSuggestions && destSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                {destSuggestions.map(s => (
                  <div key={s.id} onClick={() => handleSelectDest(s.name)} className="px-4 py-2 text-xs sm:text-sm hover:bg-blue-50 cursor-pointer text-slate-700 flex justify-between border-b border-slate-50 last:border-0">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-[10px] text-slate-400">{s.state}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-[140px] w-full relative flex items-center">
            <Calendar className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="date"
              value={travelDates}
              onChange={(e) => setTravelDates(e.target.value)}
              className="w-full text-xs sm:text-sm py-2.5 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-500"
            />
          </div>

          <div className="flex-1 min-w-[120px] w-full relative flex items-center">
            <Users className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="number"
              placeholder="Travelers"
              value={numTravelers}
              onChange={(e) => setNumTravelers(e.target.value)}
              min="1"
              className="w-full text-xs sm:text-sm py-2.5 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleSearchSubmit}
            className="w-full sm:w-auto btn btn-primary py-2.5 px-6 font-semibold shadow-md shrink-0 rounded-xl whitespace-nowrap cursor-pointer"
          >
            Search Deals
          </button>
        </div>

        {/* --- 2. FILTER CHIPS --- */}
        <div className="mt-6 flex flex-wrap gap-2 items-center justify-center max-w-5xl mx-auto">
          {CHIP_FILTERS.map(chip => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs border cursor-pointer ${activeFilters.some(f => (f.value === chip || (chip === 'India' && f.value === 'India') || (chip === 'International' && f.value === 'International')))
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* --- 3. MAIN CONTENT: SIDEBAR + GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* MOBILE FILTER TOGGLE */}
        <div className="lg:hidden flex justify-between items-center mb-2">
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="btn btn-secondary py-2 px-4 text-xs flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
          <span className="text-xs font-bold text-slate-700">{sortedDestinations.length} destinations</span>
        </div>

        {/* SIDEBAR */}
        <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-6`}>
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm sticky top-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filters
              </h2>
              {activeFilters.length > 0 && (
                <button onClick={clearAllFilters} className="text-[11px] font-bold text-rose-500 hover:text-rose-600 uppercase">
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">

              {/* Region Selector */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-3">Destination Region</h3>
                <div className="flex bg-slate-100 rounded-xl p-1 mb-3">
                  {['All', 'India', 'International'].map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        if (r === 'All') {
                          removeFilter(activeFilters.find(f => f.type === 'region')?.id);
                        } else {
                          handleCheckbox('region', r);
                        }
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${region === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {r === 'India' ? '🇮🇳 ' : r === 'International' ? '🌍 ' : ''}{r}
                    </button>
                  ))}
                </div>
                {region === 'India' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SUB_REGIONS.map(sr => (
                      <label key={sr} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={subRegion.includes(sr)} onChange={() => handleCheckbox('subRegion', sr)} className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 shadow-sm transition-all" />
                        <span className="text-[11px] text-slate-600 group-hover:text-slate-900">{sr}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Budget Slider */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-800 mb-3 flex justify-between">
                  Budget (Custom)
                  <span className="text-blue-600">₹{customBudgetMin.toLocaleString()} - ₹{customBudgetMax.toLocaleString()}</span>
                </h3>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={customBudgetMax}
                  onChange={(e) => setCustomBudgetMax(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Filter Checklist Component Builder */}
              {[
                { title: 'Budget Ranges', type: 'budgetRange', options: BUDGET_RANGES, state: budgetRange },
                { title: 'Duration', type: 'duration', options: DURATIONS, state: durationFilters },
                { title: 'Trip Type', type: 'tripType', options: TRIP_TYPES, state: tripTypes },
                { title: 'Destination Type', type: 'destType', options: DEST_TYPES, state: destTypes },
                { title: 'Travel Style', type: 'travelStyle', options: TRAVEL_STYLES, state: travelStyles },
                { title: 'Season', type: 'season', options: SEASONS, state: seasons },
                { title: 'Hotel Preference', type: 'hotelPref', options: HOTEL_PREFS, state: hotelPrefs },
                { title: 'Transport', type: 'transport', options: TRANSPORT, state: transportPrefs },
                { title: 'Smart Filters', type: 'smartFilter', options: SMART_FILTERS, state: smartFilters }
              ].map(group => (
                <div key={group.title} className="border-t border-slate-100 pt-4">
                  <h3 className="text-xs font-bold text-slate-800 mb-3">{group.title}</h3>
                  <div className="space-y-2">
                    {group.options.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={group.state.includes(opt)}
                          onChange={() => handleCheckbox(group.type, opt)}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 shadow-sm transition-all"
                        />
                        <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button onClick={() => setShowMobileFilters(false)} className="w-full btn btn-primary py-2.5 text-xs font-semibold shadow-md">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* --- GRID RESULTS --- */}
        <div className="lg:col-span-3 space-y-6">

          {/* Top Bar: Summary & Sorting */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {sortedDestinations.length === 0 ? 'No destinations found' : `${sortedDestinations.length} destinations found`}
              </h2>
              <p className="text-[11px] text-slate-500">
                {budgetRange.length > 0 || customBudgetMax < 200000
                  ? `Matching your budget from ₹${customBudgetMin.toLocaleString()} to ₹${customBudgetMax.toLocaleString()}`
                  : 'Showing trips from ₹5,000 to ₹2,00,000+'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Sort & Recommend Dropdown */}
              <div className="flex-1 sm:flex-none relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Active:</span>
              {activeFilters.map(f => (
                <div key={f.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[11px] font-semibold text-blue-700">
                  <span>{f.value}</span>
                  <button onClick={() => removeFilter(f.id)} className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={clearAllFilters} className="text-[11px] font-semibold text-slate-500 hover:text-rose-500 underline underline-offset-2 ml-1">Clear All</button>
            </div>
          )}

          {/* Cards Grid */}
          {sortedDestinations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Matches Found</h3>
              <p className="text-sm text-slate-500 mb-6">Try adjusting your filters, budget, or destination region to find more trips.</p>
              <button onClick={clearAllFilters} className="btn btn-primary px-6 py-2">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDestinations.map(dest => {
                const isSaved = wishlist.includes(dest.id);
                const isCompared = compareList.includes(dest.id);

                return (
                  <div key={dest.id} className="bg-white rounded-3xl overflow-hidden group flex flex-col justify-between border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                    {/* Card Image Header */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dest.image_url}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/60"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-md">
                          {dest.category}
                        </span>
                        {dest.is_international && (
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-600/95 text-white shadow-sm backdrop-blur-md">
                            International
                          </span>
                        )}
                      </div>

                      {/* Top Right Actions */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => toggleCompare(dest.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors shadow-sm backdrop-blur-md ${isCompared ? 'bg-blue-600 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
                            }`}
                        >
                          {isCompared ? '✓ Compared' : '+ Compare'}
                        </button>
                        <button
                          onClick={() => toggleWishlist(dest.id)}
                          className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div>
                          <h3 className="text-lg font-bold text-white drop-shadow-md leading-tight">{dest.name}</h3>
                          <p className="text-[11px] text-slate-200 font-medium flex items-center gap-1 drop-shadow-md mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {dest.state}, {dest.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-white">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-bold">{dest.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-blue-500" /> {dest.recommended_days} Days</div>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <div className="flex items-center gap-1">Season: <span className="text-slate-700">{dest.best_season}</span></div>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <div className="flex items-center gap-1 text-purple-600">AI Match: {dest.ai_score}%</div>
                      </div>

                      {/* Highlights */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 mb-1.5 uppercase tracking-wide">Popular Experiences</p>
                        <div className="flex flex-wrap gap-1.5">
                          {dest.highlights?.slice(0, 3).map((h, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] border border-slate-200 truncate max-w-full">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Estimated Cost</span>
                          <span className="text-base font-extrabold text-emerald-600 leading-none">₹{dest.estimated_budget_inr.toLocaleString()}</span>
                          <span className="text-[9px] text-slate-500 block">/ person</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/destination/${dest.id}`)}
                            className="btn btn-secondary px-3 py-1.5 text-[11px] font-bold shadow-xs hover:border-blue-300"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => navigate(`/planner?source=${encodeURIComponent(currentCity)}&dest=${encodeURIComponent(dest.name)}`)}
                            className="btn btn-primary px-3 py-1.5 text-[11px] font-bold shadow-xs"
                          >
                            Plan Trip
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
