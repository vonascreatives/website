import { NextResponse } from 'next/server';
import { getFaqData } from '@/lib/sanity';

export async function GET() {
  try {
    const data = await getFaqData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ data' },
      { status: 500 }
    );
  }
}
