// components/UserCard.tsx
import React from 'react';
import type { User } from '../types';
import { Icon } from './Icon';

interface UserCardProps {
    user: User;
    onAddFriend: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onAddFriend }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-surface rounded-lg">
            <div className="flex items-center space-x-3">
                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.bio}</p>
                </div>
            </div>
            <button
                onClick={() => onAddFriend(user.id)}
                className="p-2 rounded-full bg-brand-purple/10 text-brand-purple dark:bg-brand-teal/10 dark:text-brand-teal hover:bg-brand-purple/20 dark:hover:bg-brand-teal/20"
                aria-label={`Send friend request to ${user.name}`}
            >
                <Icon name="user" className="w-6 h-6" />
            </button>
        </div>
    );
};