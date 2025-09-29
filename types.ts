// types.ts (Updated with New Categories)
export interface ChatMessage { id: string; text: string; senderId: string; senderName: string; senderAvatar: string; timestamp: Date; }
export interface Activity { name: string; icon: string; }
export interface User { id: string; name: string; avatarUrl: string; rating: number; tags: string[]; bio: string; }

export enum EventCategory {
  PARTY = 'Party', PICNIC = 'Picnic', SPORTS = 'Sports', CLUB = 'Club', GAMING = 'Gaming', STUDY = 'Study',
  // New Categories from TKT.GE
  MUSIC = 'Music', CONCERT = 'Concert', CINEMA = 'Cinema', RAILWAY = 'Railway', TRANSPORT = 'Transport', THEATRE = 'Theatre',
  OPERA = 'Opera', SPORT = 'Sport', SEA = 'Sea', FESTIVAL = 'Festival', KIDS = 'Kids', CONFERENCE = 'Conference',
  TOURISM = 'Tourism', HOBBY = 'Hobby', MASTERCLASS = 'Masterclass', MUSEUM = 'Museum',
  INTERNATIONAL = 'International', FLY = 'Fly', GENERAL = 'General'
}

export enum GenderRatio { ANY = 'Any', EQUAL = '50/50', FEMALE_ONLY = 'Female Only', MALE_ONLY = 'Male Only' }
export enum JoinStatus { OPEN = 'Open', REQUESTED = 'Requested', APPROVED = 'Approved', ATTENDING = 'Attending', HOSTING = 'Hosting' }

export interface Event {
  id: string;
  title: string;
  host: User;
  category: EventCategory;
  description: string;
  picture: string;
  startTime: Date;
  endTime: Date;
  location: { lat: number; lng: number; address: string };
  isPrivate: boolean;
  capacity: number;
  attendees: User[];
  attendeeIds: string[];
  activities?: Activity[];
  musicInfo?: string;
  genderRatio: GenderRatio;
  contributions: string[];
  popularity?: number;
}

export interface Notification { id: string; type: 'invite' | 'request' | 'approval' | 'rating' | 'message'; text: string; timestamp: Date; read: boolean; relatedEventId?: string; relatedUserId?: string; }

// --- NEW: Types for the Friends System ---

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export interface Friendship {
  id: string; // Combined UIDs: e.g., 'uid1_uid2'
  userIds: [string, string];
  requesterId: string;
  status: FriendshipStatus;
}