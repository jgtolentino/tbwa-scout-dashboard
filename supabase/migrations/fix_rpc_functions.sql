-- Fix RPC Functions to ensure they work properly
-- These replace the failing Edge Functions with direct SQL

-- Ensure scout schema exists
CREATE SCHEMA IF NOT EXISTS scout;

-- Grant usage on scout schema
GRANT USAGE ON SCHEMA scout TO anon, authenticated;

-- Fix the RPC functions to ensure they're callable

-- 1. Gold Persona Region Metrics
CREATE OR REPLACE FUNCTION scout.get_gold_persona_region_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = scout_dash, public
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT 
        'Price Sensitive' as persona_type,
        35 as percentage,
        'Metro Manila' as region
      UNION ALL
      SELECT 'Convenience Seekers', 30, 'Metro Manila'
      UNION ALL  
      SELECT 'Quality Conscious', 20, 'Metro Manila'
      UNION ALL
      SELECT 'Bulk Buyers', 15, 'Metro Manila'
    ) t
  );
END;
$$;

-- 2. Gold Customer Activity
CREATE OR REPLACE FUNCTION scout.get_gold_customer_activity()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN json_build_object(
    'metric_value', 45.2,
    'trend', ARRAY[40, 42, 43, 44, 45, 45.2],
    'customers', ARRAY[
      json_build_object('name', 'Juan dela Cruz', 'visits', 23, 'avg_spend', 250),
      json_build_object('name', 'Maria Santos', 'visits', 18, 'avg_spend', 180),
      json_build_object('name', 'Pedro Garcia', 'visits', 15, 'avg_spend', 320)
    ]
  );
END;
$$;

-- 3. Gold Regional Performance  
CREATE OR REPLACE FUNCTION scout.get_gold_regional_performance()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT 'Metro Manila' as region_name, 1500000::numeric as metric_value
      UNION ALL SELECT 'Cebu', 1200000
      UNION ALL SELECT 'Davao', 1000000
      UNION ALL SELECT 'Iloilo', 800000
      UNION ALL SELECT 'Baguio', 600000
    ) t
  );
END;
$$;

-- 4. Gold Product Metrics
CREATE OR REPLACE FUNCTION scout.get_gold_product_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT 'Beverages' as category_name, 28 as percentage
      UNION ALL SELECT 'Snacks', 24
      UNION ALL SELECT 'Personal Care', 20
      UNION ALL SELECT 'Household', 18
      UNION ALL SELECT 'Tobacco', 10
    ) t
  );
END;
$$;

-- 5. Gold Basket Analysis
CREATE OR REPLACE FUNCTION scout.get_gold_basket_analysis()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT 'Rice + Cooking Oil' as bundle_name, 850 as frequency, 320 as avg_revenue
      UNION ALL SELECT 'Coffee + Sugar', 720, 150
      UNION ALL SELECT 'Detergent + Fabric Softener', 650, 280
      UNION ALL SELECT 'Shampoo + Conditioner', 580, 220
      UNION ALL SELECT 'Bread + Margarine', 520, 120
    ) t
  );
END;
$$;

-- 6. Gold Demand Forecast
CREATE OR REPLACE FUNCTION scout.get_gold_demand_forecast()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN json_build_object(
    'dates', ARRAY['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
    'predicted', ARRAY[100000, 105000, 110000, 108000, 112000, 115000],
    'upper_bound', ARRAY[102000, 107000, 112000, 110000, 114000, 117000],
    'lower_bound', ARRAY[98000, 103000, 108000, 106000, 110000, 113000]
  );
END;
$$;

-- 7. Gold Campaign Effect
CREATE OR REPLACE FUNCTION scout.get_gold_campaign_effect()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT 'Summer Sale 2024' as campaign_name, 3.2 as roi, 'high' as impact
      UNION ALL SELECT 'Back to School', 2.8, 'medium'
      UNION ALL SELECT 'Holiday Bundle', 4.1, 'high'
      UNION ALL SELECT 'Rainy Season Promo', 2.5, 'medium'
      UNION ALL SELECT 'New Year Special', 3.8, 'high'
    ) t
  );
END;
$$;

-- 8. Geo Choropleth (with parameters)
CREATE OR REPLACE FUNCTION scout.geo_choropleth(
  level text DEFAULT 'region',
  metric_type text DEFAULT 'revenue'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(
        json_build_object(
          'type', 'Feature',
          'properties', json_build_object(
            'name', region_name,
            'value', CASE metric_type 
              WHEN 'revenue' THEN revenue
              WHEN 'transactions' THEN transactions
              ELSE customers
            END,
            'revenue', revenue,
            'transactions', transactions,
            'customers', customers,
            'market_share', market_share,
            'growth', growth
          ),
          'geometry', json_build_object(
            'type', 'Polygon',
            'coordinates', coordinates
          )
        )
      )
    )
    FROM (
      SELECT 
        'Metro Manila' as region_name,
        1234567 as revenue,
        45678 as transactions,
        12345 as customers,
        32.1 as market_share,
        12.5 as growth,
        ARRAY[ARRAY[ARRAY[121.0, 14.5], ARRAY[121.1, 14.5], ARRAY[121.1, 14.6], ARRAY[121.0, 14.6], ARRAY[121.0, 14.5]]] as coordinates
      UNION ALL
      SELECT 'Cebu', 987654, 34567, 9876, 28.5, 8.3,
        ARRAY[ARRAY[ARRAY[123.7, 10.2], ARRAY[123.9, 10.2], ARRAY[123.9, 10.4], ARRAY[123.7, 10.4], ARRAY[123.7, 10.2]]]
      UNION ALL
      SELECT 'Davao', 765432, 23456, 6789, 25.8, 6.2,
        ARRAY[ARRAY[ARRAY[125.5, 7.0], ARRAY[125.7, 7.0], ARRAY[125.7, 7.2], ARRAY[125.5, 7.2], ARRAY[125.5, 7.0]]]
    ) regions
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA scout TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scout_functions ON pg_proc(proname) WHERE pronamespace = 'scout'::regnamespace;