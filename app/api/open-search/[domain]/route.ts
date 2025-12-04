import { NextRequest, NextResponse } from 'next/server';

// Sample data for demonstration when ClickHouse is not available
const generateSampleData = (domain: string) => {
  const now = new Date();
  const protocols = ['https', 'http', 'ftp', 'ssh', 'smtp'];
  const countries = ['US', 'UK', 'DE', 'FR', 'CA', 'AU', 'JP', 'KR'];

  const generateRecord = (index: number, isEmail: boolean = false) => {
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    // Generate sample password
    const passwords = ['Password123!', 'Admin@2024', 'Qwerty123456', 'Welcome2024!', 'SecurePass99$'];

    return {
      date_collected: date.toISOString().split('T')[0],
      url: isEmail ? `https://${domain}/login` : `https://${domain}/${['admin', 'user', 'portal', 'app', 'dashboard'][index % 5]}`,
      id: isEmail ? `user${index}@${domain}` : `user${1000 + index}`,
      pw: passwords[index % passwords.length],
      protocol: protocols[index % protocols.length],
      country: countries[index % countries.length],
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      pc_name: `PC-${Math.random().toString(36).substring(7).toUpperCase()}`,
      user_name: `USER-${Math.random().toString(36).substring(7).toUpperCase()}`
    };
  };

  return {
    urlBreaches: Array(5).fill(null).map((_, i) => generateRecord(i)),
    emailBreaches: Array(5).fill(null).map((_, i) => generateRecord(i, true)),
    totalUrlBreaches: Math.floor(Math.random() * 10000) + 1000,
    totalEmailBreaches: Math.floor(Math.random() * 5000) + 500,
    lastBreachDate: new Date().toISOString().split('T')[0]
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const resolvedParams = await params;
    const domain = resolvedParams.domain;

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Clean up domain
    const cleanDomain = domain.toLowerCase().trim()
      .replace(/['"`;\\]/g, '')
      .replace(/\s+/g, '');

    // Basic domain validation
    if (cleanDomain.length < 3 || !cleanDomain.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    // Connect to ClickHouse using environment variables
    const clickhouseProtocol = process.env.CLICKHOUSE_PROTOCOL || 'https';
    const clickhouseHost = process.env.CLICKHOUSE_HOST || 'localhost';
    const clickhousePort = process.env.CLICKHOUSE_PORT || '8443';
    const clickhouseDb = process.env.CLICKHOUSE_DB || 'default';
    const clickhouseUser = process.env.CLICKHOUSE_USER || 'default';
    const clickhousePassword = process.env.CLICKHOUSE_PASSWORD || '';

    const clickhouseUrl = `${clickhouseProtocol}://${clickhouseHost}:${clickhousePort}`;

    // Helper function to execute ClickHouse queries with parameters
    const executeQuery = async (query: string, params: Record<string, string> = {}) => {
      // Build URL with parameters
      let url = `${clickhouseUrl}/?database=${clickhouseDb}&default_format=JSONCompact&query=${encodeURIComponent(query)}`;

      // Add query parameters
      const paramEntries = Object.entries(params);
      if (paramEntries.length > 0) {
        const paramString = paramEntries
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        url += `&${paramString}`;
      }

      try {
        const auth = Buffer.from(`${clickhouseUser}:${clickhousePassword}`).toString('base64');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('ClickHouse query failed:', errorText);
          throw new Error(`ClickHouse error: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Query execution error:', error);
        throw error;
      }
    };

    // Query for URL monitoring (where URL contains the domain)
    const urlQuery = `
      SELECT
        date_collected,
        url,
        id,
        pw,
        protocol,
        country,
        ip,
        pc_name,
        user_name
      FROM leaked_data
      WHERE main_domain = {domain:String}
      ORDER BY date_collected DESC
      LIMIT 5
      FORMAT JSONCompact
    `;

    // Query for Email monitoring (where email ends with @domain)
    const emailQuery = `
      SELECT
        date_collected,
        url,
        id,
        pw,
        protocol,
        country,
        ip,
        pc_name,
        user_name
      FROM leaked_data
      WHERE main_email = {domain:String}
      ORDER BY date_collected DESC
      LIMIT 5
      FORMAT JSONCompact
    `;

    // Query for total URL breaches count
    const urlCountQuery = `
      SELECT count() as total
      FROM leaked_data
      WHERE main_domain = {domain:String}
      FORMAT JSONCompact
    `;

    // Query for total email breaches count
    const emailCountQuery = `
      SELECT count() as total
      FROM leaked_data
      WHERE main_email = {domain:String}
      FORMAT JSONCompact
    `;

    // Query for last breach date (with passwords only - meaningful breaches)
    const lastBreachQuery = `
      SELECT max(date_collected) as last_date
      FROM leaked_data
      WHERE (main_domain = {domain:String} OR main_email = {domain:String})
        AND pw != ''
        AND pw != '[NOT_SAVED]'
      FORMAT JSONCompact
    `;

    // Try to execute queries, fall back to sample data if ClickHouse is unavailable
    let urlResult, emailResult, urlCountResult, emailCountResult, lastBreachResult;
    let usingSampleData = false;

    try {
      // Test connection first
      const testResponse = await fetch(`${clickhouseUrl}/ping`);

      if (!testResponse.ok) {
        throw new Error('ClickHouse not available');
      }

      // Execute all queries in parallel with parameters
      [urlResult, emailResult, urlCountResult, emailCountResult, lastBreachResult] = await Promise.all([
        executeQuery(urlQuery, { domain: cleanDomain }),
        executeQuery(emailQuery, { domain: cleanDomain }),
        executeQuery(urlCountQuery, { domain: cleanDomain }),
        executeQuery(emailCountQuery, { domain: cleanDomain }),
        executeQuery(lastBreachQuery, { domain: cleanDomain })
      ]);
    } catch (error) {
      console.log('ClickHouse not available, using sample data');
      usingSampleData = true;

      // Use sample data
      const sampleData = generateSampleData(cleanDomain);

      urlResult = { data: sampleData.urlBreaches.map(r => [
        r.date_collected, r.url, r.id, r.pw, r.protocol, r.country, r.ip, r.pc_name, r.user_name
      ])};
      emailResult = { data: sampleData.emailBreaches.map(r => [
        r.date_collected, r.url, r.id, r.pw, r.protocol, r.country, r.ip, r.pc_name, r.user_name
      ])};
      urlCountResult = { data: [[sampleData.totalUrlBreaches]] };
      emailCountResult = { data: [[sampleData.totalEmailBreaches]] };
      lastBreachResult = { data: [[sampleData.lastBreachDate]] };
    }

    // Parse the results
    const parseResults = (result: any, columns: string[]) => {
      if (!result.data || result.data.length === 0) return [];

      return result.data.map((row: any[]) => {
        const obj: any = {};
        columns.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });
    };

    const urlColumns = ['date_collected', 'url', 'id', 'pw', 'protocol', 'country', 'ip', 'pc_name', 'user_name'];
    const emailColumns = ['date_collected', 'url', 'id', 'pw', 'protocol', 'country', 'ip', 'pc_name', 'user_name'];

    const urlBreaches = parseResults(urlResult, urlColumns);
    const emailBreaches = parseResults(emailResult, emailColumns);

    // Get counts - ensure they are numbers
    const totalUrlBreaches = parseInt(urlCountResult.data?.[0]?.[0]) || 0;
    const totalEmailBreaches = parseInt(emailCountResult.data?.[0]?.[0]) || 0;
    const lastBreachDate = lastBreachResult.data?.[0]?.[0] || null;

    // Prepare response
    const response = {
      domain: cleanDomain,
      summary: {
        totalBreaches: totalUrlBreaches + totalEmailBreaches,
        urlBreaches: totalUrlBreaches,
        emailBreaches: totalEmailBreaches,
        lastBreachDate: lastBreachDate
      },
      data: {
        urlMonitoring: {
          total: totalUrlBreaches,
          recent: urlBreaches,
          hasMore: totalUrlBreaches > 5
        },
        emailMonitoring: {
          total: totalEmailBreaches,
          recent: emailBreaches,
          hasMore: totalEmailBreaches > 5
        }
      },
      metadata: {
        timestamp: new Date().toISOString(),
        limited: true,
        recordLimit: 5,
        dataSource: usingSampleData ? 'sample' : 'live'
      }
    };

    // Set cache headers for performance
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });

  } catch (error) {
    console.error('Open search API error:', error);

    // Return meaningful error response
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch breach data',
          message: error.message,
          domain: domain
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}