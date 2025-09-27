import { useLocation } from 'react-router-dom';
import React from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { Icon } from '../components/Icon';
import type { Notification } from '../types';
import { Link } from 'react-router-dom';

<<<<<<< HEAD

=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
const NOTIFICATION_ICONS = {
  invite: { icon: 'user', color: 'text-blue-500' },
  request: { icon: 'user', color: 'text-yellow-500' },
  approval: { icon: 'checkCircle', color: 'text-green-500' },
  rating: { icon: 'sparkles', color: 'text-brand-gold' },
  message: { icon: 'user', color: 'text-gray-500' },
};

export const NotificationsPage: React.FC = () => {
<<<<<<< HEAD
  const location = useLocation();
  const showRatingForEventId = location.state?.showRatingForEventId;
=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
    
  const renderNotification = (notification: Notification) => {
    const { icon, color } = NOTIFICATION_ICONS[notification.type];
    const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((notification.timestamp.getTime() - Date.now()) / (1000 * 60)), 'minutes'
    );

    const content = (
      <div className={`flex items-start space-x-4 p-4 ${!notification.read ? 'bg-brand-purple/5 dark:bg-brand-teal/5' : ''}`}>
        <div className={`mt-1 ${color}`}>
          <Icon name={icon as any} className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200">{notification.text}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeAgo}</p>
        </div>
        {!notification.read && <div className="w-2.5 h-2.5 bg-brand-purple dark:bg-brand-teal rounded-full self-center"></div>}
      </div>
    );
<<<<<<< HEAD
    if (notification.type === 'rating') {
      return (
        <Link to={`/profile`} state={{ showRatingForEventId: notification.relatedEventId }} key={notification.id}>
          {content}
        </Link>
      );
    }
=======

>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
    if (notification.relatedEventId) {
      return (
        <Link to={`/event/${notification.relatedEventId}`} key={notification.id} className="block hover:bg-gray-50 dark:hover:bg-dark-surface">
          {content}
        </Link>
      );
    }

    return <div key={notification.id}>{content}</div>;
  };
    
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <h1 className="text-2xl font-bold p-4">Notifications</h1>
      {MOCK_NOTIFICATIONS.length > 0 ? (
        MOCK_NOTIFICATIONS.map(renderNotification)
      ) : (
        <p className="p-4 text-center text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};
