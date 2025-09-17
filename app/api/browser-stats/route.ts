import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { clickhouse } from '@/lib/clickhouse';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    // Authentication
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get user's domains
    const { data: userDomains, error: domainsError } = await supabase
      .from('domains')
      .select('domain, type')
      .eq('user_id', user.id);

    if (domainsError || !userDomains || userDomains.length === 0) {
      return NextResponse.json({
        browserStats: [],
        total: 0
      });
    }

    // Build WHERE conditions for user's domains
    const domainConditions: string[] = [];
    const params: any = {};

    userDomains.forEach((domain, index) => {
      if (domain.type === 'URL') {
        domainConditions.push(`main_domain = {domain${index}:String}`);
        params[`domain${index}`] = domain.domain;
      } else if (domain.type === 'EMAIL') {
        domainConditions.push(`main_email = {email${index}:String}`);
        params[`email${index}`] = domain.domain;
      }
    });

    if (domainConditions.length === 0) {
      return NextResponse.json({
        browserStats: [],
        total: 0
      });
    }

    // Query for browser statistics
    const query = `
      SELECT
        browser,
        count(*) as count
      FROM leaked_data
      WHERE (${domainConditions.join(' OR ')})
      GROUP BY browser
      ORDER BY count DESC
    `;

    console.log('Browser stats query:', query);
    console.log('Params:', params);

    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
      query_params: params,
    });

    const data = await result.json();
    console.log('Browser stats data:', data);

    // Process and format the data
    console.log('Raw browser data sample:', data.slice(0, 10));

    // Group and clean browser data
    const browserGroups: { [key: string]: number } = {};

    data.forEach((item: any) => {
      let browserName = (item.browser || '').trim();
      const count = parseInt(item.count);

      if (!browserName || browserName === '') {
        if (!browserGroups['Unknown']) browserGroups['Unknown'] = 0;
        browserGroups['Unknown'] += count;
        return;
      }

      // Extract browser name from file paths
      // Handle patterns like: Browser/Logins/Brave-Browser_Default[7af6ae5f].txt
      // or: C:/Users/.../Brave/Profile 1/...
      let normalized = 'Other';
      const originalLower = browserName.toLowerCase();

      // Check for browser names in file paths or complex strings
      if (originalLower.includes('brave')) {
        normalized = 'Brave';
      } else if ((originalLower.includes('chrome') || originalLower.includes('google')) &&
                 !originalLower.includes('chromium') &&
                 !originalLower.includes('edge')) {
        normalized = 'Chrome';
      } else if (originalLower.includes('firefox') || originalLower.includes('mozilla')) {
        normalized = 'Firefox';
      } else if (originalLower.includes('safari') && !originalLower.includes('chrome')) {
        normalized = 'Safari';
      } else if (originalLower.includes('edge') || originalLower.includes('msedge')) {
        normalized = 'Edge';
      } else if (originalLower.includes('opera')) {
        normalized = 'Opera';
      } else if (originalLower.includes('chromium')) {
        normalized = 'Chromium';
      } else if (originalLower.includes('vivaldi')) {
        normalized = 'Vivaldi';
      } else if (originalLower.includes('yandex')) {
        normalized = 'Yandex';
      } else if (originalLower.includes('samsung')) {
        normalized = 'Samsung Internet';
      } else if (originalLower.includes('tor')) {
        normalized = 'Tor Browser';
      } else if (originalLower.includes('whale')) {
        normalized = 'Whale';
      } else if (originalLower.includes('uc browser') || originalLower.includes('ucbrowser')) {
        normalized = 'UC Browser';
      } else if (originalLower.includes('360') || originalLower.includes('qihoo')) {
        normalized = '360 Browser';
      } else if (originalLower.includes('qq')) {
        normalized = 'QQ Browser';
      } else if (originalLower.includes('sogou')) {
        normalized = 'Sogou Browser';
      } else if (originalLower.includes('maxthon')) {
        normalized = 'Maxthon';
      } else if (originalLower.includes('palemoon') || originalLower.includes('pale moon')) {
        normalized = 'Pale Moon';
      } else if (originalLower.includes('waterfox')) {
        normalized = 'Waterfox';
      } else if (originalLower.includes('basilisk')) {
        normalized = 'Basilisk';
      } else if (originalLower.includes('seamonkey')) {
        normalized = 'SeaMonkey';
      } else if (originalLower.includes('kinza')) {
        normalized = 'Kinza';
      } else if (originalLower.includes('sleipnir')) {
        normalized = 'Sleipnir';
      } else if (originalLower.includes('coccoc')) {
        normalized = 'Coc Coc';
      } else if (originalLower.includes('comodo') || originalLower.includes('dragon')) {
        normalized = 'Comodo Dragon';
      } else if (originalLower.includes('cent')) {
        normalized = 'CentBrowser';
      } else if (originalLower.includes('slimjet')) {
        normalized = 'Slimjet';
      } else if (originalLower.includes('iron')) {
        normalized = 'SRWare Iron';
      } else if (originalLower.includes('ghost')) {
        normalized = 'Ghost Browser';
      } else if (originalLower.includes('epic')) {
        normalized = 'Epic Browser';
      } else if (originalLower.includes('avast')) {
        normalized = 'Avast Browser';
      } else if (originalLower.includes('avg')) {
        normalized = 'AVG Browser';
      } else if (originalLower.includes('blisk')) {
        normalized = 'Blisk';
      }
      // If it looks like a file path but no browser found, mark as Other
      else if (originalLower.includes('/') || originalLower.includes('\\') ||
               originalLower.includes('.txt') || originalLower.includes('.log') ||
               originalLower.includes('[') || originalLower.includes(']')) {
        normalized = 'Other';
      }

      if (!browserGroups[normalized]) browserGroups[normalized] = 0;
      browserGroups[normalized] += count;
    });

    // Convert to array and sort
    const browserStats = Object.entries(browserGroups)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: 0
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate total
    const total = browserStats.reduce((sum: number, item: any) => sum + item.count, 0);

    // Calculate percentages
    browserStats.forEach((item: any) => {
      item.percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
    });

    return NextResponse.json({
      browserStats,
      total
    });

  } catch (error) {
    console.error('Error fetching browser statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch browser statistics' },
      { status: 500 }
    );
  }
}