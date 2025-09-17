import { createClient } from '@clickhouse/client';

// Build ClickHouse URL from environment variables
const clickhouseUrl = `${process.env.CLICKHOUSE_PROTOCOL || 'https'}://${process.env.CLICKHOUSE_HOST || 'localhost'}:${process.env.CLICKHOUSE_PORT || '8443'}`;

export const clickhouse = createClient({
  url: clickhouseUrl,
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DB || 'default',
  request_timeout: 60000, // 60 seconds timeout
  max_open_connections: 10,
  compression: {
    request: false,
    response: true
  }
});

export interface LeakData {
  date_collected: string;
  ip: string;
  country: string;
  pc_name: string;
  user_name: string;
  url: string;
  id: string;
  pw: string;
  browser: string;
  main_domain: string;
  main_email: string;
  protocol: string;
}