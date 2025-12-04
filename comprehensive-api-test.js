const fs = require('fs');
const path = require('path');
const { LeakJarClient } = require('./examples/api-client.js');

// 로그를 파일에 저장하는 함수
const logFile = path.join(__dirname, `api-test-results-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.txt`);
const stream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
  console.log(message);
  stream.write(message + '\n');
}

async function testBasicQuery(client) {
  log('\n🔍 Testing 1: Basic Query');
  log('========================');

  try {
    const result = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 3
    });

    if (result.success) {
      log('✅ Success: ' + result.data.length + ' records retrieved');
      log('📊 Total records: ' + (result.pagination?.total || 'Unknown'));
      log('🔑 Domain verified: ' + (result.domain_info?.is_verified || 'Unknown'));
      log('⏱️ Response time: ' + (result.meta?.response_time_ms || 'Unknown') + 'ms');

      log('\n📋 Retrieved Records:');
      result.data.forEach((record, i) => {
        log(`  ${i+1}. Email: ${record.email || record.id}`);
        log(`     Username: ${record.username || 'None'}`);
        log(`     Password: ${record.password ? '[HIDDEN]' : 'None'}`);
        log(`     Domain: ${record.domain}`);
        log(`     Source: ${record.source}`);
        log(`     Date: ${record.date_collected}`);
        log(`     Browser: ${record.browser || 'Unknown'}`);
        log(`     IP: ${record.ip_address || 'Unknown'}`);
        log(`     Has Password: ${record.has_password ? 'Yes' : 'No'}`);
        log('');
      });
    } else {
      log('❌ Error: ' + result.error);
      log('❌ Status: ' + (result.status || 'Unknown'));
    }
  } catch (error) {
    log('❌ Exception: ' + error.message);
  }
}

async function testVerifiedDomains(client) {
  log('\n🔍 Testing 2: Verified Domains');
  log('===============================');

  try {
    const result = await client.getVerifiedDomains();

    if (result.success) {
      log('✅ Success: ' + result.data.length + ' verified domains found');
      log('⏱️ Response time: ' + (result.meta?.response_time_ms || 'Unknown') + 'ms');

      log('\n📋 Verified Domain Details:');
      result.data.forEach((domain, i) => {
        log(`  ${i+1}. Domain: ${domain.domain}`);
        log(`     Type: ${domain.type}`);
        log(`     Verified: ${domain.is_verified ? 'Yes' : 'No'}`);
        log(`     API Accessible: ${domain.api_accessible ? 'Yes' : 'No'}`);
        log(`     Created: ${domain.created_at || 'Unknown'}`);
        log(`     Verified At: ${domain.verified_at || 'Not verified'}`);
        log('');
      });

      if (result.stats) {
        log('📊 Statistics: ' + JSON.stringify(result.stats, null, 2));
      }
    } else {
      log('❌ Error: ' + result.error);
    }
  } catch (error) {
    log('❌ Exception: ' + error.message);
  }
}

async function testAllDomains(client) {
  log('\n🔍 Testing 3: All Domains Status');
  log('=================================');

  try {
    const result = await client.getAllDomains();

    if (result.success) {
      log('✅ Success: ' + result.data.length + ' total domains found');
      log('⏱️ Response time: ' + (result.meta?.response_time_ms || 'Unknown') + 'ms');

      log('\n📋 All Domain Details:');
      result.data.forEach((domain, i) => {
        log(`  ${i+1}. Domain: ${domain.domain}`);
        log(`     Type: ${domain.type}`);
        log(`     Status: ${domain.is_verified ? '✅ Verified' : '⏳ Pending'}`);
        log(`     Monitoring: ${domain.monitoring_enabled ? '🟢 Enabled' : '🔴 Disabled'}`);
        log(`     API Access: ${domain.api_accessible ? '🔑 Available' : '🚫 Not Available'}`);
        log(`     Ownership: ${domain.ownership || 'Unknown'}`);
        log(`     Company: ${domain.company_name || 'Unknown'}`);
        log(`     Created: ${domain.created_at || 'Unknown'}`);
        if (domain.verified_at) {
          log(`     Verified: ${domain.verified_at}`);
        }
        log('');
      });

      if (result.stats) {
        log('📊 Complete Statistics:');
        log(JSON.stringify(result.stats, null, 2));
      }
    } else {
      log('❌ Error: ' + result.error);
    }
  } catch (error) {
    log('❌ Exception: ' + error.message);
  }
}

