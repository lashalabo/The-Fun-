import React, { useState, useEffect } from 'react'; // Change this import
import { db } from '../services/firebase'; // Import the database
import { collection, addDoc } from "firebase/firestore";
import { Event } from '../types'; // Import the Event type
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { AIIdeaGenerator } from '../components/AIIdeaGenerator';
import { EventCategory, GenderRatio } from '../types';
import { Icon } from '../components/Icon';

const libraries: ('places')[] = ['places'];

export const CreateEventPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<EventCategory>(EventCategory.PARTY);
    const [isLoading, setIsLoading] = useState(false); // Add a loading state

    // State for the new location fields
    const [address, setAddress] = useState('');
    const [addressDetails, setAddressDetails] = useState('');

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const handleSelectIdea = (idea: { title: string; description: string; category: string }) => {
        setTitle(idea.title);
        setDescription(idea.description);
        const ideaCategory = Object.values(EventCategory).find(c => c.toLowerCase() === idea.category.toLowerCase());
        if (ideaCategory) {
            setCategory(ideaCategory);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        const bestResult = data.results[0].formatted_address;

                        // Find the address input and set its value
                        const addressInput = document.getElementById('location') as HTMLInputElement;
                        if (addressInput) {
                            addressInput.value = bestResult;
                        }
                        setAddress(bestResult); // Also update the state
                        alert(`Location found: ${bestResult}`);
                    } else {
                        alert("Could not find an address for this location.");
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    alert("Failed to fetch address details.");
                }

            }, () => {
                alert('Could not get your location. Please check your browser permissions.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create an event object from the form state
            const newEvent = {
                title,
                description,
                category,
                capacity: 10,
                genderRatio: 'Any',
                attendees: [], // Add this line to include an empty attendees list
                // You would also get location data and the host info here
            };

            // 'events' is the name of the collection in your database
            const docRef = await addDoc(collection(db, "events"), newEvent);

            console.log("Document written with ID: ", docRef.id);
            alert("Event created and saved successfully!");
            // Optionally, redirect the user
            window.location.hash = `/event/${docRef.id}`;

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to create event. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) {
        return <div className="p-4 text-center">Loading Maps...</div>;
    }

    return (
        <div className="p-4 pb-24">
            <h1 className="text-2xl font-bold mb-4">Create an Event</h1>

            <AIIdeaGenerator onSelectIdea={handleSelectIdea} />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- Core Details --- */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full input-style" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full input-style" required />
                    </div>
                    <div>
                        <label htmlFor="contributions" className="block text-sm font-bold text-gray-700 dark:text-gray-300">What should guests bring?</label>
                        <input type="text" id="contributions" placeholder="e.g., snacks, drinks, good vibes" className="mt-1 block w-full input-style" />
                    </div>
                </div>

                {/* --- Location --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Location</h3>
                    <div>
                        <label htmlFor="location" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Address</label>
                        <div className="mt-1 flex items-center space-x-2">
                            <Autocomplete>
                                <input type="text" id="location" placeholder="Search for an address" className="w-full input-style" required />
                            </Autocomplete>
                            <button type="button" onClick={handleGetCurrentLocation} className="p-2.5 bg-brand-purple/10 dark:bg-brand-teal/10 rounded-md" aria-label="Use current location">
                                <Icon name="location" className="w-5 h-5 text-brand-purple dark:text-brand-teal" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="addressDetails" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Additional Info (Optional)</label>
                        <input type="text" id="addressDetails" placeholder="e.g., Apt #123, door code 456" className="mt-1 block w-full input-style" />
                    </div>
                </div>

                {/* --- Rules & Settings --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Settings</h3>
                    <div>
                        <label htmlFor="category" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as EventCategory)} className="mt-1 block w-full input-style">
                            {Object.values(EventCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="capacity" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Capacity</label>
                            <input type="number" id="capacity" defaultValue={10} className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="genderRatio" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Guest Ratio</label>
                            <select id="genderRatio" defaultValue={GenderRatio.ANY} className="mt-1 block w-full input-style">
                                {Object.values(GenderRatio).map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Event Type</label>
                        <div className="mt-2 flex items-center space-x-6">
                            <label className="flex items-center">
                                <input type="radio" name="eventType" value="public" className="h-4 w-4 text-brand-purple border-gray-300 focus:ring-brand-purple" defaultChecked />
                                <span className="ml-2">Public</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="eventType" value="private" className="h-4 w-4 text-brand-purple border-gray-300 focus:ring-brand-purple" />
                                <span className="ml-2">Private</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-brand-purple dark:bg-brand-teal text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Create Event
                </button>
            </form>
        </div>
    );
};