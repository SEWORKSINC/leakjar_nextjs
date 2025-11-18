// on_auth_user_created 트리거 함수 내용 확인
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔍 on_auth_user_created 트리거 함수 내용 확인');

async function checkTriggerFunction() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. 트리거 정의 확인...');
    const triggerDef = await client.query(`
      SELECT
        tgname as trigger_name,
        tgenabled as enabled,
        tgrelid::regproc as function_name
      FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
    `);

    if (triggerDef.rows.length === 0) {
      console.log('❌ on_auth_user_created 트리거를 찾을 수 없습니다');
      return;
    }

    console.log('✅ 트리거 정보:');
    console.log(`   - 이름: ${triggerDef.rows[0].trigger_name}`);
    console.log(`   - 활성화: ${triggerDef.rows[0].enabled}`);
    console.log(`   - 함수: ${triggerDef.rows[0].function_name}`);

    const functionName = triggerDef.rows[0].function_name;

    console.log('\n🔧 2. 함수 내용 확인...');

    // pg_get_functiondef으로 함수 내용 확인
    const functionContent = await client.query(`
      SELECT pg_get_functiondef(oid) as function_source
      FROM pg_proc
      WHERE proname = $1::text
      LIMIT 1
    `, [functionName]);

    if (functionContent.rows.length > 0) {
      console.log('📝 트리거 함수 코드:');
      console.log(functionContent.rows[0].function_source);
    } else {
      // 다른 방법으로 시도
      const functionSource = await client.query(`
        SELECT routine_definition
        FROM information_schema.routines
        WHERE routine_name = $1
        AND routine_schema = 'public'
      `, [functionName]);

      if (functionSource.rows.length > 0) {
        console.log('📝 트리거 함수 코드:');
        console.log(functionSource.rows[0].routine_definition);
      } else {
        console.log('❌ 함수 내용을 찾을 수 없습니다');
      }
    }

    console.log('\n🔍 3. 함수 소유권 확인...');
    const functionOwner = await client.query(`
      SELECT proname, proowner, rolname
      FROM pg_proc p
      JOIN pg_roles r ON p.proowner = r.oid
      WHERE proname = $1
    `, [functionName]);

    if (functionOwner.rows.length > 0) {
      console.log('함수 소유자:', functionOwner.rows[0].rolname);
    }

  } catch (error) {
    console.error('❌ 트리거 확인 실패:', error.message);
  } finally {
    client.release();
  }
}

checkTriggerFunction();