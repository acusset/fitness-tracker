import { NextResponse } from 'next/server';
import { getActivityTimeSeriesHelper } from '@/lib/fitbit/fitbitClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resourcePath = searchParams.get('resource');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!resourcePath || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const data = await getActivityTimeSeriesHelper(
      resourcePath as any,
      startDate,
      endDate
    );
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fitbit API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
} 