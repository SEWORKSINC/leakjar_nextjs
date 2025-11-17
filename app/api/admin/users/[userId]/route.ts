import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

// Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PostgreSQL 직접 연결 Pool
const pgPool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

/**
 * PostgreSQL 직접 연결로 사용자 완전 삭제
 * 외래 키 제약조건을 올바른 순서로 처리하여 완전한 삭제 보장
 */
async function deleteUserCompletely(userId: string): Promise<{
  success: boolean;
  deletedAuthUser?: any;
  deletedPublicUser?: any;
  updatedOrganizations?: number;
  error?: string;
}> {
  const client = await pgPool.connect();

  try {
    await client.query('BEGIN');

    // 1. organizations 테이블의 created_by 참조 해제
    console.log('🏢 organizations.created_by 참조 해제...');
    const orgUpdate = await client.query(
      'UPDATE organizations SET created_by = NULL WHERE created_by = $1',
      [userId]
    );
    console.log(`   ${orgUpdate.rowCount}개 조직 업데이트 완료`);

    // 2. 관련된 테이블들 정리 (user_id 참조)
    const relatedTables = [
      'domains',
      'user_profiles',
      'sessions',
      'api_keys',
      'search_history',
      'watchlist',
      'alerts',
      'subscriptions',
      'payments',
      'usage_history',
      'audit_logs',
      'invitations',
      'support_tickets',
      'billing_settings'
    ];

    for (const table of relatedTables) {
      try {
        const column = table === 'support_tickets' ? 'assigned_to' :
                      table === 'invitations' ? 'created_by' : 'user_id';

        const result = await client.query(
          `DELETE FROM ${table} WHERE ${column} = $1`,
          [userId]
        );
        if (result.rowCount > 0) {
          console.log(`   ${table}: ${result.rowCount}개 레코드 삭제`);
        }
      } catch (tableError) {
        console.log(`   ${table}: 건너뜀 (테이블 없음 또는 권한 없음)`);
      }
    }

    // 3. auth 관련 테이블 정리
    console.log('🔐 auth 관련 테이블 정리...');
    const authTables = ['auth.sessions', 'auth.refresh_tokens'];

    for (const table of authTables) {
      try {
        const result = await client.query(`DELETE FROM ${table} WHERE user_id = $1`, [userId]);
        if (result.rowCount > 0) {
          console.log(`   ${table}: ${result.rowCount}개 삭제`);
        }
      } catch (authError) {
        console.log(`   ${table}: 건너뜀`);
      }
    }

    // 4. public.users 테이블에서 삭제 (Soft Delete 대신 Hard Delete)
    console.log('👤 public.users 테이블에서 삭제...');
    const publicDeleteResult = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email',
      [userId]
    );

    // 5. auth.users 테이블에서 최종 삭제 (가장 중요!)
    console.log('🎯 auth.users 테이블에서 최종 삭제...');
    const authDeleteResult = await client.query(
      'DELETE FROM auth.users WHERE id = $1 RETURNING id, email',
      [userId]
    );

    await client.query('COMMIT');

    console.log('✅ 사용자 완전 삭제 성공!');

    return {
      success: true,
      deletedAuthUser: authDeleteResult.rows[0],
      deletedPublicUser: publicDeleteResult.rows[0],
      updatedOrganizations: orgUpdate.rowCount
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 사용자 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the requesting user is an admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin (only super admins can delete users)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only super admins can delete users' }, { status: 403 });
    }

    // Prevent deleting own account
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // PostgreSQL 직접 연결로 완전 삭제 시도
    console.log(`🚀 PostgreSQL 직접 연결로 사용자 완전 삭제 시작: ${userId}`);
    const deletionResult = await deleteUserCompletely(userId);

    if (deletionResult.success) {
      console.log('✅ 사용자 완전 삭제 성공!');

      const response = {
        success: true,
        message: 'User completely deleted from all tables',
        deleted: {
          authUser: deletionResult.deletedAuthUser,
          publicUser: deletionResult.deletedPublicUser,
          organizationsUpdated: deletionResult.updatedOrganizations,
          method: 'postgresql-direct'
        },
        userId,
        recommendation: 'User has been completely removed from the system.'
      };

      return NextResponse.json(response, { status: 200 });

    } else {
      console.log('❌ PostgreSQL 직접 삭제 실패, 기존 방법으로 fallback...');

      // Fallback to existing Supabase API method
      const { error: domainsError } = await supabaseAdmin
        .from('domains')
        .delete()
        .eq('user_id', userId);

      const { error: profileDeleteError } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      // Soft delete as fallback
      const { error: softDeleteError } = await supabaseAdmin
        .from('users')
        .update({
          email: `deleted_${userId}@deleted.com`,
          name: 'Deleted User',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      const response = {
        success: false,
        message: 'PostgreSQL direct deletion failed, fallback to soft delete',
        error: deletionResult.error,
        deleted: {
          domains: !domainsError,
          profile: !profileDeleteError,
          softDeleted: !softDeleteError,
          method: 'supabase-soft-delete'
        },
        userId,
        recommendation: 'Manual cleanup may be required. Check PostgreSQL connection and permissions.'
      };

      return NextResponse.json(response, { status: 207 });
    }

  } catch (error) {
    console.error('Error in delete user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}