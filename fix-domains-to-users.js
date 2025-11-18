// 도메인 테이블 외래 키 제약조건을 users 테이블로 수정
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔧 도메인 테이블 외래 키 제약조건을 users 테이블로 수정');

async function fixDomainsToUsersFK() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. users 테이블 구조 확인...');
    const usersStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);

    console.log('✅ users 테이블 구조:');
    usersStructure.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });

    console.log('\n📋 2. 현재 외래 키 제약조건 확인...');
    const fkConstraints = await client.query(`
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
        AND tc.table_name = 'domains'
        AND tc.table_schema = 'public'
        AND kcu.column_name = 'user_id';
    `);

    console.log('✅ 현재 user_id 외래 키 제약조건:');
    if (fkConstraints.rows.length > 0) {
      fkConstraints.rows.forEach(constraint => {
        console.log(`   - ${constraint.constraint_name}: ${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
      });
    } else {
      console.log('   - user_id 외래 키 제약조건을 찾을 수 없음');
    }

    console.log('\n🔧 3. 손상된 외래 키 제약조건 삭제...');
    const dropFK = await client.query(`
      ALTER TABLE domains
      DROP CONSTRAINT IF EXISTS domains_user_id_fkey;
    `);

    console.log('✅ 손상된 외래 키 제약조건 삭제 완료');

    console.log('\n🔧 4. users 테이블을 참조하는 새 외래 키 생성...');
    const createFK = await client.query(`
      ALTER TABLE domains
      ADD CONSTRAINT domains_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE;
    `);

    console.log('✅ 새 외래 키 생성 완료');

    console.log('\n🧪 5. 수정된 제약조건 확인...');
    const updatedFK = await client.query(`
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
        AND tc.table_name = 'domains'
        AND tc.table_schema = 'public'
        AND kcu.column_name = 'user_id';
    `);

    console.log('✅ 수정된 user_id 외래 키 제약조건:');
    if (updatedFK.rows.length > 0) {
      updatedFK.rows.forEach(constraint => {
        console.log(`   - ${constraint.constraint_name}: ${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
      });
    }

    console.log('\n🧪 6. users 테이블 샘플 데이터 확인...');
    const sampleUsers = await client.query(`
      SELECT id, email, created_at
      FROM users
      LIMIT 3;
    `);

    console.log('✅ users 테이블 샘플 데이터:');
    sampleUsers.rows.forEach(user => {
      console.log(`   - ID: ${user.id}, Email: ${user.email}`);
    });

    console.log('\n🎉 도메인 테이블 외래 키 제약조건 수정이 성공적으로 완료되었습니다!');

  } catch (error) {
    console.error('❌ 외래 키 수정 실패:', error.message);
    console.error('상세 에러:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixDomainsToUsersFK();