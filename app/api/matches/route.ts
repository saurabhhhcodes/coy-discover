import { NextRequest, NextResponse } from 'next/server';
import { getMatches, removeMatch, sendMessageToMatch } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matches = getMatches();
    return NextResponse.json({ success: true, count: matches.length, matches });
  } catch (error) {
    console.error('Failed to get matches:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// Send chat message to match
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, message } = body;
    if (!profileId || !message) {
      return NextResponse.json({ success: false, error: 'Missing profileId or message' }, { status: 400 });
    }

    const newMsg = sendMessageToMatch(profileId, message);
    return NextResponse.json({ success: true, message: newMsg });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// Remove / unmatch connection
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId } = body;
    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Missing profileId' }, { status: 400 });
    }

    removeMatch(profileId);
    return NextResponse.json({ success: true, message: 'Connection removed successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
