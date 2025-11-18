// 도메인 테이블 모든 제약조건 확인
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔍 도메인 테이블 모든 제약조건 확인...');

async function checkAllConstraints() {
  const client = await pool.connect();

  try {
    console.log('\n📋 도메인 테이블 모든 제약조건 확인...');
    const allConstraints = await client.query(`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      LEFT JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.table_name = 'domains'
        AND tc.table_schema = 'public'
      ORDER BY tc.constraint_type, tc.constraint_name;
    `);

    console.log('✅ 모든 제약조건:');
    allConstraints.rows.forEach(constraint => {
      if (constraint.constraint_type === 'FOREIGN KEY') {
        console.log(`   - ${constraint.constraint_name}: ${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
      } else {
        console.log(`   - ${constraint.constraint_name}: ${constraint.constraint_type} (${constraint.column_name || 'N/A'})`);
      }
    });

    // auth.users 테이블 존재 여부 확인
    const authUsersCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'auth'
        AND table_name = 'users'
      );
    `);
    console.log(`\n✅ auth.users 테이블 존재 여부: ${authUsersCheck.rows[0].exists}`);

    // users 테이블 존재 여부 확인 (public 스키마)
    const usersCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);
    console.log(`✅ public.users 테이블 존재 여부: ${usersCheck.rows[0].exists}`);

    // 수동으로 user_id 외래 키 제약조건 확인
    console.log('\n🔍 user_id 컬럼 외래 키 상세 확인...');
    const userIdFK = await client.query(`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.update_rule,
        rc.delete_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      JOIN information_schema.referential_constraints AS rc
        ON tc.constraint_name = rc.constraint_name
        AND tc.table_schema = rc.constraint_schema
      WHERE tc.table_name = 'domains'
        AND tc.table_schema = 'public'
        AND kcu.column_name = 'user_id'
        AND tc.constraint_type = 'FOREIGN KEY';
    `);

    if (userIdFK.rows.length > 0) {
      console.log('✅ user_id 외래 키 제약조건:');
      userIdFK.rows.forEach(constraint => {
        console.log(`   - ${constraint.constraint_name}: ${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name} (ON DELETE ${constraint.delete_rule})`);
      });
    } else {
      console.log('❌ user_id 외래 키 제약조건을 찾을 수 없습니다.');
    }

  } catch (error) {
    console.error('❌ 확인 실패:', error.message);
    console.error('상세 에러:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAllConstraints();