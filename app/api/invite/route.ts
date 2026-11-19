import { NextResponse } from 'next/server';
import { getUserStats, inviteFriendsForBonusSlots } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = getUserStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Failed to get stats:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Simulates sharing invite link & friend onboarding -> unlocks +3 crush slots
    const updatedStats = inviteFriendsForBonusSlots(1);
    return NextResponse.json({
      success: true,
      message: 'Bonus crush slots unlocked!',
      stats: updatedStats
    });
  } catch (error) {
    console.error('Failed to unlock bonus slots:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