async function testDateRangeQuery(client) {
  log('\n🔍 Testing 4: Date Range Query');
  log('==============================');

  try {
    const result = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 5,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31'
    });

    if (result.success) {
      log('✅ Success: ' + result.data.length + ' records from 2024');
      log('📊 Total in range: ' + (result.pagination?.total || 'Unknown'));
      log('⏱️ Response time: ' + (result.meta?.response_time_ms || 'Unknown') + 'ms');

      if (result.data.length > 0) {
        log('📅 Date range: ' + result.data[0].date_collected + ' to ' + result.data[result.data.length-1].date_collected);

        log('\n📋 Sample Records from Date Range:');
        result.data.forEach((record, i) => {
          log(`  ${i+1}. ${record.email || record.id} - ${record.date_collected}`);
        });
      }
    } else {
      log('❌ Error: ' + result.error);
    }
  } catch (error) {
    log('❌ Exception: ' + error.message);
  }
}

async function testPagination(client) {
  log('\n🔍 Testing 5: Pagination');
  log('==========================');

  try {
    // Get first page
    const page1 = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 3,
      offset: 0
    });

    // Get second page
    const page2 = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 3,
      offset: 3
    });

    log('📄 Page 1 Results:');
    if (page1.success) {
      log('✅ Success: ' + page1.data.length + ' records');
      log('📊 Total records: ' + (page1.pagination?.total || 'Unknown'));
      log('🔄 Has more: ' + (page1.pagination?.has_more ? 'Yes' : 'No'));
      log('⏱️ Response time: ' + (page1.meta?.response_time_ms || 'Unknown') + 'ms');

      page1.data.forEach((record, i) => {
        log(`  ${i+1}. ${record.email || record.id}`);
      });
    } else {
      log('❌ Page 1 Error: ' + page1.error);
    }

    log('\n📄 Page 2 Results:');
    if (page2.success) {
      log('✅ Success: ' + page2.data.length + ' records');
      log('📊 Total records: ' + (page2.pagination?.total || 'Unknown'));
      log('🔄 Has more: ' + (page2.pagination?.has_more ? 'Yes' : 'No'));
      log('⏱️ Response time: ' + (page2.meta?.response_time_ms || 'Unknown') + 'ms');

      page2.data.forEach((record, i) => {
        log(`  ${i+1}. ${record.email || record.id}`);
      });
    } else {
      log('❌ Page 2 Error: ' + page2.error);
    }

    log('\n📊 Pagination Summary:');
    log('Different records between pages: ' + (
      page1.success && page2.success &&
      page1.data.length > 0 && page2.data.length > 0 &&
      page1.data[0].id !== page2.data[0].id ? '✅ Yes' : '❌ No'
    ));

  } catch (error) {
    log('❌ Exception: ' + error.message);
  }
}

async function testDataTypeFilters(client) {
  log('\n🔍 Testing 6: Data Type Filters');
  log('=================================');

  const types = ['email', 'username', 'password'];

  for (const type of types) {
    log(`\n📋 Testing ${type} filter:`);

    try {
      const result = await client.getLeakedData({
        domain: 'gmail.com',
        limit: 5,
        type: type
      });

      if (result.success) {
        log(`✅ Success: ${result.data.length} records with ${type} data`);

        result.data.forEach((record, i) => {
          const hasData = type === 'email' ? record.email :
                         type === 'username' ? record.username :
                         type === 'password' ? record.password : null;
          log(`  ${i+1}. ${record.email || record.id} - ${hasData ? 'Has ' + type : 'No ' + type}`);
        });
      } else {
        log(`❌ Error for ${type} filter: ${result.error}`);
      }
    } catch (error) {
      log(`❌ Exception for ${type} filter: ${error.message}`);
    }
  }
}

