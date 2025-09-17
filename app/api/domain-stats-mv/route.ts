import { NextRequest, NextResponse } from 'next/server';

// Materialized View를 사용하는 최적화된 도메인 통계 API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');
  const type = searchParams.get('type'); // URL or EMAIL

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
  }

  // ClickHouse 연결 설정
  const clickhouseProtocol = process.env.CLICKHOUSE_PROTOCOL || 'https';
  const clickhouseHost = process.env.CLICKHOUSE_HOST || 'localhost';
  const clickhousePort = process.env.CLICKHOUSE_PORT || '8443';
  const clickhouseDb = process.env.CLICKHOUSE_DB || 'default';
  const clickhouseUser = process.env.CLICKHOUSE_USER || 'default';
  const clickhousePassword = process.env.CLICKHOUSE_PASSWORD || '';
  const clickhouseUrl = `${clickhouseProtocol}://${clickhouseHost}:${clickhousePort}`;

  try {
    // Helper function to execute queries
    const executeQuery = async (query: string) => {
      const url = `${clickhouseUrl}/?database=${clickhouseDb}&default_format=JSONCompact`;
      const auth = Buffer.from(`${clickhouseUser}:${clickhousePassword}`).toString('base64');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Basic ${auth}`,
        },
        body: query
      });

      if (!response.ok) {
        throw new Error(`ClickHouse error: ${response.status}`);
      }

      return await response.json();
    };

    const fieldName = type === 'EMAIL' ? 'main_email' : 'main_domain';

    // 1. 전체 요약 통계 (domain_summary_mv 사용)
    const summaryQuery = `
      SELECT
        sum(total_records) as total,
        max(last_breach_date) as last_breach,
        min(first_breach_date) as first_breach,
        sum(unique_protocols) as protocols,
        sum(unique_browsers) as browsers,
        sum(unique_countries) as countries
      FROM domain_summary_mv
      WHERE ${fieldName} = '${domain}'
      FORMAT JSONCompact
    `;

    // 2. 월별 통계 (domain_monthly_stats_mv 사용) - 모든 데이터
    const monthlyQuery = `
      SELECT
        year_month,
        sum(record_count) as count
      FROM domain_monthly_stats_mv
      WHERE ${fieldName} = '${domain}'
      GROUP BY year_month
      ORDER BY year_month
      FORMAT JSONCompact
    `;

    // 3. 프로토콜 분포 (domain_protocol_stats_mv 사용)
    const protocolQuery = `
      SELECT
        protocol,
        sum(record_count) as count
      FROM domain_protocol_stats_mv
      WHERE ${fieldName} = '${domain}'
      GROUP BY protocol
      ORDER BY count DESC
      LIMIT 10
      FORMAT JSONCompact
    `;

    // 4. 브라우저 분포 (domain_browser_stats_mv 사용)
    const browserQuery = `
      SELECT
        browser,
        sum(record_count) as count
      FROM domain_browser_stats_mv
      WHERE ${fieldName} = '${domain}'
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 10
      FORMAT JSONCompact
    `;

    // 5. 국가 분포 (domain_country_stats_mv 사용)
    const countryQuery = `
      SELECT
        country,
        sum(record_count) as count
      FROM domain_country_stats_mv
      WHERE ${fieldName} = '${domain}'
      GROUP BY country
      ORDER BY count DESC
      LIMIT 20
      FORMAT JSONCompact
    `;

    // 병렬로 모든 쿼리 실행
    const [summaryResult, monthlyResult, protocolResult, browserResult, countryResult] =
      await Promise.all([
        executeQuery(summaryQuery),
        executeQuery(monthlyQuery),
        executeQuery(protocolQuery),
        executeQuery(browserQuery),
        executeQuery(countryQuery)
      ]);

    // 결과 파싱 (컬럼 수 조정: total_with_password 제거)
    const summary = summaryResult.data?.[0] || [0, null, null, 0, 0, 0];

    // 월별 데이터 포맷팅 - 연도 포함
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = (monthlyResult.data || []).map((row: any[]) => {
      const yearMonth = String(row[0]);
      const year = yearMonth.substring(0, 4);
      const month = parseInt(yearMonth.substring(4, 6)) - 1;
      return {
        month: `${monthNames[month]} ${year}`,
        yearMonth: yearMonth,
        breaches: row[1] || 0
      };
    });

    // 모든 기간 데이터 표시
    const completeMonthlyData = monthlyData;

    // 프로토콜 통계 포맷팅
    const protocolStats: any = {};
    (protocolResult.data || []).forEach((row: any[]) => {
      if (row[0]) protocolStats[row[0]] = row[1] || 0;
    });

    // 브라우저 통계 포맷팅
    const browserStats = (browserResult.data || []).map((row: any[]) => ({
      browser: row[0] || 'Unknown',
      count: row[1] || 0
    }));

    // 국가 통계 포맷팅
    const countryStats = (countryResult.data || []).map((row: any[]) => ({
      country: row[0] || 'Unknown',
      count: row[1] || 0
    }));

    // 응답 구성
    const response = {
      domain,
      type,
      total: parseInt(summary[0]) || 0,
      lastBreachDate: summary[1],
      firstBreachDate: summary[2],
      monthlyData: completeMonthlyData,
      protocolStats,
      browserStats: browserStats.slice(0, 10),
      countryStats: countryStats.slice(0, 20),
      metadata: {
        source: 'materialized_view',
        cached: false,
        timestamp: new Date().toISOString()
      }
    };

    // 캐시 헤더 설정 (5분)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('Error fetching domain stats from MV:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domain statistics' },
      { status: 500 }
    );
  }
}