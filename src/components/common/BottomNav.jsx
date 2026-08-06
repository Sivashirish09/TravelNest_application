import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Calendar, Heart, User } from 'lucide-react';

export const BottomNav = () => {
  const items = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/planner', label: 'AI Plan', icon: Sparkles },
    { path: '/bookings', label: 'My Trips', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
