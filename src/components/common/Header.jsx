import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Bell, Sparkles, User, Search, Menu, X, Heart, Settings, Camera, Star, HelpCircle } from 'lucide-react';

export const Header = () => {
  const { currentUser } = useAuth();
  const { unreadCount } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="glass-header sticky top-0 z-30 px-4 lg:px-8 pt-[max(0.875rem,env(safe-area-inset-top))] pb-3.5 flex items-center justify-between">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-blue-600 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Input Shortcut */}
      <div className="relative flex-1 max-w-xs hidden sm:flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
        <input
          type="text"
          onFocus={() => navigate('/explore')}
          placeholder="Search destinations, states, hotels..."
          className="form-control text-xs pl-10 py-2 bg-slate-50 border-slate-200"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={() => navigate('/planner')}
          className="btn btn-primary btn-sm text-xs font-semibold hidden sm:flex"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Trip Planner</span>
        </button>

        {/* Notifications Bell Button with Live Unread Counter */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar Link */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer shadow-xs"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
            {currentUser?.displayName ? currentUser.displayName.charAt(0) : 'S'}
          </div>
          <span className="text-xs font-bold text-slate-800 hidden md:inline pr-1">
            {currentUser?.displayName || currentUser?.fullName || 'Traveler'}
          </span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl animate-slide-in-left">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-lg font-bold font-heading text-slate-900">TravelNest</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {[
                { path: '/wishlist', label: 'Wishlist & Saved', icon: Heart },
                { path: '/memories', label: 'Travel Memories', icon: Camera },
                { path: '/notifications', label: 'Notifications', icon: Bell, count: unreadCount },
                { path: '/reviews', label: 'My Reviews', icon: Star },
                { path: '/settings', label: 'Settings & Security', icon: Settings },
                { path: '/support', label: 'Help & Support', icon: HelpCircle },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                  {currentUser?.displayName ? currentUser.displayName.charAt(0) : 'S'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{currentUser?.displayName || currentUser?.fullName || 'Traveler'}</p>
                  <p className="text-[11px] text-slate-500">{currentUser?.travelerLevel || 'Gold Explorer'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