async function testLargeQuery(client) {
  log('\n🔍 Testing 7: Large Query (100 records)');
  log('=======================================');

  try {
    const result = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 100
    });

    if (result.success) {
      log('✅ Success: ' + result.data.length + ' records retrieved');
      log('📊 Total available: ' + (result.pagination?.total || 'Unknown'));
      log('⏱️ Response time: ' + (result.meta?.response_time_ms || 'Unknown') + 'ms');
      log('🔄 Has more: ' + (result.pagination?.has_more ? 'Yes' : 'No'));

      // Show sample of first 5 and last 5 records
      log('\n📋 First 5 records:');
      result.data.slice(0, 5).forEach((record, i) => {
        log(`  ${i+1}. ${record.email || record.id} - ${record.date_collected}`);
      });

      if (result.data.length > 10) {
        log('  ...');
        log('📋 Last 5 records:');
        result.data.slice(-5).forEach((record, i) => {
          log(`  ${result.data.length - 4 + i}. ${record.email || record.id} - ${record.date_collected}`);
        });
      }
    } else {
      log('❌ Error: ' + result.error);
    }
  } catch (error) {
    log('❌ Exception: ' + error.message);
  }
}

async function testInvalidDomain(client) {
  log('\n🔍 Testing 8: Invalid Domain (Error Handling)');
  log('==============================================');

  try {
    const result = await client.getLeakedData({
      domain: 'nonexistent-domain-12345.com',
      limit: 5
    });

    if (!result.success) {
      log('✅ Expected error occurred: ' + result.error);
      log('📊 Status code: ' + (result.status || 'Unknown'));
    } else {
      log('⚠️ Unexpected success - this should have failed');
    }
  } catch (error) {
    log('✅ Expected exception: ' + error.message);
  }
}

async function runAllTests() {
  const startTime = Date.now();
  const fileName = path.basename(logFile);

  // Initialize client at the top level
  const client = new LeakJarClient('lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C');

  log('🚀 LeakJar API Client - Comprehensive Test Suite');
  log('==================================================');
  log('Test started at: ' + new Date().toISOString());
  log('Results file: ' + fileName);
  log('API Client Version: v1.0');
  log('API Key: lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C');
  log('');

  try {
    // Test connection first
    log('🔍 Testing API Connection...');
    const testResult = await client.getVerifiedDomains();
    if (testResult.success) {
      log('✅ API Connection successful');
    } else {
      log('❌ API Connection failed: ' + testResult.error);
      return;
    }

    // Run all tests with client parameter
    await testBasicQuery(client);
    await testVerifiedDomains(client);
    await testAllDomains(client);
    await testDateRangeQuery(client);
    await testPagination(client);
    await testDataTypeFilters(client);
    await testLargeQuery(client);
    await testInvalidDomain(client);

    const endTime = Date.now();
    const duration = endTime - startTime;

    log('\n📊 Test Summary');
    log('================');
    log('Total test duration: ' + (duration / 1000).toFixed(2) + ' seconds');
    log('Test completed at: ' + new Date().toISOString());
    log('Results saved to: ' + fileName);
    log('');
    log('✅ All tests completed successfully!');

  } catch (error) {
    log('❌ Test suite failed: ' + error.message);
  } finally {
    stream.end();
    console.log('\n📁 Test results saved to: ' + logFile);
  }
}

// 메인 실행
runAllTests().catch(error => {
  console.error('❌ Fatal error:', error);
  stream.end();
});