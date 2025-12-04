import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-service';

/**
 * POST /api/admin/migrate/api-keys - Add encryption columns to api_keys table
 * This endpoint should only be used for one-time migration
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();

    // Check if encrypted_key column already exists
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'api_keys')
      .eq('table_schema', 'public')
      .eq('column_name', 'encrypted_key');

    if (columnsError) {
      console.error('Error checking columns:', columnsError);
      return NextResponse.json(
        { error: 'Failed to check existing columns' },
        { status: 500 }
      );
    }

    // If columns already exist, return success
    if (columns && columns.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Encryption columns already exist',
        columns: ['encrypted_key', 'encryption_iv', 'encryption_tag', 'encryption_method', 'encrypted_at']
      });
    }

    // Add encryption columns using raw SQL
    const migrationSQL = `
      ALTER TABLE api_keys
      ADD COLUMN encrypted_key TEXT,
      ADD COLUMN encryption_iv TEXT,
      ADD COLUMN encryption_tag TEXT,
      ADD COLUMN encryption_method VARCHAR(50) DEFAULT 'aes-256-gcm',
      ADD COLUMN encrypted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `;

    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    // If RPC doesn't work, we'll need to handle this differently
    if (migrationError) {
      console.log('RPC method failed, columns may need to be added manually:', migrationError);

      // Return instructions for manual migration
      return NextResponse.json({
        success: false,
        error: 'Automatic migration failed',
        message: 'Please run the following SQL manually in Supabase SQL Editor:',
        sql: migrationSQL,
        instructions: [
          '1. Go to Supabase Dashboard',
          '2. Navigate to SQL Editor',
          '3. Run the SQL query above',
          '4. Verify columns were added successfully'
        ]
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully added encryption columns to api_keys table',
      columns: ['encrypted_key', 'encryption_iv', 'encryption_tag', 'encryption_method', 'encrypted_at']
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        message: 'Please check logs and run SQL manually',
        sql: `
          ALTER TABLE api_keys
          ADD COLUMN encrypted_key TEXT,
          ADD COLUMN encryption_iv TEXT,
          ADD COLUMN encryption_tag TEXT,
          ADD COLUMN encryption_method VARCHAR(50) DEFAULT 'aes-256-gcm',
          ADD COLUMN encrypted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        `
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/migrate/api-keys - Check migration status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();

    // Check if encryption columns exist
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'api_keys')
      .eq('table_schema', 'public')
      .in('column_name', ['encrypted_key', 'encryption_iv', 'encryption_tag', 'encryption_method', 'encrypted_at']);

    if (columnsError) {
      console.error('Error checking columns:', columnsError);
      return NextResponse.json(
        { error: 'Failed to check existing columns' },
        { status: 500 }
      );
    }

    const existingColumns = columns || [];
    const requiredColumns = ['encrypted_key', 'encryption_iv', 'encryption_tag', 'encryption_method', 'encrypted_at'];
    const missingColumns = requiredColumns.filter(col => !existingColumns.some(c => c.column_name === col));

    return NextResponse.json({
      success: missingColumns.length === 0,
      existingColumns: existingColumns.map(c => ({
        name: c.column_name,
        type: c.data_type,
        nullable: c.is_nullable === 'YES'
      })),
      missingColumns,
      migrationComplete: missingColumns.length === 0,
      totalRequired: requiredColumns.length,
      currentProgress: existingColumns.length
    });

  } catch (error) {
    console.error('Migration status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check migration status' },
      { status: 500 }
    );
  }
}