import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Force PostgREST to reload its schema cache
    const { error } = await supabase.rpc('pgrst_ddl_watch', {});
    
    if (error) {
      console.error('Error reloading schema:', error);
      // Even if this fails, try a direct query to force cache refresh
    }

    // Query the domains table to force cache refresh
    const { data, error: queryError } = await supabase
      .from('domains')
      .select('*')
      .limit(1);

    if (queryError) {
      console.error('Query error:', queryError);
    }

    return NextResponse.json({ 
      message: 'Schema cache reload attempted',
      success: !error && !queryError 
    });
  } catch (error) {
    console.error('Reload schema error:', error);
    return NextResponse.json(
      { error: 'Failed to reload schema cache' },
      { status: 500 }
    );
  }
}