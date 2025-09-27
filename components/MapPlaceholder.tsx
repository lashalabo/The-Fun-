import React from 'react';
import type { Event } from '../types';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface MapPlaceholderProps {
  events: Event[];
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ events }) => {
    // These positions are hardcoded for visual representation on a static map image.
    const markerPositions = [
        { top: '25%', left: '30%' },
        { top: '50%', left: '60%' },
        { top: '65%', left: '20%' },
        { top: '40%', left: '80%' },
    ];
  return (
    <div className="relative w-full h-full bg-gray-800">
      <img src="https://i.imgur.com/4l0n5hC.png" alt="Stylized city map" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-bg to-transparent"></div>

      {events.map((event, index) => (
        <Link 
            key={event.id} 
            to={`/event/${event.id}`} 
            className="absolute -translate-x-1/2 -translate-y-full"
            style={markerPositions[index % markerPositions.length]}
        >
          <div className="group flex flex-col items-center cursor-pointer">
            <div className="absolute bottom-full mb-2 w-max bg-dark-surface dark:bg-gray-100 text-white dark:text-dark-bg px-3 py-1 rounded-lg text-sm font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {event.title}
            </div>
             <div className="p-2 bg-brand-purple dark:bg-brand-teal rounded-full shadow-lg dark:shadow-[0_0_15px_3px_#4FD1C5] transform group-hover:scale-110 transition-transform duration-200">
                <Icon name="location" className="w-6 h-6 text-white"/>
             </div>
             <div className="w-2 h-2 bg-brand-purple/50 dark:bg-brand-teal/50 rounded-full animate-ping"></div>
          </div>
        </Link>
      ))}
    </div>
  );
};