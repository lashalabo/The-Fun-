// pages/FindFriendsPage.tsx
import React, { useState } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
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
    const { user: currentUser } = useAuth(); // Correctly get the current user

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || !currentUser) return;

        setIsLoading(true);
        const usersRef = collection(db, 'users');
        // Query for users whose name is greater than or equal to the search term
        // and less than the search term plus a high-value character.
        // This is a common way to do "starts with" queries in Firestore.
        const q = query(
            usersRef,
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff')
        );

        try {
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as User))
                // Filter out the current user from the search results
                .filter(user => user.id !== currentUser.uid);
            setSearchResults(users);
        } catch (error) {
            console.error("Error searching for users:", error);
            alert("Could not perform search. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddFriend = async (requesteeId: string) => {
        if (!currentUser) {
            alert("You must be logged in to add friends.");
            return;
        }

        const requesterId = currentUser.uid;
        // Create a unique, sorted ID to prevent duplicate friendship docs
        const friendshipId = [requesterId, requesteeId].sort().join('_');
        const friendshipRef = doc(db, 'friendships', friendshipId);

        try {
            // We don't need a full Friendship object here, just the data to be set.
            const newFriendshipData = {
                userIds: [requesterId, requesteeId].sort(),
                requesterId: requesterId,
                requesteeId: requesteeId,
                status: FriendshipStatus.PENDING,
                createdAt: new Date(), // Use a client-side timestamp for simplicity
            };

            await setDoc(friendshipRef, newFriendshipData);
            alert('Friend request sent!');
            // Optionally, disable the button for the user you just added
            setSearchResults(prevResults => prevResults.filter(user => user.id !== requesteeId));
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
                    placeholder="Search by name..."
                    className="w-full input-style"
                />
                <button type="submit" className="p-3 bg-brand-purple dark:bg-brand-teal text-white rounded-lg flex-shrink-0" aria-label="Search">
                    <Icon name="user" />
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
                    <p className="text-center text-gray-500">No users found. Try a different name.</p>
                )}
            </div>
        </div>
    );
};
