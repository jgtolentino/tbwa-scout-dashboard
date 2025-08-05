import { callRPC } from '../lib/supabase';

// Helper function to extract data from RPC response
function extractRPCData(data: any, functionName: string): any[] {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  // RPC functions return: [{"function_name": [...actual_data...]}]
  const responseObj = data[0];
  if (responseObj && responseObj[functionName]) {
    return responseObj[functionName];
  }
  
  // Fallback - if data is already in correct format
  return Array.isArray(data) ? data : [];
}

export const dashboardAPI = {
  async getCampaignEffect() {
    try {
      console.log('🚀 Calling getCampaignEffect...');
      const rawData = await callRPC('get_gold_campaign_effect');
      const extractedData = extractRPCData(rawData, 'get_gold_campaign_effect');
      console.log('✅ Campaign Effect Data:', extractedData);
      return extractedData;
    } catch (error) {
      console.error('❌ Failed to get campaign effect:', error);
      return [];
    }
  },

  async getCustomerActivity() {
    try {
      console.log('🚀 Calling getCustomerActivity...');
      const rawData = await callRPC('get_gold_customer_activity');
      const extractedData = extractRPCData(rawData, 'get_gold_customer_activity');
      console.log('✅ Customer Activity Data:', extractedData);
      return extractedData;
    } catch (error) {
      console.error('❌ Failed to get customer activity:', error);
      return [];
    }
  },

  async getDemandForecast() {
    try {
      console.log('🚀 Calling getDemandForecast...');
      const rawData = await callRPC('get_gold_demand_forecast');
      const extractedData = extractRPCData(rawData, 'get_gold_demand_forecast');
      console.log('✅ Demand Forecast Data:', extractedData);  
      return extractedData;
    } catch (error) {
      console.error('❌ Failed to get demand forecast:', error);
      return [];
    }
  },

  async getPersonaRegionMetrics() {
    try {
      console.log('🚀 Calling getPersonaRegionMetrics...');
      const rawData = await callRPC('get_gold_persona_region_metrics');
      const extractedData = extractRPCData(rawData, 'get_gold_persona_region_metrics');
      console.log('✅ Persona Region Metrics Data:', extractedData);
      return extractedData;
    } catch (error) {
      console.error('❌ Failed to get persona region metrics:', error);
      return [];
    }
  },

  async getRegionalPerformance() {
    try {
      console.log('🚀 Calling getRegionalPerformance...');
      const rawData = await callRPC('get_gold_regional_performance');
      const extractedData = extractRPCData(rawData, 'get_gold_regional_performance');
      console.log('✅ Regional Performance Data:', extractedData);
      return extractedData;
    } catch (error) {
      console.error('❌ Failed to get regional performance:', error);
      return [];
    }
  },

  async getProductMetrics() {
    try {
      console.log('🚀 Calling getProductMetrics...');
      const rawData = await callRPC('get_gold_product_metrics');
      const extractedData = extractRPCData(rawData, 'get_gold_product_metrics');
      console.log('✅ Product Metrics Data:', extractedData);
      return extractedData;
    } catch (error) {
      console.error('❌ Failed to get product metrics:', error);
      return [];
    }
  },

  async getBasketAnalysis() {
    try {
      console.log('🚀 Calling getBasketAnalysis...');
      const rawData = await callRPC('get_gold_basket_analysis');
      const extractedData = extractRPCData(rawData, 'get_gold_basket_analysis');
      console.log('✅ Basket Analysis Data:', extractedData);
      return extractedData;
    } catch (error) {
      console.error('❌ Failed to get basket analysis:', error);
      return [];
    }
  },

  async testAllEndpoints() {
    const results: Record<string, boolean> = {};
    
    console.log('🧪 Starting comprehensive API tests...');
    
    const tests = [
      { name: 'campaign_effect', fn: () => this.getCampaignEffect() },
      { name: 'customer_activity', fn: () => this.getCustomerActivity() },
      { name: 'demand_forecast', fn: () => this.getDemandForecast() },
      { name: 'persona_region_metrics', fn: () => this.getPersonaRegionMetrics() },
      { name: 'regional_performance', fn: () => this.getRegionalPerformance() },
      { name: 'product_metrics', fn: () => this.getProductMetrics() },
      { name: 'basket_analysis', fn: () => this.getBasketAnalysis() },
    ];

    for (const test of tests) {
      try {
        console.log(`\n🔍 Testing ${test.name}...`);
        const result = await test.fn();
        const hasData = Array.isArray(result) && result.length > 0;
        results[test.name] = hasData;
        
        if (hasData) {
          console.log(`✅ ${test.name}: SUCCESS (${result.length} records)`);
        } else {
          console.log(`⚠️  ${test.name}: NO DATA (but no error)`);
        }
      } catch (error) {
        results[test.name] = false;
        console.error(`❌ ${test.name}: FAILED`, error);
      }
    }

    console.log('\n📊 Final Test Results:', results);
    return results;
  },

  // Test individual endpoint for debugging
  async testSingleEndpoint(endpointName: string) {
    console.log(`🔬 Testing single endpoint: ${endpointName}`);
    
    const testMap: Record<string, () => Promise<any>> = {
      'campaign_effect': () => this.getCampaignEffect(),
      'customer_activity': () => this.getCustomerActivity(),
      'demand_forecast': () => this.getDemandForecast(),
      'persona_region_metrics': () => this.getPersonaRegionMetrics(),
      'regional_performance': () => this.getRegionalPerformance(),
      'product_metrics': () => this.getProductMetrics(),
      'basket_analysis': () => this.getBasketAnalysis(),
    };

    const testFn = testMap[endpointName];
    if (!testFn) {
      console.error(`❌ Unknown endpoint: ${endpointName}`);
      return null;
    }

    try {
      const result = await testFn();
      console.log(`✅ ${endpointName} result:`, result);
      return result;
    } catch (error) {
      console.error(`❌ ${endpointName} failed:`, error);
      return null;
    }
  }
};

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).dashboardAPI = dashboardAPI;
}

export default dashboardAPI;