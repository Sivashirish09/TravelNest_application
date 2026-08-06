import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, MapPin, Star, Trash2, Sparkles, Building2, Compass } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist = [], destinations = [], toggleWishlist } = useApp() || {};
  const navigate = useNavigate();

  const savedDestinations = (Array.isArray(destinations) ? destinations : []).filter(d => (Array.isArray(wishlist) ? wishlist : []).includes(d.id));

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">Wishlist & Saved Places</h1>
          </div>
          <p className="text-xs text-slate-500">
            {savedDestinations.length} saved destinations ready for your next travel adventure
          </p>
        </div>

        <button
          onClick={() => navigate('/explore')}
          className="btn btn-secondary text-xs font-semibold"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Places</span>
        </button>
      </div>

      {savedDestinations.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-200 bg-white text-center text-slate-500">
          <Heart className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-900">Your wishlist is currently empty</h3>
          <p className="text-xs text-slate-500 mt-1">Click the heart icon on any destination card to save it here</p>
          <button
            onClick={() => navigate('/explore')}
            className="btn btn-primary text-xs mt-4"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDestinations.map((dest) => {
            const budgetVal = dest.estimated_budget_inr || 15000;
            return (
              <div key={dest.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between bg-white border border-slate-200">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.image_url || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist && toggleWishlist(dest.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {dest.state}, {dest.country}
                      </span>
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {dest.rating}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{dest.name}</h3>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Est. ₹{budgetVal.toLocaleString()}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => navigate(`/planner?dest=${encodeURIComponent(dest.name)}`)}
                      className="flex-1 btn btn-secondary btn-sm text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Plan AI</span>
                    </button>
                    <button
                      onClick={() => navigate(`/booking?destId=${dest.id}`)}
                      className="flex-1 btn btn-primary btn-sm text-xs"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
