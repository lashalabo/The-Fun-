import React from 'react';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { Icon } from '../components/Icon';

export const LoginPage: React.FC = () => {

    const handleSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('User signed in:', result.user.displayName);
            // After successful login, you'll want to redirect the user
            // For now, we'll just show an alert.
            alert(`Welcome, ${result.user.displayName}!`);
            window.location.hash = '/profile'; // Redirect to profile page
        } catch (error) {
            console.error('Error during sign-in:', error);
            alert('Failed to sign in. Check the console for details.');
        }
    };

    return (
        <div className="p-8 flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-black mb-2">Welcome to</h1>
            <h2 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-teal mb-12">
                The FUN
            </h2>

            <div className="w-full max-w-xs space-y-4">
                <button
                    onClick={() => handleSignIn(new GoogleAuthProvider())}
                    className="w-full bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-600 text-light-text dark:text-dark-text font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-6 h-6" />
                    <span>Sign in with Google</span>
                </button>
                <button
                    onClick={() => handleSignIn(new FacebookAuthProvider())}
                    className="w-full bg-[#1877F2] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity"
                >
                    <Icon name="user" className="w-6 h-6" /> {/* Placeholder icon */}
                    <span>Sign in with Facebook</span>
                </button>
            </div>
        </div>
    );
};