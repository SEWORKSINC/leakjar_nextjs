// Supabase Auth 연결 테스트
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 연결 테스트');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? '설정됨' : '없음');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경변수가 설정되지 않았습니다');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. 간단한 연결 테스트
async function testConnection() {
  try {
    console.log('\n🚀 기본 연결 테스트...');
    const { data, error } = await supabase.from('users').select('count');

    if (error) {
      console.log('⚠️  users 테이블 접근 에러:', error.message);
    } else {
      console.log('✅ 기본 연결 성공');
    }
  } catch (err) {
    console.error('❌ 연결 실패:', err.message);
  }
}

// 2. 회원가입 테스트 (실제 가입은 안 함)
async function testSignupEndpoint() {
  try {
    console.log('\n📝 회원가입 엔드포인트 테스트...');

    // 테스트용 데이터
    const testData = {
      email: `test${Date.now()}@example.com`,
      password: 'test123456',
      options: {
        data: {
          name: 'Test User'
        }
      }
    };

    console.log('테스트 데이터:', {
      email: testData.email,
      password: testData.password ? '설정됨' : '없음'
    });

    const { data, error } = await supabase.auth.signUp(testData);

    if (error) {
      console.error('❌ 회원가입 에러:', {
        message: error.message,
        status: error.status,
        code: error.code || 'N/A'
      });

      // 자세한 에러 정보
      if (error.message.includes('Database error')) {
        console.log('🔍 이것은 Supabase 데이터베이스 문제일 수 있습니다');
      } else if (error.message.includes('Invalid')) {
        console.log('🔍 이것은 설정 문제일 수 있습니다');
      }
    } else {
      console.log('✅ 회원가입 성공 (테스트)');
      console.log('데이터:', data);

      // 즉시 삭제 (클린업)
      if (data.user?.id) {
        console.log('🧹 테스트 유저 삭제...');
        await supabase.auth.admin.deleteUser(data.user.id);
      }
    }
  } catch (err) {
    console.error('❌ 회원가입 테스트 실패:', err.message);
  }
}

// 실행
async function runTests() {
  await testConnection();
  await testSignupEndpoint();
}

runTests();