import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { Map } from '../components/Map';
import { MOCK_EVENTS } from '../constants';
import { EventCard } from '../components/EventCard';
import { FilterChip } from '../components/FilterChip';

const categories = ['All', 'Party', 'Picnic', 'Sports', 'Gaming'];

export const DiscoveryPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredEvents = MOCK_EVENTS.filter(
        (event) => activeCategory === 'All' || event.category === activeCategory
    );

    return (
        // This is the main container for the entire page.
        <div className="w-full h-full relative">
            {/* Layer 1: The Map. It is always present in the background. */}
            <div className="absolute inset-0">
                <Map events={filteredEvents} />
            </div>

            {/* Layer 2: Fixed UI Elements that float on top */}
            <div className="fixed top-[72px] left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center bg-gray-200 dark:bg-dark-surface p-1 rounded-full shadow-md">
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${viewMode === 'map'
                                ? 'bg-brand-purple dark:bg-brand-teal text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <Icon name="map" className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${viewMode === 'list'
                                ? 'bg-brand-purple dark:bg-brand-teal text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <Icon name="list" className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="fixed top-32 w-full z-20 overflow-x-auto px-4 py-2 no-scrollbar">
                <div className="flex space-x-2">
                    {categories.map((category) => (
                        <FilterChip
                            key={category}
                            label={category}
                            isActive={activeCategory === category}
                            onClick={() => setActiveCategory(category)}
                        />
                    ))}
                </div>
            </div>

            {/* Layer 3: The List View. We now use a conditional class to hide/show it. */}
            <div
                className={`relative z-10 h-full overflow-y-auto pt-40 ${viewMode === 'list' ? 'block' : 'hidden'
                    }`}
            >
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
};