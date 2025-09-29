import React, { useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { AIIdeaGenerator } from '../components/AIIdeaGenerator';
import { EventCategory, GenderRatio, Activity } from '../types';
import { Icon } from '../components/Icon';

const libraries: ('places')[] = ['places'];

const availableActivities: Activity[] = [
    { name: 'DJ Set', icon: 'dj' },
    { name: 'Karaoke', icon: 'microphone' },
    { name: 'Live Music', icon: 'musicNote' },
];

export const CreateEventPage: React.FC = () => {
    const [capacity, setCapacity] = useState(10);
    const [genderRatio, setGenderRatio] = useState<GenderRatio>(GenderRatio.ANY);
    const [isPrivate, setIsPrivate] = useState(false);
    // All component state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<EventCategory>(EventCategory.PARTY);
    const [isLoading, setIsLoading] = useState(false);
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
    const [musicInfo, setMusicInfo] = useState('');
    const [contributions, setContributions] = useState('');
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
        if (ideaCategory) setCategory(ideaCategory);
    };

    const handleActivityToggle = (activity: Activity) => {
        setSelectedActivities(prev =>
            prev.some(a => a.name === activity.name)
                ? prev.filter(a => a.name !== activity.name)
                : [...prev, activity]
        );
    };

    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => setAutocomplete(autocompleteInstance);

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry?.location) {
                setLat(place.geometry.location.lat());
                setLng(place.geometry.location.lng());
            }
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLng(longitude);

                // --- NEW REVERSE GEOCODING LOGIC ---
                const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.results && data.results[0]) {
                        const address = data.results[0].formatted_address;

                        // Find the address input and set its value
                        const addressInput = document.getElementById('location') as HTMLInputElement;
                        if (addressInput) {
                            addressInput.value = address;
                        }
                        alert(`Location found: ${address}`);
                    } else {
                        alert("Could not find an address for this location.");
                    }
                } catch (error) {
                    console.error("Error during reverse geocoding:", error);
                    alert("Failed to fetch address details.");
                }
                // --- END OF NEW LOGIC ---

            }, () => {
                alert("Unable to retrieve your location. Please check browser permissions.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || lat === null || lng === null) {
            alert("Please ensure you are logged in and have selected a valid address from the dropdown.");
            return;
        }

        setIsLoading(true);
        try {
            const hostData = { id: user.uid, name: user.displayName || 'Anonymous', avatarUrl: user.photoURL || '' };

            const newEvent = {
                title,
                description,
                category,
                startTime: Timestamp.fromDate(new Date(`${eventDate}T${startTime}`)),
                endTime: Timestamp.fromDate(new Date(`${eventDate}T${endTime}`)),
                // --- FIX: Use the 'isPrivate' state variable for reliability ---
                isPrivate: isPrivate,
                location: { address: (document.getElementById('location') as HTMLInputElement).value, lat, lng },
                addressDetails,
                host: hostData,
                // --- THIS IS THE FIX ---
                // Initialize the event with the host as the first attendee.
                attendees: [hostData],
                attendeeIds: [user.uid],
                // --- END OF FIX ---
                activities: selectedActivities,
                musicInfo: musicInfo,
                contributions: contributions.split(',').map(item => item.trim()),
                capacity: parseInt((document.getElementById('capacity') as HTMLInputElement).value, 10) || 10,
                genderRatio: (document.getElementById('genderRatio') as HTMLSelectElement).value,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "events"), newEvent);
            alert("Event created successfully!");
            window.location.hash = `/discover`;
        } catch (error) {
            console.error("Error creating event: ", error);
            alert("Failed to create event.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="p-4 pb-24">
            <h1 className="text-2xl font-bold mb-4">Create an Event</h1>
            <AIIdeaGenerator onSelectIdea={handleSelectIdea} />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- Core Details --- */}
                <div className="space-y-4">
                    <div><label htmlFor="title" className="font-bold">Title</label><input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 input-style" required /></div>
                    <div><label htmlFor="description" className="font-bold">Description</label><textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 input-style" required /></div>
                    <div><label htmlFor="contributions" className="font-bold">What should guests bring?</label><input id="contributions" type="text" value={contributions} onChange={e => setContributions(e.target.value)} placeholder="e.g., snacks, drinks" className="mt-1 input-style" /></div>
                </div>

                {/* --- Music & Activities Section --- */}
                <div className="space-y-4"><h3 className="text-lg font-bold">Music & Activities</h3><div><label className="font-bold">Select Activities</label><div className="mt-2 grid grid-cols-3 gap-2">{availableActivities.map((activity) => { const isSelected = selectedActivities.some(a => a.name === activity.name); return (<button type="button" key={activity.name} onClick={() => handleActivityToggle(activity)} className={`flex flex-col items-center justify-center p-2 border-2 rounded-lg transition-colors ${isSelected ? 'bg-brand-purple/20 border-brand-purple dark:bg-brand-teal/20 dark:border-brand-teal' : 'border-gray-300 dark:border-gray-600'}`}><Icon name={activity.icon as any} className="w-8 h-8" /><span className="text-xs font-semibold mt-1">{activity.name}</span></button>); })}</div></div><div><label htmlFor="musicInfo" className="font-bold">Music/Equipment Details</label><textarea id="musicInfo" value={musicInfo} onChange={e => setMusicInfo(e.target.value)} rows={2} className="mt-1 input-style" placeholder="e.g., We have a full DJ setup..." /></div></div>

                {/* --- Date, Time, Location, and Settings --- */}
                <div className="space-y-4"><h3 className="text-lg font-bold">Date & Time</h3><div><label htmlFor="eventDate" className="font-bold">Date</label><input type="date" id="eventDate" value={eventDate} onChange={e => setEventDate(e.target.value)} className="mt-1 input-style" required /></div><div className="grid grid-cols-2 gap-4"><div><label htmlFor="startTime" className="font-bold">Start Time</label><input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 input-style" required /></div><div><label htmlFor="endTime" className="font-bold">End Time</label><input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 input-style" required /></div></div></div>
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Location</h3>
                    <div>
                        <label htmlFor="location" className="font-bold">Address</label>
                        <div className="mt-1 flex items-center space-x-2">
                            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}><input type="text" id="location" placeholder="Search for an address" className="w-full input-style" required /></Autocomplete>
                            <button type="button" onClick={handleGetCurrentLocation} className="p-2.5 bg-brand-purple/10 dark:bg-brand-teal/10 rounded-md" aria-label="Use current location"><Icon name="location" className="w-5 h-5 text-brand-purple dark:text-brand-teal" /></button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="addressDetails" className="font-bold">Additional Info (Optional)</label>
                        <input type="text" id="addressDetails" value={addressDetails} onChange={e => setAddressDetails(e.target.value)} placeholder="e.g., Apt #123, door code 456" className="mt-1 input-style" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label htmlFor="capacity" className="font-bold">Capacity</label><input type="number" id="capacity" value={capacity} onChange={e => setCapacity(parseInt(e.target.value, 10))} className="mt-1 input-style" /></div>
                        <div><label htmlFor="genderRatio" className="font-bold">Guest Ratio</label><select id="genderRatio" value={genderRatio} onChange={e => setGenderRatio(e.target.value as GenderRatio)} className="mt-1 input-style">
                            {Object.values(GenderRatio).map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}
                        </select></div>
                    </div>
                    <div>
                        <label className="font-bold">Event Type</label>
                        <div className="mt-2 flex items-center space-x-6">
                            <label className="flex items-center">
                                <input type="radio" name="eventType" checked={!isPrivate} onChange={() => setIsPrivate(false)} className="h-4 w-4" />
                                <span className="ml-2">Public</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="eventType" checked={isPrivate} onChange={() => setIsPrivate(true)} className="h-4 w-4" />
                                <span className="ml-2">Private</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-brand-purple dark:bg-brand-teal text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:bg-gray-400">{isLoading ? 'Creating Event...' : 'Create Event'}</button>
            </form>
        </div>
    );
};