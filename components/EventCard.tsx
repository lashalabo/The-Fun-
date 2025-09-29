// components/EventCard.tsx (Corrected)
import React from 'react';
import type { Event } from '../types';
import { Icon } from './Icon';
import { Link } from 'react-router-dom';

interface EventCardProps { event: Event; }

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
        <Link to={`/event/${event.id}`} state={{ event: event }} className="block">
            <div className="bg-gray-50 dark:bg-dark-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 m-4">
                <div className="relative">
                    {/* --- FIX: Use event.picture and provide a fallback --- */}
                    {/* --- FIX: Use the actual event picture URL --- */}
                    <img src={event.picture || `https://picsum.photos/seed/${event.id}/400/200`} alt={event.title} className="w-full h-32 object-cover bg-gray-200 dark:bg-gray-700" />                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-2 left-4 text-white">
                        <h3 className="font-bold text-lg">{event.title}</h3>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                            <Icon name="users" className="w-5 h-5 text-brand-purple dark:text-brand-teal-light" />
                            <span>{event.attendees?.length || 0} / {event.capacity} going</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon name="calendar" className="w-5 h-5 text-brand-purple dark:text-brand-teal-light" />
                            <span>{timeFormatter.format(new Date(event.startTime))}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600 dark:text-gray-300">
                        {event.host && (
                            <>
                                <img src={event.host.avatarUrl} alt={event.host.name} className="w-6 h-6 rounded-full" />
                                <span>Hosted by <span className="font-semibold">{event.host.name}</span></span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};