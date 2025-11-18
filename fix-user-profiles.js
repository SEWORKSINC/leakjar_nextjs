// user_profiles 외래 키 문제 해결
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔧 user_profiles 외래 키 제약조건 해결');

async function fixUserProfilesFK() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. 현재 외래 키 제약조건 확인...');
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
        AND tc.table_name = 'user_profiles'
        AND tc.table_schema = 'public';
    `);

    console.log('✅ 현재 외래 키 제약조건:');
    fkConstraints.rows.forEach(constraint => {
      console.log(`   - ${constraint.constraint_name}: ${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
    });

    console.log('\n🔧 2. 문제 외래 키 제약조건 삭제...');
    // user_profiles_user_id_fkey 제약조건 삭제
    const dropFK = await client.query(`
      ALTER TABLE user_profiles
      DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
    `);

    console.log('✅ 외래 키 제약조건 삭제 완료');

    console.log('\n🔧 3. auth.users를 참조하는 새 외래 키 생성...');
    const createFK = await client.query(`
      ALTER TABLE user_profiles
      ADD CONSTRAINT user_profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id)
      ON DELETE CASCADE;
    `);

    console.log('✅ 새 외래 키 생성 완료');

    console.log('\n🧪 4. 테스트 프로필 생성...');
    const testProfile = await client.query(`
      INSERT INTO user_profiles (user_id, created_at, updated_at, role)
      VALUES ('test-user-id-123', NOW(), NOW(), 'USER')
      ON CONFLICT (user_id) DO UPDATE SET
        updated_at = NOW(),
        role = EXCLUDED.role
      RETURNING user_id, role;
    `);

    console.log('✅ 테스트 프로필 생성 성공:', testProfile.rows[0]);

    // 테스트 프로필 삭제
    await client.query(`
      DELETE FROM user_profiles WHERE user_id = 'test-user-id-123';
    `);

    console.log('✅ 테스트 프로필 정리 완료');

  } catch (error) {
    console.error('❌ 외래 키 수정 실패:', error.message);
    console.error('상세 에러:', error);
  } finally {
    client.release();
  }
}

fixUserProfilesFK();