/**
 * LeakJar API Client Example
 * This example demonstrates how to use the LeakJar API to retrieve leaked data
 */

const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_KEY = 'lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C'; // Your API key

// Helper function to save data to JSON file
function saveToJsonFile(data, filename, subfolder = 'exports') {
  try {
    const exportsDir = path.join(__dirname, subfolder);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const filePath = path.join(exportsDir, filename);
    const jsonString = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonString, 'utf8');
    console.log(`✅ Data saved successfully: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`❌ File save failed: ${filename}`, error.message);
    return null;
  }
}

// Helper function to append data to existing JSON file
function appendToJsonFile(newData, filename, subfolder = 'exports') {
  try {
    const exportsDir = path.join(__dirname, subfolder);
    const filePath = path.join(exportsDir, filename);

    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    }

    existingData.push(...newData);

    const jsonString = JSON.stringify(existingData, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf8');

    return filePath;
  } catch (error) {
    console.error(`❌ File append failed: ${filename}`, error.message);
    return null;
  }
}

class LeakJarClient {
  constructor(apiKey, baseUrl = API_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Make authenticated API request with detailed logging
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log(`\n📡 API Request Details:`);
    console.log(`  🔗 URL: ${url}`);
    console.log(`  🔑 Method: ${options.method || 'GET'}`);
    console.log(`  📋 Headers: ${JSON.stringify({
      'Authorization': 'Bearer [HIDDEN]',
      'Content-Type': headers['Content-Type']
    }, null, 2)}`);
    if (options.body) {
      console.log(`  📦 Body: ${options.body}`);
    }

    const startTime = Date.now();

    try {
      console.log(`\n⏳ Sending request...`);
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const responseTime = Date.now() - startTime;
      console.log(`\n📥 Response Details:`);
      console.log(`  🎯 Status: ${response.status} ${response.statusText}`);
      console.log(`  ⏱️ Response time: ${responseTime}ms`);

      const data = await response.json();

      if (!response.ok) {
        console.log(`\n❌ API Error Response:`);
        console.log(`  💬 Error: ${data.error || response.statusText}`);
        console.log(`  📄 Full response: ${JSON.stringify(data, null, 2)}`);
        throw new Error(`API Error: ${data.error || response.statusText}`);
      }

      console.log(`\n✅ API Success Response:`);
      console.log(JSON.stringify(data, null, 2));

      return data;
    } catch (error) {
      console.error(`\n💥 Request Failed:`);
      console.error(`  🚨 Error: ${error.message}`);
      console.error(`  ⏱️ Time elapsed: ${Date.now() - startTime}ms`);
      throw error;
    }
  }

  /**
   * Get leaked data by domain
   * @param {Object} params - Query parameters
   * @param {string} params.domain - Domain to search (required)
   * @param {number} params.limit - Number of records to return (default: 100, max: 1000)
   * @param {number} params.offset - Number of records to skip (default: 0)
   * @param {string} params.dateFrom - Start date filter (YYYY-MM-DD)
   * @param {string} params.dateTo - End date filter (YYYY-MM-DD)
   * @param {string} params.type - Data type filter (email, username, password)
   */
  async getLeakedData(params) {
    const queryParams = new URLSearchParams();

    // Required parameter
    if (!params.domain) {
      throw new Error('Domain parameter is required');
    }
    queryParams.append('domain', params.domain);

    // Optional parameters
    if (params.limit) {
      queryParams.append('limit', Math.min(params.limit, 1000).toString());
    }
    if (params.offset) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params.dateFrom) {
      queryParams.append('date_from', params.dateFrom);
    }
    if (params.dateTo) {
      queryParams.append('date_to', params.dateTo);
    }
    if (params.type) {
      queryParams.append('type', params.type);
    }

    const endpoint = `/leaked-data?${queryParams.toString()}`;
    return this.request(endpoint);
  }

  /**
   * Get all leaked data for a domain (with automatic pagination)
   * @param {string} domain - Domain to search
   * @param {Object} options - Additional options
   */
  async getAllLeakedData(domain, options = {}) {
    const allData = [];
    let offset = 0;
    const limit = options.limit || 100;

    console.log(`Fetching all leaked data for domain: ${domain}`);

    while (true) {
      console.log(`Fetching records ${offset} to ${offset + limit - 1}...`);

      const result = await this.getLeakedData({
        domain,
        limit,
        offset,
        ...options,
      });

      if (result.success && result.data) {
        allData.push(...result.data);

        // Check if there are more records
        if (!result.pagination?.has_more || allData.length >= result.pagination.total) {
          break;
        }

        offset += limit;
      } else {
        break;
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Total records fetched: ${allData.length}`);
    return allData;
  }

  
  /**
   * Get user's verified domains for API access
   */
  async getVerifiedDomains() {
    return this.request('/domains');
  }

  /**
   * Get all user's domains with verification status
   */
  async getAllDomains() {
    return this.request('/domains/all');
  }

  /**
   * Check if domain is accessible before making data request
   */
  async checkDomainAccess(domain) {
    try {
      const domainsResult = await this.getVerifiedDomains();
      if (domainsResult.success) {
        const accessibleDomains = domainsResult.data.map(d => d.domain);
        return {
          accessible: accessibleDomains.includes(domain),
          accessibleDomains,
          domainInfo: domainsResult.data.find(d => d.domain === domain)
        };
      }
      return { accessible: false, accessibleDomains: [] };
    } catch (error) {
      console.error('Failed to check domain access:', error);
      return { accessible: false, accessibleDomains: [] };
    }
  }
}

