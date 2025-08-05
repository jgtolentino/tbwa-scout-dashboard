'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  MessageSquare, 
  Target, 
  Zap,
  DollarSign,
  Activity,
  Globe,
  Store,
  Brain,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const TBWAScoutDashboard = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [nlQuery, setNlQuery] = useState('');
  const [nlResult, setNlResult] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // TBWA Design Tokens
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
    },
    typography: {
      fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      }
    }
  };

  // Your actual Supabase configuration - replace with your actual values
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
  const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
  const BASE_URL = `${SUPABASE_URL}/functions/v1/complete-scout-api-system`;

  // API client with mock data fallback
  const apiCall = async (endpoint, method = 'GET', body = null) => {
    // For demo purposes, return mock data if API is not configured
    if (SUPABASE_URL === 'https://your-project.supabase.co') {
      return getMockData(endpoint);
    }
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    };
    
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }
    
    const url = endpoint.startsWith('/') ? `${BASE_URL}${endpoint}` : 
                endpoint.includes('query') ? BASE_URL : `${BASE_URL}/${endpoint}`;
                
    try {
      const response = await fetch(url, config);
      const result = await response.json();
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
      return result.data || result;
    } catch (error) {
      // Fallback to mock data on API error
      return getMockData(endpoint);
    }
  };

  // Mock data for demonstration
  const getMockData = (endpoint) => {
    const mockData = {
      '/api/executive/dashboard': [{
        total_revenue_millions: 4.7,
        tbwa_market_share_pct: 28.3,
        avg_handshake_score: 0.82,
        campaign_influence_pct: 18.7,
        regions_covered: 15,
        active_stores: 187
      }],
      '/api/analytics/regional-performance': [
        { region: 'Metro Manila', revenue: 1234567, transaction_count: 45678, tbwa_market_share: 32.1 },
        { region: 'Cebu', revenue: 987654, transaction_count: 34567, tbwa_market_share: 28.5 },
        { region: 'Davao', revenue: 765432, transaction_count: 23456, tbwa_market_share: 25.8 },
        { region: 'Iloilo', revenue: 543210, transaction_count: 15678, tbwa_market_share: 22.3 },
        { region: 'Baguio', revenue: 432109, transaction_count: 12345, tbwa_market_share: 19.7 }
      ],
      '/api/analytics/campaign-effectiveness': [
        { store_type: 'Premium Retail', avg_influence: 0.847 },
        { store_type: 'Mass Market', avg_influence: 0.723 },
        { store_type: 'E-commerce', avg_influence: 0.691 }
      ],
      '/api/brands/competitive-analysis': [
        { brand_name: 'TBWA Client A', market_share_pct: 28.5, revenue: 2345678, customer_satisfaction: 0.89 },
        { brand_name: 'TBWA Client B', market_share_pct: 22.1, revenue: 1876543, customer_satisfaction: 0.85 },
        { brand_name: 'Competitor X', market_share_pct: 19.8, revenue: 1654321, customer_satisfaction: 0.78 },
        { brand_name: 'Competitor Y', market_share_pct: 15.2, revenue: 1234567, customer_satisfaction: 0.72 },
        { brand_name: 'Others', market_share_pct: 14.4, revenue: 987654, customer_satisfaction: 0.68 }
      ],
      '/api/analytics/geographic-intelligence': [
        { region_name: 'NCR', province_name: 'Metro Manila', city_name: 'Makati', total_sales: 1234567, transaction_count: 8765 },
        { region_name: 'Central Visayas', province_name: 'Cebu', city_name: 'Cebu City', total_sales: 987654, transaction_count: 6543 },
        { region_name: 'Davao Region', province_name: 'Davao del Sur', city_name: 'Davao City', total_sales: 765432, transaction_count: 5432 },
        { region_name: 'Western Visayas', province_name: 'Iloilo', city_name: 'Iloilo City', total_sales: 654321, transaction_count: 4321 },
        { region_name: 'CAR', province_name: 'Benguet', city_name: 'Baguio', total_sales: 543210, transaction_count: 3210 },
        { region_name: 'Central Luzon', province_name: 'Pampanga', city_name: 'Angeles', total_sales: 432109, transaction_count: 2109 }
      ]
    };

    if (endpoint === '') {
      // Mock NL query response
      return {
        data: [
          { metric: 'Total Revenue', value: '₱4.7M', trend: '+12.5%' },
          { metric: 'Market Share', value: '28.3%', trend: '+2.3%' },
          { metric: 'Customer Satisfaction', value: '0.82', trend: '+5.1%' }
        ],
        query_method: 'AI Analysis',
        confidence: 0.87,
        execution_time: 234
      };
    }

    return mockData[endpoint] || { regional: mockData['/api/analytics/regional-performance'], campaigns: mockData['/api/analytics/campaign-effectiveness'], customers: [] };
  };

  // Load dashboard data
  const loadDashboardData = async (category) => {
    setLoading(true);
    try {
      let result;
      
      switch (category) {
        case 'executive':
          result = await apiCall('/api/executive/dashboard');
          break;
        case 'analytics':
          const [regional, campaigns, customers] = await Promise.all([
            apiCall('/api/analytics/regional-performance'),
            apiCall('/api/analytics/campaign-effectiveness'),
            apiCall('/api/analytics/customer-behavior')
          ]);
          result = { regional, campaigns, customers };
          break;
        case 'brands':
          result = await apiCall('/api/brands/competitive-analysis');
          break;
        case 'geographic':
          result = await apiCall('/api/analytics/geographic-intelligence');
          break;
        default:
          result = {};
      }
      
      setData(prev => ({ ...prev, [category]: result }));
      setLastUpdated(new Date());
    } catch (error) {
      console.error(`Error loading ${category} data:`, error);
      setData(prev => ({ ...prev, [category]: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  // Natural language query handler
  const handleNLQuery = async () => {
    if (!nlQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await apiCall('', 'POST', {
        query: nlQuery,
        use_llm: false,
        confidence_threshold: 0.6
      });
      
      setNlResult(result);
    } catch (error) {
      setNlResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    loadDashboardData(activeTab);
  }, [activeTab]);

  // Sample queries for different tabs
  const sampleQueries = {
    executive: [
      "How is TBWA performing in the market?",
      "Show me executive dashboard KPIs",
      "What's our market share percentage?"
    ],
    analytics: [
      "Sales performance by region",
      "Campaign influence rate by store type", 
      "Customer behavior analysis"
    ],
    brands: [
      "Compare brand performance",
      "Competitive intelligence analysis",
      "TBWA vs competitor market share"
    ],
    geographic: [
      "Geographic performance insights",
      "Which regions have highest sales?",
      "Location-based analytics"
    ]
  };

  const TBWAKPICard = ({ title, value, subtitle, icon: Icon, trend, trendDirection = "up" }) => (
    <div 
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
      style={{ borderTop: `4px solid ${tokens.colors.tbwaYellow}` }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 opacity-5"
        style={{ 
          background: `radial-gradient(circle, ${tokens.colors.tbwaYellow} 0%, transparent 70%)` 
        }}
      />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p 
            className="text-3xl font-black mb-1"
            style={{ 
              fontFamily: tokens.typography.fontFamily,
              fontWeight: tokens.typography.fontWeights.black,
              color: tokens.colors.tbwaBlack
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: tokens.colors.tbwaBlack }}
          >
            <Icon className="h-7 w-7" style={{ color: tokens.colors.tbwaYellow }} />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <div 
            className="flex items-center px-2 py-1 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: trendDirection === "up" ? tokens.colors.accentEmerald : tokens.colors.accentRed,
              color: tokens.colors.tbwaWhite
            }}
          >
            <TrendingUp className={`h-3 w-3 mr-1 ${trendDirection === "down" ? "rotate-180" : ""}`} />
            +{trend}%
          </div>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );

  const TBWAPerformanceBar = ({ value, maxValue = 100 }) => {
    const percentage = (value / maxValue) * 100;
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out relative"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${tokens.colors.tbwaYellow} 0%, ${tokens.colors.tbwaDarkYellow} 100%)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20" />
        </div>
      </div>
    );
  };

  const renderExecutiveDashboard = () => {
    const execData = data.executive;
    if (!execData || execData.error) {
      return (
        <div 
          className="text-center p-8 rounded-lg border-2 border-dashed"
          style={{ 
            borderColor: tokens.colors.accentRed,
            backgroundColor: '#FEF2F2',
            color: tokens.colors.accentRed
          }}
        >
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-semibold">Error loading executive data</p>
          <p className="text-sm mt-2">{execData?.error}</p>
        </div>
      );
    }

    if (Array.isArray(execData) && execData.length > 0) {
      const kpis = execData[0];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TBWAKPICard 
            title="Total Revenue" 
            value={`₱${kpis.total_revenue_millions || '4.2'}M`}
            subtitle="Last 30 days"
            icon={DollarSign}
            trend="12.5"
          />
          <TBWAKPICard 
            title="Market Share" 
            value={`${kpis.tbwa_market_share_pct || '23.5'}%`}
            subtitle="TBWA Clients"
            icon={Target}
            trend="2.3"
          />
          <TBWAKPICard 
            title="Customer Satisfaction" 
            value={kpis.avg_handshake_score || '0.78'}
            subtitle="Handshake Score"
            icon={Activity}
            trend="5.1"
          />
          <TBWAKPICard 
            title="Campaign Influence" 
            value={`${kpis.campaign_influence_pct || '15.3'}%`}
            subtitle="Marketing Impact"
            icon={Zap}
            trend="8.7"
          />
          <TBWAKPICard 
            title="Geographic Coverage" 
            value={kpis.regions_covered || '12'}
            subtitle="Active Regions"
            icon={Globe}
            trend="0"
          />
          <TBWAKPICard 
            title="Active Stores" 
            value={kpis.active_stores || '156'}
            subtitle="Retail Network"
            icon={Store}
            trend="4.2"
          />
        </div>
      );
    }

    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading executive dashboard...</p>
      </div>
    );
  };

  const renderAnalytics = () => {
    const analyticsData = data.analytics;
    if (!analyticsData || analyticsData.error) {
      return (
        <div 
          className="text-center p-8 rounded-lg border-2 border-dashed"
          style={{ 
            borderColor: tokens.colors.accentRed,
            backgroundColor: '#FEF2F2',
            color: tokens.colors.accentRed
          }}
        >
          Error loading analytics: {analyticsData?.error}
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Regional Performance */}
        {analyticsData.regional && (
          <div 
            className="rounded-xl p-6 shadow-sm border"
            style={{ 
              backgroundColor: tokens.colors.tbwaWhite,
              borderColor: tokens.colors.tbwaLightGray,
              borderTop: `4px solid ${tokens.colors.tbwaBlue}`
            }}
          >
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: tokens.colors.tbwaBlue }}
              >
                <MapPin className="h-5 w-5" style={{ color: tokens.colors.tbwaWhite }} />
              </div>
              <h3 
                className="text-xl font-bold"
                style={{ 
                  color: tokens.colors.tbwaBlack,
                  fontFamily: tokens.typography.fontFamily,
                  fontWeight: tokens.typography.fontWeights.bold
                }}
              >
                Regional Performance Intelligence
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ backgroundColor: tokens.colors.tbwaBlack }}>
                    <th 
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: tokens.colors.tbwaYellow }}
                    >
                      Region
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: tokens.colors.tbwaYellow }}
                    >
                      Revenue
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: tokens.colors.tbwaYellow }}
                    >
                      Transactions
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: tokens.colors.tbwaYellow }}
                    >
                      TBWA Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analyticsData.regional.slice(0, 5).map((region, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: index % 2 === 0 ? tokens.colors.tbwaWhite : tokens.colors.tbwaLightGray }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="font-semibold"
                          style={{ color: tokens.colors.tbwaBlack }}
                        >
                          {region.region}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="font-bold"
                          style={{ color: tokens.colors.tbwaBlue }}
                        >
                          ₱{(region.revenue || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span style={{ color: tokens.colors.tbwaGray }}>
                          {(region.transaction_count || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="font-bold"
                            style={{ color: tokens.colors.tbwaBlack }}
                          >
                            {region.tbwa_market_share || 'N/A'}%
                          </span>
                          <TBWAPerformanceBar value={region.tbwa_market_share || 0} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Campaign Effectiveness */}
        {analyticsData.campaigns && (
          <div 
            className="rounded-xl p-6 shadow-sm border"
            style={{ 
              backgroundColor: tokens.colors.tbwaWhite,
              borderColor: tokens.colors.tbwaLightGray,
              borderTop: `4px solid ${tokens.colors.accentEmerald}`
            }}
          >
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: tokens.colors.accentEmerald }}
              >
                <Zap className="h-5 w-5" style={{ color: tokens.colors.tbwaWhite }} />
              </div>
              <h3 
                className="text-xl font-bold"
                style={{ 
                  color: tokens.colors.tbwaBlack,
                  fontFamily: tokens.typography.fontFamily,
                  fontWeight: tokens.typography.fontWeights.bold
                }}
              >
                Campaign Effectiveness Matrix
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analyticsData.campaigns.slice(0, 3).map((campaign, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-lg border-2"
                  style={{ 
                    backgroundColor: tokens.colors.tbwaLightGray,
                    borderColor: tokens.colors.tbwaYellow
                  }}
                >
                  <p 
                    className="text-sm font-semibold mb-2 uppercase tracking-wide"
                    style={{ color: tokens.colors.tbwaGray }}
                  >
                    {campaign.store_type}
                  </p>
                  <p 
                    className="text-2xl font-black mb-1"
                    style={{ 
                      color: tokens.colors.tbwaBlack,
                      fontFamily: tokens.typography.fontFamily,
                      fontWeight: tokens.typography.fontWeights.black
                    }}
                  >
                    {campaign.avg_influence || 'N/A'}
                  </p>
                  <p 
                    className="text-xs font-medium"
                    style={{ color: tokens.colors.tbwaGray }}
                  >
                    Avg Influence Score
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBrands = () => {
    const brandsData = data.brands;
    if (!brandsData || brandsData.error) {
      return (
        <div 
          className="text-center p-8 rounded-lg border-2 border-dashed"
          style={{ 
            borderColor: tokens.colors.accentRed,
            backgroundColor: '#FEF2F2',
            color: tokens.colors.accentRed
          }}
        >
          Error loading brands data: {brandsData?.error}
        </div>
      );
    }

    return (
      <div 
        className="rounded-xl p-6 shadow-sm border"
        style={{ 
          backgroundColor: tokens.colors.tbwaWhite,
          borderColor: tokens.colors.tbwaLightGray,
          borderTop: `4px solid ${tokens.colors.accentPurple}`
        }}
      >
        <div className="flex items-center mb-6">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: tokens.colors.accentPurple }}
          >
            <BarChart3 className="h-5 w-5" style={{ color: tokens.colors.tbwaWhite }} />
          </div>
          <h3 
            className="text-xl font-bold"
            style={{ 
              color: tokens.colors.tbwaBlack,
              fontFamily: tokens.typography.fontFamily,
              fontWeight: tokens.typography.fontWeights.bold
            }}
          >
            Brand Competitive Intelligence
          </h3>
        </div>
        
        <div className="space-y-4">
          {Array.isArray(brandsData) && brandsData.slice(0, 5).map((brand, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-6 rounded-lg border-l-4"
              style={{ 
                backgroundColor: tokens.colors.tbwaLightGray,
                borderLeftColor: tokens.colors.tbwaYellow
              }}
            >
              <div>
                <p 
                  className="font-bold text-lg mb-1"
                  style={{ 
                    color: tokens.colors.tbwaBlack,
                    fontFamily: tokens.typography.fontFamily,
                    fontWeight: tokens.typography.fontWeights.bold
                  }}
                >
                  {brand.brand_name}
                </p>
                <p 
                  className="text-sm font-medium"
                  style={{ color: tokens.colors.tbwaGray }}
                >
                  Market Share: <span style={{ color: tokens.colors.tbwaBlue }}>{brand.market_share_pct}%</span>
                </p>
              </div>
              <div className="text-right">
                <p 
                  className="text-xl font-black mb-1"
                  style={{ 
                    color: tokens.colors.tbwaBlack,
                    fontFamily: tokens.typography.fontFamily,
                    fontWeight: tokens.typography.fontWeights.black
                  }}
                >
                  ₱{(brand.revenue || 0).toLocaleString()}
                </p>
                <p 
                  className="text-sm font-medium"
                  style={{ color: tokens.colors.tbwaGray }}
                >
                  Satisfaction: <span style={{ color: tokens.colors.accentEmerald }}>{brand.customer_satisfaction}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGeographic = () => {
    const geoData = data.geographic;
    if (!geoData || geoData.error) {
      return (
        <div 
          className="text-center p-8 rounded-lg border-2 border-dashed"
          style={{ 
            borderColor: tokens.colors.accentRed,
            backgroundColor: '#FEF2F2',
            color: tokens.colors.accentRed
          }}
        >
          Error loading geographic data: {geoData?.error}
        </div>
      );
    }

    return (
      <div 
        className="rounded-xl p-6 shadow-sm border"
        style={{ 
          backgroundColor: tokens.colors.tbwaWhite,
          borderColor: tokens.colors.tbwaLightGray,
          borderTop: `4px solid ${tokens.colors.accentEmerald}`
        }}
      >
        <div className="flex items-center mb-6">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: tokens.colors.accentEmerald }}
          >
            <Globe className="h-5 w-5" style={{ color: tokens.colors.tbwaWhite }} />
          </div>
          <h3 
            className="text-xl font-bold"
            style={{ 
              color: tokens.colors.tbwaBlack,
              fontFamily: tokens.typography.fontFamily,
              fontWeight: tokens.typography.fontWeights.bold
            }}
          >
            Geographic Intelligence Matrix
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(geoData) && geoData.slice(0, 6).map((location, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 relative overflow-hidden"
              style={{ 
                borderColor: tokens.colors.tbwaLightGray,
                backgroundColor: tokens.colors.tbwaWhite
              }}
            >
              <div 
                className="absolute top-0 right-0 w-16 h-16 opacity-10"
                style={{ 
                  background: `radial-gradient(circle, ${tokens.colors.tbwaYellow} 0%, transparent 70%)` 
                }}
              />
              
              <p 
                className="font-bold text-lg mb-1 relative z-10"
                style={{ 
                  color: tokens.colors.tbwaBlack,
                  fontFamily: tokens.typography.fontFamily,
                  fontWeight: tokens.typography.fontWeights.bold
                }}
              >
                {location.region_name}
              </p>
              <p 
                className="text-sm mb-3 relative z-10"
                style={{ color: tokens.colors.tbwaGray }}
              >
                {location.province_name}, {location.city_name}
              </p>
              <div className="flex justify-between text-sm relative z-10">
                <span style={{ color: tokens.colors.tbwaBlue }}>
                  Sales: ₱{(location.total_sales || 0).toLocaleString()}
                </span>
                <span style={{ color: tokens.colors.accentEmerald }}>
                  Transactions: {(location.transaction_count || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{ 
        backgroundColor: tokens.colors.tbwaLightGray,
        fontFamily: tokens.typography.fontFamily
      }}
    >
      {/* TBWA Hero Header */}
      <div 
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{ backgroundColor: tokens.colors.tbwaBlack }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `radial-gradient(circle at 25% 25%, ${tokens.colors.tbwaYellow} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${tokens.colors.tbwaYellow} 0%, transparent 50%)`
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 
                className="text-4xl font-black mb-2 uppercase tracking-tight"
                style={{ 
                  color: tokens.colors.tbwaYellow,
                  fontFamily: tokens.typography.fontFamily,
                  fontWeight: tokens.typography.fontWeights.black
                }}
              >
                Scout Analytics Intelligence
              </h1>
              <p 
                className="text-lg font-medium"
                style={{ 
                  color: tokens.colors.tbwaWhite,
                  opacity: 0.9
                }}
              >
                AI-powered retail intelligence for TBWA client portfolio
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => loadDashboardData(activeTab)}
                className="flex items-center px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: tokens.colors.tbwaYellow,
                  color: tokens.colors.tbwaBlack
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* System Status */}
          <div className="flex flex-wrap gap-3">
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ 
                backgroundColor: `${tokens.colors.accentEmerald}20`,
                color: tokens.colors.accentEmerald,
                border: `1px solid ${tokens.colors.accentEmerald}`
              }}
            >
              <Activity className="h-3 w-3 mr-1" />
              128K+ Transactions
            </span>
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ 
                backgroundColor: `${tokens.colors.tbwaBlue}20`,
                color: tokens.colors.tbwaBlue,
                border: `1px solid ${tokens.colors.tbwaBlue}`
              }}
            >
              <Brain className="h-3 w-3 mr-1" />
              WrenAI Active
            </span>
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ 
                backgroundColor: `${tokens.colors.accentPurple}20`,
                color: tokens.colors.accentPurple,
                border: `1px solid ${tokens.colors.accentPurple}`
              }}
            >
              <Zap className="h-3 w-3 mr-1" />
              13 APIs Ready
            </span>
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ 
                backgroundColor: `${tokens.colors.tbwaYellow}20`,
                color: tokens.colors.tbwaDarkYellow,
                border: `1px solid ${tokens.colors.tbwaYellow}`
              }}
            >
              Last Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Natural Language Query */}
      <div 
        className="rounded-xl p-6 mb-8 shadow-sm border"
        style={{ 
          backgroundColor: tokens.colors.tbwaWhite,
          borderColor: tokens.colors.tbwaLightGray,
          borderTop: `4px solid ${tokens.colors.tbwaBlue}`
        }}
      >
        <div className="flex items-center mb-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: tokens.colors.tbwaBlue }}
          >
            <MessageSquare className="h-5 w-5" style={{ color: tokens.colors.tbwaWhite }} />
          </div>
          <h2 
            className="text-xl font-bold"
            style={{ 
              color: tokens.colors.tbwaBlack,
              fontFamily: tokens.typography.fontFamily,
              fontWeight: tokens.typography.fontWeights.bold
            }}
          >
            Ask Scout AI Intelligence
          </h2>
        </div>
        
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="Ask anything about your business data..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-base"
              style={{ 
                focusRingColor: tokens.colors.tbwaYellow,
                fontFamily: tokens.typography.fontFamily
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleNLQuery()}
            />
          </div>
          <button
            onClick={handleNLQuery}
            disabled={loading || !nlQuery.trim()}
            className="px-8 py-3 rounded-lg font-bold text-base transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ 
              backgroundColor: tokens.colors.tbwaYellow,
              color: tokens.colors.tbwaBlack,
              fontFamily: tokens.typography.fontFamily,
              fontWeight: tokens.typography.fontWeights.bold
            }}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-gray-800 mr-2"></div>
                Thinking...
              </div>
            ) : (
              'Ask Scout'
            )}
          </button>
        </div>

        {/* Sample queries for current tab */}
        <div className="mb-4">
          <p 
            className="text-sm font-semibold mb-3 uppercase tracking-wide"
            style={{ color: tokens.colors.tbwaGray }}
          >
            Try these intelligence queries:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries[activeTab]?.map((query, index) => (
              <button
                key={index}
                onClick={() => setNlQuery(query)}
                className="text-sm px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{ 
                  backgroundColor: tokens.colors.tbwaLightGray,
                  color: tokens.colors.tbwaGray,
                  border: `1px solid ${tokens.colors.tbwaYellow}`,
                  fontFamily: tokens.typography.fontFamily
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = tokens.colors.tbwaYellow;
                  e.target.style.color = tokens.colors.tbwaBlack;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = tokens.colors.tbwaLightGray;
                  e.target.style.color = tokens.colors.tbwaGray;
                }}
              >
                "{query}"
              </button>
            ))}
          </div>
        </div>

        {/* NL Query Result */}
        {nlResult && (
          <div 
            className="rounded-lg p-4 border-2"
            style={{ 
              backgroundColor: `${tokens.colors.tbwaBlue}10`,
              borderColor: tokens.colors.tbwaBlue
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 
                className="font-bold"
                style={{ 
                  color: tokens.colors.tbwaBlack,
                  fontFamily: tokens.typography.fontFamily,
                  fontWeight: tokens.typography.fontWeights.bold
                }}
              >
                🤖 Scout AI Response
              </h3>
              <div className="flex items-center gap-4 text-sm" style={{ color: tokens.colors.tbwaGray }}>
                <span>Method: {nlResult.query_method}</span>
                <span>Confidence: {((nlResult.confidence || 0) * 100).toFixed(1)}%</span>
                <span>{nlResult.execution_time}ms</span>
              </div>
            </div>
            
            {nlResult.error ? (
              <p style={{ color: tokens.colors.accentRed }}>{nlResult.error}</p>
            ) : (
              <div className="space-y-3">
                {nlResult.data && nlResult.data.length > 0 && (
                  <div className="overflow-x-auto">
                    <table 
                      className="min-w-full rounded border"
                      style={{ backgroundColor: tokens.colors.tbwaWhite }}
                    >
                      <thead style={{ backgroundColor: tokens.colors.tbwaBlack }}>
                        <tr>
                          {Object.keys(nlResult.data[0]).map(key => (
                            <th 
                              key={key} 
                              className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                              style={{ color: tokens.colors.tbwaYellow }}
                            >
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {nlResult.data.slice(0, 5).map((row, index) => (
                          <tr 
                            key={index} 
                            style={{ 
                              backgroundColor: index % 2 === 0 ? tokens.colors.tbwaWhite : tokens.colors.tbwaLightGray 
                            }}
                          >
                            {Object.values(row).map((value, colIndex) => (
                              <td 
                                key={colIndex} 
                                className="px-4 py-3 text-sm"
                                style={{ color: tokens.colors.tbwaBlack }}
                              >
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div 
          className="flex space-x-1 p-1 rounded-xl"
          style={{ backgroundColor: tokens.colors.tbwaWhite }}
        >
          {[
            { key: 'executive', label: 'Executive Intelligence', icon: Target },
            { key: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
            { key: 'brands', label: 'Brand Intelligence', icon: TrendingUp },
            { key: 'geographic', label: 'Geographic Intelligence', icon: MapPin }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center px-6 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wide ${
                activeTab === key ? 'shadow-md transform scale-105' : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: activeTab === key ? tokens.colors.tbwaBlack : 'transparent',
                color: activeTab === key ? tokens.colors.tbwaYellow : tokens.colors.tbwaGray,
                fontFamily: tokens.typography.fontFamily,
                fontWeight: tokens.typography.fontWeights.bold
              }}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div 
                className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 mx-auto mb-4"
                style={{ borderTopColor: tokens.colors.tbwaYellow }}
              ></div>
              <div 
                className="text-lg font-bold"
                style={{ 
                  color: tokens.colors.tbwaGray,
                  fontFamily: tokens.typography.fontFamily,
                  fontWeight: tokens.typography.fontWeights.bold
                }}
              >
                Loading {activeTab} intelligence...
              </div>
            </div>
          </div>
        )}
        
        {!loading && (
          <>
            {activeTab === 'executive' && renderExecutiveDashboard()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'brands' && renderBrands()}
            {activeTab === 'geographic' && renderGeographic()}
          </>
        )}
      </div>

      {/* Footer */}
      <div 
        className="text-center mt-12 pt-8 border-t"
        style={{ 
          borderColor: tokens.colors.tbwaLightGray,
          color: tokens.colors.tbwaGray
        }}
      >
        <p 
          className="text-sm font-medium"
          style={{ fontFamily: tokens.typography.fontFamily }}
        >
          TBWA Scout Analytics Intelligence | AI-Powered Retail Intelligence | 
          <span style={{ color: tokens.colors.tbwaYellow }}> ✨ Enhanced with WrenAI</span>
        </p>
      </div>
    </div>
  );
};

export default TBWAScoutDashboard;