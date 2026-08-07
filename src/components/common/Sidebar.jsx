import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Compass,
  Sparkles,
  Calendar,
  Heart,
  Bell,
  User,
  Settings,
  Camera,
  Star,
  HelpCircle,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const { notifications = [] } = useApp() || {};
  const navigate = useNavigate();

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore Places', icon: Compass },
    { path: '/planner', label: 'AI Trip Planner', icon: Sparkles, badge: 'AI' },
    { path: '/bookings', label: 'My Trips', icon: Calendar },
    { path: '/wishlist', label: 'Wishlist & Saved', icon: Heart },
    { path: '/notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { path: '/memories', label: 'Travel Memories', icon: Camera },
    { path: '/reviews', label: 'My Reviews', icon: Star },
    { path: '/profile', label: 'Profile Dashboard', icon: User },
    { path: '/settings', label: 'Settings & Security', icon: Settings },
    { path: '/support', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 glass-nav z-40 p-4 border-r border-slate-200 bg-white">
      {/* Brand Header */}
      <div
        onClick={() => navigate('/home')}
        className="flex items-center gap-3 px-3 py-3 mb-6 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <i className="fas fa-compass text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold font-heading tracking-wide text-slate-900">
            Travel<span className="gradient-text">Nest</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Smart Travel Platform</p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}

              {item.count > 0 && (
                <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="pt-4 mt-2 border-t border-slate-200">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
              {currentUser?.displayName ? currentUser.displayName.charAt(0) : 'S'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.displayName || currentUser?.fullName || 'Traveler'}</p>
              <p className="text-[11px] text-blue-600 font-semibold">{currentUser?.travelerLevel || 'Gold Explorer'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