// Example usage functions
async function example1_BasicQuery() {
  console.log('\n=== Example 1: Domain Access Check + Query ===');

  const client = new LeakJarClient(API_KEY);
  const domain = 'gmail.com'; // Use a verified domain from the test

  try {
    // First, check if domain is accessible
    console.log(`Checking access to domain: ${domain}`);
    const accessCheck = await client.checkDomainAccess(domain);

    if (!accessCheck.accessible) {
      console.log(`❌ Domain ${domain} is not accessible via API`);
      console.log('Accessible domains:', accessCheck.accessibleDomains);
      return;
    }

    console.log(`✅ Domain ${domain} is accessible (verified: ${accessCheck.domainInfo?.verified_at})`);

    // Now make the actual data request
    const result = await client.getLeakedData({
      domain: domain,
      limit: 10,
    });

    console.log('\nAPI Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log(`\nFound ${result.data.length} records`);
      console.log(`Total available: ${result.pagination.total}`);

      // Display domain verification info
      if (result.domain_info) {
        console.log(`\nDomain Verification Info:`);
        console.log(`  Domain: ${result.domain_info.domain}`);
        console.log(`  Type: ${result.domain_info.type}`);
        console.log(`  Verified: ${result.domain_info.is_verified}`);
        console.log(`  Domain ID: ${result.domain_info.domain_id}`);
      }

      // Display first few records
      result.data.forEach((record, index) => {
        console.log(`\nRecord ${index + 1}:`);
        console.log(`  Email: ${record.email}`);
        console.log(`  Username: ${record.username}`);
        console.log(`  Has Password: ${record.has_password}`);
        console.log(`  Domain: ${record.domain}`);
        console.log(`  Date: ${record.date_collected}`);
      });
    }
  } catch (error) {
    console.error('Example 1 failed:', error.message);
  }
}

async function example2_DateRangeQuery() {
  console.log('\n=== Example 2: Date Range Query ===');

  const client = new LeakJarClient(API_KEY);

  try {
    const result = await client.getLeakedData({
      domain: 'gmail.com', // Use a verified domain from the test
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      type: 'email', // Only get records with emails
      limit: 20,
    });

    console.log(`Found ${result.data.length} email records in date range`);

    result.data.forEach((record) => {
      console.log(`${record.email} - ${record.date_collected}`);
    });
  } catch (error) {
    console.error('Example 2 failed:', error.message);
  }
}

