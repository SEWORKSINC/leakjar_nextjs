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
        osStats: [],
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
        osStats: [],
        total: 0
      });
    }

    // Query for PC names to analyze OS
    const query = `
      SELECT
        pc_name,
        count(*) as count
      FROM leaked_data
      WHERE (${domainConditions.join(' OR ')}) AND pc_name != ''
      GROUP BY pc_name
      ORDER BY count DESC
      LIMIT 10000
    `;

    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
      query_params: params,
    });

    const data = await result.json();

    // Analyze PC names to determine OS
    const osGroups = {
      'Windows': 0,
      'Mac': 0,
      'Linux': 0,
      'Unknown': 0
    };

    const unknownPcNames: string[] = [];

    data.forEach((item: any) => {
      const pcName = item.pc_name?.toLowerCase() || '';
      const count = parseInt(item.count);

      if (detectWindows(pcName)) {
        osGroups['Windows'] += count;
      } else if (detectMac(pcName)) {
        osGroups['Mac'] += count;
      } else if (detectLinux(pcName)) {
        osGroups['Linux'] += count;
      } else {
        osGroups['Unknown'] += count;
        unknownPcNames.push(`${item.pc_name} (${count})`);
      }
    });

    // Log unknown PC names for pattern analysis
    if (unknownPcNames.length > 0) {
      console.log('🖥️ Unknown PC Names Analysis:');
      console.log('Total unknown entries:', unknownPcNames.length);
      console.log('Total Windows:', osGroups['Windows']);
      console.log('Total Mac:', osGroups['Mac']);
      console.log('Total Linux:', osGroups['Linux']);
      console.log('Total Unknown:', osGroups['Unknown']);
      console.log('');
      console.log('Top 100 unknown PC names:');
      const sortedUnknown = unknownPcNames
        .sort((a, b) => {
          const countA = parseInt(a.split('(')[1]?.replace(')', '') || '0');
          const countB = parseInt(b.split('(')[1]?.replace(')', '') || '0');
          return countB - countA;
        })
        .slice(0, 100);

      sortedUnknown.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry}`);
      });

      console.log('');
      console.log('Sample unknown patterns for analysis:');
      const uniquePatterns = new Set();
      sortedUnknown.forEach(entry => {
        const name = entry.split(' (')[0];
        // Extract different patterns
        if (name.includes('_')) uniquePatterns.add(`Underscore: ${name}`);
        if (name.includes('-')) uniquePatterns.add(`Hyphen: ${name}`);
        if (/^\d+$/.test(name)) uniquePatterns.add(`Numeric: ${name}`);
        if (name.includes('.')) uniquePatterns.add(`Dot: ${name}`);
        if (/^[A-Z]{2,}$/.test(name)) uniquePatterns.add(`AllCaps: ${name}`);
        if (name.length > 15) uniquePatterns.add(`Long: ${name}`);
      });

      Array.from(uniquePatterns).slice(0, 20).forEach(pattern => {
        console.log(`  - ${pattern}`);
      });
    }

    // Convert to array and sort
    const osStats = Object.entries(osGroups)
      .map(([os, count]) => ({ os, count }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    // Calculate total and percentages
    const total = osStats.reduce((sum, item) => sum + item.count, 0);
    osStats.forEach((item: any) => {
      item.percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
    });

    return NextResponse.json({
      osStats,
      total
    });

  } catch (error) {
    console.error('Error fetching OS statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OS statistics' },
      { status: 500 }
    );
  }
}

// Helper function to detect Windows based on PC name patterns
function detectWindows(pcName: string): boolean {
  const windowsPatterns = [
    // Original patterns
    /desktop-/i,
    /laptop-/i,
    /pc-/i,
    /win-/i,
    /windows/i,
    /^[a-z0-9-]{1,15}$/i, // NetBIOS name pattern (15 chars max)
    /user-pc/i,
    /admin-pc/i,
    /workstation/i,
    /^[a-zA-Z][a-zA-Z0-9-]*pc$/i,
    /^[a-zA-Z]+\d+$/i, // Common pattern like USER123

    // New patterns based on analysis
    /laptop_pc/i, // LAPTOP_PC
    /laptop_/i, // LAPTOP_FEDE, LAPTOP_MERLE, LAPTOP_KUL
    /_laptop/i, // YOGA_LAPTOP, M_LAPTOP
    /inbook_/i, // INBOOK_Y1_PLUS, INBOOK_X1, INBOOK_X2
    /legion_/i, // LEGION_5, LEGION_R
    /yoga_/i, // YOGA_LAPTOP
    /prime_z/i, // PRIME_Z690-P (motherboard)
    /dell_/i, // DELL_TRU
    /asus_/i, // ASUS laptop patterns
    /acer_/i, // ACER_NITRO_V15
    /omen/i, // DAVE_OMENPC (HP Omen)
    /nitro/i, // CLAUDIO_NITRO_5, ACER_NITRO_V15
    /_pc$/i, // Ends with _PC
    /_dev$/i, // DEIVID_DEV (developer PC)
    /_station/i, // MALINI_STATION
    /note_/i, // NOTE_VIEIRA
    /notehp_/i, // NOTEHP_COREI5_7
    /zerobook_/i, // ZEROBOOK_ULTRA
    /^[A-Z]+_[A-Z0-9_]+$/i, // ALL_CAPS_WITH_UNDERSCORES pattern
    /^[a-zA-Z]+_[a-zA-Z0-9_]+$/i, // Name_with_underscores pattern
    /gaming/i, // Gaming PC patterns
    /manager/i, // AKS_MANAGER
    /design/i, // JAKE_DESIGN
    /gallery/i, // ALFIN_GALLERY
    /^[A-Z]{2,}_[A-Z0-9]+$/i, // Two+ caps with underscore (SW_SECTION)
  ];

  return windowsPatterns.some(pattern => pattern.test(pcName));
}

// Helper function to detect Mac based on PC name patterns
function detectMac(pcName: string): boolean {
  const macPatterns = [
    /macbook/i,
    /imac/i,
    /mac-/i,
    /macpro/i,
    /macmini/i,
    /\.local$/i, // Often ends with .local on Mac
    /macintosh/i,
    /mbp/i, // MacBook Pro abbreviation
    /mba/i, // MacBook Air abbreviation
  ];

  return macPatterns.some(pattern => pattern.test(pcName));
}

// Helper function to detect Linux based on PC name patterns
function detectLinux(pcName: string): boolean {
  const linuxPatterns = [
    /ubuntu/i,
    /debian/i,
    /fedora/i,
    /centos/i,
    /redhat/i,
    /linux/i,
    /server/i,
    /node/i,
    /host/i,
    /vm-/i,
    /vps/i,
  ];

  return linuxPatterns.some(pattern => pattern.test(pcName));
}