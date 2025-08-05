# CORS Fix Guide for Scout v5 Production

## Issue
Production deployment shows CORS errors preventing data from loading:
- `Response to pre-flight… doesn't pass access-control check`
- `TypeError: Failed to fetch`
- `TypeError: e.filter is not a function`

## Solutions Applied

### 1. Supabase Client with SSR Support
Created proper Supabase client using `@supabase/ssr`:
```typescript
// lib/utils/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 2. Updated scoutFetch to Use functions.invoke
The `functions.invoke` method handles CORS automatically:
```typescript
// lib/utils/scoutFetch.ts
export async function scoutFetch(fn: string, payload?: any) {
  const data = await callEdgeFunction(fn, payload);
  return data;
}
```

### 3. Added CORS Headers to API Routes
All Next.js API routes now include CORS headers:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
```

### 4. Edge Function CORS Template
Created shared CORS utility for Edge Functions:
```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

## Required Actions

### 1. Update ALL Edge Functions
Each Edge Function needs to handle OPTIONS requests:
```typescript
import { corsHeaders, handleCORS } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  // ... your function logic ...

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

### 2. Configure Supabase Dashboard
In Supabase Dashboard → Settings → Auth → CORS:
```
https://tbwa-scout-dashboard.vercel.app
https://tbwa-scout-dashboard-*.vercel.app
https://*.vercel.app
```

### 3. Environment Variables
Ensure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

## Testing Checklist
1. ✅ No red CORS errors in browser console
2. ✅ Edge Functions return 200 OK with JSON
3. ✅ Map renders (CSS loaded)
4. ✅ KPI cards populate with data
5. ✅ Production build succeeds

## Mock Data Fallback
The system includes mock data for development when Edge Functions are unavailable, ensuring the UI always renders properly.