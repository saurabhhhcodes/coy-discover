import { NextResponse } from 'next/server';
import { resetDataStore } from '@/lib/db';

export async function POST() {
  try {
    resetDataStore();
    return NextResponse.json({ success: true, message: 'Data store reset successfully' });
  } catch (error) {
    console.error('Failed to reset store:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
