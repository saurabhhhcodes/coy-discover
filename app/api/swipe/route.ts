import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, direction } = body;

    if (!profileId || !['like', 'pass'].includes(direction)) {
      return NextResponse.json(
        { success: false, error: 'Invalid profileId or direction' },
        { status: 400 }
      );
    }

    const result = recordSwipe(profileId, direction);

    return NextResponse.json({
      success: true,
      profileId,
      direction,
      isMatch: result.isMatch,
      outOfSlots: result.outOfSlots,
      profile: result.profile
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
