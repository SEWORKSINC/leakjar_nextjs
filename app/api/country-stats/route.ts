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
        countryStats: [],
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
        countryStats: [],
        total: 0
      });
    }

    // Query for country statistics
    const query = `
      SELECT
        country,
        count(*) as count
      FROM leaked_data
      WHERE (${domainConditions.join(' OR ')})
      GROUP BY country
      ORDER BY count DESC
      LIMIT 50
    `;


    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
      query_params: params,
    });

    const data = await result.json();

    // Process and format the data
    // First, separate valid country codes from unknown/numeric codes
    let unknownTotal = 0;
    const validCountryStats = [];

    data.forEach((item: any) => {
      const code = item.country?.trim();
      if (!code || code === '') return;

      // Aggregate UN and numeric codes as Unknown
      if (code === 'UN' || /^\d+$/.test(code)) {
        unknownTotal += parseInt(item.count);
      } else {
        // Valid country code
        validCountryStats.push({
          country: getCountryName(code),
          count: parseInt(item.count),
          code: code
        });
      }
    });

    // Add the aggregated Unknown entry if there's data
    if (unknownTotal > 0) {
      validCountryStats.push({
        country: 'Unknown',
        count: unknownTotal,
        code: 'UN'
      });
    }

    // Sort by count descending
    const countryStats = validCountryStats.sort((a, b) => b.count - a.count);

    // Calculate total
    const total = countryStats.reduce((sum: number, item: any) => sum + item.count, 0);

    // Add percentage
    countryStats.forEach((item: any) => {
      item.percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
    });

    return NextResponse.json({
      countryStats,
      total
    });

  } catch (error) {
    console.error('Error fetching country statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch country statistics' },
      { status: 500 }
    );
  }
}

// Helper function to get country name from ISO code
function getCountryName(code: string): string {
  const trimmed = code.trim().toUpperCase();

  // If it's numeric or invalid, return as is
  if (/^\d+$/.test(trimmed) || trimmed === 'UN') {
    return trimmed;
  }

  const codeToName: { [key: string]: string } = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'BR': 'Brazil',
    'RU': 'Russia',
    'AU': 'Australia',
    'ES': 'Spain',
    'IT': 'Italy',
    'MX': 'Mexico',
    'KR': 'South Korea',
    'NL': 'Netherlands',
    'TR': 'Turkey',
    'SA': 'Saudi Arabia',
    'CH': 'Switzerland',
    'PL': 'Poland',
    'BE': 'Belgium',
    'SE': 'Sweden',
    'AR': 'Argentina',
    'NO': 'Norway',
    'AT': 'Austria',
    'AE': 'UAE',
    'DK': 'Denmark',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'IL': 'Israel',
    'HK': 'Hong Kong',
    'EG': 'Egypt',
    'PH': 'Philippines',
    'FI': 'Finland',
    'CL': 'Chile',
    'PK': 'Pakistan',
    'GR': 'Greece',
    'PT': 'Portugal',
    'VN': 'Vietnam',
    'ID': 'Indonesia',
    'TH': 'Thailand',
    'IE': 'Ireland',
    'CZ': 'Czech Republic',
    'NZ': 'New Zealand',
    'RO': 'Romania',
    'HU': 'Hungary',
    'CO': 'Colombia',
    'UA': 'Ukraine',
    'ZA': 'South Africa',
    'TW': 'Taiwan',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'PE': 'Peru',
    'VE': 'Venezuela',
    'MA': 'Morocco',
    'DZ': 'Algeria',
    'NG': 'Nigeria',
    'KE': 'Kenya',
    'ET': 'Ethiopia',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'KZ': 'Kazakhstan',
    'UZ': 'Uzbekistan',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'RS': 'Serbia',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'LT': 'Lithuania',
    'LV': 'Latvia',
    'EE': 'Estonia',
    'LU': 'Luxembourg',
    'MT': 'Malta',
    'CY': 'Cyprus',
    'IS': 'Iceland',
    'DO': 'Dominican Republic',
    'EC': 'Ecuador',
    'GT': 'Guatemala',
    'BO': 'Bolivia',
    'HN': 'Honduras',
    'PY': 'Paraguay',
    'SV': 'El Salvador',
    'NI': 'Nicaragua',
    'CR': 'Costa Rica',
    'PA': 'Panama',
    'UY': 'Uruguay',
    'JM': 'Jamaica',
    'TT': 'Trinidad and Tobago'
  };

  return codeToName[trimmed] || trimmed;
}

// Helper function to convert country names to ISO codes
function getCountryCode(country: string): string {
  const trimmed = country.trim();

  // If it's already a 2-letter code, return it
  if (trimmed.length === 2) {
    return trimmed.toUpperCase();
  }

  const countryMap: { [key: string]: string } = {
    'United States': 'US',
    'USA': 'US',
    'US': 'US',
    'United States of America': 'US',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Great Britain': 'GB',
    'England': 'GB',
    'Canada': 'CA',
    'Germany': 'DE',
    'France': 'FR',
    'Japan': 'JP',
    'China': 'CN',
    'India': 'IN',
    'Brazil': 'BR',
    'Russia': 'RU',
    'Russian Federation': 'RU',
    'Australia': 'AU',
    'Spain': 'ES',
    'Italy': 'IT',
    'Mexico': 'MX',
    'South Korea': 'KR',
    'Korea': 'KR',
    'Korea, Republic of': 'KR',
    'Netherlands': 'NL',
    'Turkey': 'TR',
    'Saudi Arabia': 'SA',
    'Switzerland': 'CH',
    'Poland': 'PL',
    'Belgium': 'BE',
    'Sweden': 'SE',
    'Argentina': 'AR',
    'Norway': 'NO',
    'Austria': 'AT',
    'UAE': 'AE',
    'United Arab Emirates': 'AE',
    'Denmark': 'DK',
    'Singapore': 'SG',
    'Malaysia': 'MY',
    'Israel': 'IL',
    'Hong Kong': 'HK',
    'Egypt': 'EG',
    'Philippines': 'PH',
    'Finland': 'FI',
    'Chile': 'CL',
    'Pakistan': 'PK',
    'Greece': 'GR',
    'Portugal': 'PT',
    'Vietnam': 'VN',
    'Viet Nam': 'VN',
    'Indonesia': 'ID',
    'Thailand': 'TH',
    'Ireland': 'IE',
    'Czech Republic': 'CZ',
    'Czechia': 'CZ',
    'New Zealand': 'NZ',
    'Romania': 'RO',
    'Hungary': 'HU',
    'Colombia': 'CO',
    'Ukraine': 'UA',
    'South Africa': 'ZA',
    'Taiwan': 'TW',
    'Iran': 'IR',
    'Iraq': 'IQ',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Morocco': 'MA',
    'Algeria': 'DZ',
    'Nigeria': 'NG',
    'Kenya': 'KE',
    'Ethiopia': 'ET',
    'Bangladesh': 'BD',
    'Sri Lanka': 'LK',
    'Kazakhstan': 'KZ',
    'Uzbekistan': 'UZ',
    'Bulgaria': 'BG',
    'Croatia': 'HR',
    'Serbia': 'RS',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Lithuania': 'LT',
    'Latvia': 'LV',
    'Estonia': 'EE',
    'Luxembourg': 'LU',
    'Malta': 'MT',
    'Cyprus': 'CY',
    'Iceland': 'IS'
  };

  const code = countryMap[trimmed];
  if (code) return code;

  // Try lowercase match
  for (const [key, value] of Object.entries(countryMap)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return value;
    }
  }

  // Return first 2 letters as fallback
  return trimmed.substring(0, 2).toUpperCase();
}