
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS, CURRENT_USER, MOCK_USERS } from '../constants';
import type { User } from '../types';
import { JoinStatus } from '../types';
import { Icon } from '../components/Icon';
import { RatingStars } from '../components/RatingStars';

const GuestRequest: React.FC<{ user: User, onApprove: (id: string) => void, onReject: (id: string) => void }> = ({ user, onApprove, onReject }) => (
    <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-dark-surface rounded-lg">
        <div className="flex items-center space-x-3">
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold">{user.name}</p>
                <RatingStars rating={user.rating} size="sm" />
            </div>
        </div>
        <div className="flex space-x-2">
            <button onClick={() => onReject(user.id)} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/30">
                <Icon name="xCircle" className="w-5 h-5" />
            </button>
            <button onClick={() => onApprove(user.id)} className="p-2 bg-green-500/20 text-green-500 rounded-full hover:bg-green-500/30">
                <Icon name="checkCircle" className="w-5 h-5" />
            </button>
        </div>
    </div>
);

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = MOCK_EVENTS.find(e => e.id === id);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>(JoinStatus.OPEN);
  const [requests, setRequests] = useState<User[]>([MOCK_USERS[2]]);

  if (!event) {
    return <div className="p-4 text-center">Event not found.</div>;
  }
  
  const isHost = event.host.id === CURRENT_USER.id;

  const handleJoinRequest = () => {
    setJoinStatus(JoinStatus.REQUESTED);
  };

  const handleApprove = (userId: string) => {
    setRequests(prev => prev.filter(u => u.id !== userId));
    // Here you would also add the user to the event attendees list
  };

  const handleReject = (userId: string) => {
    setRequests(prev => prev.filter(u => u.id !== userId));
  };
  
  const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const getActionButton = () => {
    if (isHost) {
      return <button className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg">Manage Event</button>;
    }
    switch (joinStatus) {
      case JoinStatus.OPEN:
        return <button onClick={handleJoinRequest} className="w-full bg-brand-purple dark:bg-brand-teal text-white font-bold py-3 px-4 rounded-lg hover:opacity-90">Request to Join</button>;
      case JoinStatus.REQUESTED:
        return <button disabled className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed">Pending Approval</button>;
      case JoinStatus.APPROVED:
        return <button disabled className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg">You're In!</button>;
      default:
        return null;
    }
  };


  return (
    <div className="pb-4">
      <Link to="/discover" className="absolute top-4 left-4 z-20 p-2 bg-white/50 dark:bg-black/50 rounded-full">
        <Icon name="arrowLeft" className="w-5 h-5" />
      </Link>
      <div className="relative h-48">
        <img src={`https://picsum.photos/seed/${event.id}/500/300`} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-sm font-bold bg-black/50 px-2 py-1 rounded-full">{event.category}</span>
          <h1 className="text-3xl font-black mt-1">{event.title}</h1>
        </div>
      </div>

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
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs border-2 border-white dark:border-dark-bg">
                +{event.attendees.length - 7}
              </div>
            )}
          </div>
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
