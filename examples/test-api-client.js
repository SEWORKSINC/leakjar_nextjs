const { LeakJarClient } = require('./api-client.js');
const client = new LeakJarClient('lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C');

async function testBasicQuery() {
  console.log('🔍 Testing 1: Basic Query');
  try {
    const result = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 3
    });
    if (result.success) {
      console.log('✅ Success:', result.data.length, 'records');
      console.log('📊 Total:', result.pagination?.total);
      console.log('🔑 Domain verified:', result.domain_info?.is_verified);
      result.data.forEach((record, i) => {
        console.log(`  Record ${i+1}: ${record.email || record.id} - ${record.date_collected}`);
      });
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

async function testVerifiedDomains() {
  console.log('\n🔍 Testing 2: Verified Domains');
  try {
    const result = await client.getVerifiedDomains();
    if (result.success) {
      console.log('✅ Success:', result.data.length, 'verified domains');
      result.data.forEach((domain, i) => {
        console.log(`  ${i+1}. ${domain.domain} (${domain.type}) - Verified: ${domain.is_verified}`);
      });
      console.log('📊 Stats:', result.stats);
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

async function testAllDomains() {
  console.log('\n🔍 Testing 3: All Domains Status');
  try {
    const result = await client.getAllDomains();
    if (result.success) {
      console.log('✅ Success:', result.data.length, 'total domains');
      result.data.forEach((domain, i) => {
        console.log(`  ${i+1}. ${domain.domain} (${domain.type}) - Status: ${domain.is_verified ? 'Verified' : 'Pending'}`);
      });
      console.log('📊 Stats:', result.stats);
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

async function testDateRangeQuery() {
  console.log('\n🔍 Testing 4: Date Range Query');
  try {
    const result = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 5,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31'
    });
    if (result.success) {
      console.log('✅ Success:', result.data.length, 'records from 2024');
      console.log('📊 Total in range:', result.pagination?.total);
      if (result.data.length > 0) {
        console.log('📅 Date range:', result.data[0].date_collected, 'to', result.data[result.data.length-1].date_collected);
      }
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

async function testPagination() {
  console.log('\n🔍 Testing 5: Pagination');
  try {
    const page1 = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 3,
      offset: 0
    });

    const page2 = await client.getLeakedData({
      domain: 'gmail.com',
      limit: 3,
      offset: 3
    });

    if (page1.success && page2.success) {
      console.log('✅ Page 1:', page1.data.length, 'records');
      console.log('✅ Page 2:', page2.data.length, 'records');
      console.log('📊 Total records:', page1.pagination?.total);
      console.log('🔄 Has more after page 1:', page1.pagination?.has_more);
      console.log('🔄 Has more after page 2:', page2.pagination?.has_more);
    } else {
      console.log('❌ Pagination error');
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 LeakJar API Client - All Menu Tests');
  console.log('==========================================');

  await testBasicQuery();
  await testVerifiedDomains();
  await testAllDomains();
  await testDateRangeQuery();
  await testPagination();

  console.log('\n✅ All tests completed!');
}

runAllTests().catch(console.error);