// Supabase 데이터베이스 구조 확인
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Service Role Key를 사용해서 관리자 권한으로 접속
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('🔍 Supabase 데이터베이스 구조 확인');

async function checkDatabase() {
  try {
    // 1. auth.users 테이블 확인
    console.log('\n📋 auth.users 테이블 확인...');
    const { data: authUsers, error: authError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .limit(1);

    if (authError) {
      console.error('❌ users 테이블 접근 에러:', authError.message);
    } else {
      console.log('✅ users 테이블 접근 가능');
    }

    // 2. RLS 정책 확인
    console.log('\n🔒 RLS 정책 확인...');
    const { data: rlsPolicies, error: rlsError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, permissive, roles')
      .eq('tablename', 'users');

    if (rlsError) {
      console.log('⚠️  RLS 정책을 직접 확인할 수 없음:', rlsError.message);
    } else {
      console.log('✅ RLS 정책 확인됨:', rlsPolicies.length, '개');
    }

    // 3. user_profiles 테이블 확인
    console.log('\n👤 user_profiles 테이블 확인...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, user_id, created_at')
      .limit(1);

    if (profilesError) {
      console.error('❌ user_profiles 테이블 접근 에러:', profilesError.message);
    } else {
      console.log('✅ user_profiles 테이블 접근 가능');
    }

    // 4. 트리거 확인
    console.log('\n⚙️  트리거 확인...');
    const { data: triggers, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name, event_manipulation, event_object_table')
      .eq('event_object_table', 'users');

    if (triggerError) {
      console.log('⚠️  트리거 확인 불가:', triggerError.message);
    } else {
      console.log('✅ 트리거 확인됨:', triggers.length, '개');
      triggers.forEach(trigger => {
        console.log(`   - ${trigger.trigger_name}: ${trigger.event_manipulation} on ${trigger.event_object_table}`);
      });
    }

  } catch (error) {
    console.error('❌ 데이터베이스 확인 실패:', error.message);
  }
}

checkDatabase();