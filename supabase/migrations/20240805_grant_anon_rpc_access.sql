-- Grant execute permission to anon role for RPC functions
-- This allows unauthenticated users to call these functions

-- Grant execute on all scout schema functions to anon
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA scout TO anon;

-- Specifically grant execute on each function (for clarity)
GRANT EXECUTE ON FUNCTION scout.get_gold_campaign_effect() TO anon;
GRANT EXECUTE ON FUNCTION scout.get_gold_customer_activity() TO anon;
GRANT EXECUTE ON FUNCTION scout.get_gold_basket_analysis() TO anon;
GRANT EXECUTE ON FUNCTION scout.get_gold_persona_region_metrics() TO anon;
GRANT EXECUTE ON FUNCTION scout.get_gold_demand_forecast() TO anon;
GRANT EXECUTE ON FUNCTION scout.get_gold_product_metrics() TO anon;
GRANT EXECUTE ON FUNCTION scout.get_gold_regional_performance() TO anon;
GRANT EXECUTE ON FUNCTION scout.geo_choropleth(text, text) TO anon;

-- Also grant usage on the scout schema itself
GRANT USAGE ON SCHEMA scout TO anon;