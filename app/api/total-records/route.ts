import { NextResponse } from 'next/server';
import { clickhouse } from '@/lib/clickhouse';

export async function GET() {
  try {
    const query = `
      SELECT count(*) as total
      FROM leaked_data
    `;

    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
    });

    const data = await result.json();
    const total = data[0]?.total || 0;

    return NextResponse.json({
      total: parseInt(total),
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching Total Breaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Total Breaches' },
      { status: 500 }
    );
  }
}