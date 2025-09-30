import React, { useState } from 'react';
// --- THIS IS THE FIX: Add 'setDoc' to the import list ---
import { collection, query, where, getDocs, doc, getDoc, setDoc, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';
import { UserCard } from '../components/UserCard';
import type { User, Friendship } from '../types';
import { FriendshipStatus } from '../types';

export const FindFriendsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user: currentUser } = useAuth();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || !currentUser) return;

        setIsLoading(true);
        setSearchResults([]);
        const usersRef = collection(db, 'users');

        try {
            // 1. Attempt to find a user by their exact ID first.
            const userDocRef = doc(db, 'users', searchTerm.trim());
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.id !== currentUser.uid) {
                // If a user is found by ID, display just that user.
                const foundUser = { id: userDoc.id, ...userDoc.data() } as User;
                setSearchResults([foundUser]);
            } else {
                // 2. If no user is found by ID, fall back to searching by name.
                const nameQuery = query(
                    usersRef,
                    where('name', '>=', searchTerm),
                    where('name', '<=', searchTerm + '\uf8ff')
                );

                const querySnapshot = await getDocs(nameQuery);
                const users = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as User))
                    .filter(user => user.id !== currentUser.uid); // Exclude self from results
                setSearchResults(users);
            }
        } catch (error) {
            console.error("Error searching for users:", error);
            alert("Could not perform search. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddFriend = async (requesteeId: string) => {
        if (!currentUser) return;

        const requesterId = currentUser.uid;
        const friendshipId = [requesterId, requesteeId].sort().join('_');
        const friendshipRef = doc(db, 'friendships', friendshipId);

        try {
            const newFriendshipData = {
                userIds: [requesterId, requesteeId].sort(),
                requesterId: requesterId,
                requesteeId: requesteeId,
                status: FriendshipStatus.PENDING,
                createdAt: new Date(),
            };
            await setDoc(friendshipRef, newFriendshipData);
            alert('Friend request sent!');
            setSearchResults(prev => prev.filter(user => user.id !== requesteeId));
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Find Friends</h1>
            <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or paste user ID..."
                    className="w-full input-style"
                />
                <button type="submit" className="p-3 bg-brand-purple dark:bg-brand-teal text-white rounded-lg flex-shrink-0" aria-label="Search">
                    <Icon name="userPlus" />
                </button>
            </form>

            <div className="space-y-3">
                {isLoading ? (
                    <p className="text-center text-gray-500">Searching...</p>
                ) : searchResults.length > 0 ? (
                    searchResults.map(user => (
                        <UserCard key={user.id} user={user} onAddFriend={handleAddFriend} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No users found. Try a different name or ID.</p>
                )}
            </div>
        </div>
    );
};

