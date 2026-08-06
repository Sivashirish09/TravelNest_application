import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Heart,
  Star,
  Compass,
  Clock,
  ShieldCheck,
  CreditCard,
  Plane,
  Bell,
  Briefcase,
  ArrowUpRight,
  Users
} from 'lucide-react';

export const HomePage = () => {
  const { currentUser } = useAuth();
  const { 
    destinations = [], 
    bookings = [], 
    wishlist = [], 
    notifications = [],
    userStats = {},
    toggleWishlist 
  } = useApp() || {};
  const navigate = useNavigate();

  const [fromCity, setFromCity] = useState('Hyderabad');
  const [toCity, setToCity] = useState('');
  const [travelDate, setTravelDate] = useState('2026-08-15');
  const [travelers, setTravelers] = useState(2);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (toCity) {
      navigate(`/planner?source=${encodeURIComponent(fromCity)}&dest=${encodeURIComponent(toCity)}`);
    } else {
      navigate(`/explore`);
    }
  };

  const upcomingBooking = Array.isArray(bookings) ? bookings.find(b => b.status === 'CONFIRMED') : null;
  const unreadNotifCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;
  const currentDest = upcomingBooking?.destination_name || (bookings.length > 0 ? bookings[0]?.destination_name : (toCity || 'Araku Valley'));
  const currentSource = upcomingBooking?.source || fromCity || 'Hyderabad';
  const totalMoneySpent = (Array.isArray(bookings) ? bookings : [])
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (Number(b.total_amount_inr) || Number(b.total_amount) || Number(b.total_budget) || 0), 0);

  const filters = [
    'All', 'Beaches', 'Mountains', 'Adventure', 'Heritage', 'Wildlife',
    'Family', 'Couples', 'Solo', 'Luxury', 'Weekend Trips'
  ];

  const filteredPlaces = (Array.isArray(destinations) ? destinations : []).filter(d => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Beaches') return d.category === 'Beach';
    if (selectedFilter === 'Mountains') return d.category === 'Hill Station';
    if (selectedFilter === 'Adventure') return d.category === 'Adventure';
    if (selectedFilter === 'Heritage') return d.category === 'Heritage';
    if (selectedFilter === 'Luxury') return d.category === 'Luxury';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Welcome & Personalized Travel Message Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-6 sm:p-10 border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-purple">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Smart AI Engine
            </span>
            <span className="badge badge-blue">
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentUser?.travelerLevel || 'Gold Explorer 🧭'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Where will your next <span className="gradient-text">journey take you?</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
            Plan smarter with AI Trip Planner, discover curated destinations across all Indian States & UTs and International hubs, and manage your hotel stays.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSubmit} className="mt-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div className="form-group mb-0">
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">From (Source)</label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="form-control text-xs pl-10 py-2.5 bg-slate-50 border-slate-200"
                  required
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">To (Destination)</label>
              <div className="relative flex items-center">
                <Compass className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="Goa, Araku, Manali..."
                  className="form-control text-xs pl-10 py-2.5 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Start Date</label>
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="form-control text-xs pl-10 py-2.5 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Travelers</label>
              <div className="relative flex items-center">
                <Users className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="form-control text-xs pl-10 py-2.5 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary text-xs py-2.5 font-semibold w-full shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
              <span>Plan My Trip</span>
            </button>
          </form>
        </div>
      </div>

      {/* Travel Dashboard */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Travel Dashboard
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Real-time travel activity, bookings, spending, and saved trips
            </p>
          </div>
          <span className="badge badge-blue text-[11px] font-semibold py-1 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
            Live Firebase Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {/* Card 1: 📍 Current Destination */}
          <div
            onClick={() => {
              if (upcomingBooking?.destination_name) {
                navigate(`/planner?source=${encodeURIComponent(currentSource)}&dest=${encodeURIComponent(upcomingBooking.destination_name)}`);
              } else if (toCity) {
                navigate(`/planner?source=${encodeURIComponent(fromCity)}&dest=${encodeURIComponent(toCity)}`);
              } else {
                navigate('/explore');
              }
            }}
            className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Focus Location</span>
                    <span className="text-xs font-bold text-slate-900">Current Destination</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="mt-2">
                <h3 className="text-base font-extrabold text-slate-900 font-heading truncate group-hover:text-blue-600 transition-colors">
                  {currentDest}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-blue-600">
                  <span>{currentSource}</span>
                  <span className="text-slate-400">➔</span>
                  <span className="truncate">{currentDest}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Selected route</span>
              <span className="text-blue-600 font-bold group-hover:underline">Plan / Explore →</span>
            </div>
          </div>

          {/* Card 2: 🧳 Upcoming Trip */}
          <div
            onClick={() => {
              if (upcomingBooking) {
                navigate(`/booking/${upcomingBooking.id}`);
              } else {
                navigate('/planner');
              }
            }}
            className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Itinerary</span>
                    <span className="text-xs font-bold text-slate-900">Upcoming Trip</span>
                  </div>
                </div>
                {upcomingBooking ? (
                  <span className="badge badge-green text-[10px] py-0.5 px-2 font-bold">CONFIRMED</span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                )}
              </div>

              {upcomingBooking ? (
                <div className="mt-1 space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 font-heading truncate group-hover:text-indigo-600 transition-colors">
                    {upcomingBooking.destination_name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Date:</span>
                      <span className="font-semibold text-slate-800 truncate block">{upcomingBooking.check_in_date || upcomingBooking.travel_date || 'Upcoming'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Duration:</span>
                      <span className="font-semibold text-slate-800">{upcomingBooking.nights || 3}N / {(Number(upcomingBooking.nights) || 3) + 1}D</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 pt-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">Hotel:</span>
                    <span className="font-semibold text-indigo-700 truncate block">{upcomingBooking.hotel_or_resort_name || 'Confirmed Resort'}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <h3 className="text-sm font-bold text-slate-900 font-heading">No Upcoming Trips</h3>
                  <p className="text-xs text-slate-500 mt-1">Ready for your next adventure? Generate an AI itinerary and reserve hotel stays.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">{upcomingBooking ? (upcomingBooking.tripType || 'AI Smart Tour') : 'Zero bookings pending'}</span>
              <span className="text-indigo-600 font-bold group-hover:underline">{upcomingBooking ? 'View Ticket →' : 'Plan Trip →'}</span>
            </div>
          </div>

          {/* Card 3: 💰 Total Money Spent */}
          <div
            onClick={() => navigate('/bookings')}
            className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Expenditure</span>
                    <span className="text-xs font-bold text-slate-900">Total Money Spent</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="mt-2">
                <div className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight group-hover:text-emerald-600 transition-colors">
                  ₹{totalMoneySpent.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Across all completed and confirmed bookings
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">{userStats.completedTrips || 0} completed • {userStats.confirmedTrips || 0} active</span>
              <span className="text-emerald-600 font-bold group-hover:underline">Manage Stays →</span>
            </div>
          </div>

          {/* Card 4: ✈️ Total Trips */}
          <div
            onClick={() => navigate('/bookings')}
            className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Activity</span>
                    <span className="text-xs font-bold text-slate-900">Total Trips</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="mt-2">
                <div className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight group-hover:text-sky-600 transition-colors">
                  {bookings.length} {bookings.length === 1 ? 'Trip' : 'Trips'}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Total bookings loaded directly from Firebase
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">{userStats.confirmedTrips || 0} Confirmed • {userStats.completedTrips || 0} Past</span>
              <span className="text-sky-600 font-bold group-hover:underline">View Bookings →</span>
            </div>
          </div>

          {/* Card 5: 🔔 Notifications */}
          <div
            onClick={() => navigate('/notifications')}
            className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                    <Bell className="w-4 h-4" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Updates</span>
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                  </div>
                </div>
                {unreadNotifCount > 0 ? (
                  <span className="badge badge-blue bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0.5 px-2 font-bold">
                    {unreadNotifCount} NEW
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                )}
              </div>

              <div className="mt-2">
                <div className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight group-hover:text-amber-600 transition-colors">
                  {unreadNotifCount} {unreadNotifCount === 1 ? 'Unread' : 'Unread'}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {unreadNotifCount > 0 ? 'Pending booking & travel alert updates' : 'All travel alerts are up to date'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">{notifications.length} total messages</span>
              <span className="text-amber-600 font-bold group-hover:underline">Open Inbox →</span>
            </div>
          </div>

          {/* Card 6: ⭐ Saved Trips */}
          <div
            onClick={() => navigate('/wishlist')}
            className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                    <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Wishlist</span>
                    <span className="text-xs font-bold text-slate-900">Saved Trips</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="mt-2">
                <div className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight group-hover:text-rose-500 transition-colors">
                  {wishlist.length} {wishlist.length === 1 ? 'Saved Place' : 'Saved Places'}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Your bookmarked dream destinations
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">{wishlist.length > 0 ? 'Ready for planning' : 'No places saved yet'}</span>
              <span className="text-rose-500 font-bold group-hover:underline">View Wishlist →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Trip Overview Card */}
      {upcomingBooking && (
        <div className="glass-card p-6 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-white to-slate-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Upcoming Confirmed Travel</h2>
            </div>
            <span className="badge badge-green">CONFIRMED</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{upcomingBooking.destination_name} ({upcomingBooking.country})</h3>
              <p className="text-xs text-slate-700 mt-0.5">Hotel: {upcomingBooking.hotel_or_resort_name}</p>
              <p className="text-xs text-slate-500">Ref: {upcomingBooking.booking_reference} | Check-in: {upcomingBooking.check_in_date}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/booking/${upcomingBooking.id}`)}
                className="btn btn-secondary text-xs"
              >
                View Ticket & Details
              </button>
              <button
                onClick={() => navigate('/bookings')}
                className="btn btn-primary text-xs"
              >
                Manage Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explore India Filtered Destinations Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Explore Destinations</h2>
            <p className="text-xs text-slate-500">Handpicked top travel hotspots across Indian States and International hubs</p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All ({destinations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedFilter === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPlaces.slice(0, 8).map((dest) => {
            const isSaved = Array.isArray(wishlist) && wishlist.includes(dest.id);
            const budgetVal = dest.estimated_budget_inr || 15000;
            return (
              <div key={dest.id} className="glass-card overflow-hidden rounded-2xl group flex flex-col justify-between bg-white border border-slate-200">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.image_url || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-blue bg-white/90 backdrop-blur-md shadow-xs">
                      {dest.category}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleWishlist && toggleWishlist(dest.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-xs"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        {dest.state}, {dest.country}
                      </span>
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500" />
                        {dest.rating}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {dest.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Est. Budget</span>
                      <span className="text-xs font-bold text-emerald-600">₹{budgetVal.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/destination/${dest.id}`)}
                      className="btn btn-secondary btn-sm text-[11px]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
