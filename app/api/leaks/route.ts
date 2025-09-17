import { NextRequest, NextResponse } from 'next/server';
import { clickhouse, LeakData } from '@/lib/clickhouse';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/auth-middleware';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // REQUIRED authentication - no bypass allowed for security
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    // Additional security: If domain filter is provided, verify user owns the domain
    const domain = searchParams.get('domain');

    // If no domain is specified (viewing all data), require admin access
    if (!domain) {
      const hasAdminAccess = await isAdmin(supabase, user.id);
      if (!hasAdminAccess) {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required to view all data' },
          { status: 403 }
        );
      }
    }
    let isVerified = true; // Default to true for admin or no-domain cases
    if (domain) {
      // Clean domain input same way as in POST /api/domains
      const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

      console.log(`🔐 Checking domain ownership: "${domain}" -> cleaned: "${cleanDomain}"`);

      const { data: domainOwnership, error: ownershipError } = await supabase
        .from('domains')
        .select('id, domain, type, is_verified')
        .eq('user_id', user.id)
        .eq('domain', cleanDomain);

      console.log(`🔐 Domain ownership query result:`, domainOwnership);
      console.log(`🔐 Domain ownership query error:`, ownershipError);

      if (!domainOwnership || domainOwnership.length === 0) {
        // Get all user domains for debugging
        const { data: allDomains } = await supabase
          .from('domains')
          .select('domain, type')
          .eq('user_id', user.id);

        console.log(`🔐 User's registered domains:`, allDomains);

        return NextResponse.json(
          { error: `Access denied: You don't have permission to view data for "${domain}". This domain is not registered under your account.` },
          { status: 403 }
        );
      }

      // Check if domain is verified
      isVerified = domainOwnership[0].is_verified || false;
      console.log(`🔐 Domain verification status: ${isVerified}`);
    }

    // If domain is not verified, restrict access
    let actualPage = parseInt(searchParams.get('page') || '1');
    let actualLimit = parseInt(searchParams.get('limit') || '50');
    let actualSearch = searchParams.get('search');

    if (!isVerified) {
      // For unverified domains, restrict to first page with 30 items max
      actualPage = 1;
      actualLimit = Math.min(actualLimit, 30);
      actualSearch = null; // Disable search for unverified domains
      console.log(`🔒 Unverified domain - restricting access: page=1, limit=${actualLimit}, search disabled`);
    }

    const page = actualPage;
    const limit = actualLimit;
    const domainType = searchParams.get('domainType'); // URL or EMAIL
    const sortBy = searchParams.get('sortBy') || 'date_collected';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const search = actualSearch;
    const searchField = searchParams.get('searchField') || 'all';
    
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        date_collected,
        ip,
        country,
        pc_name,
        user_name,
        url,
        id,
        pw,
        browser,
        main_domain,
        main_email,
        protocol
      FROM leaked_data
    `;
    
    const params: any = {};
    const whereConditions: string[] = [];

    if (domain) {
      // Choose the field based on domain type
      if (domainType === 'EMAIL') {
        whereConditions.push('main_email = {domain:String}');
        params.domain = domain; // Email monitoring exact match
        console.log(`🔍 EMAIL Filter: main_email = ${domain}`);
      } else {
        // URL filtering uses main_domain
        whereConditions.push('main_domain = {domain:String}');
        params.domain = domain;
        console.log(`🔍 URL Filter: main_domain = ${domain}`);
      }
    }

    // Handle primary search filter
    if (search) {
      let searchCondition = '';
      if (searchField === 'all') {
        searchCondition = '(user_name LIKE {search:String} OR id LIKE {search:String} OR url LIKE {search:String} OR ip LIKE {search:String})';
      } else if (searchField === 'domain') {
        searchCondition = '(main_domain LIKE {search:String} OR main_email LIKE {search:String})';
      } else if (searchField === 'user_name') {
        searchCondition = 'user_name LIKE {search:String}';
      } else if (searchField === 'id') {
        searchCondition = 'id LIKE {search:String}';
      } else if (searchField === 'url') {
        searchCondition = 'url LIKE {search:String}';
      } else if (searchField === 'ip') {
        searchCondition = 'ip LIKE {search:String}';
      }

      if (searchCondition) {
        whereConditions.push(searchCondition);
        params.search = `%${search}%`;
        console.log(`🔍 Search Filter: ${searchField} LIKE %${search}%`);
      }
    }

    // Handle additional search filters
    for (let i = 1; i <= 10; i++) { // Support up to 10 additional filters
      const additionalSearch = searchParams.get(`search${i}`);
      const additionalField = searchParams.get(`searchField${i}`);

      if (additionalSearch && additionalField) {
        let searchCondition = '';
        if (additionalField === 'domain') {
          searchCondition = `(main_domain LIKE {search${i}:String} OR main_email LIKE {search${i}:String})`;
        } else if (additionalField === 'user_name') {
          searchCondition = `user_name LIKE {search${i}:String}`;
        } else if (additionalField === 'id') {
          searchCondition = `id LIKE {search${i}:String}`;
        } else if (additionalField === 'url') {
          searchCondition = `url LIKE {search${i}:String}`;
        } else if (additionalField === 'ip') {
          searchCondition = `ip LIKE {search${i}:String}`;
        }

        if (searchCondition) {
          whereConditions.push(searchCondition);
          params[`search${i}`] = `%${additionalSearch}%`;
          console.log(`🔍 Additional Filter ${i}: ${additionalField} LIKE %${additionalSearch}%`);
        }
      }
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    if (!domain && !search) {
      console.log('🔍 No filters applied');
    }
    
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    query += ' LIMIT {limit:UInt32} OFFSET {offset:UInt32}';
    
    params.limit = limit;
    params.offset = offset;
    
    const resultSet = await clickhouse.query({
      query,
      query_params: params,
      format: 'JSONEachRow'
    });
    
    const data = await resultSet.json<LeakData>();

    // Debug: Show first few records and their main_domain values
    if (data.length > 0) {
      console.log(`📊 Query returned ${data.length} records`);
      console.log(`📊 First record main_domain:`, data[0]?.main_domain);
      console.log(`📊 Sample domains:`, data.slice(0, 3).map(d => d.main_domain));
    }
    
    // Get total count
    let countQuery = 'SELECT count() as total FROM leaked_data';
    let countParams: any = {};
    const countWhereConditions: string[] = [];

    if (domain) {
      if (domainType === 'EMAIL') {
        countWhereConditions.push('main_email = {domain:String}');
        countParams.domain = domain;
      } else {
        countWhereConditions.push('main_domain = {domain:String}');
        countParams.domain = domain;
      }
    }

    if (search) {
      let searchCondition = '';
      if (searchField === 'all') {
        searchCondition = '(user_name LIKE {search:String} OR id LIKE {search:String} OR url LIKE {search:String} OR ip LIKE {search:String})';
      } else if (searchField === 'domain') {
        searchCondition = '(main_domain LIKE {search:String} OR main_email LIKE {search:String})';
      } else if (searchField === 'user_name') {
        searchCondition = 'user_name LIKE {search:String}';
      } else if (searchField === 'id') {
        searchCondition = 'id LIKE {search:String}';
      } else if (searchField === 'url') {
        searchCondition = 'url LIKE {search:String}';
      } else if (searchField === 'ip') {
        searchCondition = 'ip LIKE {search:String}';
      }

      if (searchCondition) {
        countWhereConditions.push(searchCondition);
        countParams.search = `%${search}%`;
      }
    }

    if (countWhereConditions.length > 0) {
      countQuery += ' WHERE ' + countWhereConditions.join(' AND ');
    }

    const countResult = await clickhouse.query({
      query: countQuery,
      query_params: countParams,
      format: 'JSONEachRow'
    });
    
    const countData = await countResult.json<{ total: string }>();
    const total = parseInt(countData[0]?.total || '0');
    
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      isVerified,
      restrictedAccess: !isVerified // Flag to indicate restricted access
    });
  } catch (error) {
    console.error('Error fetching data from ClickHouse:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}