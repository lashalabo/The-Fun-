import React from 'react';
import { Icon } from './Icon';
import type { Notification } from '../types';

interface EventInviteCardProps {
    notification: Notification;
    onAccept: (invitationId: string, eventId: string) => void;
    onDecline: (invitationId: string) => void;
}

export const EventInviteCard: React.FC<EventInviteCardProps> = ({ notification, onAccept, onDecline }) => {
    const invitationId = notification.relatedInvitationId;
    const eventId = notification.relatedEventId;

    // Render nothing if the required IDs are missing to prevent errors
    if (!invitationId || !eventId) {
        return null;
    }

    return (
        <div className="flex items-center justify-between p-4 bg-brand-teal/5 dark:bg-brand-purple/5">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-teal dark:bg-brand-purple rounded-full">
                    <Icon name="calendar" className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-semibold">Event Invitation</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{notification.text}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onAccept(invitationId, eventId)}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    aria-label="Accept invitation"
                >
                    <Icon name="checkCircle" className="w-6 h-6" />
                </button>
                <button
                    onClick={() => onDecline(invitationId)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    aria-label="Decline invitation"
                >
                    <Icon name="xCircle" className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

