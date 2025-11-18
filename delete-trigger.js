// 트리거 완전 삭제 스크립트
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🗑️ on_auth_user_created 트리거 완전 삭제');

async function deleteTrigger() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. 트리거 삭제...');

    // 트리거 삭제
    const dropTrigger = await client.query(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `);

    console.log('✅ 트리거 삭제 완료');

    console.log('\n🧪 2. 트리거 삭제 확인...');
    const triggerCheck = await client.query(`
      SELECT tgname
      FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
    `);

    if (triggerCheck.rows.length === 0) {
      console.log('✅ 트리거가 완전히 삭제되었습니다');
    } else {
      console.log('❌ 트리거가 여전히 존재합니다');
    }

    console.log('\n🗑️ 3. 관련 함수도 삭제 (선택사항)...');
    const dropFunction = await client.query(`
      DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
    `);

    console.log('✅ 관련 함수 삭제 완료');

  } catch (error) {
    console.error('❌ 트리거 삭제 실패:', error.message);
  } finally {
    client.release();
  }
}

deleteTrigger();