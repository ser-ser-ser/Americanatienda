import { builder } from '@builder.io/sdk'

// Replace with your Public API Key
const BUILDER_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'YOUR_PUBLIC_API_KEY'

builder.init(BUILDER_PUBLIC_API_KEY)

export default builder
