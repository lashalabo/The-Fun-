
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';

const navItems = [
  { path: '/discover', icon: 'map', label: 'Discover' },
  { path: '/create', icon: 'plusCircle', label: 'Create' },
  { path: '/notifications', icon: 'bell', label: 'Alerts' },
  { path: '/profile', icon: 'user', label: 'Profile' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 w-full transition-colors duration-200 ${
                isActive
                  ? 'text-brand-purple dark:text-brand-teal-light'
                  : 'text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-teal-light'
              }`
            }
          >
            <Icon name={item.icon as any} className="w-7 h-7" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
