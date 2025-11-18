// PostgreSQL 직접 연결로 데이터베이스 구조 확인
require('dotenv').config();

const { Pool } = require('pg');

// PostgreSQL 직접 연결
const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔍 PostgreSQL 직접 연결로 데이터베이스 구조 확인');

async function checkDatabaseStructure() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. auth.users 테이블 구조 확인...');
    const usersSchema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND table_schema = 'auth'
      ORDER BY ordinal_position
    `);

    console.log('auth.users 칼럼들:');
    usersSchema.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL 허용' : 'NOT NULL'})`);
    });

    console.log('\n👤 2. public.user_profiles 테이블 구조 확인...');
    const profilesSchema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'user_profiles' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    console.log('public.user_profiles 칼럼들:');
    profilesSchema.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL 허용' : 'NOT NULL'})${col.column_default ? ` 기본값: ${col.column_default}` : ''}`);
    });

    console.log('\n⚙️ 3. 트리거 확인...');
    const triggers = await client.query(`
      SELECT trigger_name, event_manipulation, event_object_table, action_timing, action_condition
      FROM information_schema.triggers
      WHERE event_object_table IN ('users', 'user_profiles')
      ORDER BY trigger_name
    `);

    if (triggers.rows.length > 0) {
      console.log('관련 트리거들:');
      triggers.rows.forEach(trigger => {
        console.log(`   - ${trigger.trigger_name}: ${trigger.action_timing} ${trigger.event_manipulation} on ${trigger.event_object_table}`);
      });
    } else {
      console.log('   ❌ users 또는 user_profiles 관련 트리거 없음');
    }

    console.log('\n🔒 4. RLS 정책 확인...');
    const policies = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd
      FROM pg_policies
      WHERE tablename = 'users' AND schemaname = 'auth'
      ORDER BY policyname
    `);

    if (policies.rows.length > 0) {
      console.log('auth.users RLS 정책들:');
      policies.rows.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd} (${policy.permissive ? 'Permissive' : 'Restrictive'})`);
      });
    } else {
      console.log('   ❌ auth.users 관련 RLS 정책 없음');
    }

    console.log('\n🔗 5. 외래 키 제약조건 확인...');
    const foreignKeys = await client.query(`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND (tc.table_name = 'user_profiles' OR ccu.table_name = 'user_profiles')
      ORDER BY tc.table_name;
    `);

    if (foreignKeys.rows.length > 0) {
      console.log('외래 키 제약조건들:');
      foreignKeys.rows.forEach(fk => {
        console.log(`   - ${fk.constraint_name}: ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('   ❌ user_profiles 관련 외래 키 제약조건 없음');
    }

    console.log('\n✅ 데이터베이스 구조 확인 완료');

  } catch (error) {
    console.error('❌ 데이터베이스 확인 실패:', error.message);
  } finally {
    client.release();
  }
}

checkDatabaseStructure();