import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Sparkles, TrendingUp, Users, MapPin, BarChart3, Brain, Lightbulb } from 'lucide-react';

interface IntelligenceBarProps {
  onQuery: (query: string, type: 'analytics' | 'ai_chat') => void;
  isLoading?: boolean;
}

const UnifiedIntelligenceBar: React.FC<IntelligenceBarProps> = ({ onQuery, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickInsights = [
    { icon: TrendingUp, text: "Show me revenue trends this quarter", category: "analytics" },
    { icon: Users, text: "Which customer personas drive the most value?", category: "ai_chat" },
    { icon: MapPin, text: "Compare regional performance across Metro Manila", category: "analytics" },
    { icon: BarChart3, text: "What are my best ROI opportunities?", category: "ai_chat" },
    { icon: Brain, text: "Analyze customer buying patterns", category: "ai_chat" },
    { icon: Lightbulb, text: "Show campaign effectiveness by brand", category: "analytics" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const isAIQuery = query.toLowerCase().includes('predict') || 
                      query.toLowerCase().includes('why') || 
                      query.toLowerCase().includes('how') ||
                      query.toLowerCase().includes('recommend');

    onQuery(query.trim(), isAIQuery ? 'ai_chat' : 'analytics');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Ask anything about your sari-sari data: revenue trends, customer insights, ROI opportunities..."
            className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isLoading ? 'Analyzing...' : 'Ask'}
            </span>
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickInsights.map((insight, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(insight.text);
                    onQuery(insight.text, insight.category as 'analytics' | 'ai_chat');
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <insight.icon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{insight.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedIntelligenceBar;
