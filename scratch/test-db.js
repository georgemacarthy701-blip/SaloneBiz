const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
    env[match[1]] = value;
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, anonKey);

async function runTest() {
  console.log('--- Warmed Database Latency Isolation Test ---');
  
  // Warmup connection
  console.log('Warming up connection...');
  await supabase.from('categories').select('id').limit(1);
  console.log('Warmup complete.');

  // Test 1: Querying categories table (No RLS)
  console.log('\nRunning Categories (No RLS) queries...');
  const catTimes = [];
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    await supabase.from('categories').select('*');
    catTimes.push(Date.now() - start);
  }
  console.log('Individual times (Categories):', catTimes);
  console.log('Average time (Categories):', catTimes.reduce((a, b) => a + b, 0) / catTimes.length, 'ms');

  // Test 2: Querying businesses table (RLS enabled with subquery)
  console.log('\nRunning Businesses (With RLS Subquery) queries...');
  const bizTimes = [];
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    await supabase.from('businesses').select('*').limit(10);
    bizTimes.push(Date.now() - start);
  }
  console.log('Individual times (Businesses):', bizTimes);
  console.log('Average time (Businesses):', bizTimes.reduce((a, b) => a + b, 0) / bizTimes.length, 'ms');
}

runTest();
