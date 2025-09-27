import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Event } from '../types';
import { Icon } from '../components/Icon';
import { Map } from '../components/Map';
import { EventCard } from '../components/EventCard';
import { FilterPanel } from '../components/FilterPanel';

export const DiscoveryPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [showFilters, setShowFilters] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDateFilter, setActiveDateFilter] = useState('Today');
    const [customDate, setCustomDate] = useState('');
    const [privacyFilter, setPrivacyFilter] = useState('All');
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const eventsCollection = collection(db, 'events');
        const q = query(eventsCollection);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsData: Event[] = querySnapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
                startTime: (doc.data().startTime as Timestamp)?.toDate(),
                endTime: (doc.data().endTime as Timestamp)?.toDate(),
            } as Event));
            setEvents(eventsData);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredEvents = events.filter((event) => {
        const categoryMatch = activeCategory === 'All' || event.category === activeCategory;
        let dateMatch = false;
        const eventDate = event.startTime;
        if (!eventDate) { dateMatch = false; }
        else if (customDate) {
            const startOfDay = new Date(customDate); startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(customDate); endOfDay.setUTCHours(23, 59, 59, 999);
            dateMatch = eventDate >= startOfDay && eventDate <= endOfDay;
        } else {
            switch (activeDateFilter) {
                case 'Today': const today = new Date(); dateMatch = eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear(); break;
                case 'Tomorrow': const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); dateMatch = eventDate.getDate() === tomorrow.getDate() && eventDate.getMonth() === tomorrow.getMonth() && eventDate.getFullYear() === tomorrow.getFullYear(); break;
                case 'This Weekend': const weekendToday = new Date(); const dayOfWeek = weekendToday.getDay(); const startOfWeekend = new Date(weekendToday); startOfWeekend.setDate(weekendToday.getDate() - dayOfWeek + 5); startOfWeekend.setHours(0, 0, 0, 0); const endOfWeekend = new Date(startOfWeekend); endOfWeekend.setDate(startOfWeekend.getDate() + 2); endOfWeekend.setHours(23, 59, 59, 999); dateMatch = eventDate >= startOfWeekend && eventDate <= endOfWeekend; break;
                default: dateMatch = true; break;
            }
        }
        const privacyMatch = privacyFilter === 'All' || (privacyFilter === 'Public' && !event.isPrivate) || (privacyFilter === 'Private' && event.isPrivate);
        return categoryMatch && dateMatch && privacyMatch;
    });

    return (
        <div className="w-full h-full relative">
            <div className="absolute inset-0">
                <Map events={filteredEvents} />
            </div>
            <div className="fixed top-[72px] left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center bg-gray-200/80 dark:bg-dark-surface/80 backdrop-blur-sm p-1 rounded-full shadow-md space-x-1">
                    <div className="flex items-center bg-gray-300/50 dark:bg-black/20 p-0.5 rounded-full">
                        <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-full transition-colors ${viewMode === 'map' ? 'bg-white dark:bg-dark-bg' : 'text-gray-600 dark:text-gray-300'}`}><Icon name="map" className="w-5 h-5" /></button>
                        <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-dark-bg' : 'text-gray-600 dark:text-gray-300'}`}><Icon name="list" className="w-5 h-5" /></button>
                    </div>
                    <button onClick={() => setShowFilters(true)} className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200">
                        Filters
                    </button>
                </div>
            </div>
            {showFilters && (
                <FilterPanel
                    activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                    activeDateFilter={activeDateFilter} setActiveDateFilter={setActiveDateFilter}
                    customDate={customDate} setCustomDate={setCustomDate}
                    privacyFilter={privacyFilter} setPrivacyFilter={setPrivacyFilter}
                    onClose={() => setShowFilters(false)}
                />
            )}
            <div className={`relative z-10 h-full overflow-y-auto pt-28 ${viewMode === 'list' ? 'block' : 'hidden'}`}>
                {isLoading ? (<p className="text-center">Loading events...</p>) : (
                    filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (<EventCard key={event.id} event={event} />))
                    ) : (<p className="text-center text-gray-500">No events found for this filter.</p>)
                )}
            </div>
        </div>
    );
};