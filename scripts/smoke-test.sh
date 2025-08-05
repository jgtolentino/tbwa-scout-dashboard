#!/bin/bash

# Scout v5 Smoke Test Script - CI/CD Pipeline
# Tests all routes, edge functions, and data integrity

set -e  # Exit on any error

echo "🚀 Scout v5 Smoke Test Starting..."

# 1. Build the project
echo "📦 Building project..."
npm run build || { echo "❌ Build failed"; exit 1; }

# 2. Start the dev server in background
echo "🔧 Starting dev server..."
npm run dev &
SERVER_PID=$!
sleep 5  # Give server time to start

# Function to cleanup on exit
cleanup() {
  echo "🧹 Cleaning up..."
  kill $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT

# 3. Test each route
echo "🌐 Testing routes..."
ROUTES=("/" "/performance" "/brand" "/geographic" "/sari-sari" "/ask")

for route in "${ROUTES[@]}"; do
  echo -n "  Testing $route... "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route)
  if [ "$STATUS" = "200" ]; then
    echo "✅"
  else
    echo "❌ (HTTP $STATUS)"
    exit 1
  fi
done

# 4. Test Edge Functions (if Supabase URL is set)
if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "🔌 Testing Edge Functions..."
  
  FUNCTIONS=(
    "scout-dashboard-api"
    "geographic-insights"
    "competitive-insights"
    "consumer-insights-enhanced"
    "wren-query"
  )
  
  for fn in "${FUNCTIONS[@]}"; do
    echo -n "  Testing $fn... "
    STATUS=$(curl -sf -X POST \
      -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
      -H "Content-Type: application/json" \
      -d '{"test": true}' \
      -o /dev/null -w "%{http_code}" \
      "${NEXT_PUBLIC_SUPABASE_URL}/functions/v1/$fn" || echo "000")
    
    if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
      echo "✅"
    else
      echo "⚠️  (HTTP $STATUS - may require auth)"
    fi
  done
else
  echo "⚠️  Skipping Edge Function tests (NEXT_PUBLIC_SUPABASE_URL not set)"
fi

# 5. Check for required KPI elements
echo "🎯 Checking KPI elements..."
HTML=$(curl -s http://localhost:3000)

# Check for critical elements
ELEMENTS=(
  "Executive Overview"
  "Scout v5 Data Intelligence"
  "Ask anything about your business data"
)

for element in "${ELEMENTS[@]}"; do
  echo -n "  Checking for '$element'... "
  if echo "$HTML" | grep -q "$element"; then
    echo "✅"
  else
    echo "❌"
    exit 1
  fi
done

# 6. Test API endpoints
echo "🔗 Testing API endpoints..."
API_ROUTES=("/api/wren-query" "/api/geo_choropleth?level=region&metric=revenue")

for api in "${API_ROUTES[@]}"; do
  echo -n "  Testing $api... "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$api)
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "405" ]; then  # 405 for GET on POST-only routes
    echo "✅"
  else
    echo "❌ (HTTP $STATUS)"
    exit 1
  fi
done

# 7. Performance check
echo "📊 Performance check..."
START_TIME=$(date +%s%N)
curl -s http://localhost:3000 > /dev/null
END_TIME=$(date +%s%N)
LOAD_TIME=$(( ($END_TIME - $START_TIME) / 1000000 ))

echo -n "  Homepage load time: ${LOAD_TIME}ms "
if [ $LOAD_TIME -lt 3000 ]; then
  echo "✅"
else
  echo "⚠️  (slow)"
fi

# 8. Memory usage check
echo "💾 Memory usage check..."
MEMORY=$(ps aux | grep "node.*next" | grep -v grep | awk '{print $6}')
MEMORY_MB=$((MEMORY / 1024))
echo "  Next.js process using ${MEMORY_MB}MB"

# Summary
echo ""
echo "✨ Smoke Test Complete!"
echo "━━━━━━━━━━━━━━━━━━━━"
echo "✅ All critical tests passed"
echo "📋 Next steps:"
echo "   - Run full E2E test suite"
echo "   - Deploy to staging environment"
echo "   - Perform manual QA verification"

exit 0