import { NextResponse } from 'next/server';
import { createClient } from '@clickhouse/client';

export async function GET() {
  const config = {
    host: process.env.CLICKHOUSE_HOST || 'not-set',
    port: process.env.CLICKHOUSE_PORT || 'not-set',
    protocol: process.env.CLICKHOUSE_PROTOCOL || 'not-set',
    user: process.env.CLICKHOUSE_USER || 'not-set',
    password: process.env.CLICKHOUSE_PASSWORD || 'not-set',
    passwordLength: process.env.CLICKHOUSE_PASSWORD?.length || 0,
    db: process.env.CLICKHOUSE_DB || 'not-set',
  };

  try {
    const clickhouseUrl = `${process.env.CLICKHOUSE_PROTOCOL || 'https'}://${process.env.CLICKHOUSE_HOST || 'localhost'}:${process.env.CLICKHOUSE_PORT || '8443'}`;

    const client = createClient({
      url: clickhouseUrl,
      username: process.env.CLICKHOUSE_USER || 'default',
      password: process.env.CLICKHOUSE_PASSWORD || '',
      database: process.env.CLICKHOUSE_DB || 'default',
      request_timeout: 10000,
    });

    // Simple test query
    const result = await client.query({
      query: 'SELECT 1 as test',
      format: 'JSONEachRow',
    });

    const data = await result.json();

    return NextResponse.json({
      success: true,
      config,
      testResult: data,
      message: 'ClickHouse connection successful'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      config,
      error: error.message || 'Unknown error',
      errorCode: error.code,
      errorType: error.type,
      message: 'ClickHouse connection failed'
    }, { status: 500 });
  }
}