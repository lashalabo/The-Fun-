import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import type { Event } from '../types';
import React, { useState } from 'react';
import { CURRENT_USER, MOCK_EVENTS } from '../constants';
import { RatingStars } from '../components/RatingStars';
import { EventCard } from '../components/EventCard';
import { Icon } from '../components/Icon'; // Make sure Icon is imported

export const ProfilePage: React.FC = () => {
<<<<<<< HEAD
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = auth.currentUser; // Make sure to import auth from firebase
    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        const eventsQuery = query(collection(db, 'events'), where("host.id", "==", user.uid));

        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            const userEvents: Event[] = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
                startTime: (doc.data().startTime as Timestamp)?.toDate(),
            } as Event));
            setMyEvents(userEvents);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const location = useLocation();
    const [showRatingModal, setShowRatingModal] = useState(!!location.state?.showRatingForEventId);
=======
    const user = CURRENT_USER;
    const pastEvents = MOCK_EVENTS.slice(0, 1); // Mock past events
    const [showRatingModal, setShowRatingModal] = useState(true); // State to control visibility
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
    const handleReportUser = () => {
        const confirmReport = window.confirm("Are you sure you want to report this user? This action cannot be undone.");
        if (confirmReport) {
            // In a real app, this would send a report to a backend server.
            alert("Thank you for your report. We will review this user's profile shortly.");
        }
    };

    return (
        <div>
            <div className="p-6 flex flex-col items-center text-center">
<<<<<<< HEAD
                {/* Use the correct properties from the Firebase user object */}
                <img src={user.photoURL || 'https://via.placeholder.com/150'} alt={user.displayName || 'User'} className="w-24 h-24 rounded-full border-4 border-brand-purple dark:border-brand-teal shadow-lg" />
                <h1 className="text-2xl font-bold mt-4">{user.displayName || 'New User'}</h1>

                {/* Use a placeholder rating for now */}
                <div className="mt-2">
                    <RatingStars rating={4.5} size="md" />
                </div>

                {/* Use a placeholder bio for now */}
                <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-sm">Welcome to The FUN!</p>

                {/* We will add tags back in a future step */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {/* Placeholder for tags */}
=======
                <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-brand-purple dark:border-brand-teal shadow-lg" />
                <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
                <div className="mt-2">
                    <RatingStars rating={user.rating} size="md" />
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-sm">{user.bio}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {user.tags.map(tag => (
                        <span key={tag} className="bg-gray-200 dark:bg-dark-surface text-sm font-semibold px-3 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                    <button onClick={handleReportUser} className="p-1.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20" aria-label="Report user">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 01-1-1V6z" clipRule="evenodd" />
                        </svg>
                    </button>
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-4 pt-4">
<<<<<<< HEAD
                <h2 className="text-xl font-bold">My Created Events</h2>
                {isLoading ? (
                    <p className="text-gray-500 mt-2">Loading your events...</p>
                ) : myEvents.length > 0 ? (
                    <div>
                        {myEvents.map(event => (
=======
                <h2 className="text-xl font-bold">Past Events</h2>
                {pastEvents.length > 0 ? (
                    <div>
                        {pastEvents.map(event => (
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
<<<<<<< HEAD
                    <p className="text-gray-500 mt-2">You haven't created any events yet.</p>
=======
                    <p className="text-gray-500 mt-2">No past events to show.</p>
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
                )}
            </div>

            {/* --- RATING MODAL --- */}
            {/* It will only show if 'showRatingModal' is true */}
            {showRatingModal && (
                <div className="fixed inset-x-0 bottom-24 max-w-md mx-auto p-4">
                    <div className="relative bg-white dark:bg-dark-surface rounded-lg shadow-2xl p-4 border border-brand-gold">
                        {/* THE NEW CLOSE BUTTON */}
                        <button
                            onClick={() => setShowRatingModal(false)}
                            className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full"
                            aria-label="Close rating modal"
                        >
                            <Icon name="xCircle" className="w-6 h-6" />
                        </button>

                        <h3 className="font-bold">Rate your experience!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">How was the "Rooftop Sunset Party"?</p>
                        <RatingStars rating={0} setRating={() => { }} size="lg" />
                        <button className="w-full mt-3 bg-brand-gold text-white font-bold py-2 rounded-lg">Submit Rating</button>
                    </div>
                </div>
            )}
        </div>
    );
};