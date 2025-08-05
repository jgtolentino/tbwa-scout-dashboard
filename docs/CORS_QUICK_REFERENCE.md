# 🚀 Scout v5 CORS Quick Reference

## Copy-Paste CORS Solution

### 1️⃣ Add to Supabase Dashboard
**Settings → API → CORS Configuration**
```
https://tbwa-scout-dashboard.vercel.app
https://tbwa-scout-dashboard-*.vercel.app
https://*.vercel.app
http://localhost:3000
http://localhost:3001
```

### 2️⃣ Add to Every Edge Function

```typescript
// Add at top
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Add after Deno.serve(async (req) => {
if (req.method === 'OPTIONS') {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// Add to ALL responses
return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  status: 200
});
```

### 3️⃣ Deploy Functions
```bash
# Deploy one
supabase functions deploy function-name

# Deploy all priority functions
for fn in wren-query geo_choropleth scout-dashboard-api geographic-insights consumer-insights-enhanced; do
  supabase functions deploy $fn
done
```

### 4️⃣ Test in Browser Console
```javascript
// Should see no CORS errors
fetch('https://your-project.supabase.co/functions/v1/wren-query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'your-anon-key'
  },
  body: JSON.stringify({ query: 'test' })
}).then(r => r.json()).then(console.log)
```

## ✅ Success Indicators
- No red CORS errors in console
- Functions return 200 OK
- Data loads in dashboard
- Maps render properly

## ❌ Common Fixes
| Error | Fix |
|-------|-----|
| "No 'Access-Control-Allow-Origin'" | Add corsHeaders to response |
| "Preflight request failed" | Add OPTIONS handler |
| "Method not allowed" | Update Allow-Methods header |

## 📞 Quick Test
```bash
# Run from project root
./scripts/verify-cors.sh
```