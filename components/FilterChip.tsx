
import React from 'react';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-200 whitespace-nowrap ${
        isActive
          ? 'bg-brand-purple text-white border-brand-purple dark:bg-brand-teal dark:border-brand-teal'
          : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-dark-surface'
      }`}
    >
      {label}
    </button>
  );
};
