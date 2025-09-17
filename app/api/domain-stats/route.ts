import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { clickhouse } from '@/lib/clickhouse';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const type = searchParams.get('type');

    console.log('Domain stats request:', { domain, type });

    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter required' }, { status: 400 });
    }

    // Get monthly breach statistics for the domain (all historical data)
    let query = `
      SELECT
        toMonth(date_collected) as month,
        toYear(date_collected) as year,
        count(*) as count
      FROM leaked_data
      WHERE 1=1
    `;

    const params: any = {};

    // Convert type to uppercase for case-insensitive comparison
    const typeUpper = type?.toUpperCase();

    if (typeUpper === 'URL') {
      // URL 모니터링은 main_domain 필드 사용
      query += ` AND main_domain = {domain:String}`;
      params.domain = domain;
    } else if (typeUpper === 'EMAIL') {
      // Email 모니터링은 main_email 필드 정확히 매칭
      query += ` AND main_email = {domain:String}`;
      params.domain = domain;
    }

    query += `
      GROUP BY year, month
      ORDER BY year ASC, month ASC
    `;

    console.log('Query:', query);
    console.log('Params:', params);

    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
      query_params: params,
    });

    const data = await result.json();
    console.log('Raw data from ClickHouse:', data);

    // Process all historical data by year and month
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Only include months with actual data (count > 0)
    data.forEach((item: any) => {
      const count = parseInt(item.count);
      if (count > 0) {
        monthlyData.push({
          month: monthNames[item.month - 1],
          year: item.year,
          breaches: count,
          monthNum: item.month,
          label: `${monthNames[item.month - 1]}\n${item.year}`
        });
      }
    })

    // Sort by year and month to ensure chronological order
    monthlyData.sort((a: any, b: any) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNum - b.monthNum;
    });

    console.log('Processed monthly data:', monthlyData);

    // Get total count for the domain
    let totalQuery = `
      SELECT count(*) as total
      FROM leaked_data
      WHERE 1=1
    `;

    if (typeUpper === 'URL') {
      totalQuery += ` AND main_domain = {domain:String}`;
    } else if (typeUpper === 'EMAIL') {
      totalQuery += ` AND main_email = {domain:String}`;
    }

    console.log('Total query:', totalQuery);

    const totalResult = await clickhouse.query({
      query: totalQuery,
      format: 'JSONEachRow',
      query_params: params,
    });

    const totalData = await totalResult.json();
    console.log('Total data:', totalData);

    const total = totalData[0]?.total || 0;

    // Get protocol distribution
    let protocolStats: any = {};

    try {
      let protocolQuery = `
        SELECT
          countIf(protocol = 'https') as httpsCount,
          countIf(protocol = 'http') as httpCount,
          countIf(protocol = 'android') as androidCount,
          countIf(protocol = 'ios') as iosCount,
          countIf(protocol = 'app') as appCount,
          countIf(protocol = 'smtp') as smtpCount,
          countIf(protocol = 'mailbox') as mailboxCount,
          countIf(protocol = 'ftp') as ftpCount,
          countIf(protocol = 'chrome') as chromeCount,
          countIf(protocol = 'chrome-extension') as chromeExtCount,
          countIf(protocol = 'edge') as edgeCount,
          countIf(protocol = 'edge-extension') as edgeExtCount,
          countIf(protocol = 'moz-extension') as mozExtCount,
          countIf(protocol = 'opera') as operaCount,
          countIf(protocol = 'opera-extension') as operaExtCount,
          countIf(protocol = 'brave-extension') as braveExtCount,
          countIf(protocol = 'vivaldi') as vivaldiCount,
          countIf(protocol = 'resource') as resourceCount,
          countIf(protocol = 'content') as contentCount,
          countIf(protocol = 'file') as fileCount,
          countIf(protocol = 'oauth') as oauthCount,
          countIf(protocol = 'moz-proxy') as mozProxyCount,
          countIf(protocol = 'im') as imCount,
          countIf(protocol = 'ssh') as sshCount,
          countIf(protocol = 'rdp') as rdpCount,
          countIf(protocol = 'vnc') as vncCount,
          countIf(protocol = 'telnet') as telnetCount,
          countIf(protocol = 'rtmp') as rtmpCount,
          countIf(protocol = 'news') as newsCount,
          countIf(protocol = 'postgresql') as postgresqlCount,
          countIf(protocol = 'mysql') as mysqlCount,
          countIf(protocol = 'mongodb') as mongodbCount
        FROM leaked_data
        WHERE 1=1
      `;

      if (typeUpper === 'URL') {
        protocolQuery += ` AND main_domain = {domain:String}`;
      } else if (typeUpper === 'EMAIL') {
        protocolQuery += ` AND main_email = {domain:String}`;
      }

      console.log('Protocol query:', protocolQuery);

      const protocolResult = await clickhouse.query({
        query: protocolQuery,
        format: 'JSONEachRow',
        query_params: params,
      });

      const protocolData = await protocolResult.json();
      console.log('Protocol data:', protocolData);

      if (protocolData[0]) {
        protocolStats = {
          https: parseInt(protocolData[0].httpsCount || 0),
          http: parseInt(protocolData[0].httpCount || 0),
          android: parseInt(protocolData[0].androidCount || 0),
          ios: parseInt(protocolData[0].iosCount || 0),
          app: parseInt(protocolData[0].appCount || 0),
          smtp: parseInt(protocolData[0].smtpCount || 0),
          mailbox: parseInt(protocolData[0].mailboxCount || 0),
          ftp: parseInt(protocolData[0].ftpCount || 0),
          chrome: parseInt(protocolData[0].chromeCount || 0),
          'chrome-extension': parseInt(protocolData[0].chromeExtCount || 0),
          edge: parseInt(protocolData[0].edgeCount || 0),
          'edge-extension': parseInt(protocolData[0].edgeExtCount || 0),
          'moz-extension': parseInt(protocolData[0].mozExtCount || 0),
          opera: parseInt(protocolData[0].operaCount || 0),
          'opera-extension': parseInt(protocolData[0].operaExtCount || 0),
          'brave-extension': parseInt(protocolData[0].braveExtCount || 0),
          vivaldi: parseInt(protocolData[0].vivaldiCount || 0),
          resource: parseInt(protocolData[0].resourceCount || 0),
          content: parseInt(protocolData[0].contentCount || 0),
          file: parseInt(protocolData[0].fileCount || 0),
          oauth: parseInt(protocolData[0].oauthCount || 0),
          'moz-proxy': parseInt(protocolData[0].mozProxyCount || 0),
          im: parseInt(protocolData[0].imCount || 0),
          ssh: parseInt(protocolData[0].sshCount || 0),
          rdp: parseInt(protocolData[0].rdpCount || 0),
          vnc: parseInt(protocolData[0].vncCount || 0),
          telnet: parseInt(protocolData[0].telnetCount || 0),
          rtmp: parseInt(protocolData[0].rtmpCount || 0),
          news: parseInt(protocolData[0].newsCount || 0),
          postgresql: parseInt(protocolData[0].postgresqlCount || 0),
          mysql: parseInt(protocolData[0].mysqlCount || 0),
          mongodb: parseInt(protocolData[0].mongodbCount || 0)
        };
      }
    } catch (protocolError) {
      console.log('Protocol query failed:', protocolError);
      protocolStats = {};
    }

    // Legacy support - keep old variables for compatibility
    const webCount = (protocolStats.https || 0) + (protocolStats.http || 0);
    const androidCount = protocolStats.android || 0;
    const iosCount = protocolStats.ios || 0;

    const response = {
      domain,
      type,
      monthlyData,
      total: parseInt(total),
      webCount,
      androidCount,
      iosCount,
      protocolStats,  // 모든 프로토콜 통계 추가
      allYears: true
    };

    console.log('Final response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching domain statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domain statistics' },
      { status: 500 }
    );
  }
}