import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';
import type { User, Friendship } from '../types';
import { FriendshipStatus, InvitationStatus } from '../types';
import { Icon } from './Icon';

interface InviteFriendsModalProps {
    eventId: string;
    hostId: string;
    onClose: () => void;
}

export const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({ eventId, hostId, onClose }) => {
    const [friends, setFriends] = useState<User[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    // Fetch the user's friends
    useEffect(() => {
        const fetchFriends = async () => {
            setIsLoading(true);
            const friendshipsQuery = query(
                collection(db, 'friendships'),
                where('userIds', 'array-contains', hostId),
                where('status', '==', FriendshipStatus.ACCEPTED)
            );
            const querySnapshot = await getDocs(friendshipsQuery);
            const friendships = querySnapshot.docs.map(d => d.data() as Friendship);
            const friendIds = friendships.map(f => f.userIds.find(id => id !== hostId)).filter((id): id is string => !!id);

            if (friendIds.length > 0) {
                const usersQuery = query(collection(db, 'users'), where('__name__', 'in', friendIds));
                const usersSnapshot = await getDocs(usersQuery);
                setFriends(usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as User)));
            }
            setIsLoading(false);
        };
        fetchFriends();
    }, [hostId]);

    const handleSelectFriend = (friendId: string) => {
        setSelectedFriends(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(friendId)) {
                newSelection.delete(friendId);
            } else {
                newSelection.add(friendId);
            }
            return newSelection;
        });
    };

    const handleSendInvites = async () => {
        if (selectedFriends.size === 0) return;
        setIsSending(true);

        const batch = writeBatch(db);
        selectedFriends.forEach(inviteeId => {
            const invitationRef = doc(collection(db, 'invitations'));
            batch.set(invitationRef, {
                eventId,
                hostId,
                inviteeId,
                status: InvitationStatus.PENDING,
            });
        });

        try {
            await batch.commit();
            alert(`Successfully sent ${selectedFriends.size} invitation(s)!`);
        } catch (error) {
            console.error("Error sending invitations:", error);
            alert("Failed to send invitations. Please try again.");
        } finally {
            setIsSending(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Invite Friends</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg">
                        <Icon name="xCircle" className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 flex-grow overflow-y-auto">
                    {isLoading ? (
                        <p>Loading friends...</p>
                    ) : friends.length === 0 ? (
                        <p className="text-gray-500">You don't have any friends to invite yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {friends.map(friend => {
                                const isSelected = selectedFriends.has(friend.id);
                                return (
                                    <div
                                        key={friend.id}
                                        onClick={() => handleSelectFriend(friend.id)}
                                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-brand-purple/20 dark:bg-brand-teal/20' : 'hover:bg-gray-100 dark:hover:bg-dark-bg'
                                            }`}
                                    >
                                        <img src={friend.avatarUrl} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                                        <span className="font-semibold">{friend.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t dark:border-gray-700 space-y-2">
                    <button
                        onClick={handleSendInvites}
                        disabled={isSending || selectedFriends.size === 0}
                        className="w-full bg-brand-purple dark:bg-brand-teal text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:bg-gray-400"
                    >
                        {isSending ? 'Sending...' : `Send Invites (${selectedFriends.size})`}
                    </button>
                    <button onClick={onClose} className="w-full text-center py-2 text-gray-600 dark:text-gray-300">
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};
