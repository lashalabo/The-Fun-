<<<<<<< HEAD
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
}
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
}
export interface Activity {
  name: string;
  icon: string;
}
=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50

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
<<<<<<< HEAD
  startTime: Date;
  endTime: Date;
=======
  time: Date;
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
  location: { lat: number; lng: number; address: string };
  isPrivate: boolean;
  capacity: number;
  attendees: User[];
<<<<<<< HEAD
  attendeeIds: string[];
  activities?: Activity[];
  musicInfo?: string;
=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
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
