import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { User } from '../types';
import { Icon } from './Icon';

interface FriendRequestCardProps {
    requesterId: string;
    onAccept: () => void;
    onDecline: () => void;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ requesterId, onAccept, onDecline }) => {
    const [requester, setRequester] = useState<User | null>(null);

    useEffect(() => {
        // Fetch the profile data of the user who sent the request
        const userDocRef = doc(db, 'users', requesterId);
        getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
                setRequester({ id: docSnap.id, ...docSnap.data() } as User);
            }
        });
    }, [requesterId]);

    if (!requester) {
        return <div className="p-4 text-sm text-gray-500">Loading request...</div>;
    }

    return (
        <div className="flex items-center justify-between p-4 bg-brand-purple/5 dark:bg-brand-teal/5">
            <div className="flex items-center space-x-3">
                <img src={requester.avatarUrl || `https://i.pravatar.cc/150?u=${requester.id}`} alt={requester.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p className="font-semibold">{requester.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sent you a friend request.</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button onClick={onAccept} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600" aria-label="Accept request">
                    <Icon name="checkCircle" className="w-6 h-6" />
                </button>
                <button onClick={onDecline} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600" aria-label="Decline request">
                    <Icon name="xCircle" className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
