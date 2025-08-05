import { callEdgeFunction, supabase } from './supabase';

/**
 * Unified fetch wrapper for Scout v5 Edge Functions with JWT authentication
 * Uses Supabase functions.invoke which handles CORS properly
 * @param fn - Edge function name
 * @param payload - Request payload
 * @returns Promise with response data
 */
export async function scoutFetch(fn: string, payload?: any) {
  try {
    // Use the Supabase functions.invoke method which handles CORS properly
    const data = await callEdgeFunction(fn, payload);
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${fn}:`, error);
    
    // Return mock data in development if edge function fails
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Returning mock data for ${fn}`);
      return getMockData(fn);
    }
    
    throw error;
  }
}

/**
 * Helper to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Helper to get current user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Mock data fallback for development
function getMockData(fn: string) {
  const mockData: Record<string, any> = {
    'gold_persona_region_metrics': [
      { persona_type: 'Price Sensitive', percentage: 35 },
      { persona_type: 'Convenience Seekers', percentage: 30 },
      { persona_type: 'Quality Conscious', percentage: 20 },
      { persona_type: 'Bulk Buyers', percentage: 15 }
    ],
    'gold_customer_activity': {
      metric_value: 45.2,
      trend: [40, 42, 43, 44, 45, 45.2]
    },
    'geo_regional_performance': [
      { region_name: 'Metro Manila', metric_value: 1500000 },
      { region_name: 'Cebu', metric_value: 1200000 },
      { region_name: 'Davao', metric_value: 1000000 }
    ],
    'gold_peak_hours_analysis': {
      heatmap: Array(24).fill(Array(7).fill(0)).map(() => 
        Array(7).fill(0).map(() => Math.random() * 100)
      )
    },
    'gold_product_bundles': [
      { bundle_name: 'Rice + Cooking Oil', frequency: 850, avg_revenue: 320 },
      { bundle_name: 'Coffee + Sugar', frequency: 720, avg_revenue: 150 },
      { bundle_name: 'Detergent + Fabric Softener', frequency: 650, avg_revenue: 280 }
    ],
    'gold_category_mix': [
      { category_name: 'Beverages', percentage: 28 },
      { category_name: 'Snacks', percentage: 24 },
      { category_name: 'Personal Care', percentage: 20 },
      { category_name: 'Household', percentage: 18 },
      { category_name: 'Tobacco', percentage: 10 }
    ],
    'gold_demand_forecast': {
      dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
      predicted: [100000, 105000, 110000, 108000, 112000, 115000],
      upper_bound: [102000, 107000, 112000, 110000, 114000, 117000],
      lower_bound: [98000, 103000, 108000, 106000, 110000, 113000]
    },
    'gold_promotion_effectiveness': [
      { campaign_name: 'Summer Sale 2024', roi: 3.2, impact: 'high' },
      { campaign_name: 'Back to School', roi: 2.8, impact: 'medium' },
      { campaign_name: 'Holiday Bundle', roi: 4.1, impact: 'high' }
    ]
  };
  
  return mockData[fn] || [];
}