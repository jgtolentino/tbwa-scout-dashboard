# Fix for 401 Invalid JWT / Missing apikey Errors

## Problem
All RPC calls are returning 401 errors because PostgREST requires:
1. `apikey` header (the anon key)
2. `Authorization` header (Bearer token) - optional if policies allow anon

## Solution

### 1. Grant Execute Permissions to Anon Role
Run the migration in Supabase SQL Editor:
```sql
-- Grant execute permission to anon role
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA scout TO anon;
GRANT USAGE ON SCHEMA scout TO anon;
```

### 2. Verify Environment Variables in Vercel
Go to Vercel → Project Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://cxzllzyxwpyptfretryc.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key from Supabase dashboard

### 3. Updated Supabase Client
The client is configured with:
```typescript
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: { 
      headers: { 
        'x-application-name': 'scout-dashboard' 
      } 
    }
  }
)
```

This automatically adds the `apikey` header to all requests.

### 4. Quick Test
```bash
# Test with curl (replace with your anon key)
curl -i \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' \
  https://cxzllzyxwpyptfretryc.supabase.co/rest/v1/rpc/get_gold_customer_activity
```

### 5. Debug in Browser
Open DevTools → Network → Look for RPC calls → Check Request Headers:
- Should see `apikey: eyJ...` 
- Should see `Authorization: Bearer eyJ...` (if using auth)

## What Changed
1. Added anon role permissions via SQL migration
2. Enhanced Supabase client configuration
3. Added debug logging to track issues
4. All RPC calls now go through properly configured client