// ClickHouse 연결 확인 스크립트
require('dotenv').config();

const clickhouseConfig = {
  host: process.env.NEXT_PUBLIC_CLICKHOUSE_HOST,
  port: process.env.CLICKHOUSE_PORT,
  username: process.env.NEXT_PUBLIC_CLICKHOUSE_USERNAME,
  password: process.env.NEXT_PUBLIC_CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DB || 'leaked_data',
  protocol: process.env.CLICKHOUSE_PROTOCOL || 'http'
};

console.log('🔍 ClickHouse 환경변수 확인:');
console.log('Host:', clickhouseConfig.host ? '✅ 설정됨' : '❌ 없음');
console.log('Port:', clickhouseConfig.port ? '✅ 설정됨' : '❌ 없음');
console.log('Username:', clickhouseConfig.username ? '✅ 설정됨' : '❌ 없음');
console.log('Password:', clickhouseConfig.password ? '✅ 설정됨' : '❌ 없음');
console.log('Database:', clickhouseConfig.database);
console.log('Protocol:', clickhouseConfig.protocol);

// ClickHouse 연결 테스트
async function testClickHouseConnection() {
  try {
    // Node.js 환경에서는 ClickHouse 네이티브 클라이언트 필요
    // 여기서는 HTTP API를 사용한 간단한 연결 테스트
    const baseUrl = `${clickhouseConfig.protocol}://${clickhouseConfig.host}:${clickhouseConfig.port}`;

    console.log('\n🚀 ClickHouse 연결 시도...');
    console.log('URL:', baseUrl);

    // 기본 쿼리 테스트
    const testQuery = 'SELECT 1 as test';
    console.log('테스트 쿼리:', testQuery);

    // 현재는 설정값만 확인하고 연결은 서버사이드에서 테스트
    console.log('\n✅ ClickHouse 환경변수 설정 확인 완료');
    console.log('📝 실제 연결 테스트는 서버사이드 API에서 진행 필요');

  } catch (error) {
    console.error('❌ ClickHouse 연결 테스트 실패:', error.message);
  }
}

testClickHouseConnection();