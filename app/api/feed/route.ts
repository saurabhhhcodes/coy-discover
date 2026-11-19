import { NextRequest, NextResponse } from 'next/server';
import { getFeedProfiles, getUserStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location') || undefined;
    const interest = searchParams.get('interest') || undefined;
    const gender = searchParams.get('gender') || undefined;
    const ageMin = searchParams.get('ageMin') ? parseInt(searchParams.get('ageMin')!) : undefined;
    const ageMax = searchParams.get('ageMax') ? parseInt(searchParams.get('ageMax')!) : undefined;
    const userLat = searchParams.get('userLat') ? parseFloat(searchParams.get('userLat')!) : undefined;
    const userLon = searchParams.get('userLon') ? parseFloat(searchParams.get('userLon')!) : undefined;
    const maxDistanceKm = searchParams.get('maxDistanceKm') ? parseInt(searchParams.get('maxDistanceKm')!) : undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;

    const feed = getFeedProfiles({
      location,
      interest,
      gender,
      ageMin,
      ageMax,
      userLat,
      userLon,
      maxDistanceKm,
      sortBy
    });
    const stats = getUserStats();

    return NextResponse.json({
      success: true,
      count: feed.length,
      stats,
      profiles: feed
    });
  } catch (error) {
    console.error('Failed to get feed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
