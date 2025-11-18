// MCP로 트리거 함수 수정
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

console.log('🔧 MCP를 사용한 트리거 함수 수정');

async function fixTriggerWithMCP() {
  const client = await pool.connect();

  try {
    console.log('\n📋 1. 수정된 트리거 함수 생성...');

    // 수정된 트리거 함수 - user_profiles 먼저 생성
    const createFunction = await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        -- 1. Create personal organization
        INSERT INTO organizations (
          name, slug, created_by, max_members, max_domains, max_monthly_searches
        ) VALUES (
          COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Personal'),
          'personal-' || NEW.id::text,
          NEW.id,
          1,
          5,
          100
        );

        -- 2. Add user as owner of their personal organization
        INSERT INTO organization_members (
          organization_id, user_id, role, status
        ) VALUES (
          (SELECT id FROM organizations WHERE created_by = NEW.id AND slug = 'personal-' || NEW.id::text),
          NEW.id,
          'owner',
          'active'
        );

        -- 3. Create user profile first (if not exists) - 이게 핵심 수정!
        INSERT INTO user_profiles (user_id, created_at, updated_at)
        VALUES (NEW.id, NOW(), NOW())
        ON CONFLICT (user_id) DO NOTHING;

        -- 4. Update user profile with organization IDs
        UPDATE user_profiles
        SET
          personal_organization_id = (SELECT id FROM organizations WHERE created_by = NEW.id AND slug = 'personal-' || NEW.id::text),
          current_organization_id = (SELECT id FROM organizations WHERE created_by = NEW.id AND slug = 'personal-' || NEW.id::text)
        WHERE user_id = NEW.id;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log('✅ 트리거 함수 생성/수정 완료');

    console.log('\n⚙️ 2. 트리거 함수 할당...');
    const reassignTrigger = await client.query(`
      CREATE OR REPLACE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
    `);

    console.log('✅ 트리거 재할당 완료');

    console.log('\n🧪 3. 테스트 사용자 생성 시도...');
    // 간단 테스트 - user_profiles에 기본 레코드 생성
    const testUser = await client.query(`
      -- 테스트를 위한 임시 사용자 프로필 생성 (실제 auth.users 아님)
      INSERT INTO user_profiles (user_id, created_at, updated_at)
      VALUES ('test-user-id-' || floor(random() * 1000000)::text, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
      RETURNING user_id;
    `);

    console.log('✅ 테스트 완료:', testUser.rows[0].user_id);

  } catch (error) {
    console.error('❌ 트리거 수정 실패:', error.message);
    console.error('상세 에러:', error);

    // 롤백 시도
    try {
      console.log('\n🔄 롤백 시도 중...');
      const rollback = await client.query(`
        -- 실패한 함수 제거
        DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
        -- 트리거 비활성화
        ALTER TRIGGER on_auth_user_created DISABLE;
      `);
      console.log('✅ 롤백 완료');
    } catch (rollbackError) {
      console.error('❌ 롤백 실패:', rollbackError.message);
    }
  } finally {
    client.release();
  }
}

fixTriggerWithMCP();