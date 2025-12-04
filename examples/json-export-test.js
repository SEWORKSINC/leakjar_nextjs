/**
 * JSON Export Test with Sample Data
 * This demonstrates the JSON export functionality
 */

const { saveToJsonFile } = require('./api-client.js');
const fs = require('fs');
const path = require('path');

// Generate sample leaked data
function generateSampleData(count = 50) {
  const data = [];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const sources = ['breach1', 'breach2', 'breach3', 'darkweb', 'phishing'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Mobile'];

  for (let i = 0; i < count; i++) {
    const hasEmail = Math.random() > 0.3;
    const hasUsername = Math.random() > 0.4;
    const hasPassword = Math.random() > 0.5;

    data.push({
      id: `record_${i + 1}`,
      email: hasEmail ? `user${i + 1}@${domains[Math.floor(Math.random() * domains.length)]}` : null,
      username: hasUsername ? `user${i + 1}_${Math.floor(Math.random() * 1000)}` : null,
      password: hasPassword ? '********' : null,
      has_password: hasPassword,
      domain: domains[Math.floor(Math.random() * domains.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      date_collected: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      data_type: ['email', 'username', 'password'][Math.floor(Math.random() * 3)]
    });
  }

  return data;
}

// Test JSON export functionality
async function testJsonExport() {
  console.log('🧪 JSON 내보내기 기능 테스트');
  console.log('==========================\n');

  try {
    // 샘플 데이터 생성
    console.log('샘플 데이터 생성 중...');
    const sampleData = generateSampleData(25);

    // 타임스탬프 생성
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // 1. 단일 파일 저장 테스트
    console.log('1. 단일 파일 저장 테스트...');
    const singleFile = `test-single-export-${timestamp}.json`;
    saveToJsonFile(sampleData, singleFile);

    // 2. 메타데이터 포함 내보내기 테스트
    console.log('\n2. 메타데이터 포함 내보내기 테스트...');
    const exportData = {
      export_info: {
        domain: 'test-domain.com',
        export_timestamp: new Date().toISOString(),
        total_records: sampleData.length,
        export_type: 'sample_test',
        api_version: 'v1'
      },
      data_summary: {
        records_with_emails: sampleData.filter(r => r.email).length,
        records_with_usernames: sampleData.filter(r => r.username).length,
        records_with_passwords: sampleData.filter(r => r.has_password).length,
        unique_sources: [...new Set(sampleData.map(r => r.source))],
        unique_domains: [...new Set(sampleData.map(r => r.domain))]
      },
      records: sampleData
    };

    const metaFile = `test-meta-export-${timestamp}.json`;
    saveToJsonFile(exportData, metaFile);

    // 3. 여러 배치 파일 저장 테스트
    console.log('\n3. 여러 배치 파일 저장 테스트...');
    const batchSize = 10;
    let batchIndex = 1;

    for (let i = 0; i < sampleData.length; i += batchSize) {
      const batch = sampleData.slice(i, i + batchSize);
      const batchFileName = `test-batch-${batchIndex}-${timestamp}.json`;

      const batchInfo = {
        batch_number: batchIndex,
        batch_size: batch.length,
        total_batches: Math.ceil(sampleData.length / batchSize),
        records: batch
      };

      saveToJsonFile(batchInfo, batchFileName);
      batchIndex++;
    }

    // 4. 결과 요약
    console.log('\n📊 테스트 결과 요약:');
    console.log(`✅ 생성된 레코드 수: ${sampleData.length}`);
    console.log(`✅ 이메일 포함 레코드: ${exportData.data_summary.records_with_emails}`);
    console.log(`✅ 사용자명 포함 레코드: ${exportData.data_summary.records_with_usernames}`);
    console.log(`✅ 비밀번호 포함 레코드: ${exportData.data_summary.records_with_passwords}`);
    console.log(`✅ 고유 소스 수: ${exportData.data_summary.unique_sources.length}`);
    console.log(`✅ 고유 도메인 수: ${exportData.data_summary.unique_domains.length}`);

    console.log('\n📁 생성된 파일:');
    console.log(`• 단일 파일: exports/${singleFile}`);
    console.log(`• 메타데이터 파일: exports/${metaFile}`);
    console.log(`• 배치 파일: exports/test-batch-*-${timestamp}.json (${Math.ceil(sampleData.length / batchSize)}개 파일)`);

    // 5. 파일 크기 확인
    const exportsDir = path.join(__dirname, 'exports');
    if (fs.existsSync(exportsDir)) {
      const files = fs.readdirSync(exportsDir).filter(file => file.includes(timestamp));
      let totalSize = 0;

      files.forEach(file => {
        const filePath = path.join(exportsDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        console.log(`• ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
      });

      console.log(`\n📈 전체 파일 크기: ${(totalSize / 1024).toFixed(2)} KB`);
    }

    console.log('\n🎉 JSON 내보내기 기능 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  }
}

// 테스트 실행
if (require.main === module) {
  testJsonExport();
}

module.exports = { testJsonExport, generateSampleData };