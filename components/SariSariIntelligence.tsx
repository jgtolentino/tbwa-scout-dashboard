'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Store, 
  BarChart3, 
  RefreshCw,
  Zap,
  Target,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import TransactionInference from './TransactionInference';
import PersonaCard from './PersonaCard';
import ROIRecommendations from './ROIRecommendations';
import { EDGE_FUNCTIONS, getEdgeFunctionUrl, getApiHeaders } from '@/lib/config/edge-functions';

interface SariSariIntelligenceProps {
  storeId?: string;
}

const SariSariIntelligence: React.FC<SariSariIntelligenceProps> = ({ storeId = '1' }) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [personas, setPersonas] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentInferences, setRecentInferences] = useState<any[]>([]);

  // TBWA Design tokens
  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
      tbwaLightGray: '#F5F5F5',
      tbwaDarkYellow: '#E6C200',
      tbwaBlue: '#1E40AF',
      accentPurple: '#6B46C1',
      accentEmerald: '#059669',
      accentRed: '#DC2626',
      accentOrange: '#D97706'
    }
  };

  // Load personas and insights
  const loadSariSariData = async () => {
    setLoading(true);
    try {
      // Load personas
      const personasResponse = await fetch(getEdgeFunctionUrl(EDGE_FUNCTIONS.PERSONA_INSIGHTS), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          store_id: storeId,
          include_business_value: true
        })
      });

      if (personasResponse.ok) {
        const personasData = await personasResponse.json();
        setPersonas(personasData.personas || []);
      }

      // Load general insights
      const insightsResponse = await fetch(getEdgeFunctionUrl(EDGE_FUNCTIONS.SARI_SARI_EXPERT), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          type: 'overview',
          store_id: storeId
        })
      });

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setInsights(insightsData);
      }
    } catch (error) {
      console.error('Failed to load Sari-Sari data:', error);
      // Load mock data
      setPersonas(getMockPersonas());
      setInsights(getMockInsights());
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const getMockPersonas = () => [
    {
      persona_type: 'Juan',
      demographic_profile: {
        age_range: '25-45',
        gender: 'Male',
        occupation: 'Construction Worker',
        income_level: 'Lower-Middle',
        location_type: 'Urban'
      },
      behavioral_patterns: {
        peak_shopping_times: 'Afternoon (2-6PM)',
        shopping_frequency: '5-7 times/week',
        payment_preference: 'Cash'
      },
      product_preferences: {
        top_categories: ['Cigarettes', 'Beverages', 'Instant Meals', 'Energy Drinks', 'Phone Load']
      },
      business_value: {
        average_transaction_value: 25,
        monthly_ltv: 750,
        frequency_score: 85
      },
      regional_affinity: {
        top_regions: ['Metro Manila', 'Cebu'],
        seasonal_pattern: 'Consistent'
      }
    },
    {
      persona_type: 'Maria',
      demographic_profile: {
        age_range: '30-50',
        gender: 'Female',
        occupation: 'Housewife',
        income_level: 'Middle',
        location_type: 'Residential'
      },
      behavioral_patterns: {
        peak_shopping_times: 'Morning (7-10AM)',
        shopping_frequency: '3-4 times/week',
        payment_preference: 'GCash/Cash'
      },
      product_preferences: {
        top_categories: ['Cooking Ingredients', 'Kids Snacks', 'Household Items', 'School Supplies', 'Medicine']
      },
      business_value: {
        average_transaction_value: 45,
        monthly_ltv: 540,
        frequency_score: 60
      },
      regional_affinity: {
        top_regions: ['Luzon', 'Visayas'],
        seasonal_pattern: 'School Season High'
      }
    }
  ];

  const getMockInsights = () => ({
    total_inferences_today: 47,
    average_confidence: 0.83,
    top_persona: 'Juan - Urban Worker',
    revenue_opportunities: 15400,
    implemented_recommendations: 3,
    pending_recommendations: 8
  });

  // Handle inference completion
  const handleInferenceComplete = (result: any) => {
    setRecentInferences(prev => [result, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    loadSariSariData();
  }, [storeId]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          style={{ borderTop: `4px solid ${tokens.colors.accentEmerald}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Daily Inferences</p>
              <p className="text-3xl font-black" style={{ color: tokens.colors.tbwaBlack }}>
                {insights?.total_inferences_today || 47}
              </p>
            </div>
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tokens.colors.accentEmerald }}
            >
              <Brain className="h-7 w-7" style={{ color: tokens.colors.tbwaWhite }} />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          style={{ borderTop: `4px solid ${tokens.colors.tbwaBlue}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Avg Confidence</p>
              <p className="text-3xl font-black" style={{ color: tokens.colors.tbwaBlack }}>
                {((insights?.average_confidence || 0.83) * 100).toFixed(1)}%
              </p>
            </div>
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tokens.colors.tbwaBlue }}
            >
              <Target className="h-7 w-7" style={{ color: tokens.colors.tbwaWhite }} />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          style={{ borderTop: `4px solid ${tokens.colors.accentOrange}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Revenue Opportunities</p>
              <p className="text-3xl font-black" style={{ color: tokens.colors.tbwaBlack }}>
                ₱{(insights?.revenue_opportunities || 15400).toLocaleString()}
              </p>
            </div>
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tokens.colors.accentOrange }}
            >
              <DollarSign className="h-7 w-7" style={{ color: tokens.colors.tbwaWhite }} />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          style={{ borderTop: `4px solid ${tokens.colors.accentPurple}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Active Recommendations</p>
              <p className="text-3xl font-black" style={{ color: tokens.colors.tbwaBlack }}>
                {(insights?.pending_recommendations || 8)}
              </p>
            </div>
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tokens.colors.accentPurple }}
            >
              <Zap className="h-7 w-7" style={{ color: tokens.colors.tbwaWhite }} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Personas Quick View */}
      <div 
        className="rounded-xl p-6 shadow-sm border"
        style={{ 
          backgroundColor: tokens.colors.tbwaWhite,
          borderColor: tokens.colors.tbwaLightGray,
          borderTop: `4px solid ${tokens.colors.tbwaBlue}`
        }}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: tokens.colors.tbwaBlack }}>
          <Users className="h-5 w-5 mr-2" />
          Top Customer Personas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.slice(0, 2).map((persona, index) => (
            <PersonaCard 
              key={index} 
              persona={persona} 
              compact={true}
              onClick={() => setActiveSubTab('personas')}
            />
          ))}
        </div>
      </div>

      {/* Recent Inferences */}
      {recentInferences.length > 0 && (
        <div 
          className="rounded-xl p-6 shadow-sm border"
          style={{ 
            backgroundColor: tokens.colors.tbwaWhite,
            borderColor: tokens.colors.tbwaLightGray,
            borderTop: `4px solid ${tokens.colors.accentEmerald}`
          }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: tokens.colors.tbwaBlack }}>
            <BarChart3 className="h-5 w-5 mr-2" />
            Recent Transaction Inferences
          </h3>
          <div className="space-y-3">
            {recentInferences.slice(0, 3).map((inference, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: tokens.colors.tbwaLightGray }}
              >
                <div>
                  <p className="font-semibold" style={{ color: tokens.colors.tbwaBlack }}>
                    {inference.persona_analysis?.persona}
                  </p>
                  <p className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
                    ₱{inference.inferred_transaction?.total_spent} • {inference.inferred_transaction?.likely_products?.length} products
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: tokens.colors.accentEmerald }}>
                    {(inference.inferred_transaction?.confidence_score * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>
                    Confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const subTabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'inference', label: 'Transaction Inference', icon: Brain },
    { key: 'personas', label: 'Customer Personas', icon: Users },
    { key: 'recommendations', label: 'ROI Recommendations', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ backgroundColor: tokens.colors.tbwaBlack }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `radial-gradient(circle at 25% 25%, ${tokens.colors.tbwaYellow} 0%, transparent 50%)`
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-black mb-2 uppercase tracking-tight"
                style={{ color: tokens.colors.tbwaYellow }}
              >
                Sari-Sari Expert Bot
              </h1>
              <p 
                className="text-lg font-medium"
                style={{ color: tokens.colors.tbwaWhite, opacity: 0.9 }}
              >
                AI-powered transaction inference and customer persona analysis
              </p>
            </div>
            
            <button
              onClick={loadSariSariData}
              disabled={loading}
              className="flex items-center px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ 
                backgroundColor: tokens.colors.tbwaYellow,
                color: tokens.colors.tbwaBlack
              }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation */}
      <div 
        className="flex space-x-1 p-1 rounded-xl"
        style={{ backgroundColor: tokens.colors.tbwaWhite }}
      >
        {subTabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wide ${
              activeSubTab === key ? 'shadow-md transform scale-105' : 'hover:scale-102'
            }`}
            style={{
              backgroundColor: activeSubTab === key ? tokens.colors.tbwaBlack : 'transparent',
              color: activeSubTab === key ? tokens.colors.tbwaYellow : tokens.colors.tbwaGray
            }}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div 
                className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 mx-auto mb-4"
                style={{ borderTopColor: tokens.colors.tbwaYellow }}
              ></div>
              <div 
                className="text-lg font-bold"
                style={{ color: tokens.colors.tbwaGray }}
              >
                Loading Sari-Sari intelligence...
              </div>
            </div>
          </div>
        )}
        
        {!loading && (
          <>
            {activeSubTab === 'overview' && renderOverview()}
            {activeSubTab === 'inference' && (
              <TransactionInference onInferenceComplete={handleInferenceComplete} />
            )}
            {activeSubTab === 'personas' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {personas.map((persona, index) => (
                    <PersonaCard key={index} persona={persona} showDetails={true} />
                  ))}
                </div>
              </div>
            )}
            {activeSubTab === 'recommendations' && (
              <ROIRecommendations storeId={storeId} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SariSariIntelligence;