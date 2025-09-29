import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { FriendRequestCard } from '../components/FriendRequestCard';
import { FriendshipStatus } from '../types';
import type { Friendship } from '../types';

export const NotificationsPage: React.FC = () => {
  // Revert to the simpler useAuth hook
  const { user, loading } = useAuth();
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);

  useEffect(() => {
    // This simplified effect will now work because the rules are correct.
    if (user) {
      const requestsQuery = query(
        collection(db, 'friendships'),
        where('userIds', 'array-contains', user.uid),
        where('status', '==', FriendshipStatus.PENDING)
      );

      const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Friendship));
        setFriendRequests(requests);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAccept = async (friendshipId: string) => {
    const requestDocRef = doc(db, 'friendships', friendshipId);
    await updateDoc(requestDocRef, { status: FriendshipStatus.ACCEPTED });
  };

  const handleDecline = async (friendshipId: string) => {
    const requestDocRef = doc(db, 'friendships', friendshipId);
    await deleteDoc(requestDocRef);
  };

  if (loading) {
    return <p className="p-4 text-center text-gray-500">Loading notifications...</p>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <h1 className="text-2xl font-bold p-4">Notifications</h1>
      {friendRequests.length > 0 ? (
        <div className="py-2">
          <h2 className="font-bold px-4 pb-2">Friend Requests</h2>
          {friendRequests.map(request => (
            <FriendRequestCard
              key={request.id}
              requesterId={request.requesterId}
              onAccept={() => handleAccept(request.id)}
              onDecline={() => handleDecline(request.id)}
            />
          ))}
        </div>
      ) : (
        <p className="p-4 text-center text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};

