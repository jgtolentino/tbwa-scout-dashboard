#!/bin/bash

# CORS Verification Script for Scout v5
# Tests all Edge Functions for proper CORS headers

echo "🔍 Scout v5 CORS Verification"
echo "============================"
echo ""

# Get Supabase URL and anon key from environment
SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-"https://cxzllzyxwpyptfretryc.supabase.co"}
ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-""}

if [ -z "$ANON_KEY" ]; then
  echo "❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not set"
  echo "Please set it in your .env.local file"
  exit 1
fi

# List of functions to test
FUNCTIONS=(
  "wren-query"
  "geo_choropleth"
  "scout-dashboard-api"
  "geographic-insights"
  "consumer-insights-enhanced"
)

echo "Testing Edge Functions CORS..."
echo ""

# Test each function
for fn in "${FUNCTIONS[@]}"; do
  echo -n "Testing $fn... "
  
  # Send OPTIONS request
  OPTIONS_RESPONSE=$(curl -s -X OPTIONS \
    -H "Origin: https://tbwa-scout-dashboard.vercel.app" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: authorization,content-type" \
    -w "\n%{http_code}" \
    "$SUPABASE_URL/functions/v1/$fn" 2>/dev/null)
  
  STATUS_CODE=$(echo "$OPTIONS_RESPONSE" | tail -n 1)
  
  if [ "$STATUS_CODE" = "200" ] || [ "$STATUS_CODE" = "204" ]; then
    echo "✅ OPTIONS OK"
  else
    echo "❌ OPTIONS failed (HTTP $STATUS_CODE)"
  fi
  
  # Send POST request to check CORS headers
  echo -n "  POST test... "
  POST_RESPONSE=$(curl -s -X POST \
    -H "Origin: https://tbwa-scout-dashboard.vercel.app" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "apikey: $ANON_KEY" \
    -d '{"test": true}' \
    -D - \
    "$SUPABASE_URL/functions/v1/$fn" 2>/dev/null | head -n 20)
  
  # Check for CORS headers
  if echo "$POST_RESPONSE" | grep -q "access-control-allow-origin"; then
    echo "✅ CORS headers present"
  else
    echo "❌ Missing CORS headers"
  fi
  
  echo ""
done

echo ""
echo "📋 Summary"
echo "=========="
echo ""
echo "✅ Functions with CORS: Check output above"
echo "❌ Functions without CORS: Need updating"
echo ""
echo "🔗 Production URL: https://tbwa-scout-dashboard.vercel.app"
echo ""
echo "Next steps:"
echo "1. Update any functions showing ❌"
echo "2. Deploy updated functions: supabase functions deploy <name>"
echo "3. Test in browser console"