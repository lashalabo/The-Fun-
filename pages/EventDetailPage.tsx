// pages/EventDetailPage.tsx (Complete and Corrected)
import React, { useState, useEffect } from 'react';
import { EventChat } from '../components/EventChat';
import { useParams, Link, useLocation } from 'react-router-dom';
import { doc, Timestamp, updateDoc, arrayUnion, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Event } from '../types';
import { JoinStatus } from '../types';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const location = useLocation();

  const [event, setEvent] = useState<Event | null>(location.state?.event || null);
  const [loading, setLoading] = useState(!event);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>(JoinStatus.OPEN);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (event || !id) {
      if (user && event?.attendeeIds?.includes(user.uid)) {
        setJoinStatus(JoinStatus.ATTENDING);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const eventDocRef = doc(db, 'events', id);
    const unsubscribe = onSnapshot(eventDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const eventData = {
          id: docSnap.id, ...data,
          startTime: (data.startTime as Timestamp)?.toDate(),
          endTime: (data.endTime as Timestamp)?.toDate(),
        } as Event;
        setEvent(eventData);

        if (user && eventData.attendeeIds?.includes(user.uid)) {
          setJoinStatus(JoinStatus.ATTENDING);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, event, user]);

  const handleJoinRequest = async () => {
    if (!user || !event) return;
    setJoinStatus(JoinStatus.REQUESTED);
    const eventDocRef = doc(db, 'events', event.id);
    const attendeeData = { id: user.uid, name: user.displayName || 'Anonymous', avatarUrl: user.photoURL || '' };
    try {
      await updateDoc(eventDocRef, {
        attendees: arrayUnion(attendeeData),
        attendeeIds: arrayUnion(user.uid)
      });
      if (user.uid !== event.host.id) {
        await addDoc(collection(db, "notifications"), {
          recipientId: event.host.id,
          senderName: user.displayName || 'A user',
          type: 'request',
          text: `${user.displayName || 'A user'} has joined your event: "${event.title}"`,
          relatedEventId: event.id,
          timestamp: serverTimestamp(),
          read: false
        });
      }
      alert("You've joined the event!");
      setJoinStatus(JoinStatus.ATTENDING);
    } catch (error) {
      console.error("Error joining event: ", error);
      setJoinStatus(JoinStatus.OPEN);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading event...</div>;
  if (!event) return <div className="p-4 text-center">Event not found.</div>;

  const isHost = user && event.host.id === user.uid;
  const isScrapedEvent = event.host.id === 'scraper-tktge';
  const dateTimeFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });

  const getActionButton = () => {
    if (isScrapedEvent) {
      return <a href="https://tkt.ge/en/events" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-brand-purple dark:bg-brand-teal text-white font-bold py-3 px-4 rounded-lg hover:opacity-90">Buy Tickets</a>;
    }
    if (isHost) {
      return (
        <button className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
          <Icon name="live" className="w-6 h-6" /><span>Go Live on Instagram</span>
        </button>
      );
    }
    switch (joinStatus) {
      case JoinStatus.OPEN: return <button onClick={handleJoinRequest} className="w-full bg-brand-purple dark:bg-brand-teal text-white font-bold py-3 px-4 rounded-lg hover:opacity-90">Request to Join</button>;
      case JoinStatus.ATTENDING: return <button disabled className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg">You're Attending!</button>;
      default: return null;
    }
  };

  return (
    <div className="pb-20">
      <Link to="/discover" className="absolute top-4 left-4 z-20 p-2 bg-white/50 dark:bg-black/50 rounded-full"><Icon name="arrowLeft" className="w-5 h-5" /></Link>
      <div className="relative h-48">
        <img src={event.picture || `https://picsum.photos/seed/${event.id}/500/300`} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-sm font-bold bg-black/50 px-2 py-1 rounded-full">{event.category}</span>
          <h1 className="text-3xl font-black mt-1">{event.title}</h1>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {!isScrapedEvent && (
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-dark-surface rounded-lg">
            <div className="flex items-center space-x-3">
              <img src={event.host.avatarUrl} alt={event.host.name} className="w-12 h-12 rounded-full object-cover" />
              <div><p className="text-xs">Hosted by</p><p className="font-bold">{event.host.name}</p></div>
            </div>
          </div>
        )}
        <div className="space-y-4 text-sm">
          <div className="flex items-start space-x-3"><Icon name="calendar" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" /><div><p className="font-semibold">Date & Time</p><p>{event.startTime ? dateTimeFormatter.format(event.startTime) : 'Time not set'}</p></div></div>
          {/* --- NEW: Display Public/Private Status --- */}
          <div className="flex items-start space-x-3">
            <Icon name={event.isPrivate ? 'lock' : 'globe'} className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" />
            <div>
              <p className="font-semibold">Event Type</p>
              <p>{event.isPrivate ? 'Private Event' : 'Public Event'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="location" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" />
            <div>
              <p className="font-semibold">Location</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${event.location.lat},${event.location.lng}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-800 dark:text-gray-200">
                {event.location.address}
              </a>
            </div>
          </div>
        </div>
        <div><h3 className="font-bold mb-2">About this event</h3><p>{event.description}</p></div>

        {!isScrapedEvent && (
          <>
            <button
              onClick={() => setShowChat(true)}
              className="w-full font-bold py-3 px-4 rounded-lg bg-gray-200 dark:bg-dark-surface hover:opacity-80"
            >
              Open Event Chat
            </button>
            <div>
              <h3 className="font-bold mb-2">Guests ({event.attendees?.length || 0}/{event.capacity || 'N/A'})</h3>
              <div className="flex -space-x-2">
                {event.attendees?.slice(0, 7).map(att => (
                  <img key={att.id} src={att.avatarUrl} alt={att.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-bg object-cover" />
                ))}
                {event.attendees && event.attendees.length > 7 && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs border-2 border-white dark:border-dark-bg">
                    +{event.attendees.length - 7}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="pt-4">{getActionButton()}</div>
      </div>
      {showChat && event && !isScrapedEvent && (
        <EventChat eventId={event.id} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};