async function example3_PaginatedFetch() {
  console.log('\n📄 Example 3: Fetch All Data with Pagination (Single File Export)');
  console.log('============================================================');

  const client = new LeakJarClient(API_KEY);
  const domain = 'gmail.com';
  const batchSize = 1000;
  let offset = 0;
  let allData = [];
  let batchIndex = 1;

  console.log(`Batch size: ${batchSize} records`);
  console.log('Progress:');

  while (true) {
    const result = await client.getLeakedData({
      domain: domain,
      limit: batchSize,
      offset: offset,
      dateFrom: '2024-01-01',
    });

    if (!result.success || result.data.length === 0) {
      if (!result.success) {
        console.log(`❌ Final failed: ${result.error}`);
      } else {
        console.log(`\n✅ All data fetching completed`);
      }
      break;
    }

    allData.push(...result.data);
    console.log(`  Batch ${batchIndex}: ${result.data.length} records (cumulative: ${allData.length})`);

    if (!result.pagination?.has_more) {
      console.log(`\n✅ All data fetching completed - Total ${allData.length} records`);
      break;
    }

    offset += batchSize;
    batchIndex++;

    // Consider API rate limiting with slight delay
    if (batchIndex % 5 === 0) {
      console.log('  ⏳ Brief delay for API rate limiting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save all data to a single file
  if (allData.length > 0) {
    const exportInfo = {
      export_info: {
        domain: domain,
        export_timestamp: new Date().toISOString(),
        total_records: allData.length,
        batch_size: batchSize,
        total_batches: batchIndex - 1,
        api_version: 'v1',
        date_filter: '2024-01-01 onwards'
      },
      data_summary: {
        records_with_emails: allData.filter(r => r.email).length,
        records_with_usernames: allData.filter(r => r.username).length,
        records_with_passwords: allData.filter(r => r.has_password).length,
        unique_sources: [...new Set(allData.map(r => r.source).filter(Boolean))],
        date_range: allData.length > 0 ? {
          earliest: new Date(Math.min(...allData.map(r => new Date(r.date_collected).getTime()))).toISOString().split('T')[0],
          latest: new Date(Math.max(...allData.map(r => new Date(r.date_collected).getTime()))).toISOString().split('T')[0]
        } : null
      },
      records: allData
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `complete_export_${domain}_${timestamp}.json`;
    saveToJsonFile(exportInfo, fileName);

    console.log('\n📊 Final Results Summary:');
    console.log(`✅ Processed ${allData.length} records in total`);
    console.log(`📁 Saved as single file: exports/${fileName}`);

    console.log('\n📋 Raw Export Data:');
    console.log(JSON.stringify(exportInfo, null, 2));
  } else {
    console.log('\n❌ No data to export.');
  }
}

async function example4_VerifiedDomains() {
  console.log('\n=== Example 4: Get Verified Domains ===');

  const client = new LeakJarClient(API_KEY);

  try {
    const domains = await client.getVerifiedDomains();

    console.log('Your Verified Domains for API Access:');
    console.log('======================================');

    if (domains.success && domains.data.length > 0) {
      domains.data.forEach((domain, index) => {
        console.log(`\n${index + 1}. ${domain.domain}`);
        console.log(`   Type: ${domain.type}`);
        console.log(`   Verified: ${domain.verified_at ? new Date(domain.verified_at).toLocaleDateString() : 'Unknown'}`);
        console.log(`   API Access: ${domain.api_accessible ? '✅ Available' : '❌ Not Available'}`);
      });

      console.log(`\nTotal accessible domains: ${domains.data.length}`);
      console.log(`\nYou can use these domains with the /api/v1/leaked-data endpoint.`);
    } else {
      console.log('❌ No verified domains found');
      console.log('Contact your administrator to verify domains for API access.');
    }
  } catch (error) {
    console.error('Example 4 failed:', error.message);
  }
}

async function example5_AllDomainsStatus() {
  console.log('\n=== Example 5: All Domains Status ===');

  const client = new LeakJarClient(API_KEY);

  try {
    const result = await client.getAllDomains();

    console.log('All Your Domains (with verification status):');
    console.log('==============================================');

    if (result.success && result.data.length > 0) {
      console.log(`\n📊 Domain Statistics:`);
      console.log(`  Total domains: ${result.stats.total}`);
      console.log(`  Verified: ${result.stats.verified} ✅`);
      console.log(`  Pending verification: ${result.stats.pending} ⏳`);
      console.log(`  Monitoring enabled: ${result.stats.monitoring_enabled}`);
      console.log(`  API accessible: ${result.stats.api_accessible} 🔑`);

      console.log(`\n📂 By Type:`);
      console.log(`  URL domains: ${result.stats.by_type.URL}`);
      console.log(`  Email domains: ${result.stats.by_type.EMAIL}`);

      console.log(`\n👥 By Ownership:`);
      console.log(`  Direct: ${result.stats.by_ownership.direct}`);
      console.log(`  Organization: ${result.stats.by_ownership.organization}`);

      console.log('\n📋 Domain Details:');
      result.data.forEach((domain, index) => {
        console.log(`\n${index + 1}. ${domain.domain}`);
        console.log(`   Type: ${domain.type}`);
        console.log(`   Status: ${domain.is_verified ? '✅ Verified' : '⏳ Pending'}`);
        console.log(`   Monitoring: ${domain.monitoring_enabled ? '🟢 Enabled' : '🔴 Disabled'}`);
        console.log(`   API Access: ${domain.api_accessible ? '🔑 Available' : '🚫 Not Available'}`);
        console.log(`   Ownership: ${domain.ownership_type} (${domain.access_level})`);
        console.log(`   Created: ${new Date(domain.created_at).toLocaleDateString()}`);

        if (domain.verified_at) {
          console.log(`   Verified: ${new Date(domain.verified_at).toLocaleDateString()}`);
        }

        if (domain.company_name) {
          console.log(`   Company: ${domain.company_name}`);
        }
      });

      console.log(`\n💡 Help: ${result.help.verification_info}`);
      if (result.stats.pending > 0) {
        console.log(`\n⚠️ You have ${result.stats.pending} domain(s) pending verification.`);
        console.log(`   ${result.help.contact_support}`);
      }
    } else {
      console.log('❌ No domains found');
      console.log('Register domains at https://leakjar.vercel.app/settings/domains');
    }
  } catch (error) {
    console.error('Example 5 failed:', error.message);
  }
}

async function example6_UsageStats() {
  console.log('\n=== Example 6: API Usage Statistics ===');

  const client = new LeakJarClient(API_KEY);

  try {
    const usage = await client.getUsage();

    console.log('API Usage:');
    console.log(`  Requests today: ${usage.requests_today}`);
    console.log(`  Requests this month: ${usage.requests_month}`);
    console.log(`  Rate limit per minute: ${usage.rate_limit_per_minute}`);

    if (usage.daily_usage) {
      console.log('\nDaily Usage (last 7 days):');
      usage.daily_usage.forEach(day => {
        console.log(`  ${day.date}: ${day.count} requests`);
      });
    }
  } catch (error) {
    console.error('Example 6 failed:', error.message);
  }
}

async function example7_JsonExportOnly() {
  console.log('\n=== Example 7: JSON Export Only (Silent Mode) ===');

  const client = new LeakJarClient(API_KEY);
  const domain = 'gmail.com';
  const maxRecords = 500;
  const limit = 100;

  try {
    console.log(`Silent mode: Exporting ${maxRecords} records from ${domain} domain to JSON...`);

    const allData = [];
    let offset = 0;

    while (allData.length < maxRecords) {
      const currentLimit = Math.min(limit, maxRecords - allData.length);

      const result = await client.getLeakedData({
        domain: domain,
        limit: currentLimit,
        offset: offset,
        dateFrom: '2024-01-01',
      });

      if (result.success && result.data) {
        allData.push(...result.data);

        if (!result.pagination?.has_more || allData.length >= result.pagination.total || allData.length >= maxRecords) {
          break;
        }

        offset += currentLimit;
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        break;
      }
    }

    // Include timestamp in filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `leaked-data-export_${domain}_${timestamp}.json`;

    // Include metadata in export
    const exportData = {
      export_info: {
        domain: domain,
        export_timestamp: new Date().toISOString(),
        total_records: allData.length,
        max_requested: maxRecords,
        api_endpoint: `${client.baseUrl}/leaked-data`,
        date_range: {
          from: '2024-01-01',
          to: new Date().toISOString().split('T')[0]
        }
      },
      data_summary: {
        records_with_emails: allData.filter(r => r.email).length,
        records_with_usernames: allData.filter(r => r.username).length,
        records_with_passwords: allData.filter(r => r.has_password).length,
        unique_sources: [...new Set(allData.map(r => r.source).filter(Boolean))]
      },
      records: allData.slice(0, maxRecords)
    };

    saveToJsonFile(exportData, fileName);

    console.log(`✅ Export completed: ${allData.length} records`);
    console.log(`📁 File: exports/${fileName}`);

  } catch (error) {
    console.error('Example 7 failed:', error.message);
  }
}

// Run examples
async function runExamples() {
  console.log('LeakJar API Client Examples');
  console.log('============================');

  await example1_BasicQuery();
  await example2_DateRangeQuery();
  await example3_PaginatedFetch();
  await example4_VerifiedDomains();
  await example5_AllDomainsStatus();
  await example6_UsageStats();
  await example7_JsonExportOnly();

  console.log('\n=== All Examples Completed ===');
}

// Run only JSON export example
async function runJsonExportExample() {
  console.log('LeakJar API - JSON Export Example');
  console.log('==================================');

  await example7_JsonExportOnly();

  console.log('\n=== JSON Export Completed ===');
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Interactive Menu System
const readline = require('readline');

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Ultimate Windows input buffering fix - using simple timeout approach
async function getUserInput(prompt) {
  // For Windows, use timeout-based approach to avoid buffering issues
  if (process.platform === 'win32') {
    return getWindowsSimpleInput(prompt);
  } else {
    return getUnixInput(prompt);
  }
}

// Windows simple input handler - avoids raw mode issues
async function getWindowsSimpleInput(prompt) {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false // Important: disable terminal mode to avoid buffering
    });

    rl.question(prompt, (input) => {
      rl.close();

      // Critical Windows fix: handle duplicate character buffering
      if (typeof input === 'string') {
        let cleanInput = input.trim();

        // Windows buffering bug: "1" becomes "11", "2" becomes "22", etc.
        if (cleanInput.length >= 2 && /^[0-9a-zA-Z]$/.test(cleanInput[0])) {
          const firstChar = cleanInput[0];

          // Check if all characters are the same (Windows buffering issue)
          const allSame = cleanInput.split('').every(char => char === firstChar);

          if (allSame) {
            // Return only the first character
            cleanInput = firstChar;
          } else if (cleanInput.length === 2 && cleanInput[0] === cleanInput[1]) {
            // Handle double character case
            cleanInput = cleanInput[0];
          }
        }

        resolve(cleanInput);
      } else {
        resolve(String(input || '').trim());
      }
    });
  });
}

// Unix/Linux/macOS input handler
async function getUnixInput(prompt) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  return new Promise((resolve) => {
    rl.question(prompt, (input) => {
      rl.close();

      // Unix systems: simple trim and return
      const cleanInput = String(input || '').trim();
      resolve(cleanInput);
    });
  });
}

