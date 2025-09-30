import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Icon } from './Icon';

export const ProfileActions: React.FC = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // The auth state listener in App.tsx will handle the redirect to the login page.
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out: ', error);
            alert('Failed to sign out. Please try again.');
        }
    };

    const goToSettings = () => {
        navigate('/settings'); // We will create this page in a later step
    };

    return (
        <div className="p-4 flex justify-end space-x-2">
            <button
                onClick={goToSettings}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface"
                aria-label="Settings"
            >
                <Icon name="cog" className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface"
                aria-label="Log out"
            >
                <Icon name="logout" className="w-6 h-6 text-red-500" />
            </button>
        </div>
    );
};
