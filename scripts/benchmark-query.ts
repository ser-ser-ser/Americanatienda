
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function benchmark() {
  console.log('Starting benchmark...')

  // 1. Measure Stores Query
  console.log('\n--- Stores Query ---')
  const startStoresOriginal = performance.now()
  const { data: storesOriginal, error: errorStoresOriginal } = await supabase.from('stores').select('*')
  const endStoresOriginal = performance.now()
  if (errorStoresOriginal) console.error('Error fetching stores (original):', errorStoresOriginal)
  else console.log(`Original Stores Query Time: ${(endStoresOriginal - startStoresOriginal).toFixed(2)}ms, Rows: ${storesOriginal.length}`)

  const startStoresOptimized = performance.now()
  const { data: storesOptimized, error: errorStoresOptimized } = await supabase.from('stores').select('id, name, slug, description, cover_image_url, cover_video_url')
  const endStoresOptimized = performance.now()
  if (errorStoresOptimized) console.error('Error fetching stores (optimized):', errorStoresOptimized)
  else console.log(`Optimized Stores Query Time: ${(endStoresOptimized - startStoresOptimized).toFixed(2)}ms, Rows: ${storesOptimized.length}`)

  // 2. Measure Categories Query
  console.log('\n--- Categories Query ---')
  const startCatsOriginal = performance.now()
  const { data: catsOriginal, error: errorCatsOriginal } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
  const endCatsOriginal = performance.now()
  if (errorCatsOriginal) console.error('Error fetching categories (original):', errorCatsOriginal)
  else console.log(`Original Categories Query Time: ${(endCatsOriginal - startCatsOriginal).toFixed(2)}ms, Rows: ${catsOriginal.length}`)

  const startCatsOptimized = performance.now()
  const { data: catsOptimized, error: errorCatsOptimized } = await supabase.from('categories').select('id, name, slug, image_url, created_at').order('created_at', { ascending: true })
  const endCatsOptimized = performance.now()
  if (errorCatsOptimized) console.error('Error fetching categories (optimized):', errorCatsOptimized)
  else console.log(`Optimized Categories Query Time: ${(endCatsOptimized - startCatsOptimized).toFixed(2)}ms, Rows: ${catsOptimized.length}`)
}

benchmark()
