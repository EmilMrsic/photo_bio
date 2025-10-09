#!/usr/bin/env node

const XANO_API_BASE = 'https://xbwz-pynn-hycq.n7e.xano.io/api:CFT-MENJ';

async function testEndpoint(name, url) {
  console.log(`\nTesting ${name}...`);
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const responseTime = Date.now() - startTime;
    const data = await response.text();
    
    console.log(`✓ Status: ${response.status}`);
    console.log(`✓ Response Time: ${responseTime}ms`);
    console.log(`✓ Response Size: ${data.length} bytes`);
    
    if (responseTime > 5000) {
      console.log(`⚠️  WARNING: Response time exceeds 5 seconds!`);
    }
    
    // Parse and show some data info
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        console.log(`✓ Data: Array with ${parsed.length} items`);
      } else {
        console.log(`✓ Data: Object`);
      }
    } catch (e) {
      console.log(`✗ Data: Unable to parse JSON`);
    }
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.log(`✗ Error: ${error.message}`);
    console.log(`✗ Failed after: ${responseTime}ms`);
  }
}

async function runDiagnostics() {
  console.log('=== Xano API Performance Diagnostics ===');
  console.log(`Base URL: ${XANO_API_BASE}`);
  console.log(`Time: ${new Date().toISOString()}`);
  
  // Test provider endpoint
  await testEndpoint('Provider by Email', `${XANO_API_BASE}/providers?email=projects@thankyuu.com`);
  
  // Test clients endpoint with provider ID
  await testEndpoint('Clients by Provider ID', `${XANO_API_BASE}/clients?providers_id=3`);
  
  // Test all clients (to see if filtering is the issue)
  await testEndpoint('All Clients', `${XANO_API_BASE}/clients`);
  
  // Test blogs endpoint
  await testEndpoint('Blogs', `${XANO_API_BASE}/blogs`);
  
  // Test a simple endpoint to check if it's a general API issue
  await testEndpoint('Client Documents', `${XANO_API_BASE}/client_documents`);
  
  console.log('\n=== Diagnostics Complete ===\n');
}

// Run the diagnostics
runDiagnostics().catch(console.error);