// Simplified menu selection for Windows compatibility
async function getMenuSelection(prompt) {
  const input = await getUserInput(prompt);

  // Additional validation for menu selections
  const cleanInput = input.trim();

  // Handle Windows double-digit bug (e.g., "22" -> "2")
  if (cleanInput.length >= 2 && /^[1-9]$/.test(cleanInput[0])) {
    const firstChar = cleanInput[0];
    const allSame = cleanInput.split('').every(char => char === firstChar);
    if (allSame) {
      return firstChar;
    }
  }

  return cleanInput;
}

async function showMainMenu() {
  const rl = createInterface();

  console.log('\n🚀 LeakJar API Test Menu');
  console.log('==============================');
  console.log('1. Basic Leaked Data Query');
  console.log('2. Verified Domains List');
  console.log('3. All Domains Status');
  console.log('4. Date Range Query');
  console.log('5. Pagination');
  console.log('6. JSON Export (Custom Count)');
  console.log('7. Run All Examples');
  console.log('8. Exit');
  console.log('==============================');

  const answer = await getMenuSelection('Select function (1-8): ');
  rl.close();
  return parseInt(answer);
}

async function handleUserChoice(choice) {
  switch (choice) {
    case 1:
      await testBasicDataQuery();
      break;
    case 2:
      await example4_VerifiedDomains();
      break;
    case 3:
      await example5_AllDomainsStatus();
      break;
    case 4:
      await testDateRangeQuery();
      break;
    case 5:
      await testPagination();
      break;
    case 6:
      await testJsonExport();
      break;
    case 7:
      await runExamples();
      break;
    case 8:
      console.log('\n👋 Exiting program.');
      return false;
    default:
      console.log('\n❌ Invalid choice. Select 1-8.');
      return true;
  }
  return true;
}

