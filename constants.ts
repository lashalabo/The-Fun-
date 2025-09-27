
import type { User, Event, Notification } from './types';
import { EventCategory, GenderRatio } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex', avatarUrl: 'https://picsum.photos/seed/alex/100', rating: 4.8, tags: ['Chill', 'Music Lover', 'Good Vibes'], bio: 'Just here to find some fun events and meet cool people.' },
  { id: 'u2', name: 'Brenda', avatarUrl: 'https://picsum.photos/seed/brenda/100', rating: 4.9, tags: ['Party Starter', 'Great Host', 'Adventurous'], bio: 'I host the best house parties. Come through!' },
  { id: 'u3', name: 'Chris', avatarUrl: 'https://picsum.photos/seed/chris/100', rating: 4.5, tags: ['Gamer', 'Techie', 'Introvert'], bio: 'Looking for board game nights or LAN parties.' },
  { id: 'u4', name: 'Dana', avatarUrl: 'https://picsum.photos/seed/dana/100', rating: 4.7, tags: ['Foodie', 'Explorer', 'Photographer'], bio: 'Let\'s find the best picnic spots!' },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Rooftop Sunset Party',
    host: MOCK_USERS[1],
    category: EventCategory.PARTY,
    description: 'Chill vibes, good music, and a great view of the city sunset. BYOB. We need more drinks!',
    time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    location: { lat: 34.0522, lng: -118.2437, address: '123 Main St, Los Angeles' },
    isPrivate: false,
    capacity: 20,
    attendees: [MOCK_USERS[0], MOCK_USERS[3]],
    genderRatio: GenderRatio.EQUAL,
    contributions: ['Drinks', 'Snacks'],
    popularity: 85,
  },
  {
    id: 'e2',
    title: 'Central Park Picnic',
    host: MOCK_USERS[3],
    category: EventCategory.PICNIC,
    description: 'Let\'s enjoy the good weather with some food and frisbee. Bring a blanket and your favorite dish to share.',
    time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    location: { lat: 40.7850, lng: -73.9682, address: 'Central Park, NYC' },
    isPrivate: false,
    capacity: 15,
    attendees: [],
    genderRatio: GenderRatio.ANY,
    contributions: ['Food', 'Games'],
    popularity: 60,
  },
  {
    id: 'e3',
    title: 'Smash Bros Tournament',
    host: MOCK_USERS[2],
    category: EventCategory.GAMING,
    description: 'Private tournament at my place. Only serious players! Prize for the winner. Looking for 4 guys and 4 girls.',
    time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    location: { lat: 37.7749, lng: -122.4194, address: '555 Tech Way, San Francisco' },
    isPrivate: true,
    capacity: 8,
    attendees: [],
    genderRatio: GenderRatio.EQUAL,
    contributions: ['Controllers'],
    popularity: 95,
  },
];


export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        type: 'request',
        text: 'Alex requested to join your "Rooftop Sunset Party".',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
        read: false,
        relatedEventId: 'e1',
        relatedUserId: 'u1'
    },
    {
        id: 'n2',
        type: 'approval',
        text: 'Dana approved your request for "Central Park Picnic"!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        read: false,
        relatedEventId: 'e2',
    },
    {
        id: 'n3',
        type: 'rating',
        text: 'How was the "Rooftop Sunset Party"? Rate your host and fellow guests.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        relatedEventId: 'e1',
    }
];

export const CURRENT_USER = MOCK_USERS[0]; // Let's assume Alex is the current user
