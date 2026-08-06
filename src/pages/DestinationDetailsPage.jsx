import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Star, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Plane, 
  Train, 
  Building2, 
  ArrowLeft,
  Share2,
  Map as MapIcon,
  ShieldCheck,
  Utensils,
  Coffee,
  Sun
} from 'lucide-react';

export const DestinationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { destinations, wishlist, toggleWishlist, showToast } = useApp();

  const [showMapModal, setShowMapModal] = useState(false);

  const dest = destinations.find(d => d.id === id) || destinations[0];
  const isSaved = wishlist.includes(dest.id);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast(`🔗 Shareable link for ${dest.name} copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Back Button & Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMapModal(!showMapModal)}
            className="btn btn-secondary btn-sm text-xs"
          >
            <MapIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>View Map</span>
          </button>
          <button onClick={handleShare} className="btn btn-secondary btn-sm text-xs">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Image Header */}
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 glass-card border border-slate-200">
        <img
          src={dest.image_url}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-blue bg-white/90 backdrop-blur-md shadow-xs">{dest.category}</span>
            <span className="badge badge-amber bg-white/90 backdrop-blur-md shadow-xs">⭐ {dest.rating} ({dest.review_count} reviews)</span>
            <span className="badge badge-green bg-white/90 backdrop-blur-md shadow-xs">AI Score: 98% Match</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            {dest.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-blue-400" />
            {dest.state}, {dest.country} • Approx. 450 km from Source
          </p>
        </div>

        <button
          onClick={() => toggleWishlist(dest.id)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors cursor-pointer shadow-md"
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="glass-card p-6 rounded-3xl border border-blue-200 bg-blue-50/50 text-center space-y-3">
          <MapIcon className="w-10 h-10 text-blue-600 mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-slate-900">Interactive GPS Route Map — {dest.name}</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Calculated distance: ~450 km from Source | Transit time: 1 hr 15 mins flight / 7 hrs express train
          </p>
          <button onClick={() => setShowMapModal(false)} className="btn btn-secondary btn-sm text-xs">Close Map</button>
        </div>
      )}

      {/* Grid Layout: Details & Action Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
            <h2 className="text-base font-bold text-slate-900 font-heading">About {dest.name}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {dest.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Best Season</span>
                <span className="text-xs font-bold text-slate-900">{dest.best_season}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Weather</span>
                <span className="text-xs font-bold text-blue-600">{dest.weather_info}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Recommended</span>
                <span className="text-xs font-bold text-slate-900">{dest.recommended_days} Days</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Local Language</span>
                <span className="text-xs font-bold text-emerald-600">{dest.local_language}</span>
              </div>
            </div>
          </div>

          {/* Highlights & Top Attractions */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-heading">Must-Visit Attractions & Activities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dest.highlights?.map((h, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Hotels & Dining */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-600" />
              <span>Recommended Hotels & Local Cafes</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {dest.hotels?.map((h, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">{h.name}</span>
                  <span className="text-blue-600 font-semibold block">₹{h.price_per_night.toLocaleString()} / night</span>
                  <span className="text-slate-500 text-[10px]">⭐ {h.rating} Rating • Luxury Amenities</span>
                </div>
              )) || (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Taj Exotica Resort & Spa</span>
                  <span className="text-blue-600 font-semibold block">₹8,500 / night</span>
                </div>
              )}
            </div>
          </div>

          {/* Safety & Logistics Info */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transit & Safety Guide</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Plane className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Airport Hub</span>
                  <span className="font-bold text-slate-900">{dest.nearest_airport}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Train className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Railway Hub</span>
                  <span className="font-bold text-slate-900">{dest.nearest_railway}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safety Rating: 9.6/10 • Verified Safe Destination for solo & family travel.</span>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-blue-200 bg-white space-y-5 sticky top-24 shadow-lg">
            <div>
              <span className="text-xs text-slate-500 block font-semibold">Starting Trip Cost</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-emerald-600">₹{dest.estimated_budget_inr.toLocaleString()}</span>
                <span className="text-xs text-slate-500">/ person</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => navigate(`/booking?destId=${dest.id}`)}
                className="w-full btn btn-primary py-3 text-xs font-semibold shadow-md shadow-blue-500/20"
              >
                <Building2 className="w-4 h-4" />
                <span>Book Hotel & Stay Now</span>
              </button>

              <button
                onClick={() => navigate(`/planner?dest=${encodeURIComponent(dest.name)}`)}
                className="w-full btn btn-secondary py-3 text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Generate AI Itinerary</span>
              </button>

              <button
                onClick={() => toggleWishlist(dest.id)}
                className="w-full btn btn-secondary py-2.5 text-xs font-semibold text-rose-600"
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500' : ''}`} />
                <span>{isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-500">
              <div className="flex items-center justify-between">
                <span>Instant Confirmation</span>
                <span className="text-emerald-600 font-bold">✓ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Free Cancellation</span>
                <span className="text-emerald-600 font-bold">✓ 24 Hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
