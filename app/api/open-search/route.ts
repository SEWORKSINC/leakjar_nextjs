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
      FROM leaked_data
      WHERE main_domain = {domain:String}
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
      FROM leaked_data
      WHERE main_email = {domain:String}
      ORDER BY date_collected DESC
      LIMIT 5
    `;

    // Query for total counts
    const urlCountQuery = `
      SELECT count() as total
      FROM leaked_data
      WHERE main_domain = {domain:String}
    `;

    const emailCountQuery = `
      SELECT count() as total
      FROM leaked_data
      WHERE main_email = {domain:String}
    `;

    // Query for last breach date
    const lastBreachQuery = `
      SELECT max(date_collected) as last_date
      FROM leaked_data
      WHERE main_domain = {domain:String} OR main_email = {domain:String}
    `;

    // Execute queries
    const auth = Buffer.from(`${clickhouseUser}:${clickhousePassword}`).toString('base64');

    const executeQuery = async (query: string, params: Record<string, string> = {}) => {
      // Build URL with parameters
      let url = `${clickhouseUrl}/?query=${encodeURIComponent(query)}`;

      // Add query parameters
      const paramEntries = Object.entries(params);
      if (paramEntries.length > 0) {
        const paramString = paramEntries
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        url += `&${paramString}`;
      }

      const response = await fetch(url, {
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

    // Execute all queries with parameters
    const [urlData, emailData, urlCount, emailCount, lastBreach] = await Promise.all([
      executeQuery(urlQuery, { domain: cleanDomain }),
      executeQuery(emailQuery, { domain: cleanDomain }),
      executeQuery(urlCountQuery, { domain: cleanDomain }),
      executeQuery(emailCountQuery, { domain: cleanDomain }),
      executeQuery(lastBreachQuery, { domain: cleanDomain })
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