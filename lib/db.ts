import fs from 'fs';
import path from 'path';
import { Profile, ClientProfile, SwipeAction, MatchRecord, UserStats, ChatMessage } from './types';
import seedData from '../data/seed_profiles.json';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  BITS: { lat: 28.3639, lon: 75.5870 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Goa: { lat: 15.2993, lon: 74.1240 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function getProfileCoordinates(profile: Profile): { lat: number; lon: number } {
  if (profile.latitude && profile.longitude) {
    return { lat: profile.latitude, lon: profile.longitude };
  }
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (
      profile.location.toLowerCase().includes(key.toLowerCase()) ||
      (profile.campusCircle && profile.campusCircle.toLowerCase().includes(key.toLowerCase()))
    ) {
      return coords;
    }
  }
  return CITY_COORDS['Delhi'];
}

interface StoreSchema {
  swipes: Record<string, SwipeAction>;
  matches: MatchRecord[];
  confessionsLeft: number;
  totalCrushSlots: number;
  invitedFriendsCount: number;
  blockedOrReportedIds: string[];
}

function getInitialStore(): StoreSchema {
  return {
    swipes: {},
    matches: [],
    confessionsLeft: 5,
    totalCrushSlots: 5,
    invitedFriendsCount: 0,
    blockedOrReportedIds: []
  };
}

export function getStore(): StoreSchema {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const initial = getInitialStore();
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const content = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      swipes: parsed.swipes || {},
      matches: parsed.matches || [],
      confessionsLeft: typeof parsed.confessionsLeft === 'number' ? parsed.confessionsLeft : 5,
      totalCrushSlots: typeof parsed.totalCrushSlots === 'number' ? parsed.totalCrushSlots : 5,
      invitedFriendsCount: typeof parsed.invitedFriendsCount === 'number' ? parsed.invitedFriendsCount : 0,
      blockedOrReportedIds: Array.isArray(parsed.blockedOrReportedIds) ? parsed.blockedOrReportedIds : []
    };
  } catch (err) {
    console.error('Error reading store:', err);
    return getInitialStore();
  }
}

export function saveStore(store: StoreSchema): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

export function getAllProfiles(): Profile[] {
  return seedData as Profile[];
}

export function getFeedProfiles(filters?: {
  location?: string;
  interest?: string;
  gender?: string;
  ageMin?: number;
  ageMax?: number;
  userLat?: number;
  userLon?: number;
  maxDistanceKm?: number;
  sortBy?: 'recommended' | 'nearest' | 'mutuals';
}): ClientProfile[] {
  const store = getStore();
  const swipedIds = new Set(Object.keys(store.swipes));
  const blockedIds = new Set(store.blockedOrReportedIds || []);

  let unswiped = getAllProfiles().filter((p) => !swipedIds.has(p.id) && !blockedIds.has(p.id));

  // Location filter
  if (filters?.location && filters.location !== 'all') {
    const locLower = filters.location.toLowerCase();
    unswiped = unswiped.filter(
      (p) =>
        p.location.toLowerCase().includes(locLower) ||
        (p.campusCircle && p.campusCircle.toLowerCase().includes(locLower))
    );
  }

  // Interest filter
  if (filters?.interest && filters.interest !== 'all') {
    const intLower = filters.interest.toLowerCase();
    unswiped = unswiped.filter((p) =>
      p.interests.some((i) => i.toLowerCase().includes(intLower))
    );
  }

  // Gender filter
  if (filters?.gender && filters.gender !== 'all') {
    if (filters.gender === 'women') {
      unswiped = unswiped.filter((p) => ['Ananya', 'Meera', 'Tara', 'Dia', 'Ishani', 'Rhea', 'Kavya', 'Avani', 'Pooja', 'Shreya', 'Natasha', 'Sanya', 'Tanvi', 'Rupali', 'Alisha'].some(name => p.name.includes(name)));
    } else if (filters.gender === 'men') {
      unswiped = unswiped.filter((p) => ['Rohan', 'Kabir', 'Arjun', 'Dev', 'Zayn', 'Siddharth', 'Vikram', 'Nikhil', 'Aman', 'Karan', 'Aditya', 'Neil', 'Pranav', 'Varun', 'Samarth'].some(name => p.name.includes(name)));
    }
  }

  // Granular Age range filter
  if (filters?.ageMin !== undefined) {
    unswiped = unswiped.filter((p) => p.age >= filters.ageMin!);
  }
  if (filters?.ageMax !== undefined) {
    unswiped = unswiped.filter((p) => p.age <= filters.ageMax!);
  }

  let clientProfiles: ClientProfile[] = unswiped.map((p) => {
    const coords = getProfileCoordinates(p);
    let distanceKm: number | undefined = undefined;

    if (filters?.userLat !== undefined && filters?.userLon !== undefined) {
      distanceKm = calculateDistance(filters.userLat, filters.userLon, coords.lat, coords.lon);
    } else {
      distanceKm = calculateDistance(28.6139, 77.2090, coords.lat, coords.lon);
    }

    return {
      id: p.id,
      name: p.name,
      age: p.age,
      photo: p.photo,
      bio: p.bio,
      location: p.location,
      interests: p.interests,
      mutualFriendsCount: p.mutualFriendsCount || 2,
      campusCircle: p.campusCircle || p.location,
      mysteryHint: p.mysteryHint || 'Connected via extended campus network',
      distanceKm
    };
  });

  if (filters?.maxDistanceKm && filters.userLat !== undefined) {
    clientProfiles = clientProfiles.filter(
      (p) => p.distanceKm === undefined || p.distanceKm <= filters.maxDistanceKm!
    );
  }

  if (filters?.sortBy === 'nearest') {
    clientProfiles.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  } else if (filters?.sortBy === 'mutuals') {
    clientProfiles.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);
  }

  return clientProfiles;
}

