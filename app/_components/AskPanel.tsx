'use client';

import React, { useState } from 'react';
import { Search, Cookie, TrendingUp, MapPin, Package } from 'lucide-react';
import { semanticSearch } from '@/lib/nlp/semantic-search';

interface AskPanelProps {
  onResult?: (result: any) => void;
}

export const AskPanel: React.FC<AskPanelProps> = ({ onResult }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Merged sample queries from both Scout AI and SUQI modes
  const sampleQueries = [
    // Business Intelligence
    "What's our total revenue this month?",
    "Show me top performing regions",
    "Which campaigns are most effective?",
    // Sari-Sari Operations
    "What products does Juan typically buy?",
    "Show transaction patterns for Maria persona",
    "Which products have highest ROI potential?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
      // Use semantic search for all queries
      const searchResults = semanticSearch(query);
      
      if (searchResults.length > 0) {
        const topResult = searchResults[0];
        const response = await fetch('/api/wren-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            question: query,
            sql: topResult.sql,
            context: 'unified'
          })
        });
        const data = await response.json();
        
        if (onResult) {
          onResult(data);
        }
      } else {
        // Return helpful message if no matches found
        if (onResult) {
          onResult({
            result: 'No specific data found. Try asking about revenue, regions, campaigns, customer personas, or product recommendations.',
            sql: null,
            confidence: 0.3
          });
        }
      }
    } catch (err) {
      console.error('Query error:', err);
      if (onResult) {
        onResult({
          error: err instanceof Error ? err.message : 'Query failed'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePillClick = (text: string) => {
    setQuery(text);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Input row */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your business intelligence or sari-sari operations..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Ask
              </>
            )}
          </button>
        </div>

        {/* Quick-type pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {sampleQueries.map((text, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePillClick(text)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {text}
            </button>
          ))}
        </div>

        {/* Help drawer with merged capabilities */}
        <details className="bg-gray-50 rounded-lg p-3">
          <summary className="cursor-pointer font-medium text-sm select-none flex items-center gap-2">
            <span>What can I ask?</span>
          </summary>

          <div className="mt-3 text-sm leading-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Intelligence */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Business Intelligence
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Executive dashboards and KPIs</li>
                <li>Performance analytics</li>
                <li>Brand competitive analysis</li>
                <li>Geographic intelligence</li>
                <li>Campaign effectiveness</li>
              </ul>
            </div>
            
            {/* Sari-Sari Operations */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Sari-Sari Operations
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Transaction pattern analysis</li>
                <li>Customer persona insights</li>
                <li>Product bundle recommendations</li>
                <li>ROI optimization strategies</li>
                <li>Peak hour analytics</li>
              </ul>
            </div>
          </div>
        </details>
      </form>
    </div>
  );
};