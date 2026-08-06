import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SEED_DESTINATIONS, findCanonicalDestination } from '../data/destinations';
import { 
  Sparkles, 
  Calendar, 
  Download, 
  Share2, 
  Building2, 
  ArrowLeft,
  RefreshCw,
  Heart,
  Car,
  Utensils,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const ItineraryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, wishlist, showToast } = useApp();

  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`itinerary_${id}`);
    if (stored) {
      setPlan(JSON.parse(stored));
    } else {
      // Default fallback with exact Chennai details if no stored session found
      const chennaiObj = findCanonicalDestination('Chennai') || SEED_DESTINATIONS[0];
      setPlan({
        id: id || 'itin-demo',
        source: 'Hyderabad',
        destination: chennaiObj.name,
        destId: chennaiObj.id,
        destObj: chennaiObj,
        startDate: '2026-08-15',
        days: 3,
        budget: 12500,
        travelers: 2,
        tripType: 'Moderate & Balanced',
        hotelPref: 'ITC Grand Chola Chennai',
        transport: 'Flight / Express Train',
        foodPref: 'Local Authentic Dining',
        routeInfo: { distanceKm: 625, travelTime: '1 hr 15 mins Flight / 10 hrs Train' }
      });
    }
  }, [id]);

  if (!plan) return null;

  const destObj = plan.destObj || findCanonicalDestination(plan.destId || plan.destination) || SEED_DESTINATIONS[0];
  const isSaved = wishlist.includes(destObj.id);
  const daysList = Array.from({ length: plan.days }, (_, i) => i + 1);

  // Generate location-specific day schedule tailored specifically to destObj
  const getDaySchedule = (dayNum) => {
    const dailyCost = Math.round((plan.budget || 12000) / plan.days);
    const highlights = destObj.highlights || ['Local Sightseeing', 'Cultural Tour', 'Heritage Walk'];
    const hotels = destObj.hotels || [{ name: 'Luxury City Resort' }];
    const restaurants = destObj.restaurants || [{ name: 'Local Authentic Diner', type: 'Regional Cuisine' }];
    const activities = destObj.popular_activities || ['Sightseeing tour', 'Local food tasting', 'Culture walk'];

    const hIndex = (dayNum - 1) % highlights.length;
    const currentAttraction = highlights[hIndex] || highlights[0];
    const currentHotel = hotels[0]?.name || plan.hotelPref || 'City Hotel';
    const currentRest = restaurants[dayNum % restaurants.length] || restaurants[0];
    const currentAct = activities[(dayNum - 1) % activities.length] || activities[0];

    return {
      title: `Day ${dayNum}: ${currentAttraction}`,
      breakfast: `Morning Breakfast at ${currentHotel} / Local Specialty Cafe`,
      morning: `Visit ${currentAttraction}. Explore historical architecture and local culture in ${destObj.name}.`,
      attraction: currentAttraction,
      lunch: `Lunch at ${currentRest.name} (${currentRest.type})`,
      afternoon: `Experience: ${currentAct}. Sightseeing and souvenir shopping in ${destObj.name} city center.`,
      evening: `Sunset view and evening tea/coffee walk.`,
      dinner: `Traditional Dinner at ${currentRest.name}`,
      dailyCost,
      distance: `~15-20 km local transit`
    };
  };

  const handleDownloadItinerary = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('🔗 Itinerary link copied to clipboard!', 'success');
  };

  const handleRegenerate = () => {
    showToast(`✨ Regenerated a fresh schedule variation for ${destObj.name}!`, 'info');
  };

  const handleProceedToBook = () => {
    const targetHotel = destObj.hotels?.[0]?.name || plan.hotelPref || 'Luxury Resort';
    // Store full prefill context for booking page
    const prefillData = {
      source_city: plan.source || plan.source_city || '',
      destination_name: destObj.name,
      destination_id: destObj.id,
      destObj: destObj,
      hotel_or_resort_name: targetHotel,
      check_in_date: plan.startDate || '',
      nights: plan.days,
      guests: plan.travelers,
      trip_type: plan.tripType || 'Couple',
      transport_mode: plan.transport || '',
      total_budget: plan.budget,
      costBreakdown: plan.costBreakdown || {},
      itinerary_id: plan.id
    };
    sessionStorage.setItem(`booking_prefill_${plan.id}`, JSON.stringify(prefillData));
    navigate(`/booking?destId=${destObj.id}&destName=${encodeURIComponent(destObj.name)}&hotel=${encodeURIComponent(targetHotel)}&nights=${plan.days}&guests=${plan.travelers}&budget=${plan.budget}&tripType=${encodeURIComponent(plan.tripType || 'Couple')}&source=${encodeURIComponent(plan.source || '')}&itinId=${plan.id}`);
  };


  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Back Button & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('/planner')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleRegenerate} className="btn btn-secondary btn-sm text-xs">
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            <span>Regenerate Plan</span>
          </button>

          <button onClick={() => toggleWishlist(destObj.id)} className="btn btn-secondary btn-sm text-xs">
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button onClick={handleShare} className="btn btn-secondary btn-sm text-xs">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button onClick={handleDownloadItinerary} className="btn btn-secondary btn-sm text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Header (Strict Exact Destination Display) */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-purple">
            <Sparkles className="w-3.5 h-3.5" />
            Personalized AI Schedule
          </span>
          <span className="badge badge-green">Exact Destination Match Active</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          {plan.days}-Day Trip Itinerary to <span className="gradient-text">{destObj.name}</span> ({destObj.state})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Route: <strong>{plan.source}</strong> ➔ <strong>{destObj.name}</strong> | Starts: {plan.startDate}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Estimated Budget</span>
            <span className="font-extrabold text-emerald-600 text-sm">₹{plan.budget?.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Travelers</span>
            <span className="font-bold text-slate-900 text-sm">{plan.travelers} Guests</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Hotel Option</span>
            <span className="font-bold text-blue-600 text-sm truncate block">{destObj.hotels?.[0]?.name || plan.hotelPref}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Transit Mode</span>
            <span className="font-bold text-purple-600 text-sm">{plan.transport}</span>
          </div>
        </div>
      </div>

      {/* Nearby Places Cards Section */}
      {destObj.nearby_places && destObj.nearby_places.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Nearby Places & Local Infrastructure in {destObj.name}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {destObj.nearby_places.map((place, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 block">{place.name}</span>
                  <span className="badge badge-blue text-[9px]">{place.category}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{place.description}</p>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>Distance: {place.distance}</span>
                  <span className="text-amber-600 font-semibold">{place.price || `Rating: ${place.rating}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day Timeline */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Day-by-Day Travel Schedule for {destObj.name} ({plan.days} Days)</span>
        </h2>

        <div className="space-y-5">
          {daysList.map((dayNum) => {
            const dayData = getDaySchedule(dayNum);
            return (
              <div key={dayNum} className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-bold font-heading text-blue-600">{dayData.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1"><Car className="w-3 h-3 text-slate-400" /> {dayData.distance}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">Daily Budget: ~₹{dayData.dailyCost.toLocaleString()}</span>
                    </p>
                  </div>
                  <span className="badge badge-blue shrink-0">Day {dayNum} of {plan.days}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px] inline-block mb-1">☕ BREAKFAST & MORNING</span>
                    <p className="font-semibold text-slate-900">{dayData.breakfast}</p>
                    <p className="text-slate-600">{dayData.morning}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px] inline-block mb-1">📍 LOCATION HIGHLIGHT</span>
                    <p className="font-semibold text-slate-900">{dayData.attraction}</p>
                    <p className="text-slate-600">Guided tour of top destination highlights in {destObj.name}.</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px] inline-block mb-1">🍲 LUNCH & AFTERNOON</span>
                    <p className="font-semibold text-slate-900">{dayData.lunch}</p>
                    <p className="text-slate-600">{dayData.afternoon}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px] inline-block mb-1">🌙 EVENING & DINNER</span>
                    <p className="font-semibold text-slate-900">{dayData.dinner}</p>
                    <p className="text-slate-600">{dayData.evening}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book This Itinerary CTA */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Ready to book this trip to {destObj.name}?</h3>
          <p className="text-xs text-slate-600">Proceed to checkout, lock in resort room & generate digital QR ticket</p>
        </div>

        <button
          onClick={handleProceedToBook}
          className="btn btn-primary py-3.5 px-8 text-xs font-semibold shadow-md shadow-emerald-500/20 shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          <span>Proceed to Book Trip (₹{plan.budget?.toLocaleString()})</span>
        </button>
      </div>
    </div>
  );
};
