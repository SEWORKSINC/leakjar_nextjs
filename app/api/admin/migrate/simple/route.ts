import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-service';

/**
 * GET /api/admin/migrate/simple - Simple migration check and instructions
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();

    // Try to select the api_keys table structure
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error accessing api_keys table:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to access api_keys table',
        details: error.message,
        message: 'Please check your Supabase credentials and table existence'
      });
    }

    // Check if we have encryption-related columns by looking at the first record
    const sampleRecord = data && data[0];
    const hasEncryptionColumns = sampleRecord && (
      'encrypted_key' in sampleRecord ||
      'encryption_iv' in sampleRecord ||
      'encryption_tag' in sampleRecord
    );

    return NextResponse.json({
      success: true,
      hasEncryptionColumns,
      currentColumns: sampleRecord ? Object.keys(sampleRecord) : [],
      tableAccessible: true,
      sampleRecord: sampleRecord ? {
        id: sampleRecord.id,
        user_id: sampleRecord.user_id,
        name: sampleRecord.name,
        // Don't return sensitive data
        created_at: sampleRecord.created_at,
        is_active: sampleRecord.is_active
      } : null,
      instructions: !hasEncryptionColumns ? {
        message: 'Encryption columns need to be added to api_keys table',
        sql: `
-- Run this SQL in Supabase SQL Editor:
ALTER TABLE api_keys
ADD COLUMN encrypted_key TEXT,
ADD COLUMN encryption_iv TEXT,
ADD COLUMN encryption_tag TEXT,
ADD COLUMN encryption_method VARCHAR(50) DEFAULT 'aes-256-gcm',
ADD COLUMN encrypted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        `,
        steps: [
          '1. Go to your Supabase project dashboard',
          '2. Click on "SQL Editor" in the sidebar',
          '3. Copy and paste the SQL query above',
          '4. Click "Run" to execute the migration',
          '5. Verify the columns were added successfully'
        ]
      } : {
        message: 'Encryption columns already exist in api_keys table'
      }
    });

  } catch (error) {
    console.error('Migration check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Migration check failed',
      message: 'Please run the SQL migration manually in Supabase dashboard',
      sql: `
ALTER TABLE api_keys
ADD COLUMN encrypted_key TEXT,
ADD COLUMN encryption_iv TEXT,
ADD COLUMN encryption_tag TEXT,
ADD COLUMN encryption_method VARCHAR(50) DEFAULT 'aes-256-gcm',
ADD COLUMN encrypted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `
    });
  }
}