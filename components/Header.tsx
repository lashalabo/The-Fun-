
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm z-10 px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-teal">
        The FUN
      </h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Icon name="moon" className="w-5 h-5 text-brand-purple" /> : <Icon name="sun" className="w-5 h-5 text-brand-gold" />}
      </button>
    </header>
  );
};
