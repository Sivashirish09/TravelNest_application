import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  CheckCircle2, 
  CloudSun, 
  Sparkles, 
  Check, 
  Trash2, 
  Eye,
  AlertCircle,
  XCircle,
  CreditCard,
  Camera,
  Star,
  DollarSign,
  Clock,
  Filter,
  ArrowRight
} from 'lucide-react';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { 
    notifications = [], 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('all');

  const getIconAndColor = (type, category) => {
    switch (type) {
      case 'booking':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'cancellation':
        return {
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
          bgColor: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'payment':
      case 'refund':
        return {
          icon: <CreditCard className="w-5 h-5 text-blue-600" />,
          bgColor: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'itinerary':
      case 'ai':
        return {
          icon: <Sparkles className="w-5 h-5 text-purple-600" />,
          bgColor: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'weather':
        return {
          icon: <CloudSun className="w-5 h-5 text-amber-500" />,
          bgColor: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'memory':
        return {
          icon: <Camera className="w-5 h-5 text-pink-600" />,
          bgColor: 'bg-pink-50 text-pink-700 border-pink-200'
        };
      case 'review':
        return {
          icon: <Star className="w-5 h-5 text-amber-500" />,
          bgColor: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      default:
        return {
          icon: <Bell className="w-5 h-5 text-slate-600" />,
          bgColor: 'bg-slate-50 text-slate-700 border-slate-200'
        };
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'booking') return n.type === 'booking' || n.category === 'Booking Confirmed';
    if (activeFilter === 'cancellation') return n.type === 'cancellation' || n.category === 'Booking Cancelled';
    if (activeFilter === 'payment') return n.type === 'payment' || n.type === 'refund' || n.category === 'Refund Processed';
    if (activeFilter === 'itinerary') return n.type === 'itinerary' || n.type === 'ai';
    if (activeFilter === 'weather') return n.type === 'weather';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            Notification Center ({unreadCount} Unread)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Travel Alerts & Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time confirmations, cancellation & refund status, weather guidance, and AI travel updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="btn btn-secondary btn-sm text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setActiveFilter('booking')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            activeFilter === 'booking'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Bookings</span>
        </button>

        <button
          onClick={() => setActiveFilter('cancellation')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            activeFilter === 'cancellation'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <XCircle className="w-3 h-3" />
          <span>Cancelled & Refunds</span>
        </button>

        <button
          onClick={() => setActiveFilter('payment')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            activeFilter === 'payment'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CreditCard className="w-3 h-3" />
          <span>Payments</span>
        </button>

        <button
          onClick={() => setActiveFilter('itinerary')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            activeFilter === 'itinerary'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Itineraries</span>
        </button>

        <button
          onClick={() => setActiveFilter('weather')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            activeFilter === 'weather'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CloudSun className="w-3 h-3" />
          <span>Weather</span>
        </button>
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-200 bg-white text-center text-slate-500 shadow-xs">
          <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">No notifications in this category</h3>
          <p className="text-xs text-slate-500 mt-1">
            New booking alerts, refund confirmations, and itinerary updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => {
            const { icon, bgColor } = getIconAndColor(n.type, n.category);
            const isUnread = !n.read;

            return (
              <div
                key={n.id}
                className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isUnread
                    ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200/80 bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`p-2.5 rounded-2xl border shrink-0 shadow-xs ${bgColor}`}>
                    {icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {n.category || 'Notification'}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h3>
                      {isUnread && (
                        <span className="badge badge-blue text-[9px] py-0.2">NEW</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {n.description || n.message}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{n.time || 'Today'}</span>
                      {n.date && <span>• {n.date}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {n.bookingId && (
                    <button
                      onClick={() => {
                        markNotificationRead(n.id);
                        navigate('/bookings');
                      }}
                      className="btn btn-secondary btn-sm text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Trip</span>
                    </button>
                  )}

                  {isUnread && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
