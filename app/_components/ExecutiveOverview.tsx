'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card } from './Card';
import { scoutFetch } from '@/lib/utils/scoutFetch';
import { 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  BarChart3,
  Map,
  Clock,
  Package,
  Zap
} from 'lucide-react';

// Dynamically import map component to avoid SSR issues
const ChoroplethMap = dynamic(() => import('./tiles/ChoroplethMap'), { 
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading map...</div>
});

// Import tile components
import PersonaMixChart from './tiles/PersonaMixChart';
import LoyaltySpark from './tiles/LoyaltySpark';
import HeatMatrix from './tiles/HeatMatrix';
import TopBundlesTable from './tiles/TopBundlesTable';
import CategoryBarRace from './tiles/CategoryBarRace';
import ForecastWidget from './tiles/ForecastWidget';
import PromoImpactList from './tiles/PromoImpactList';

export const ExecutiveOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    personas?: any;
    loyalty?: any;
    regional?: any;
    peakHours?: any;
    bundles?: any;
    categories?: any;
    forecast?: any;
    promos?: any;
  }>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Parallel fetch all data sources
      const [
        personasData,
        loyaltyData,
        regionalData,
        activityData,
        bundlesData,
        categoriesData,
        forecastData,
        promoData
      ] = await Promise.all([
        scoutFetch('gold_persona_region_metrics').catch(() => null),
        scoutFetch('gold_customer_activity').catch(() => null),
        scoutFetch('gold_regional_performance').catch(() => null),
        scoutFetch('gold_customer_activity', { analysis: 'peak_hours' }).catch(() => null),
        scoutFetch('gold_basket_analysis').catch(() => null),
        scoutFetch('gold_product_metrics').catch(() => null),
        scoutFetch('gold_demand_forecast').catch(() => null),
        scoutFetch('gold_campaign_effect').catch(() => null)
      ]);

      setData({
        personas: personasData,
        loyalty: loyaltyData,
        regional: regionalData,
        peakHours: activityData,
        bundles: bundlesData,
        categories: categoriesData,
        forecast: forecastData,
        promos: promoData
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tokens = {
    colors: {
      babyBlue: '#4f6ef7',
      lavender: '#8a6bff',
      mintGreen: '#97de9b',
      peach: '#ffddb0'
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Row 1 */}
      <Card span={4} title="Persona Mix" borderColor={tokens.colors.babyBlue}>
        <PersonaMixChart data={data.personas} loading={loading} />
      </Card>
      
      <Card span={4} title="Regional Performance" borderColor={tokens.colors.lavender}>
        <div className="h-64">
          <ChoroplethMap data={data.regional} metric="revenue" />
        </div>
      </Card>
      
      <Card span={4} title="90-Day Forecast" borderColor={tokens.colors.peach}>
        <ForecastWidget data={data.forecast} loading={loading} />
      </Card>

      {/* Row 2 */}
      <Card span={3} title="Loyalty Index" borderColor={tokens.colors.babyBlue}>
        <LoyaltySpark data={data.loyalty} loading={loading} />
      </Card>
      
      <Card span={6} title="Peak Transaction Hours" borderColor={tokens.colors.lavender}>
        <HeatMatrix data={data.peakHours} loading={loading} />
      </Card>
      
      <Card span={3} title="Promo Impact" borderColor={tokens.colors.peach}>
        <PromoImpactList data={data.promos} loading={loading} />
      </Card>

      {/* Row 3 */}
      <Card span={6} title="Top Product Bundles" borderColor={tokens.colors.mintGreen}>
        <TopBundlesTable data={data.bundles} loading={loading} />
      </Card>
      
      <Card span={6} title="Category Performance" borderColor={tokens.colors.mintGreen}>
        <CategoryBarRace data={data.categories} loading={loading} />
      </Card>
    </div>
  );
};