'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  Filter,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';
import { EDGE_FUNCTIONS, getEdgeFunctionUrl, getApiHeaders } from '@/lib/config/edge-functions';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  roi_percentage: number;
  revenue_potential: number;
  implementation_cost: number;
  timeline: string;
  confidence_score: number;
  success_rate: number;
  risk_level: string;
  supporting_data: any;
  implementation_steps: string[];
  is_implemented: boolean;
}

interface ROIRecommendationsProps {
  storeId?: string;
  onRecommendationSelect?: (recommendation: Recommendation) => void;
}

const ROIRecommendations: React.FC<ROIRecommendationsProps> = ({ 
  storeId = '1',
  onRecommendationSelect 
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all',
    category: 'all',
    implemented: 'all'
  });
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

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

  // Priority colors
  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      'high': tokens.colors.accentRed,
      'medium': tokens.colors.accentOrange,
      'low': tokens.colors.accentEmerald
    };
    return colorMap[priority.toLowerCase()] || tokens.colors.tbwaGray;
  };

  // Risk level colors
  const getRiskColor = (risk: string) => {
    const colorMap: { [key: string]: string } = {
      'low': tokens.colors.accentEmerald,
      'medium': tokens.colors.accentOrange,
      'high': tokens.colors.accentRed
    };
    return colorMap[risk.toLowerCase()] || tokens.colors.tbwaGray;
  };

  // Load recommendations
  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(getEdgeFunctionUrl(EDGE_FUNCTIONS.ROI_RECOMMENDATIONS), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          store_id: storeId,
          priority: filters.priority !== 'all' ? filters.priority : null,
          category: filters.category !== 'all' ? filters.category : null,
          implemented: filters.implemented !== 'all' ? filters.implemented === 'true' : null,
          limit: 10
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data.recommendations || data || []);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Fallback to mock data
      setRecommendations(getMockRecommendations());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockRecommendations = (): Recommendation[] => [
    {
      id: '1',
      title: 'Optimize Beverage Cooler Placement',
      description: 'Move beverages to eye-level and near entrance for 15% sales increase',
      category: 'layout_optimization',
      priority: 'high',
      roi_percentage: 23.5,
      revenue_potential: 2500,
      implementation_cost: 200,
      timeline: 'immediate',
      confidence_score: 0.87,
      success_rate: 85,
      risk_level: 'low',
      supporting_data: { customer_flow: 'high', visibility_score: 0.92 },
      implementation_steps: ['Relocate cooler', 'Update signage', 'Track sales for 2 weeks'],
      is_implemented: false
    },
    {
      id: '2',
      title: 'Implement Cigarette-Beverage Combo Strategy',
      description: 'Bundle cigarettes with beverages for increased basket size',
      category: 'cross_selling',
      priority: 'medium',
      roi_percentage: 15.3,
      revenue_potential: 1800,
      implementation_cost: 150,
      timeline: '1_week',
      confidence_score: 0.76,
      success_rate: 72,
      risk_level: 'medium',
      supporting_data: { combo_potential: 0.68 },
      implementation_steps: ['Create combo offers', 'Train staff', 'Monitor results'],
      is_implemented: false
    },
    {
      id: '3',
      title: 'Family Shopping Stock Optimization',
      description: 'Increase family-oriented products during peak hours',
      category: 'inventory_optimization',
      priority: 'medium',
      roi_percentage: 18.7,
      revenue_potential: 3200,
      implementation_cost: 800,
      timeline: '2_weeks',
      confidence_score: 0.81,
      success_rate: 78,
      risk_level: 'low',
      supporting_data: { family_traffic: 0.85 },
      implementation_steps: ['Analyze family patterns', 'Adjust inventory', 'Create family sections'],
      is_implemented: true
    }
  ];

  // Load recommendations on mount and filter changes
  useEffect(() => {
    loadRecommendations();
  }, [storeId, filters]);

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.priority !== 'all' && rec.priority !== filters.priority) return false;
    if (filters.category !== 'all' && rec.category !== filters.category) return false;
    if (filters.implemented !== 'all' && rec.is_implemented !== (filters.implemented === 'true')) return false;
    return true;
  });

  const handleRecommendationClick = (rec: Recommendation) => {
    setSelectedRec(rec);
    if (onRecommendationSelect) {
      onRecommendationSelect(rec);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-xl p-6 shadow-sm border"
        style={{ 
          backgroundColor: tokens.colors.tbwaWhite,
          borderColor: tokens.colors.tbwaLightGray,
          borderTop: `4px solid ${tokens.colors.accentEmerald}`
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: tokens.colors.accentEmerald }}
            >
              <Target className="h-5 w-5" style={{ color: tokens.colors.tbwaWhite }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: tokens.colors.tbwaBlack }}>
              ROI Recommendations Engine
            </h3>
          </div>
          <button
            onClick={loadRecommendations}
            disabled={loading}
            className="flex items-center px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
            style={{ 
              backgroundColor: tokens.colors.tbwaYellow,
              color: tokens.colors.tbwaBlack
            }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: tokens.colors.tbwaGray }}>
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: tokens.colors.tbwaYellow }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: tokens.colors.tbwaGray }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: tokens.colors.tbwaYellow }}
            >
              <option value="all">All Categories</option>
              <option value="layout_optimization">Layout Optimization</option>
              <option value="cross_selling">Cross Selling</option>
              <option value="inventory_optimization">Inventory</option>
              <option value="pricing_strategy">Pricing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: tokens.colors.tbwaGray }}>
              Status
            </label>
            <select
              value={filters.implemented}
              onChange={(e) => setFilters(prev => ({ ...prev, implemented: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: tokens.colors.tbwaYellow }}
            >
              <option value="all">All Status</option>
              <option value="false">Not Implemented</option>
              <option value="true">Implemented</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 mx-auto mb-4"
              style={{ borderTopColor: tokens.colors.tbwaYellow }}
            ></div>
            <p style={{ color: tokens.colors.tbwaGray }}>Loading recommendations...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((rec) => (
            <div 
              key={rec.id}
              className="rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-lg transition-all hover:scale-102"
              style={{ 
                backgroundColor: tokens.colors.tbwaWhite,
                borderColor: tokens.colors.tbwaLightGray,
                borderLeft: `4px solid ${getPriorityColor(rec.priority)}`
              }}
              onClick={() => handleRecommendationClick(rec)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-bold mr-3" style={{ color: tokens.colors.tbwaBlack }}>
                      {rec.title}
                    </h4>
                    {rec.is_implemented && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-bold flex items-center"
                        style={{ 
                          backgroundColor: `${tokens.colors.accentEmerald}20`,
                          color: tokens.colors.accentEmerald
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Implemented
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: tokens.colors.tbwaGray }}>
                    {rec.description}
                  </p>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: tokens.colors.accentEmerald }}>
                        {rec.roi_percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>ROI</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: tokens.colors.tbwaBlue }}>
                        ₱{rec.revenue_potential.toLocaleString()}
                      </p>
                      <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>Revenue Potential</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: tokens.colors.accentPurple }}>
                        {rec.success_rate}%
                      </p>
                      <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: getRiskColor(rec.risk_level) }}>
                        {rec.risk_level.toUpperCase()}
                      </p>
                      <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>Risk Level</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end ml-4">
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ 
                      backgroundColor: `${getPriorityColor(rec.priority)}20`,
                      color: getPriorityColor(rec.priority)
                    }}
                  >
                    {rec.priority.toUpperCase()} PRIORITY
                  </div>
                  <div className="flex items-center text-xs" style={{ color: tokens.colors.tbwaGray }}>
                    <Clock className="h-3 w-3 mr-1" />
                    {rec.timeline.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Implementation Steps Preview */}
              {rec.implementation_steps && rec.implementation_steps.length > 0 && (
                <div className="border-t pt-3" style={{ borderColor: tokens.colors.tbwaLightGray }}>
                  <p className="text-sm font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                    Implementation Steps:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rec.implementation_steps.slice(0, 3).map((step, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: tokens.colors.tbwaLightGray,
                          color: tokens.colors.tbwaBlack
                        }}
                      >
                        {index + 1}. {step}
                      </span>
                    ))}
                    {rec.implementation_steps.length > 3 && (
                      <span 
                        className="px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: tokens.colors.tbwaYellow,
                          color: tokens.colors.tbwaBlack
                        }}
                      >
                        +{rec.implementation_steps.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-16">
              <Target className="h-16 w-16 mx-auto mb-4 opacity-30" style={{ color: tokens.colors.tbwaGray }} />
              <p className="text-lg font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                No recommendations found
              </p>
              <p className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
                Try adjusting your filters or refresh the data
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ROIRecommendations;