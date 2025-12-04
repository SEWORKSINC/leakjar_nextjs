const { LeakJarClient } = require('./api-client.js');
const client = new LeakJarClient('lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C');

async function testUrlDomain() {
  console.log('🔍 Testing URL domain (roblox.com)...');

  try {
    const result = await client.getLeakedData({
      domain: 'roblox.com',
      limit: 10
    });

    console.log(`Success: ${result.success}`);
    console.log(`Records: ${result.data ? result.data.length : 0}`);
    console.log(`Total: ${result.pagination?.total || 'unknown'}`);

    if (result.success && result.data && result.data.length > 0) {
      console.log(`\nFirst record:`);
      console.log(`  ID: ${result.data[0].id}`);
      console.log(`  Email: ${result.data[0].email}`);
      console.log(`  Username: ${result.data[0].username}`);
      console.log(`  Domain: ${result.data[0].domain}`);
      console.log(`  Date: ${result.data[0].date_collected}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUrlDomain().catch(console.error);