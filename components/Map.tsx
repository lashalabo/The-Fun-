import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import type { Event } from '../types';
import { useTheme } from '../hooks/useTheme';
import { mapStyles } from './mapStyles';

<<<<<<< HEAD
const libraries: ('places')[] = ['places'];

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const defaultCenter = {
    lat: 41.7151,
    lng: 44.8271, // Centered on Tbilisi
};

export const Map: React.FC<{ events: Event[] }> = ({ events }) => {
    const [center, setCenter] = useState(defaultCenter);
    const { theme } = useTheme();

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // --- CORRECTED ICON DEFINITION USING useMemo ---
    const { categoryIcons, defaultIcon } = useMemo(() => {
        if (!isLoaded) return { categoryIcons: {}, defaultIcon: {} }; // Return empty objects if maps is not loaded

        const icons = {
            Party: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#8B5CF6', fillOpacity: 1, strokeWeight: 0, scale: 8 },
            Picnic: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#10B981', fillOpacity: 1, strokeWeight: 0, scale: 8 },
            Sports: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#3B82F6', fillOpacity: 1, strokeWeight: 0, scale: 8 },
            Gaming: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#EF4444', fillOpacity: 1, strokeWeight: 0, scale: 8 },
            Club: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#EC4899', fillOpacity: 1, strokeWeight: 0, scale: 8 },
            Study: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#F59E0B', fillOpacity: 1, strokeWeight: 0, scale: 8 },
        };
        const defIcon = { path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#6B7280', fillOpacity: 1, strokeWeight: 0, scale: 8 };

        return { categoryIcons: icons, defaultIcon: defIcon };
    }, [isLoaded]); // This will re-run only when isLoaded changes

=======
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
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
<<<<<<< HEAD
                setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
=======
                const { latitude, longitude } = position.coords;
                setCenter({ lat: latitude, lng: longitude });
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
            });
        }
    }, []);

<<<<<<< HEAD
    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
=======
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
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                styles: theme === 'dark' ? mapStyles.dark : mapStyles.light,
                disableDefaultUI: true,
                zoomControl: true,
<<<<<<< HEAD
                scrollwheel: true, // Add this line
=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
            }}
        >
            {events.map((event) => (
                <MarkerF
                    key={event.id}
                    position={event.location}
<<<<<<< HEAD
                    icon={categoryIcons[event.category as keyof typeof categoryIcons] || defaultIcon}
                />
            ))}
        </GoogleMap>
=======
                    label={categoryIcons[event.category as keyof typeof categoryIcons] || '📍'}
                />
            ))}
        </GoogleMap>
    ) : (
        <div>Loading...</div>
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
    );
};