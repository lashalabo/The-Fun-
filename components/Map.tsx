import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import type { Event } from '../types';
import { useTheme } from '../hooks/useTheme';
import { mapStyles } from './mapStyles';

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


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        }
    }, []);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                styles: theme === 'dark' ? mapStyles.dark : mapStyles.light,
                disableDefaultUI: true,
                zoomControl: true,
                scrollwheel: true, // Add this line
            }}
        >
            {events.map((event) => (
                <MarkerF
                    key={event.id}
                    position={event.location}
                    icon={categoryIcons[event.category as keyof typeof categoryIcons] || defaultIcon}
                />
            ))}
        </GoogleMap>
    );
};