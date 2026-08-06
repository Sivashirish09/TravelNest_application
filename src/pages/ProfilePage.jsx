import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  User,
  Settings,
  Calendar,
  Building2,
  Heart,
  Camera,
  Star,
  LogOut,
  DollarSign,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Compass,
  Utensils,
  PhoneCall,
  Edit3,
  Luggage,
  Sparkles,
  Plane,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const {
    bookings,
    wishlist,
    memories,
    reviews,
    userProfile,
    userStats,
    updateProfileData,
    showToast
  } = useApp();
  const navigate = useNavigate();

  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || currentUser?.fullName || userProfile?.displayName || '',
    email: currentUser?.email || userProfile?.email || '',
    phoneNumber: userProfile?.phoneNumber || currentUser?.phoneNumber || '',
    bio: userProfile?.bio || 'Passionate globetrotter, mountain hiker, and heritage explorer.',
    travelStyle: userProfile?.travelStyle || 'Balanced & Adventurous',
    dietaryPreference: userProfile?.dietaryPreference || 'Vegetarian',
    preferredTransport: userProfile?.preferredTransport || 'Flight + Scenic Train',
    emergencyName: userProfile?.emergencyContact?.name || '',
    emergencyRelation: userProfile?.emergencyContact?.relation || '',
    emergencyPhone: userProfile?.emergencyContact?.phoneNumber || ''
  });

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      navigate('/login');
    } catch (err) {
      showToast('Logout failed', 'error');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfileData({
      displayName: formData.displayName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      bio: formData.bio,
      travelStyle: formData.travelStyle,
      dietaryPreference: formData.dietaryPreference,
      preferredTransport: formData.preferredTransport,
      emergencyContact: {
        name: formData.emergencyName,
        relation: formData.emergencyRelation,
        phoneNumber: formData.emergencyPhone
      }
    });
    setEditModal(false);
  };

  // Comprehensive Travel Metrics — from Firestore via userStats
  const totalBookings = userStats?.totalTrips ?? bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');

  const totalMoneySpent = userStats?.totalSpent ?? bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (Number(b.total_amount_inr) || 0), 0);

  const totalRefundedAmount = userStats?.refunded ?? cancelledBookings
    .reduce((sum, b) => sum + (Number(b.total_amount_inr) || 0), 0);

  const totalTravelDays = userStats?.totalDays ?? bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (Number(b.nights) || 0), 0);

  const upcomingTrip = activeBookings[0] || null;

  // Profile display values — Firebase Auth is source of truth
  const displayName = currentUser?.displayName || currentUser?.fullName || userProfile?.displayName || 'Traveler';
  const displayEmail = currentUser?.email || userProfile?.email || '';
  const displayPhone = userProfile?.phoneNumber || currentUser?.phoneNumber || '';
  const displayPhoto = currentUser?.photoURL || userProfile?.photoURL || null;
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Profile Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-white shadow-md shrink-0">
            {displayPhoto ? (
              <img src={displayPhoto} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-heading">
                {displayName}
              </h1>
              <span className="badge badge-green inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Traveler
              </span>
              <span className="badge badge-blue">
                {userProfile?.travelerLevel || 'Gold Explorer 🧭'}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {displayEmail} {displayPhone ? `• ${displayPhone}` : ''} • Member since {new Date(currentUser?.metadata?.creationTime || Date.now()).getFullYear() || '2026'}
            </p>

            <p className="text-xs text-slate-500 italic max-w-2xl">
              "{userProfile?.bio || 'Passionate globetrotter, mountain hiker, and heritage explorer. Traveled across multiple domestic & international destinations.'}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setEditModal(true)}
              className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Travel Metrics & Personal Analytics (Replaces Badges Section) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Travel Metrics & Personal Analytics
            </h2>
            <p className="text-xs text-slate-500">Live aggregated statistics across all your bookings and travel logs</p>
          </div>
        </div>

        {/* Top 4 Primary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Luggage className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block leading-tight">{totalBookings}</span>
              <span className="text-xs font-semibold text-slate-500">Total Trips Booked</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-600 block leading-tight">{activeBookings.length}</span>
              <span className="text-xs font-semibold text-slate-500">Active / Confirmed Trips</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-purple-600 block leading-tight">{totalTravelDays}</span>
              <span className="text-xs font-semibold text-slate-500">Total Days Traveled</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block leading-tight">₹{totalMoneySpent.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-500">Total Travel Spend</span>
            </div>
          </div>
        </div>

        {/* Secondary Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Cancelled Trips</span>
              <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-bold text-rose-600">{cancelledBookings.length} Trips</div>
            <div className="text-[11px] text-slate-400 mt-1">₹{totalRefundedAmount.toLocaleString()} Refunded</div>
          </div>

          <div
            onClick={() => navigate('/wishlist')}
            className="glass-card p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs cursor-pointer hover:border-rose-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Saved Wishlist</span>
              <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900">{wishlist.length} Places</div>
            <div className="text-[11px] text-slate-400 mt-1">Click to view saved</div>
          </div>

          <div
            onClick={() => navigate('/memories')}
            className="glass-card p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs cursor-pointer hover:border-purple-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Travel Memories</span>
              <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900">{memories.length} Journal Logs</div>
            <div className="text-[11px] text-slate-400 mt-1">Photos & travel logs</div>
          </div>

          <div
            onClick={() => navigate('/reviews')}
            className="glass-card p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs cursor-pointer hover:border-amber-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Reviews Posted</span>
              <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900">{reviews.length} Reviews</div>
            <div className="text-[11px] text-slate-400 mt-1">Community ratings</div>
          </div>
        </div>
      </div>

      {/* Upcoming Trip Alert Card */}
      {upcomingTrip && (
        <div className="glass-card p-6 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-white to-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
              <Plane className="w-3 h-3 text-blue-600" />
              Next Scheduled Trip
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {upcomingTrip.destination_name} ({upcomingTrip.country || 'India'})
            </h3>
            <p className="text-xs text-slate-600">
              Stay: <strong>{upcomingTrip.hotel_or_resort_name}</strong> | Check-in: {upcomingTrip.check_in_date} | {upcomingTrip.nights} Nights | Ref: <span className="font-mono font-semibold">{upcomingTrip.booking_reference}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/bookings')}
              className="btn btn-primary text-xs font-semibold px-4 py-2.5 shadow-xs"
            >
              View Booking E-Ticket & QR
            </button>
          </div>
        </div>
      )}

      {/* Preferences & Emergency Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Travel Preferences */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              Travel Preferences & Settings
            </h3>
            <button
              onClick={() => setEditModal(true)}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Update
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Travel Style</span>
              <span className="font-bold text-slate-800">{userProfile?.travelStyle || 'Balanced & Adventurous'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Dietary Preference</span>
              <span className="font-bold text-slate-800">{userProfile?.dietaryPreference || 'Vegetarian'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Preferred Transit</span>
              <span className="font-bold text-slate-800">{userProfile?.preferredTransport || 'Flight + Scenic Train'}</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact & Safety */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              Emergency Contact & Safety
            </h3>
            <span className="badge badge-green text-[10px]">Active SOS</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Person</span>
              <span className="font-bold text-slate-900">{userProfile?.emergencyContact?.name || 'Ramesh V (Family)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Relationship</span>
              <span className="text-slate-700">{userProfile?.emergencyContact?.relation || 'Father / Guardian'}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/60 pt-2">
              <span className="text-slate-500">Emergency Phone</span>
              <span className="font-mono font-bold text-emerald-600">{userProfile?.emergencyContact?.phoneNumber || '+91 94401 23456'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Shared with hotels during check-in for emergency assistance.</span>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Edit Profile & Travel Preferences
              </h3>
              <button onClick={() => setEditModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Full Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="form-control text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="form-control text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Traveler Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={2}
                  className="form-control text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Travel Style</label>
                  <select
                    value={formData.travelStyle}
                    onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                    className="form-control text-xs"
                  >
                    <option>Balanced & Adventurous</option>
                    <option>Luxury & Leisure</option>
                    <option>Budget Explorer</option>
                    <option>Cultural & Heritage</option>
                    <option>Solo Backpacker</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Dietary</label>
                  <select
                    value={formData.dietaryPreference}
                    onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                    className="form-control text-xs"
                  >
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>Non-Vegetarian</option>
                    <option>Halal</option>
                    <option>Gluten-Free</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Transit Preference</label>
                  <select
                    value={formData.preferredTransport}
                    onChange={(e) => setFormData({ ...formData, preferredTransport: e.target.value })}
                    className="form-control text-xs"
                  >
                    <option>Flight + Scenic Train</option>
                    <option>Flight + Private Cab</option>
                    <option>Road Trip / Self Drive</option>
                    <option>Trains & Public Transit</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  Emergency Contact Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                      className="form-control text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Relationship</label>
                    <input
                      type="text"
                      value={formData.emergencyRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                      className="form-control text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Phone Number</label>
                    <input
                      type="text"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="form-control text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="btn btn-secondary text-xs flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs flex-1"
                >
                  Save Profile & Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
