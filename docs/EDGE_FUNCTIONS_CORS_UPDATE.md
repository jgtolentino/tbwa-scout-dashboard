# Edge Functions CORS Update Guide

## Overview
This guide provides step-by-step instructions to update all Supabase Edge Functions with CORS support for the Scout v5 dashboard.

## 1. Supabase Dashboard CORS Configuration

### Add Allowed Origins
1. Go to [Supabase Dashboard](https://app.supabase.com/project/cxzllzyxwpyptfretryc)
2. Navigate to **Settings → API → CORS Configuration**
3. Add these domains to the allowed origins:

```
https://tbwa-scout-dashboard.vercel.app
https://tbwa-scout-dashboard-*.vercel.app
https://*.vercel.app
http://localhost:3000
http://localhost:3001
```

## 2. Edge Functions Update Template

### CORS Headers to Add
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};
```

### Function Template with CORS
```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    // Your existing function logic here
    const body = await req.json();
    
    // Process request...
    
    return new Response(
      JSON.stringify(result),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 500,
      }
    );
  }
});
```

## 3. Functions to Update

### High Priority Functions
These are called directly by the Scout dashboard:

1. **wren-query** - Natural language query processing
2. **geo_choropleth** - Map data
3. **scout-dashboard-api** - Main dashboard API
4. **geographic-insights** - Geographic analytics
5. **consumer-insights-enhanced** - Consumer analytics

### Gold Layer Functions
These provide data to the Executive Overview:

6. **gold_persona_region_metrics**
7. **gold_customer_activity**
8. **gold_regional_performance**
9. **gold_peak_hours_analysis**
10. **gold_product_bundles**
11. **gold_category_mix**
12. **gold_demand_forecast**
13. **gold_promotion_effectiveness**

## 4. Deployment Commands

### Deploy Individual Function
```bash
supabase functions deploy function-name
```

### Deploy All Functions
```bash
# Deploy high priority functions
supabase functions deploy wren-query
supabase functions deploy geo_choropleth
supabase functions deploy scout-dashboard-api
supabase functions deploy geographic-insights
supabase functions deploy consumer-insights-enhanced

# Deploy gold layer functions
supabase functions deploy gold_persona_region_metrics
supabase functions deploy gold_customer_activity
supabase functions deploy gold_regional_performance
supabase functions deploy gold_peak_hours_analysis
supabase functions deploy gold_product_bundles
supabase functions deploy gold_category_mix
supabase functions deploy gold_demand_forecast
supabase functions deploy gold_promotion_effectiveness
```

## 5. Testing CORS

### Browser Console Test
```javascript
// Test in browser console
fetch('https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/wren-query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'your-anon-key'
  },
  body: JSON.stringify({ query: 'test' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Expected Result
- No CORS errors in console
- Function returns data successfully
- Response headers include Access-Control-Allow-Origin

## 6. Verification Checklist

- [ ] Supabase CORS settings updated with Vercel domains
- [ ] All Edge Functions have OPTIONS handler
- [ ] All responses include CORS headers
- [ ] Browser console shows no CORS errors
- [ ] Data loads in production dashboard

## 7. Troubleshooting

### Common Issues
1. **"No 'Access-Control-Allow-Origin' header"**
   - Function missing CORS headers in response
   - Add `...corsHeaders` to all responses

2. **"Preflight request failed"**
   - Missing OPTIONS handler
   - Add the OPTIONS check at start of function

3. **"CORS policy: Method not allowed"**
   - Update Allow-Methods header
   - Include all methods your function uses

### Debug Commands
```bash
# Check function logs
supabase functions logs function-name

# Test function locally
supabase functions serve function-name
```

## Quick Reference Card

```typescript
// 1. Add to top of function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 2. Add after Deno.serve(async (req) => {
if (req.method === 'OPTIONS') {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// 3. Add to all responses
return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  status: 200
});
```