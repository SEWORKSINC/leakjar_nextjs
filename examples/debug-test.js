const { LeakJarClient } = require('./api-client.js');
const client = new LeakJarClient('lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C');

async function debugTest() {
  console.log('🔍 Debugging data retrieval...');

  const testCases = [
    { name: 'No date filter', params: { domain: 'gmail.com', limit: 10 } },
    { name: 'From 2020', params: { domain: 'gmail.com', limit: 10, dateFrom: '2020-01-01' } },
    { name: 'From 2022', params: { domain: 'gmail.com', limit: 10, dateFrom: '2022-01-01' } },
    { name: 'From 2023', params: { domain: 'gmail.com', limit: 10, dateFrom: '2023-01-01' } },
    { name: 'From 2024', params: { domain: 'gmail.com', limit: 10, dateFrom: '2024-01-01' } },
    { name: 'Offset 1000', params: { domain: 'gmail.com', limit: 10, offset: 1000 } },
    { name: 'Offset 5000', params: { domain: 'gmail.com', limit: 10, offset: 5000 } },
    { name: 'Offset 10000', params: { domain: 'gmail.com', limit: 10, offset: 10000 } }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n📋 ${testCase.name}:`);
      const result = await client.getLeakedData(testCase.params);

      if (result.success) {
        console.log(`  Success: ${result.data.length} records`);
        console.log(`  Total: ${result.pagination?.total || 'unknown'}`);
        if (result.data.length > 0) {
          console.log(`  First record date: ${result.data[0].date_collected}`);
          console.log(`  First record email: ${result.data[0].email || 'No email'}`);
        }
      } else {
        console.log(`  Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

debugTest().catch(console.error);