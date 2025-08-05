// Supabase Edge Functions Configuration
export const EDGE_FUNCTIONS = {
  // Base URL
  BASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxzllzyxwpyptfretryc.supabase.co',
  
  // Scout Dashboard Core APIs
  SCOUT_DASHBOARD_API: '/functions/v1/scout-dashboard-api',
  COMPLETE_SCOUT_API: '/functions/v1/complete-scout-api-system',
  SCOUT_API: '/functions/v1/scout-api',
  REAL_DASHBOARD_API: '/functions/v1/real-dashboard-api',
  
  // Analytics & Insights
  CONSUMER_INSIGHTS: '/functions/v1/consumer-insights',
  CONSUMER_INSIGHTS_ENHANCED: '/functions/v1/consumer-insights-enhanced',
  GEOGRAPHIC_INSIGHTS: '/functions/v1/geographic-insights',
  COMPETITIVE_INSIGHTS: '/functions/v1/competitive-insights',
  PREDICTIVE_INSIGHTS: '/functions/v1/predictive-insights',
  AI_GENERATED_INSIGHTS: '/functions/v1/ai-generated-insights',
  
  // Geographic APIs
  GEOGRAPHIC_ANALYTICS: '/functions/v1/geographic-analytics',
  GEO_CHOROPLETH: '/functions/v1/geo_choropleth',
  PHILIPPINES_LOCATIONS_API: '/functions/v1/philippines-locations-api',
  MUNICIPALITIES_GEOJSON: '/functions/v1/municipalities-geojson',
  
  // AI & Query Processing
  SUQI_BOT: '/functions/v1/suqi-bot',
  WRENAI_INTEGRATION: '/functions/v1/wrenai-integration',
  ENHANCED_WRENAI_RAG: '/functions/v1/enhanced-wrenai-rag',
  SCOUT_QUERY_PROCESSOR: '/functions/v1/scout-query-processor',
  RAG_CHAT: '/functions/v1/rag-chat',
  WREN_QUERY: '/functions/v1/wren-query',
  
  // Real-time & Metrics
  REALTIME_METRICS: '/functions/v1/realtime-metrics',
  SUBSTITUTION_ANALYTICS: '/functions/v1/substitution-analytics',
  RETAIL_ANALYTICS_API: '/functions/v1/retail-analytics-api',
  
  // Data Processing
  SCOUT_ETL: '/functions/v1/scout-etl',
  TRANSFORM_TO_SILVER: '/functions/v1/transform_to_silver',
  SYNC_INTELLIGENCE_DATA: '/functions/v1/sync-intelligence-data',
  REAL_TIME_DATA_SYNC: '/functions/v1/real-time-data-sync',
  
  // Utility Functions
  HEALTH_CHECK: '/functions/v1/health-check',
  SSOT_STATUS: '/functions/v1/ssot-status',
  INFRASTRUCTURE_TOOLS: '/functions/v1/infrastructure-tools',
  
  // Chart & Visualization
  CHARTVISION: '/functions/v1/chartvision',
  GET_INSIGHT_CARD: '/functions/v1/get-insight-card',
  GENERATE_INSIGHT: '/functions/v1/generate-insight',
  
  // Sari-Sari Expert Bot System
  SARI_SARI_EXPERT: '/functions/v1/sari-sari-expert-advanced',
  TRANSACTION_INFERENCE: '/functions/v1/transaction-inference',
  PERSONA_MATCHING: '/functions/v1/persona-matching',
  ROI_RECOMMENDATIONS: '/functions/v1/roi-recommendations',
  PERSONA_INSIGHTS: '/functions/v1/persona-insights'
};

// Helper function to build full URL
export const getEdgeFunctionUrl = (functionPath: string): string => {
  return `${EDGE_FUNCTIONS.BASE_URL}${functionPath}`;
};

// API Headers helper
export const getApiHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
});