// Helper function to get verified domains and let user choose
async function selectDomain(client) {
  console.log('\n🔍 Fetching your verified domains...');

  try {
    const domainsResult = await client.getVerifiedDomains();

    if (!domainsResult.success || domainsResult.data.length === 0) {
      console.log('❌ No verified domains found. Please contact your administrator to verify domains.');
      return null;
    }

    console.log('\n📋 Your Verified Domains:');
    domainsResult.data.forEach((domain, index) => {
      console.log(`  ${index + 1}. ${domain.domain} (${domain.type}) - ${domain.api_accessible ? '✅ API Accessible' : '❌ Not Accessible'}`);
    });

    const answer = await getUserInput('\nSelect domain by number (1-' + domainsResult.data.length + '): ');
    const choiceNum = parseInt(answer);

    if (choiceNum >= 1 && choiceNum <= domainsResult.data.length) {
      const choice = choiceNum - 1;
      const selectedDomain = domainsResult.data[choice];
      console.log(`\n✅ Selected domain: ${selectedDomain.domain}`);
      return selectedDomain.domain;
    } else {
      console.log('❌ Invalid choice. Please select a number from the list.');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching verified domains:', error.message);
    return null;
  }
}

async function testBasicDataQuery() {
  console.log('\n🔍 Basic Leaked Data Query Test');

  const rl = createInterface();

  try {
    // First, get verified domains and let user choose
    const client = new LeakJarClient(API_KEY);
    const selectedDomain = await selectDomain(client);

    if (!selectedDomain) {
      console.log('❌ Domain selection cancelled or failed.');
      return;
    }

      const limit = await getUserInput('Number of records to retrieve (default: 10, max: 100): ');

    console.log(`\n📡 Querying ${limit} records from domain: ${selectedDomain}`);

    const result = await client.getLeakedData({
      domain: selectedDomain,
      limit: limit,
      // Remove date filter - all data query
    });

    if (result.success) {
      console.log(`\n✅ Success: ${result.data.length} records retrieved`);
      console.log(`📊 Total available records: ${result.pagination?.total || 'Unknown'}`);
      console.log(`⏱️ Response time: ${result.meta?.response_time_ms || 'Unknown'}ms`);
      console.log(`🔄 More data available: ${result.pagination?.has_more ? 'Yes' : 'No'}`);

      if (result.data.length > 0) {
        console.log(`\n📋 Raw JSON Response:`);
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('\n⚠️ No records found for the selected criteria.');
        console.log('Raw JSON Response:');
        console.log(JSON.stringify(result, null, 2));
      }
    } else {
      console.log('❌ Query failed');
    }
  } catch (error) {
    console.error('❌ Error occurred:', error.message);
  } finally {
    rl.close();
  }
}

async function testDateRangeQuery() {
  console.log('\n📅 Date Range Query Test');

  const rl = createInterface();

  try {
    const client = new LeakJarClient(API_KEY);
    const selectedDomain = await selectDomain(client);

    if (!selectedDomain) {
      console.log('❌ Domain selection cancelled or failed.');
      return;
    }

    const dateFrom = await getUserInput('Start date (YYYY-MM-DD, default: 2024-01-01): ') || '2024-01-01';

    const limitAnswer = await getUserInput('Number of records to retrieve (default: 20, max: 100): ');
    const limit = limitAnswer ? Math.min(parseInt(limitAnswer), 100) : 20;

    console.log(`\n📡 Querying ${limit} records from ${selectedDomain} since ${dateFrom}`);

    const result = await client.getLeakedData({
      domain: selectedDomain,
      dateFrom: dateFrom,
      limit: limit
    });

    if (result.success) {
      console.log(`\n✅ Success: ${result.data.length} records retrieved since ${dateFrom}`);
      console.log(`📊 Total available records: ${result.pagination?.total || 'Unknown'}`);
      console.log(`⏱️ Response time: ${result.meta?.response_time_ms || 'Unknown'}ms`);
      console.log(`🔄 More data available: ${result.pagination?.has_more ? 'Yes' : 'No'}`);

      console.log(`\n📋 Raw JSON Response:`);
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Query failed');
    }
  } catch (error) {
    console.error('❌ Error occurred:', error.message);
  } finally {
    rl.close();
  }
}

async function testPagination() {
  console.log('\n📄 Pagination Test');

  const rl = createInterface();

  try {
    const client = new LeakJarClient(API_KEY);
    const selectedDomain = await selectDomain(client);

    if (!selectedDomain) {
      console.log('❌ Domain selection cancelled or failed.');
      return;
    }

    // First, get total record count for the domain
    console.log(`\n🔍 Checking total records available for domain: ${selectedDomain}`);
    const countResult = await client.getLeakedData({
      domain: selectedDomain,
      limit: 1 // Just get 1 record to see pagination info
    });

    if (!countResult.success) {
      console.log('❌ Failed to get domain information');
      return;
    }

    const totalRecords = countResult.pagination?.total || 0;

    if (totalRecords === 0) {
      console.log('\n⚠️ No records found for this domain.');
      return;
    }

    console.log(`\n📊 Domain Statistics:`);
    console.log(`  🏷️  Domain: ${selectedDomain}`);
    console.log(`  📋 Total Records: ${totalRecords.toLocaleString()}`);
    console.log(`  📄 Recommended pages: ${Math.ceil(totalRecords / 10)} (10 per page)`);
    console.log(`  📄 Recommended pages: ${Math.ceil(totalRecords / 50)} (50 per page)`);
    console.log(`  📄 Recommended pages: ${Math.ceil(totalRecords / 100)} (100 per page)`);
    console.log(`  📄 Recommended pages: ${Math.ceil(totalRecords / 1000)} (1000 per page)`);

    const limitAnswer = await getUserInput('\nRecords per page (default: 10, max: 1000): ');
    const limit = limitAnswer ? Math.min(parseInt(limitAnswer), 1000) : 10;

    const totalPages = Math.ceil(totalRecords / limit);
    console.log(`\n📖 Pagination Plan:`);
    console.log(`  📊 Total Records: ${totalRecords.toLocaleString()}`);
    console.log(`  📄 Records per page: ${limit}`);
    console.log(`  📚 Total pages: ${totalPages}`);
    console.log(`  🔄 This test will show pages 1 and 2 (${Math.min(2, totalPages)} of ${totalPages})`);

    console.log(`\n⏳ Testing pagination with ${limit} records per page for domain: ${selectedDomain}`);

    // Page 1
    console.log('\n📖 Fetching page 1 (offset 0)...');
    const page1 = await client.getLeakedData({
      domain: selectedDomain,
      limit: limit,
      offset: 0
    });

    // Page 2
    console.log(`📖 Fetching page 2 (offset ${limit})...`);
    const page2 = await client.getLeakedData({
      domain: selectedDomain,
      limit: limit,
      offset: limit
    });

    console.log(`\n📊 Pagination Test Results for ${selectedDomain}:`);

    console.log(`\n📋 Page 1 Raw JSON Response:`);
    console.log(JSON.stringify(page1, null, 2));

    if (totalPages > 1) {
      console.log(`\n📋 Page 2 Raw JSON Response:`);
      console.log(JSON.stringify(page2, null, 2));
    }

  } catch (error) {
    console.error('❌ Error occurred:', error.message);
  } finally {
    rl.close();
  }
}

async function testJsonExport() {
  console.log('\n💾 JSON Export Test');

  const rl = createInterface();

  try {
    const client = new LeakJarClient(API_KEY);
    const selectedDomain = await selectDomain(client);

    if (!selectedDomain) {
      console.log('❌ Domain selection cancelled or failed.');
      return;
    }

    const maxRecordsAnswer = await getUserInput('Export record count (default: 100, max: 1000): ');
    const maxRecords = maxRecordsAnswer ? Math.min(parseInt(maxRecordsAnswer), 1000) : 100;

    const dateFrom = await getUserInput('Start date filter (YYYY-MM-DD, default: no filter): ') || null;

    console.log(`\n⏳ Exporting ${maxRecords} records from ${selectedDomain} domain to JSON...`);
    if (dateFrom) {
      console.log(`📅 Date filter: from ${dateFrom}`);
    }

    const allData = [];
    let offset = 0;
    const limit = 100;
    let batchCount = 0;

    while (allData.length < maxRecords) {
      const currentLimit = Math.min(limit, maxRecords - allData.length);
      batchCount++;

      console.log(`📦 Batch ${batchCount}: Fetching ${currentLimit} records (offset: ${offset})...`);

      const queryParams = {
        domain: selectedDomain,
        limit: currentLimit,
        offset: offset,
      };

      if (dateFrom) {
        queryParams.dateFrom = dateFrom;
      }

      const result = await client.getLeakedData(queryParams);

      if (result.success && result.data) {
        allData.push(...result.data);

        if (!result.pagination?.has_more || allData.length >= result.pagination.total || allData.length >= maxRecords) {
          console.log(`✅ All data collected - ${allData.length} records in ${batchCount} batches`);
          break;
        }

        offset += currentLimit;
        console.log(`📝 Progress: ${allData.length}/${maxRecords} records collected...`);

        // Brief delay to avoid rate limiting
        if (batchCount % 5 === 0) {
          console.log(`⏳ Brief delay for API rate limiting...`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else {
        console.log(`❌ Batch ${batchCount} failed, stopping export`);
        break;
      }
    }

    // Save with timestamp and domain name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeDomainName = selectedDomain.replace(/[^\w.-]/g, '_');
    const fileName = `leaked-data-export_${safeDomainName}_${timestamp}.json`;

    // Create comprehensive export data
    const exportData = {
      export_info: {
        domain: selectedDomain,
        safe_domain_name: safeDomainName,
        export_timestamp: new Date().toISOString(),
        total_records: allData.length,
        requested_records: maxRecords,
        batches_processed: batchCount,
        api_endpoint: `${client.baseUrl}/leaked-data`,
        date_filter: dateFrom || 'No filter',
        api_version: 'v1'
      },
      data_summary: {
        records_with_emails: allData.filter(r => r.email).length,
        records_with_usernames: allData.filter(r => r.username).length,
        records_with_passwords: allData.filter(r => r.password).length,
        records_with_ips: allData.filter(r => r.ip_address).length,
        unique_sources: [...new Set(allData.map(r => r.source).filter(Boolean))],
        unique_browsers: [...new Set(allData.map(r => r.browser).filter(Boolean))],
        date_range: allData.length > 0 ? {
          earliest: new Date(Math.min(...allData.map(r => new Date(r.date_collected).getTime()))).toISOString().split('T')[0],
          latest: new Date(Math.max(...allData.map(r => new Date(r.date_collected).getTime()))).toISOString().split('T')[0]
        } : null
      },
      records: allData
    };

    const filePath = saveToJsonFile(exportData, fileName);

    if (filePath) {
      console.log(`\n🎉 Export Completed Successfully!`);
      console.log(`✅ Records exported: ${allData.length}/${maxRecords} requested`);
      console.log(`📁 File saved: ${filePath}`);

      const stats = require('fs').statSync(filePath);
      console.log(`📏 File size: ${(stats.size / 1024).toFixed(2)} KB`);

      console.log('\n📋 Raw Export Data:');
      console.log(JSON.stringify(exportData, null, 2));
    } else {
      console.log('❌ Export failed');
    }

  } catch (error) {
    console.error('❌ Error occurred:', error.message);
  } finally {
    rl.close();
  }
}


// Interactive Menu Runner
async function runInteractiveMenu() {
  console.log('🎉 LeakJar API Interactive Test Tool');
  console.log('=====================================');

  while (true) {
    const choice = await showMainMenu();
    const shouldContinue = await handleUserChoice(choice);

    if (!shouldContinue) {
      break;
    }

    // Pause before next choice
    await getUserInput('\nPress any key to continue...');
  }
}

// Run if executed directly
if (require.main === module) {
  // Check if command line arguments are provided
  const args = process.argv.slice(2);

  if (args.length > 0) {
    // Run specific function based on arguments
    const command = args[0];

    switch (command) {
      case 'export':
        runJsonExportExample().catch(console.error);
        break;
      case 'examples':
        runExamples().catch(console.error);
        break;
      case 'menu':
      default:
        runInteractiveMenu().catch(console.error);
        break;
    }
  } else {
    // Default to interactive menu
    runInteractiveMenu().catch(console.error);
  }
}

module.exports = {
  LeakJarClient,
  runJsonExportExample,
  saveToJsonFile,
  appendToJsonFile
};