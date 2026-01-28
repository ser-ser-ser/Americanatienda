// Simulation of middleware latency before and after optimization
// Usage: npx tsx scripts/benchmark_middleware.ts

const NETWORK_LATENCY_MS = 100; // Assume 100ms round trip to Supabase/DB
const AUTH_LATENCY_MS = 150; // Auth often takes a bit longer

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Mocks
const mockUser = {
    id: 'user-123',
    app_metadata: {
        role: 'vendor',
        store_status: 'active'
    }
};

// Original Implementation: 3 Round Trips
async function middlewareOriginal() {
    const start = performance.now();

    // 1. getUser()
    await sleep(AUTH_LATENCY_MS);

    // 2. Get Profile Role
    await sleep(NETWORK_LATENCY_MS);

    // 3. Get Store Status (for vendor)
    await sleep(NETWORK_LATENCY_MS);

    return performance.now() - start;
}

// Optimized Implementation: 1 Round Trip
async function middlewareOptimized() {
    const start = performance.now();

    // 1. getUser() (returns metadata)
    await sleep(AUTH_LATENCY_MS);

    // Check metadata (instant)
    const role = mockUser.app_metadata.role;
    const status = mockUser.app_metadata.store_status;

    return performance.now() - start;
}

async function runBenchmark() {
    console.log("⚡ Middleware Performance Benchmark (Simulation)\n");
    console.log(`Assumptions:`);
    console.log(`- Auth Latency: ${AUTH_LATENCY_MS}ms`);
    console.log(`- DB Query Latency: ${NETWORK_LATENCY_MS}ms`);
    console.log(`--------------------------------------------------`);

    const originalTime = await middlewareOriginal();
    console.log(`🔴 Original Middleware (3 round trips): ${originalTime.toFixed(2)}ms`);

    const optimizedTime = await middlewareOptimized();
    console.log(`🟢 Optimized Middleware (1 round trip):  ${optimizedTime.toFixed(2)}ms`);

    const improvement = originalTime - optimizedTime;
    const percent = (improvement / originalTime) * 100;

    console.log(`--------------------------------------------------`);
    console.log(`🚀 Improvement: ${improvement.toFixed(2)}ms faster (${percent.toFixed(0)}% reduction)`);
}

runBenchmark();
