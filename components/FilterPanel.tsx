import React from 'react';
import { FilterChip } from './FilterChip';
import { Icon } from './Icon';

interface FilterPanelProps {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    activeDateFilter: string;
    setActiveDateFilter: (filter: string) => void;
    customDate: string;
    setCustomDate: (date: string) => void;
    privacyFilter: string;
    setPrivacyFilter: (filter: string) => void;
    onClose: () => void;
}

const categories = ['All', 'Party', 'Picnic', 'Sports', 'Gaming'];
const dateFilters = ['Today', 'Tomorrow', 'This Weekend'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
    activeCategory, setActiveCategory,
    activeDateFilter, setActiveDateFilter,
    customDate, setCustomDate,
    privacyFilter, setPrivacyFilter,
    onClose
}) => {
    const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomDate(e.target.value);
        setActiveDateFilter('');
    };

    return (
        <div className="absolute inset-0 z-30 flex flex-col">
            <div className="flex-grow bg-black/50" onClick={onClose}></div>
            <div className="bg-white dark:bg-dark-bg p-4 shadow-2xl rounded-t-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface">
                        <Icon name="xCircle" className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => <FilterChip key={cat} label={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} />)}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Date</h3>
                        <div className="flex flex-wrap gap-2 items-center">
                            {dateFilters.map(df => <FilterChip key={df} label={df} isActive={activeDateFilter === df} onClick={() => { setActiveDateFilter(df); setCustomDate(''); }} />)}
                            <label htmlFor="custom-date-picker" className={`relative flex items-center transition-all duration-200 py-2 rounded-full border-2 cursor-pointer ${customDate ? 'bg-brand-purple text-white border-brand-purple dark:bg-brand-teal dark:border-brand-teal px-4 space-x-2' : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-dark-surface px-2.5'}`}>
                                <Icon name="calendar" className="w-5 h-5" />
                                {customDate && (<span className="text-sm font-semibold">{new Date(customDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>)}
                                <input id="custom-date-picker" type="date" value={customDate} onChange={handleCustomDateChange} className="absolute inset-0 w-full h-full opacity-0" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Event Type</h3>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip label="All Events" isActive={privacyFilter === 'All'} onClick={() => setPrivacyFilter('All')} />
                            <FilterChip label="Public" isActive={privacyFilter === 'Public'} onClick={() => setPrivacyFilter('Public')} />
                            <FilterChip label="Private" isActive={privacyFilter === 'Private'} onClick={() => setPrivacyFilter('Private')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};