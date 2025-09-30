import React, { useState, useEffect, useMemo } from 'react';
import type { Event, EventCategory, User } from '../types';
import { Icon } from '../components/Icon';
import { Map } from '../components/Map';
import { EventCard } from '../components/EventCard';
import { FilterPanel } from '../components/FilterPanel';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';
import { MapStyleSwitcher } from '../components/MapStyleSwitcher';

const adaptEventData = (eventData: any): Event => {
    const startTime = eventData.startTime?.toDate ? eventData.startTime.toDate() : new Date(eventData.time || Date.now());
    const endTime = eventData.endTime?.toDate ? eventData.endTime.toDate() : new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    const location = eventData.latitude && eventData.longitude ? {
        lat: eventData.latitude,
        lng: eventData.longitude,
        address: eventData.location,
    } : eventData.location?.lat && eventData.location?.lng ? {
        lat: eventData.location.lat,
        lng: eventData.location.lng,
        address: eventData.location.address,
    } : {
        lat: 41.7151,
        lng: 44.8271,
        address: eventData.location || "Tbilisi, Georgia",
    };

    return {
        id: eventData.id || eventData.unique_id,
        title: eventData.title,
        description: eventData.description || 'No description available.',
        category: (eventData.category as EventCategory) || 'General',
        startTime,
        endTime,
        location,
        host: eventData.host || { id: 'scraper-tktge', name: 'TKT.GE', avatarUrl: 'https://tkt.ge/favicon.ico' } as User,
        capacity: eventData.capacity || 100,
        attendees: eventData.attendees || [],
        attendeeIds: eventData.attendeeIds || [],
        isPrivate: eventData.isPrivate || false,
        picture: eventData.picture,
    } as Event;
};

export const DiscoveryPage: React.FC = () => {
    const { theme } = useTheme();
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [showFilters, setShowFilters] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDateFilter, setActiveDateFilter] = useState('Today');
    const [customDate, setCustomDate] = useState('');
    const [privacyFilter, setPrivacyFilter] = useState('Public');
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeMapStyle, setActiveMapStyle] = useState(theme === 'dark' ? 'cyberpunk' : 'vintage');

    useEffect(() => {
        setActiveMapStyle(theme === 'dark' ? 'cyberpunk' : 'vintage');
    }, [theme]);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/tkt_events_from_api.json');
                const scrapedEvents = await response.json();
                const adaptedScrapedEvents = scrapedEvents.map(adaptEventData);

                const eventsCollection = collection(db, 'events');
                const q = query(eventsCollection);
                onSnapshot(q, (querySnapshot) => {
                    const firestoreEvents = querySnapshot.docs.map(doc => adaptEventData({ id: doc.id, ...doc.data() }));
                    setAllEvents([...adaptedScrapedEvents, ...firestoreEvents]);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Failed to load events:", error);
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (showFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showFilters]);

    const filteredEvents = useMemo(() => {
        const toLocalDateString = (date: Date) => {
            const d = new Date(date);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return allEvents.filter((event) => {
            const categoryMatch = activeCategory === 'All' || event.category === activeCategory;
            const privacyMatch = privacyFilter === 'All' ||
                (privacyFilter === 'Public' && !event.isPrivate) ||
                (privacyFilter === 'Private' && event.isPrivate);

            if (!categoryMatch || !privacyMatch) {
                return false;
            }

            const eventDate = new Date(event.startTime);
            const today = new Date();

            if (customDate) {
                return toLocalDateString(eventDate) === customDate;
            }
            if (activeDateFilter === 'All') {
                return true;
            }
            if (activeDateFilter === 'Today') {
                return toLocalDateString(eventDate) === toLocalDateString(today);
            }
            if (activeDateFilter === 'Tomorrow') {
                const tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);
                return toLocalDateString(eventDate) === toLocalDateString(tomorrow);
            }
            if (activeDateFilter === 'This Weekend') {
                const dayOfWeek = today.getDay();
                const friday = new Date();
                friday.setDate(today.getDate() - dayOfWeek + 5);
                friday.setHours(0, 0, 0, 0);

                const sunday = new Date(friday);
                sunday.setDate(friday.getDate() + 2);
                sunday.setHours(23, 59, 59, 999);

                return eventDate >= friday && eventDate <= sunday;
            }
            return false;
        });
    }, [allEvents, activeCategory, activeDateFilter, customDate, privacyFilter]);

    return (
        <div className="w-full h-full relative">
            <div className="absolute inset-0"> <Map events={filteredEvents} mapStyleId={activeMapStyle} /> </div>

            {/* --- THIS IS THE FIX --- */}
            {/* We now have a main container for all top-bar controls */}
            <div className="fixed top-[72px] left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">

                {/* The Map/List view switcher is back */}
                <div className="flex items-center bg-gray-200/80 dark:bg-dark-surface/80 backdrop-blur-sm p-1 rounded-full shadow-md">
                    <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-full transition-colors ${viewMode === 'map' ? 'bg-white dark:bg-dark-bg' : 'text-gray-600 dark:text-gray-300'}`}><Icon name="map" className="w-5 h-5" /></button>
                    <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-dark-bg' : 'text-gray-600 dark:text-gray-300'}`}><Icon name="list" className="w-5 h-5" /></button>
                </div>

                {/* The new Map Style Switcher */}
                <MapStyleSwitcher
                    currentThemeMode={theme}
                    activeStyleId={activeMapStyle}
                    onStyleChange={setActiveMapStyle}
                />

                {/* The Filters button */}
                <button onClick={() => setShowFilters(true)} className="px-4 py-2.5 text-sm font-bold bg-gray-200/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-full shadow-md text-gray-700 dark:text-gray-200"> Filters </button>
            </div>

            {showFilters && (
                <FilterPanel
                    allEvents={allEvents}
                    activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                    activeDateFilter={activeDateFilter} setActiveDateFilter={setActiveDateFilter}
                    customDate={customDate} setCustomDate={setCustomDate}
                    privacyFilter={privacyFilter} setPrivacyFilter={setPrivacyFilter}
                    onClose={() => setShowFilters(false)}
                />
            )}

            {/* This div will now correctly appear when you click the "List" button */}
            <div className={`relative z-10 h-full overflow-y-auto pt-28 pb-20 ${viewMode === 'list' ? 'block' : 'hidden'}`}>
                {isLoading ? (<p className="text-center p-4">Loading events...</p>) : (
                    filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (<EventCard key={event.id} event={event} />))
                    ) : (<p className="text-center p-4 text-gray-500">No events found for this filter.</p>)
                )}
            </div>
        </div>
    );
};

