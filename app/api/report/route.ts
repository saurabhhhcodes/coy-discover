import { NextRequest, NextResponse } from 'next/server';
import { reportAndBlockProfile } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, reason } = body;
    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Missing profileId' }, { status: 400 });
    }

    reportAndBlockProfile(profileId, reason || 'Inappropriate behavior or spam');
    return NextResponse.json({
      success: true,
      message: 'Profile reported and blocked successfully'
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