export function getUserStats(): UserStats {
  const store = getStore();
  const blockedIds = new Set(store.blockedOrReportedIds || []);
  const unswipedAdmirers = getAllProfiles().filter(
    (p) => p.hasLikedUser && !store.swipes[p.id] && !blockedIds.has(p.id)
  ).length;

  return {
    confessionsLeft: store.confessionsLeft,
    totalCrushSlots: store.totalCrushSlots,
    incomingSecretAdmirers: unswipedAdmirers,
    invitedFriendsCount: store.invitedFriendsCount
  };
}

export function inviteFriendsForBonusSlots(count: number = 1): UserStats {
  const store = getStore();
  store.invitedFriendsCount += count;
  store.totalCrushSlots += count * 3;
  store.confessionsLeft += count * 3;
  saveStore(store);
  return getUserStats();
}

export function recordSwipe(profileId: string, direction: 'like' | 'pass') {
  const store = getStore();
  const profiles = getAllProfiles();
  const target = profiles.find((p) => p.id === profileId);

  if (!target) {
    throw new Error('Profile not found');
  }

  if (direction === 'like' && store.confessionsLeft <= 0) {
    return {
      isMatch: false,
      outOfSlots: true,
      profile: null
    };
  }

  const timestamp = new Date().toISOString();
  store.swipes[profileId] = {
    profileId,
    direction,
    timestamp
  };

  if (direction === 'like') {
    store.confessionsLeft = Math.max(0, store.confessionsLeft - 1);
  }

  let isMatch = false;
  let matchProfile: ClientProfile | null = null;

  if (direction === 'like' && target.hasLikedUser) {
    isMatch = true;
    matchProfile = {
      id: target.id,
      name: target.name,
      age: target.age,
      photo: target.photo,
      bio: target.bio,
      location: target.location,
      interests: target.interests,
      mutualFriendsCount: target.mutualFriendsCount || 2,
      campusCircle: target.campusCircle || target.location,
      mysteryHint: target.mysteryHint || ''
    };

    if (!store.matches.some((m) => m.profile.id === target.id)) {
      store.matches.unshift({
        profile: matchProfile,
        matchedAt: timestamp,
        messages: [
          {
            id: `msg_welcome_${Date.now()}`,
            sender: 'match',
            text: `Hey! Looks like we both secretly liked each other on Coy 😊`,
            timestamp
          }
        ]
      });
    }
  }

  saveStore(store);

  return {
    isMatch,
    outOfSlots: false,
    profile: matchProfile
  };
}

export function getMatches(): MatchRecord[] {
  const store = getStore();
  const blockedIds = new Set(store.blockedOrReportedIds || []);
  return (store.matches || []).filter((m) => !blockedIds.has(m.profile.id));
}

export function sendMessageToMatch(profileId: string, text: string): ChatMessage {
  const store = getStore();
  const match = store.matches.find((m) => m.profile.id === profileId);
  if (!match) throw new Error('Match not found');

  if (!match.messages) match.messages = [];

  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    sender: 'user',
    text,
    timestamp: new Date().toISOString()
  };

  match.messages.push(newMsg);
  saveStore(store);
  return newMsg;
}

export function removeMatch(profileId: string): void {
  const store = getStore();
  store.matches = store.matches.filter((m) => m.profile.id !== profileId);
  if (store.swipes[profileId]) {
    store.swipes[profileId].direction = 'pass';
  }
  saveStore(store);
}

export function reportAndBlockProfile(profileId: string, reason: string): void {
  const store = getStore();
  if (!store.blockedOrReportedIds) store.blockedOrReportedIds = [];
  if (!store.blockedOrReportedIds.includes(profileId)) {
    store.blockedOrReportedIds.push(profileId);
  }
  store.matches = store.matches.filter((m) => m.profile.id !== profileId);
  store.swipes[profileId] = {
    profileId,
    direction: 'pass',
    timestamp: new Date().toISOString()
  };
  saveStore(store);
}

export function resetDataStore(): void {
  const initial = getInitialStore();
  saveStore(initial);
}
