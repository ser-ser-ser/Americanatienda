
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mockSequential() {
  const start = performance.now();

  // 1. Fetch Store
  await delay(100);
  const store = { id: 'store_123', slug: 'my-store' };

  // 2. Fetch Category
  await delay(100);
  const category = { id: 'cat_456', slug: 'my-category', store_id: store.id };

  // 3. Fetch Products
  await delay(100);
  const products = [{ id: 'prod_789', name: 'Product A' }];

  const end = performance.now();
  return end - start;
}

async function mockOptimized() {
  const start = performance.now();

  // 1. Fetch Everything
  await delay(120); // Slightly more processing time for join
  const data = {
    id: 'cat_456',
    slug: 'my-category',
    store: { id: 'store_123', slug: 'my-store' },
    products: [{ id: 'prod_789', name: 'Product A' }]
  };

  const end = performance.now();
  return end - start;
}

async function runBenchmark() {
  console.log('⚡ Starting Performance Benchmark Simulation...\n');

  console.log('Running Sequential Request Waterfall...');
  const seqTime = await mockSequential();
  console.log(`Sequential Time: ${seqTime.toFixed(2)}ms\n`);

  console.log('Running Optimized Single Query...');
  const optTime = await mockOptimized();
  console.log(`Optimized Time: ${optTime.toFixed(2)}ms\n`);

  const improvement = ((seqTime - optTime) / seqTime) * 100;
  console.log(`🚀 Performance Improvement: ${improvement.toFixed(2)}%`);
}

runBenchmark();
