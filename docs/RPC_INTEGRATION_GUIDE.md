# RPC Integration Guide - CORS-Free Solution

## Overview
This guide documents how Scout v5 uses Supabase RPC calls instead of Edge Functions to bypass CORS issues entirely.

## Architecture Change

### Before (Edge Functions with CORS issues)
```typescript
// ❌ Failed due to CORS
fetch(`${supabaseUrl}/functions/v1/gold_persona_region_metrics`)
```

### After (Direct RPC calls)
```typescript
// ✅ Works without CORS issues
const { data } = await supabase.rpc('get_gold_persona_region_metrics');
```

## RPC Functions Available

### Gold Layer Functions
```typescript
// Customer Analytics
supabase.rpc('get_gold_persona_region_metrics')
supabase.rpc('get_gold_customer_activity')

// Regional Performance
supabase.rpc('get_gold_regional_performance')
supabase.rpc('geo_choropleth', { level: 'region', metric_type: 'revenue' })

// Product Analytics
supabase.rpc('get_gold_product_metrics')
supabase.rpc('get_gold_basket_analysis')

// Forecasting
supabase.rpc('get_gold_demand_forecast')
supabase.rpc('get_gold_campaign_effect')
```

### Query Functions
```typescript
// Natural Language Query
supabase.rpc('wren_query', { 
  question: 'What are top selling products?',
  context: 'general'
})
```

## Implementation Details

### 1. scoutFetch Utility
The `scoutFetch` utility automatically maps frontend function names to RPC functions:

```typescript
// lib/utils/scoutFetch.ts
export async function scoutFetch(fn: string, payload?: any) {
  const rpcFunction = rpcFunctionMap[fn] || fn;
  const { data, error } = await supabase.rpc(rpcFunction, payload);
  
  if (error) throw error;
  return data;
}
```

### 2. ExecutiveOverview Component
Uses parallel RPC calls for performance:

```typescript
const [personas, loyalty, regional, ...] = await Promise.all([
  scoutFetch('gold_persona_region_metrics'),
  scoutFetch('gold_customer_activity'),
  scoutFetch('gold_regional_performance'),
  // ... more calls
]);
```

### 3. API Routes
API routes now use RPC instead of Edge Functions:

```typescript
// app/api/geo_choropleth/route.ts
const { data, error } = await supabase.rpc('geo_choropleth', {
  level,
  metric_type: metric
});
```

## Benefits

1. **No CORS Issues**: RPC calls use Supabase client library
2. **Better Authentication**: Automatic session handling
3. **Type Safety**: Can generate TypeScript types from database
4. **Performance**: Direct database queries without HTTP overhead
5. **Simplicity**: No Edge Function deployment needed

## Testing

### Local Development
```bash
# Ensure environment variables are set
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Run development server
npm run dev

# Test in browser console
const { data } = await supabase.rpc('get_gold_persona_region_metrics');
console.log(data);
```

### Production
The RPC functions work immediately in production without any CORS configuration.

## Migration Checklist

- [x] Update scoutFetch to use RPC
- [x] Map all function names to RPC functions
- [x] Update API routes to use RPC
- [x] Add mock data fallbacks
- [x] Test all dashboard components
- [x] Deploy to production

## Troubleshooting

### "Function does not exist"
Ensure the RPC function is created in the scout schema:
```sql
CREATE OR REPLACE FUNCTION scout.get_gold_persona_region_metrics()
RETURNS TABLE(...) AS $$
```

### Empty data returns
Check if the gold layer views have data:
```sql
SELECT * FROM scout_dash.gold_persona_region_metrics LIMIT 10;
```

### Authentication errors
Ensure you're using the anon key and RLS policies allow access.

## SQL Functions Reference

All RPC functions are defined in the scout schema and follow this pattern:
- Prefix: `get_` for data retrieval
- Returns: JSON array or table
- Security: SECURITY DEFINER with scout role
- Access: Granted to anon and authenticated roles

Example:
```sql
CREATE OR REPLACE FUNCTION scout.get_gold_customer_activity()
RETURNS json
SECURITY DEFINER
SET search_path = scout_dash, public
AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM gold_customer_activity t
  );
END;
$$ LANGUAGE plpgsql;