import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAuthReady: false });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // --- THIS IS THE FIX ---
                // Every time a user logs in, check if they have a profile in Firestore.
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);

                // If the user document does NOT exist, create it.
                if (!docSnap.exists()) {
                    const newUser = {
                        id: user.uid,
                        name: user.displayName || 'Anonymous User',
                        avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
                        bio: 'Welcome to The FUN!',
                        rating: 0,
                        tags: [],
                        createdAt: serverTimestamp(),
                    };
                    await setDoc(userDocRef, newUser);
                }
            }

            setUser(user);
            setLoading(false);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    const value = { user, loading, isAuthReady };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
