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

// Test optimizeImageUrl logic
function optimizeImageUrl(url, width = 400) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com')) {
    if (url.includes('/f_auto,q_auto')) return url;
    return url.replace(
      /\/image\/upload\/(?:v\d+\/)?/,
      (match) => match.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width},c_limit/`)
    );
  }
  return url;
}

const testCloudinary = 'https://res.cloudinary.com/dz93uevat/image/upload/v1720000000/sample_photo.jpg';
console.log('Original Cloudinary:', testCloudinary);
console.log('Transformed Cloudinary:', optimizeImageUrl(testCloudinary, 400));

async function runBenchmark() {
  console.log('\n--- Benchmark: Paginated Category Query (Page 1, limit 12) ---');
  const start = Date.now();
  const { data, count, error } = await supabase
    .from('businesses')
    .select(`
      id,
      name,
      category,
      logo,
      rating,
      review_count,
      location,
      cover_image,
      featured,
      starting_price,
      maximum_price
    `, { count: 'exact' })
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(0, 11);

  const duration = Date.now() - start;
  if (error) {
    console.error('Benchmark Error:', error.message);
  } else {
    console.log(`Success! Fetched ${data.length} records (Total Count: ${count}) in ${duration}ms`);
  }
}

runBenchmark();
