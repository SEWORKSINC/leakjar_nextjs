import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Clean up domain
    const cleanDomain = domain.toLowerCase().trim();

    // Connect to ClickHouse
    const clickhouseUrl = process.env.CLICKHOUSE_URL || 'http://localhost:8123';
    const clickhouseUser = process.env.CLICKHOUSE_USER || 'default';
    const clickhousePassword = process.env.CLICKHOUSE_PASSWORD || '';

    // Query for URL monitoring (main_domain matches)
    const urlQuery = `
      SELECT
        date_collected,
        url,
        id,
        protocol,
        country,
        ip
      FROM credentials_ultimate
      WHERE main_domain = '${cleanDomain}'
      ORDER BY date_collected DESC
      LIMIT 5
    `;

    // Query for Email monitoring (main_email matches)
    const emailQuery = `
      SELECT
        date_collected,
        url,
        id,
        protocol,
        country,
        ip
      FROM credentials_ultimate
      WHERE main_email = '${cleanDomain}'
      ORDER BY date_collected DESC
      LIMIT 5
    `;

    // Query for total counts
    const urlCountQuery = `
      SELECT count() as total
      FROM credentials_ultimate
      WHERE main_domain = '${cleanDomain}'
    `;

    const emailCountQuery = `
      SELECT count() as total
      FROM credentials_ultimate
      WHERE main_email = '${cleanDomain}'
    `;

    // Query for last breach date
    const lastBreachQuery = `
      SELECT max(date_collected) as last_date
      FROM credentials_ultimate
      WHERE main_domain = '${cleanDomain}' OR main_email = '${cleanDomain}'
    `;

    // Execute queries
    const auth = Buffer.from(`${clickhouseUser}:${clickhousePassword}`).toString('base64');

    const executeQuery = async (query: string) => {
      const response = await fetch(`${clickhouseUrl}/?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        console.error('ClickHouse query failed:', await response.text());
        return { data: [] };
      }

      const result = await response.json();
      return result;
    };

    // Execute all queries
    const [urlData, emailData, urlCount, emailCount, lastBreach] = await Promise.all([
      executeQuery(urlQuery),
      executeQuery(emailQuery),
      executeQuery(urlCountQuery),
      executeQuery(emailCountQuery),
      executeQuery(lastBreachQuery)
    ]);

    // Format response
    const response = {
      urlBreaches: urlData.data || [],
      emailBreaches: emailData.data || [],
      totalUrlBreaches: urlCount.data?.[0]?.total || 0,
      totalEmailBreaches: emailCount.data?.[0]?.total || 0,
      lastBreachDate: lastBreach.data?.[0]?.last_date || null,
      domain: cleanDomain
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Open search API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch breach data' },
      { status: 500 }
    );
  }
}