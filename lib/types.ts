export interface Profile {
  id: string;
  name: string;
  age: number;
  gender?: 'woman' | 'man';
  photo: string;
  bio: string;
  location: string;
  interests: string[];
  mutualFriendsCount?: number;
  campusCircle?: string;
  mysteryHint?: string;
  latitude?: number;
  longitude?: number;
  hasLikedUser?: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  age: number;
  gender?: 'woman' | 'man';
  photo: string;
  bio: string;
  location: string;
  interests: string[];
  mutualFriendsCount: number;
  campusCircle: string;
  mysteryHint: string;
  distanceKm?: number;
}

export interface SwipeAction {
  profileId: string;
  direction: 'like' | 'pass';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: string;
}

export interface MatchRecord {
  profile: ClientProfile;
  matchedAt: string;
  messages: ChatMessage[];
}

export interface UserStats {
  confessionsLeft: number;
  totalCrushSlots: number;
  incomingSecretAdmirers: number;
  invitedFriendsCount: number;
}
