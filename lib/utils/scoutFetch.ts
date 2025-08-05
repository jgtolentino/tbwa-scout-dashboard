import { supabase } from './supabase';

/**
 * Unified fetch wrapper for Scout v5 using Supabase RPC
 * Bypasses CORS issues by using direct SQL functions
 * @param fn - RPC function name (without 'get_' prefix)
 * @param payload - Request payload
 * @returns Promise with response data
 */
export async function scoutFetch(fn: string, payload?: any) {
  try {
    // Map frontend function names to RPC function names
    const rpcFunctionMap: Record<string, string> = {
      // Gold layer views
      'gold_persona_region_metrics': 'get_gold_persona_region_metrics',
      'gold_customer_activity': 'get_gold_customer_activity',
      'gold_regional_performance': 'get_gold_regional_performance',
      'gold_peak_hours_analysis': 'get_gold_customer_activity', // Same function with analysis param
      'gold_basket_analysis': 'get_gold_basket_analysis',
      'gold_product_metrics': 'get_gold_product_metrics',
      'gold_category_mix': 'get_gold_product_metrics', // Same data, different view
      'gold_demand_forecast': 'get_gold_demand_forecast',
      'gold_campaign_effect': 'get_gold_campaign_effect',
      'gold_promotion_effectiveness': 'get_gold_campaign_effect', // Same function
      
      // Other functions
      'geo_choropleth': 'geo_choropleth',
      'wren-query': 'wren_query',
      'geographic-insights': 'get_geographic_insights',
      'consumer-insights-enhanced': 'get_consumer_insights',
      'competitive-insights': 'get_competitive_insights'
    };

    const rpcFunction = rpcFunctionMap[fn] || fn;
    
    // Special handling for functions that need specific parameters
    let rpcPayload = payload || {};
    
    // Handle peak hours analysis
    if (fn === 'gold_peak_hours_analysis') {
      const { data, error } = await supabase.rpc('get_gold_customer_activity');
      if (error) throw error;
      
      // Transform to peak hours format
      return {
        heatmap: generatePeakHoursHeatmap(data)
      };
    }
    
    // Handle category mix
    if (fn === 'gold_category_mix') {
      const { data, error } = await supabase.rpc('get_gold_product_metrics');
      if (error) throw error;
      
      // Transform to category format
      return data.map((item: any) => ({
        category_name: item.category || item.product_category,
        percentage: item.category_percentage || (item.sales_amount / item.total_sales * 100)
      }));
    }
    
    // Call the RPC function
    const { data, error } = await supabase.rpc(rpcFunction, rpcPayload);
    
    if (error) {
      console.error(`RPC error for ${rpcFunction}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${fn}:`, error);
    
    // Return mock data in development if RPC fails
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

// Helper to generate peak hours heatmap from activity data
function generatePeakHoursHeatmap(activityData: any[]) {
  // Create 24x7 matrix (hours x days)
  const heatmap = Array(24).fill(null).map(() => Array(7).fill(0));
  
  // If we have hourly data, use it
  if (activityData && activityData.length > 0) {
    activityData.forEach((item: any) => {
      if (item.hour !== undefined && item.day_of_week !== undefined) {
        heatmap[item.hour][item.day_of_week] = item.activity_score || item.transactions || 0;
      }
    });
  } else {
    // Generate mock heatmap
    for (let hour = 0; hour < 24; hour++) {
      for (let day = 0; day < 7; day++) {
        // Peak hours: 10am-12pm and 5pm-8pm
        const isPeakHour = (hour >= 10 && hour <= 12) || (hour >= 17 && hour <= 20);
        const isWeekend = day === 0 || day === 6;
        const baseValue = isPeakHour ? 80 : 30;
        const weekendMultiplier = isWeekend ? 1.2 : 1;
        heatmap[hour][day] = Math.floor(baseValue * weekendMultiplier + Math.random() * 20);
      }
    }
  }
  
  return heatmap;
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
    'gold_regional_performance': [
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
    'gold_basket_analysis': [
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
    'gold_product_metrics': [
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
    ],
    'gold_campaign_effect': [
      { campaign_name: 'Summer Sale 2024', roi: 3.2, impact: 'high' },
      { campaign_name: 'Back to School', roi: 2.8, impact: 'medium' },
      { campaign_name: 'Holiday Bundle', roi: 4.1, impact: 'high' }
    ]
  };
  
  return mockData[fn] || [];
}