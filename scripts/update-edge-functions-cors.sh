#!/bin/bash

# Script to update all Edge Functions with CORS handling
# This generates the updated functions locally for deployment

echo "🔄 Updating Edge Functions with CORS support..."

# Create the base CORS template
CORS_TEMPLATE='import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // YOUR_FUNCTION_LOGIC_HERE

    return new Response(
      JSON.stringify({ data: "response" }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 500,
      }
    );
  }
});'

# List of Edge Functions that need CORS
EDGE_FUNCTIONS=(
  "scout-dashboard-api"
  "geographic-insights"
  "competitive-insights"
  "consumer-insights-enhanced"
  "wren-query"
  "geo_choropleth"
  "gold_persona_region_metrics"
  "gold_customer_activity"
  "gold_regional_performance"
  "gold_peak_hours_analysis"
  "gold_product_bundles"
  "gold_category_mix"
  "gold_demand_forecast"
  "gold_promotion_effectiveness"
)

# Create CORS examples directory
mkdir -p supabase/functions/cors-examples

# Generate example for each function
for fn in "${EDGE_FUNCTIONS[@]}"; do
  echo "📝 Creating CORS example for: $fn"
  
  # Create function directory
  mkdir -p "supabase/functions/cors-examples/$fn"
  
  # Create the index.ts with CORS
  cat > "supabase/functions/cors-examples/$fn/index.ts" << EOF
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    
    // Example: Call the corresponding gold layer view
    const { data, error } = await supabase
      .rpc("$fn", body);

    if (error) throw error;

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 500,
      }
    );
  }
});
EOF
done

echo "✅ CORS examples created in supabase/functions/cors-examples/"
echo ""
echo "📋 Next steps:"
echo "1. Review each function in cors-examples/"
echo "2. Copy the CORS handling to your actual Edge Functions"
echo "3. Deploy using: supabase functions deploy <function-name>"
echo ""
echo "🌐 Vercel domains to add to Supabase CORS settings:"
echo "   - https://tbwa-scout-dashboard.vercel.app"
echo "   - https://tbwa-scout-dashboard-*.vercel.app"
echo "   - https://*.vercel.app"
echo "   - http://localhost:3000"
echo "   - http://localhost:3001"