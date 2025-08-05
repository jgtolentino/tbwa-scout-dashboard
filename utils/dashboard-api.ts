import { callRPC } from '../lib/utils/supabase';

export const dashboardAPI = {
  async getCampaignEffect() {
    try {
      return await callRPC('get_gold_campaign_effect');
    } catch (error) {
      console.error('Failed to get campaign effect:', error);
      return [];
    }
  },

  async getCustomerActivity() {
    try {
      return await callRPC('get_gold_customer_activity');
    } catch (error) {
      console.error('Failed to get customer activity:', error);
      return [];
    }
  },

  async getDemandForecast() {
    try {
      return await callRPC('get_gold_demand_forecast');
    } catch (error) {
      console.error('Failed to get demand forecast:', error);
      return [];
    }
  },

  async getPersonaRegionMetrics() {
    try {
      return await callRPC('get_gold_persona_region_metrics');
    } catch (error) {
      console.error('Failed to get persona region metrics:', error);
      return [];
    }
  },

  async getRegionalPerformance() {
    try {
      return await callRPC('get_gold_regional_performance');
    } catch (error) {
      console.error('Failed to get regional performance:', error);
      return [];
    }
  },

  async getProductMetrics() {
    try {
      return await callRPC('get_gold_product_metrics');
    } catch (error) {
      console.error('Failed to get product metrics:', error);
      return [];
    }
  },

  async getBasketAnalysis() {
    try {
      return await callRPC('get_gold_basket_analysis');
    } catch (error) {
      console.error('Failed to get basket analysis:', error);
      return [];
    }
  },

  async testAllEndpoints() {
    const results: Record<string, boolean> = {};
    
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
        const result = await test.fn();
        results[test.name] = Array.isArray(result) ? result.length > 0 : !!result;
        console.log(`✅ ${test.name}: ${results[test.name] ? 'SUCCESS' : 'NO DATA'}`);
      } catch (error) {
        results[test.name] = false;
        console.error(`❌ ${test.name}: FAILED`, error);
      }
    }

    return results;
  }
};

export default dashboardAPI;