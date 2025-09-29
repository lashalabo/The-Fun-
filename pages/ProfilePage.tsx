import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import type { Event, Friendship, User } from '../types';
import { FriendshipStatus } from '../types';
import { RatingStars } from '../components/RatingStars';
import { EventCard } from '../components/EventCard';
import { FriendCard } from '../components/FriendCard';
import { Icon } from '../components/Icon';

export const ProfilePage: React.FC = () => {
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    // Revert to the simpler useAuth hook
    const { user, loading } = useAuth();
    const location = useLocation();
    const [showRatingModal, setShowRatingModal] = useState(!!location.state?.showRatingForEventId);

    useEffect(() => {
        // This simplified effect will now work because the rules are correct.
        if (user) {
            // Fetch Events
            const eventsQuery = query(collection(db, 'events'), where("host.id", "==", user.uid));
            const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
                const userEvents = snapshot.docs.map(d => ({ id: d.id, ...d.data(), startTime: (d.data().startTime as Timestamp)?.toDate() } as Event));
                setMyEvents(userEvents);
            });

            // Fetch Friends
            const friendshipsQuery = query(
                collection(db, 'friendships'),
                where('userIds', 'array-contains', user.uid),
                where('status', '==', FriendshipStatus.ACCEPTED)
            );
            const unsubscribeFriends = onSnapshot(friendshipsQuery, async (snapshot) => {
                const friendships = snapshot.docs.map(d => d.data() as Friendship);
                const friendIds = friendships.map(f => f.userIds.find(id => id !== user.uid)).filter(Boolean);

                if (friendIds.length > 0) {
                    const friendPromises = friendIds.map(id => getDoc(doc(db, 'users', id!)));
                    const friendDocs = await Promise.all(friendPromises);
                    setFriends(friendDocs.map(d => ({ id: d.id, ...d.data() } as User)).filter(f => f.id));
                } else {
                    setFriends([]);
                }
            });

            // THIS IS THE FIX: Return a cleanup function.
                       // This function will be called when the component unmounts (e.g., when you navigate away).
                           // It detaches the listeners to prevent memory leaks and background errors.
                           return () => {
                                   unsubscribeEvents(); // Stop listening to events
                                  unsubscribeFriends(); // Stop listening to friendships
                                };
        }
    }, [user]);

    if (loading) {
        return <p className="p-4 text-center text-gray-500">Loading profile...</p>;
    }

    return (
        <div>
            <div className="p-6 flex flex-col items-center text-center">
                <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt={user?.displayName || 'User'} className="w-24 h-24 rounded-full border-4 border-brand-purple dark:border-brand-teal shadow-lg" />
                <h1 className="text-2xl font-bold mt-4">{user?.displayName || 'New User'}</h1>
                <div className="mt-2"><RatingStars rating={4.5} size="md" /></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-sm">Welcome to The FUN!</p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-4 pt-4">
                <h2 className="text-xl font-bold mb-3">My Friends ({friends.length})</h2>
                {friends.length > 0 ? (
                    <div className="space-y-3">
                        {friends.map(friend => <FriendCard key={friend.id} friend={friend} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2 text-center pb-4">You haven't added any friends yet. Go find some!</p>
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-4 pt-4 mt-6">
                <h2 className="text-xl font-bold">My Created Events</h2>
                {myEvents.length > 0 ? (
                    <div>
                        {myEvents.map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">You haven't created any events yet.</p>
                )}
            </div>

            {showRatingModal && (
                <div className="fixed inset-x-0 bottom-24 max-w-md mx-auto p-4">
                    <div className="relative bg-white dark:bg-dark-surface rounded-lg shadow-2xl p-4 border border-brand-gold">
                        <button onClick={() => setShowRatingModal(false)} className="absolute top-2 right-2 p-1" aria-label="Close rating modal">
                            <Icon name="xCircle" className="w-6 h-6" />
                        </button>
                        <h3 className="font-bold">Rate your experience!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">How was the event?</p>
                        <RatingStars rating={0} setRating={() => { }} size="lg" />
                        <button className="w-full mt-3 bg-brand-gold text-white font-bold py-2 rounded-lg">Submit Rating</button>
                    </div>
                </div>
            )}
        </div>
    );
};

