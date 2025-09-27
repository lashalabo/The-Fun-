import React, { useState, useEffect } from 'react';
import { EventChat } from '../components/EventChat';
import { useParams, Link } from 'react-router-dom';
import { doc, Timestamp, updateDoc, arrayUnion, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Event } from '../types';
import { JoinStatus } from '../types';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // Get the confirmed user from our context
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>(JoinStatus.OPEN);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!id) return;
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
        } else {
          setJoinStatus(JoinStatus.OPEN);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, user]); // Depend on the user from context

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

  const isHost = event.host.id === user?.uid;
  const eventHasEnded = event.endTime && event.endTime.getTime() < Date.now();
  const dateTimeFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });
  

  const getActionButton = () => {
    const handleGoLive = () => {
      const instagramLiveUrl = "instagram://camera?effect_id=0&camera_position=0&capture_mode=live";
      window.open(instagramLiveUrl, '_blank');
    };
    if (isHost) {
      return (
        <button onClick={handleGoLive} className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
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
        <img src={`https://picsum.photos/seed/${event.id}/500/300`} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-sm font-bold bg-black/50 px-2 py-1 rounded-full">{event.category}</span>
          <h1 className="text-3xl font-black mt-1">{event.title}</h1>
        </div>
      </div>
<<<<<<< HEAD
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-dark-surface rounded-lg">
          <div className="flex items-center space-x-3">
            <img src={event.host.avatarUrl} alt={event.host.name} className="w-12 h-12 rounded-full object-cover" />
            <div><p className="text-xs">Hosted by</p><p className="font-bold">{event.host.name}</p></div>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex items-start space-x-3"><Icon name="calendar" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" /><div><p className="font-semibold">Date & Time</p><p>{event.startTime ? dateTimeFormatter.format(event.startTime) : 'Time not set'}</p></div></div>
          <div className="flex items-start space-x-3"><Icon name="location" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" /><div><p className="font-semibold">Location</p><p>{event.location.address}</p></div></div>
          {/* --- ADD THIS BLOCK --- */}
          {event.contributions && event.contributions.length > 0 && event.contributions[0] !== '' && (
            <div className="flex items-start space-x-3">
              <Icon name="plusCircle" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" />
              <div>
                <p className="font-semibold">What to Bring</p>
                <p>{event.contributions.join(', ')}</p>
              </div>
            </div>
          )}
          {event.addressDetails && (
            <div className="flex items-start space-x-3">
              <Icon name="bell" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" />
              <div>
                <p className="font-semibold">Additional Info</p>
                <p>{event.addressDetails}</p>
              </div>
            </div>
          )}
          {/* --- END OF BLOCK --- */}
        </div>
        <div><h3 className="font-bold mb-2">About this event</h3><p>{event.description}</p></div>
        {(event.activities && event.activities.length > 0 || event.musicInfo) && (
          <div>
            <h3 className="font-bold mb-2">Activities & Music</h3>
            {event.activities && event.activities.length > 0 && (<div className="flex flex-wrap gap-4 mb-2">{event.activities.map(activity => (<div key={activity.name} className="flex items-center space-x-2"><Icon name={activity.icon as any} className="w-6 h-6 text-brand-purple dark:text-brand-teal" /><span className="font-semibold">{activity.name}</span></div>))}</div>)}
            {event.musicInfo && (<p className="text-sm">{event.musicInfo}</p>)}
          </div>
        )}
        <button
          onClick={() => setShowChat(true)}
          className="w-full font-bold py-3 px-4 rounded-lg bg-gray-200 dark:bg-dark-surface hover:opacity-80"
        >
          Open Event Chat
        </button>
        <div>
          <h3 className="font-bold mb-2">Guests ({event.attendees?.length || 0}/{event.capacity || 'N/A'})</h3>
          {/* Guest profile pictures */}
          <div className="flex -space-x-2">
            {event.attendees?.slice(0, 7).map(att => (
              <img key={att.id} src={att.avatarUrl} alt={att.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-bg object-cover" />
            ))}
            {event.attendees && event.attendees.length > 7 && (
=======

      <div className="p-4 space-y-6">
        {/* Host Info */}
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-dark-surface rounded-lg">
          <div className="flex items-center space-x-3">
            <img src={event.host.avatarUrl} alt={event.host.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hosted by</p>
              <p className="font-bold">{event.host.name}</p>
            </div>
          </div>
          <RatingStars rating={event.host.rating} />
        </div>

        {/* Event Details */}
        <div className="space-y-4 text-sm">
          <div className="flex items-start space-x-3">
            <Icon name="calendar" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" />
            <div>
              <p className="font-semibold">Date & Time</p>
              <p className="text-gray-600 dark:text-gray-300">{dateTimeFormatter.format(event.time)}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="location" className="w-5 h-5 mt-1 text-brand-purple dark:text-brand-teal-light flex-shrink-0" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-gray-600 dark:text-gray-300">{event.location.address}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">About this event</h3>
          <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
        </div>

        {/* Guest List */}
        <div>
          <h3 className="font-bold mb-2">Guests ({event.attendees.length}/{event.capacity})</h3>
          <div className="flex -space-x-2">
            {event.attendees.slice(0, 7).map(user => (
              <img key={user.id} src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-bg" />
            ))}
            {event.attendees.length > 7 && (
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs border-2 border-white dark:border-dark-bg">
                +{event.attendees.length - 7}
              </div>
            )}
          </div>
<<<<<<< HEAD
          {/* Guest names list */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="mt-2 text-sm">
              <p>
                <span className="font-semibold">{event.attendees[0].name}</span>
                {event.attendees.length > 1 && ` and ${event.attendees.length - 1} others are going.`}
                {event.attendees.length === 1 && ' is going.'}
              </p>
            </div>
          )}
        </div>
        <div className="pt-4">{getActionButton()}</div>
        
      </div>
      {/* --- Render Chat Panel --- */}
      {showChat && event && (
        <EventChat eventId={event.id} onClose={() => setShowChat(false)} />
      )}
    </div>
    
  );
};
=======
        </div>

        {/* Host View: Guest Requests */}
        {isHost && requests.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Guest Requests ({requests.length})</h3>
            <div className="space-y-2">
                {requests.map(user => <GuestRequest key={user.id} user={user} onApprove={handleApprove} onReject={handleReject} />)}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">{getActionButton()}</div>
      </div>
    </div>
  );
};
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
