
export enum EventCategory {
  PARTY = 'Party',
  PICNIC = 'Picnic',
  SPORTS = 'Sports',
  CLUB = 'Club',
  GAMING = 'Gaming',
  STUDY = 'Study',
}

export enum GenderRatio {
  ANY = 'Any',
  EQUAL = '50/50',
  FEMALE_ONLY = 'Female Only',
  MALE_ONLY = 'Male Only',
}

export enum JoinStatus {
  OPEN = 'Open',
  REQUESTED = 'Requested',
  APPROVED = 'Approved',
  ATTENDING = 'Attending',
  HOSTING = 'Hosting',
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  tags: string[];
  bio: string;
}

export interface Event {
  id: string;
  title: string;
  host: User;
  category: EventCategory;
  description: string;
  time: Date;
  location: { lat: number; lng: number; address: string };
  isPrivate: boolean;
  capacity: number;
  attendees: User[];
  genderRatio: GenderRatio;
  contributions: string[];
  popularity: number;
}

export interface Notification {
  id: string;
  type: 'invite' | 'request' | 'approval' | 'rating' | 'message';
  text: string;
  timestamp: Date;
  read: boolean;
  relatedEventId?: string;
  relatedUserId?: string;
}
