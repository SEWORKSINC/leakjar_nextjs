// 트리거 재설정 스크립트
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔧 on_auth_user_created 트리거 재설정');

async function resetTrigger() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. 기존 트리거 삭제...');

    // 먼저 트리거 삭제 시도
    const dropTrigger = await client.query(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `);

    console.log('✅ 기존 트리거 삭제 완료');

    console.log('\n🔧 2. 새 트리거 생성...');

    // 새 트리거 생성
    const createTrigger = await client.query(`
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
    `);

    console.log('✅ 새 트리거 생성 완료');

    console.log('\n🧪 3. 트리거 상태 확인...');
    const triggerStatus = await client.query(`
      SELECT
        tgname as trigger_name,
        tgenabled as enabled,
        tgrelid::regproc as table_name
      FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
    `);

    if (triggerStatus.rows.length > 0) {
      const trigger = triggerStatus.rows[0];
      console.log('✅ 트리거 상태:');
      console.log(`   - 이름: ${trigger.trigger_name}`);
      console.log(`   - 활성화: ${trigger.enabled === 'O' ? '활성' : '비활성'}`);
      console.log(`   - 테이블: ${trigger.table_name}`);
    } else {
      console.log('❌ 트리거를 찾을 수 없음');
    }

  } catch (error) {
    console.error('❌ 트리거 재설정 실패:', error.message);

    // 권한 에러인 경우 대안 제시
    if (error.message.includes('must be owner')) {
      console.log('\n💡 권한 문제 해결 방법:');
      console.log('1. Supabase 프로젝트 설정에서 트리거 비활성화');
      console.log('2. Supabase 대시보드 > Authentication > Settings');
      console.log('3. "Enable custom access token hook" 비활성화');
      console.log('4. 또는 SQL Editor에서 SUPERUSER 권한으로 실행');
    }

  } finally {
    client.release();
  }
}

resetTrigger();