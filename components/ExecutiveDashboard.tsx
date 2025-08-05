import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, MapPin, Star, ShoppingCart, Target, RefreshCw } from 'lucide-react';
import sariSariAI from '../utils/sari-sari-ai-api';
import dashboardAPI from '../utils/dashboard-api';

const ExecutiveDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [summary, personas, campaigns, products] = await Promise.all([
          sariSariAI.getDailyInferences(),
          dashboardAPI.getPersonaRegionMetrics(),
          dashboardAPI.getCampaignEffect(),
          dashboardAPI.getProductMetrics()
        ]);
        
        setData({ summary, personas, campaigns, products });
      } catch (error) {
        console.error('Dashboard loading error:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Overview</h1>
          <p className="text-gray-600">Real-time insights from your sari-sari store network</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₱2.4M</p>
          <p className="text-sm text-green-600">+12.5% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Customers</h3>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.summary?.customer_segments_identified || 8}</p>
          <p className="text-sm text-blue-600">+8.3% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Daily Inferences</h3>
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.summary?.total_inferences || 47}</p>
          <p className="text-sm text-purple-600">95% confidence</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Regions</h3>
            <MapPin className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">17</p>
          <p className="text-sm text-orange-600">+5.7% vs last month</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Personas */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Personas</h3>
          <div className="space-y-4">
            {(data.personas || []).slice(0, 4).map((persona: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {persona.persona_type || `Persona ${index + 1}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {persona.percentage || 0}% of customers • {persona.region || 'All regions'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            {(data.campaigns || []).slice(0, 4).map((campaign: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {campaign.campaign_name || `Campaign ${index + 1}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {campaign.brand_name} • {campaign.roi || 0}% ROI • {campaign.impact || 'medium'} impact
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
