import React, { useState, useEffect } from 'react';
// --- FIX 1: Import 'getDocs' and the necessary types ---
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, arrayUnion, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { FriendRequestCard } from '../components/FriendRequestCard';
import { EventInviteCard } from '../components/EventInviteCard';
import { FriendshipStatus } from '../types';
import type { Friendship, Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const [eventInvites, setEventInvites] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const requestsQuery = query(
        collection(db, 'friendships'),
        where('userIds', 'array-contains', user.uid),
        where('status', '==', FriendshipStatus.PENDING)
      );
      const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
        const requests = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Friendship))
          .filter(req => req.requesterId !== user.uid);
        setFriendRequests(requests);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const invitesQuery = query(
        collection(db, 'notifications'),
        where('recipientId', '==', user.uid),
        where('type', '==', 'invite')
      );
      const unsubscribe = onSnapshot(invitesQuery, (snapshot) => {
        const invites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setEventInvites(invites);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAcceptFriendRequest = async (friendshipId: string) => {
    const requestDocRef = doc(db, 'friendships', friendshipId);
    await updateDoc(requestDocRef, { status: FriendshipStatus.ACCEPTED });
  };

  const handleDeclineFriendRequest = async (friendshipId: string) => {
    const requestDocRef = doc(db, 'friendships', friendshipId);
    await deleteDoc(requestDocRef);
  };

  const handleAcceptInvite = async (invitationId: string, eventId: string) => {
    if (!user) return;
    const invitationRef = doc(db, 'invitations', invitationId);
    const eventRef = doc(db, 'events', eventId);
    const notificationQuery = query(collection(db, 'notifications'), where('relatedInvitationId', '==', invitationId));

    try {
      await updateDoc(invitationRef, { status: 'accepted' });
      const attendeeData = { id: user.uid, name: user.displayName || 'Anonymous', avatarUrl: user.photoURL || '' };
      await updateDoc(eventRef, {
        attendees: arrayUnion(attendeeData),
        attendeeIds: arrayUnion(user.uid)
      });

      const notificationSnapshot = await getDocs(notificationQuery);
      // --- FIX 2: Explicitly type the 'doc' parameter ---
      notificationSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => deleteDoc(doc.ref));

    } catch (error) {
      console.error("Error accepting invite: ", error);
    }
  };

  const handleDeclineInvite = async (invitationId: string) => {
    const invitationRef = doc(db, 'invitations', invitationId);
    const notificationQuery = query(collection(db, 'notifications'), where('relatedInvitationId', '==', invitationId));

    try {
      await updateDoc(invitationRef, { status: 'declined' });
      const notificationSnapshot = await getDocs(notificationQuery);
      // --- FIX 3: Explicitly type the 'doc' parameter ---
      notificationSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => deleteDoc(doc.ref));
    } catch (error) {
      console.error("Error declining invite: ", error);
    }
  };


  if (loading) {
    return <p className="p-4 text-center text-gray-500">Loading notifications...</p>;
  }

  const noNotifications = friendRequests.length === 0 && eventInvites.length === 0;

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <h1 className="text-2xl font-bold p-4">Notifications</h1>

      {friendRequests.length > 0 && (
        <div className="py-2">
          <h2 className="font-bold px-4 pb-2">Friend Requests</h2>
          {friendRequests.map(request => (
            <FriendRequestCard
              key={request.id}
              requesterId={request.requesterId}
              onAccept={() => handleAcceptFriendRequest(request.id)}
              onDecline={() => handleDeclineFriendRequest(request.id)}
            />
          ))}
        </div>
      )}

      {eventInvites.length > 0 && (
        <div className="py-2">
          <h2 className="font-bold px-4 pb-2">Event Invitations</h2>
          {eventInvites.map(invite => (
            <EventInviteCard
              key={invite.id}
              notification={invite}
              onAccept={handleAcceptInvite}
              onDecline={handleDeclineInvite}
            />
          ))}
        </div>
      )}

      {noNotifications && (
        <p className="p-4 text-center text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};

