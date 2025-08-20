import React, { useState, useEffect } from 'react'; // Change this import
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
type MapProps = {
    events: Event[];
}; 
import type { Event } from '../types';
import { useTheme } from '../hooks/useTheme';
import { mapStyles } from './mapStyles';

const libraries: ('places')[] = ['places']; // Add this line

// We define the known heights of the UI elements that cover the viewport
const HEADER_HEIGHT = 60; // Approximate height of the Header in pixels
const BOTTOM_NAV_HEIGHT = 64; // h-16 from BottomNav.tsx (4rem = 64px)
const TOTAL_VERTICAL_OFFSET = HEADER_HEIGHT + BOTTOM_NAV_HEIGHT;

const containerStyle = {
    width: '100%',
    // THE FIX: Calculate the height dynamically to fill the available space
    height: `calc(100vh - ${TOTAL_VERTICAL_OFFSET}px)`,
};

// Default center is a fallback
const defaultCenter = {
    lat: 34.0522,
    lng: -118.2437,
};

export const Map: React.FC<MapProps> = ({ events }) => {
    const [center, setCenter] = useState(defaultCenter);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCenter({ lat: latitude, lng: longitude });
            });
        }
    }, []);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries, // Add this line
    });

    const { theme } = useTheme();

    if (loadError) {
        return <div>Error loading maps</div>;
    }
    const categoryIcons = {
        Party: '🎉',
        Picnic: '🧺',
        Sports: '⚽️',
        Club: '🎶',
        Gaming: '🎮',
        Study: '📚',
    };
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                styles: theme === 'dark' ? mapStyles.dark : mapStyles.light,
                disableDefaultUI: true,
                zoomControl: true,
            }}
        >
            {events.map((event) => (
                <MarkerF
                    key={event.id}
                    position={event.location}
                    label={categoryIcons[event.category as keyof typeof categoryIcons] || '📍'}
                />
            ))}
        </GoogleMap>
    ) : (
        <div>Loading...</div>
    );
};