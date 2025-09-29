// components/Map.tsx (Updated)
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import { useTheme } from '../hooks/useTheme';
import { mapStyles } from './mapStyles';

const libraries: ('places')[] = ['places'];
const containerStyle = { width: '100%', height: '100vh' };
const defaultCenter = { lat: 41.7151, lng: 44.8271 };

export const Map: React.FC<{ events: Event[] }> = ({ events }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const [center, setCenter] = useState(defaultCenter);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        }
    }, []);

    const handleMarkerClick = (event: Event) => {
        navigate(`/event/${event.id}`, { state: { event } });
    };

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
                scrollwheel: true,
            }}
        >
            {events.map((event) => (
                <MarkerF
                    key={event.id}
                    position={event.location}
                    onClick={() => handleMarkerClick(event)}
                    onMouseOver={() => setActiveMarker(event.id)}
                    onMouseOut={() => setActiveMarker(null)}
                >
                    {activeMarker === event.id && (
                        <InfoWindowF
                            onCloseClick={() => setActiveMarker(null)}
                            options={{ disableAutoPan: true }} // Add this 'options' prop
                        >
                            <div className="p-1">
                                <h3 className="font-bold text-md text-gray-800">{event.title}</h3>
                            </div>
                        </InfoWindowF>
                    )}
                </MarkerF>
            ))}
        </GoogleMap>
    );
};