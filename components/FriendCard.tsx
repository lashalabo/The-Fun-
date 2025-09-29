import React from 'react';
import type { User } from '../types';
import { Icon } from './Icon';

interface FriendCardProps {
    friend: User;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
    return (
        <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-dark-surface rounded-lg">
            <img src={friend.avatarUrl || `https://i.pravatar.cc/150?u=${friend.id}`} alt={friend.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
                <p className="font-bold text-lg">{friend.name}</p>
                {/* Future actions like 'Message' or 'View Profile' can go here */}
            </div>
        </div>
    );
};
