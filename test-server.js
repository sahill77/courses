// Simple script to test if the server is running
import http from 'http';

const testEndpoints = [
  { path: '/api/health', name: 'Health Check' },
  { path: '/api/courses', name: 'Courses API' },
  { path: '/api/categories', name: 'Categories API' },
];

console.log('🧪 Testing SparksStream Server...\n');

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

function testEndpoint(path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${name}: OK (${res.statusCode})`);
          resolve(true);
        } else {
          console.log(`⚠️  ${name}: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏱️  ${name}: Timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  console.log(`Testing server at http://${HOST}:${PORT}\n`);
  
  let allPassed = true;
  
  for (const endpoint of testEndpoints) {
    const passed = await testEndpoint(endpoint.path, endpoint.name);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('✅ All tests passed! Server is running correctly.');
    console.log(`\n🌐 Access your app at: http://${HOST}:${PORT}`);
  } else {
    console.log('❌ Some tests failed. Please check:');
    console.log('   1. Is the backend server running? (cd backend && npm start)');
    console.log('   2. Is MongoDB connected?');
    console.log('   3. Are environment variables configured?');
    console.log('\n📖 See START_SERVER.md for help');
  }
  
  console.log('='.repeat(50) + '\n');
}

runTests();
