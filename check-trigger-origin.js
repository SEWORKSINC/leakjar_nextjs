// 트리거 생성자와 내용 확인
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔍 on_auth_user_created 트리거 생성자 확인');

async function checkTriggerOrigin() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. pg_trigger에서 트리거 정보 확인...');
    const triggerInfo = await client.query(`
      SELECT
        tgname as trigger_name,
        tgrelid::regproc as function_name,
        tgenabled as enabled,
        tgfoid::regprocedure as function_schema,
        tgfoid::regproc as function_name
      FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
    `);

    if (triggerInfo.rows.length === 0) {
      console.log('❌ 트리거를 찾을 수 없습니다');
      return;
    }

    const trigger = triggerInfo.rows[0];
    console.log('✅ 트리거 정보:');
    console.log(`   - 이름: ${trigger.trigger_name}`);
    console.log(`   - 함수 OID: ${trigger.function_name}`);
    console.log(`   - 활성화: ${trigger.enabled}`);

    console.log('\n📝 2. pg_proc에서 함수 정보 확인...');
    const functionInfo = await client.query(`
      SELECT
        proname as function_name,
        pronamespace as function_schema,
        proowner::regrole as owner_role,
        prosrc as function_source
      FROM pg_proc
      WHERE proname = 'handle_new_user'
    `);

    if (functionInfo.rows.length > 0) {
      const func = functionInfo.rows[0];
      console.log('✅ 함수 정보:');
      console.log(`   - 이름: ${func.function_name}`);
      console.log(`   - 스키마: ${func.function_schema}`);
      console.log(`   - 소유자: ${func.owner_role}`);

      if (func.function_source) {
        console.log('\n📋 함수 내용:');
        console.log(func.function_source);
      }
    }

    console.log('\n🏢 3. 생성자 확인 (Supabase 기본인지 확인)...');
    const defaultFunctions = [
      'auth.trigger_on_auth_user_created',
      'auth.handle_new_user',
      'extensions.supabase_auth_admin'
    ];

    if (functionInfo.rows.length > 0) {
      const funcName = functionInfo.rows[0].function_name;
      const funcNamespace = functionInfo.rows[0].function_schema;

      console.log(`✅ 현재 함수: ${funcSchema}.${funcName}`);

      // Supabase 기본 함수 패턴 확인
      const isSupabaseDefault = funcNamespace === 'auth' ||
                              funcName.includes('trigger_') ||
                              funcName.includes('handle_new_') ||
                              funcName.includes('supabase_');

      if (isSupabaseDefault) {
        console.log('🎯 이것은 Supabase 기본 함수일 가능성이 높습니다');
      } else {
        console.log('🔧 이것은 수동으로 생성된 함수일 수 있습니다');
      }
    }

    console.log('\n⏰ 4. 트리거 생성 시간 확인...');
    const creationInfo = await client.query(`
      SELECT
        obj_description(oid) as description,
        obj_type(oid) as type
      FROM pg_class
      WHERE oid = (
        SELECT tgrelid FROM pg_trigger WHERE tgname = 'on_auth_user_created'
      )
    `);

    if (creationInfo.rows.length > 0) {
      console.log('트리거 타입:', creationInfo.rows[0].type);
    }

  } catch (error) {
    console.error('❌ 확인 실패:', error.message);
  } finally {
    client.release();
  }
}

checkTriggerOrigin();