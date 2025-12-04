const http = require('http');
const crypto = require('crypto');

// API 설정
const API_BASE_URL = 'localhost:3000';
const API_KEY = 'lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C';

// 도메인 테스트
const testDomain = 'roblox.com';

// POST 요청 함수
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      rejectUnauthorized: false // 개발 환경에서 SSL 인증서 무시
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testRobloxDotCom() {
  console.log(`🔍 Testing ${testDomain} API access...`);
  console.log('=====================================');

  try {
    // roblox.com 데이터 조회 테스트
    const response = await makeRequest(`/api/v1/leaked-data?domain=${testDomain}&limit=5`);

    console.log(`📊 Status Code: ${response.statusCode}`);

    if (response.statusCode === 200) {
      console.log('✅ Success! API returned data:');
      console.log('Total records:', response.data.pagination?.total || 'N/A');
      console.log('Data count:', response.data.data?.length || 0);

      if (response.data.data && response.data.data.length > 0) {
        console.log('\n📋 Sample records:');
        response.data.data.forEach((record, index) => {
          console.log(`\nRecord ${index + 1}:`);
          console.log(`  Domain: ${record.domain}`);
          console.log(`  Username: ${record.username || 'N/A'}`);
          console.log(`  Has Password: ${record.has_password ? 'Yes' : 'No'}`);
          console.log(`  Date: ${record.date_collected}`);
        });
      }

      console.log('\n🎉 ClickHouse field mapping issue has been resolved!');
    } else {
      console.log('❌ Error response:');
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('💥 Request failed:', error.message);
  }
}

// 테스트 실행
testRobloxDotCom().catch(console.error);