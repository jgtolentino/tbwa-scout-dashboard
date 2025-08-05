'use client';

import React, { useState } from 'react';
import { Calculator, User, TrendingUp, Clock, MapPin, Package, DollarSign, Brain, AlertCircle } from 'lucide-react';
import { EDGE_FUNCTIONS, getEdgeFunctionUrl, getApiHeaders } from '@/lib/config/edge-functions';

interface TransactionInferenceProps {
  onInferenceComplete?: (result: any) => void;
}

interface InferenceResult {
  inferred_transaction: {
    total_spent: number;
    likely_products: string[];
    confidence_score: number;
    alternative_scenarios: any[];
  };
  persona_analysis: {
    persona: string;
    confidence: number;
    persona_details: any;
  };
  recommendations: any[];
  business_insights: {
    revenue_impact: number;
    frequency_score: number;
    loyalty_indicator: string;
  };
}

const TransactionInference: React.FC<TransactionInferenceProps> = ({ onInferenceComplete }) => {
  const [formData, setFormData] = useState({
    payment_amount: '',
    change_given: '',
    time_of_day: 'morning',
    customer_behavior: '',
    visible_products: '',
    location_context: ''
  });
  
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const inferTransaction = async () => {
    if (!formData.payment_amount || !formData.change_given) {
      setError('Payment amount and change given are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(getEdgeFunctionUrl(EDGE_FUNCTIONS.TRANSACTION_INFERENCE), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          payment_amount: parseFloat(formData.payment_amount),
          change_given: parseFloat(formData.change_given),
          time_of_day: formData.time_of_day,
          customer_behavior: formData.customer_behavior,
          visible_products: formData.visible_products.split(',').map(p => p.trim()),
          context_data: {
            location_type: formData.location_context || 'urban',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const inferenceResult = await response.json();
      setResult(inferenceResult);
      
      if (onInferenceComplete) {
        onInferenceComplete(inferenceResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inference failed');
      console.error('Transaction inference error:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = [
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-10PM)' },
    { value: 'night', label: 'Night (10PM-6AM)' }
  ];

  return (
    <div className="space-y-6">
      {/* Input Form */}
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
            <Calculator className="h-5 w-5" style={{ color: tokens.colors.tbwaWhite }} />
          </div>
          <h3 className="text-xl font-bold" style={{ color: tokens.colors.tbwaBlack }}>
            Transaction Inference Engine
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Details */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center" style={{ color: tokens.colors.tbwaGray }}>
              <DollarSign className="h-4 w-4 mr-2" />
              Payment Details
            </h4>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                Payment Amount (₱)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.payment_amount}
                onChange={(e) => handleInputChange('payment_amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: tokens.colors.tbwaYellow }}
                placeholder="20.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                Change Given (₱)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.change_given}
                onChange={(e) => handleInputChange('change_given', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: tokens.colors.tbwaYellow }}
                placeholder="3.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                <Clock className="h-4 w-4 inline mr-1" />
                Time of Day
              </label>
              <select
                value={formData.time_of_day}
                onChange={(e) => handleInputChange('time_of_day', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: tokens.colors.tbwaYellow }}
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Context Details */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center" style={{ color: tokens.colors.tbwaGray }}>
              <User className="h-4 w-4 mr-2" />
              Customer Context
            </h4>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                Customer Behavior
              </label>
              <textarea
                value={formData.customer_behavior}
                onChange={(e) => handleInputChange('customer_behavior', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: tokens.colors.tbwaYellow }}
                placeholder="Male, looked at cigarettes, seemed in a hurry"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                <Package className="h-4 w-4 inline mr-1" />
                Visible Products (comma-separated)
              </label>
              <input
                type="text"
                value={formData.visible_products}
                onChange={(e) => handleInputChange('visible_products', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: tokens.colors.tbwaYellow }}
                placeholder="Coke Zero, Marlboro, Lucky Me"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.tbwaGray }}>
                <MapPin className="h-4 w-4 inline mr-1" />
                Location Context
              </label>
              <select
                value={formData.location_context}
                onChange={(e) => handleInputChange('location_context', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: tokens.colors.tbwaYellow }}
              >
                <option value="">Select location type</option>
                <option value="urban">Urban Area</option>
                <option value="rural">Rural Area</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial District</option>
                <option value="school">Near School</option>
                <option value="office">Near Office</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={inferTransaction}
            disabled={loading || !formData.payment_amount || !formData.change_given}
            className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center"
            style={{ 
              backgroundColor: tokens.colors.tbwaYellow,
              color: tokens.colors.tbwaBlack
            }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-gray-800 mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Infer Transaction
              </>
            )}
          </button>
        </div>

        {error && (
          <div 
            className="mt-4 p-4 rounded-lg flex items-center"
            style={{ 
              backgroundColor: '#FEF2F2',
              color: tokens.colors.accentRed
            }}
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Inference Results */}
      {result && (
        <div className="space-y-6">
          {/* Transaction Analysis */}
          <div 
            className="rounded-xl p-6 shadow-sm border"
            style={{ 
              backgroundColor: tokens.colors.tbwaWhite,
              borderColor: tokens.colors.tbwaLightGray,
              borderTop: `4px solid ${tokens.colors.accentEmerald}`
            }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: tokens.colors.tbwaBlack }}>
              <TrendingUp className="h-5 w-5 mr-2" />
              Transaction Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: tokens.colors.tbwaGray }}>Total Spent</p>
                <p className="text-2xl font-bold" style={{ color: tokens.colors.accentEmerald }}>
                  ₱{result.inferred_transaction.total_spent.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: tokens.colors.tbwaGray }}>Confidence</p>
                <p className="text-2xl font-bold" style={{ color: tokens.colors.tbwaBlue }}>
                  {(result.inferred_transaction.confidence_score * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: tokens.colors.tbwaGray }}>Products</p>
                <p className="text-2xl font-bold" style={{ color: tokens.colors.accentPurple }}>
                  {result.inferred_transaction.likely_products.length}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2" style={{ color: tokens.colors.tbwaGray }}>
                Likely Products Purchased:
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.inferred_transaction.likely_products.map((product, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: tokens.colors.tbwaLightGray,
                      color: tokens.colors.tbwaBlack
                    }}
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Persona Analysis */}
          <div 
            className="rounded-xl p-6 shadow-sm border"
            style={{ 
              backgroundColor: tokens.colors.tbwaWhite,
              borderColor: tokens.colors.tbwaLightGray,
              borderTop: `4px solid ${tokens.colors.tbwaBlue}`
            }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: tokens.colors.tbwaBlack }}>
              <User className="h-5 w-5 mr-2" />
              Customer Persona Match
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-lg font-bold" style={{ color: tokens.colors.tbwaBlue }}>
                  {result.persona_analysis.persona}
                </p>
                <p className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
                  Confidence: {(result.persona_analysis.confidence * 100).toFixed(1)}%
                </p>
              </div>
              
              {result.business_insights && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: tokens.colors.tbwaGray }}>Revenue Impact:</span>
                    <span className="font-bold" style={{ color: tokens.colors.accentEmerald }}>
                      ₱{result.business_insights.revenue_impact}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: tokens.colors.tbwaGray }}>Frequency Score:</span>
                    <span className="font-bold" style={{ color: tokens.colors.tbwaBlue }}>
                      {result.business_insights.frequency_score}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: tokens.colors.tbwaGray }}>Loyalty:</span>
                    <span className="font-bold" style={{ color: tokens.colors.accentPurple }}>
                      {result.business_insights.loyalty_indicator}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionInference;