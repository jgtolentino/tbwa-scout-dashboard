'use client';

import React, { useState } from 'react';
import { Search, Brain, Cookie } from 'lucide-react';
import { semanticSearch } from '@/lib/nlp/semantic-search';
import { getEdgeFunctionUrl, getApiHeaders, EDGE_FUNCTIONS } from '@/lib/config/edge-functions';

type ChatSource = 'scout' | 'suqi';

interface AskPanelProps {
  onResult?: (result: any) => void;
}

export const AskPanel: React.FC<AskPanelProps> = ({ onResult }) => {
  const [source, setSource] = useState<ChatSource>('scout');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
      tbwaLightGray: '#F5F5F5',
      cookieBrown: '#B47921',
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let response;
      
      if (source === 'scout') {
        // Scout AI - Use Wren AI endpoint
        const functionUrl = getEdgeFunctionUrl(EDGE_FUNCTIONS.WREN_QUERY);
        response = await fetch(functionUrl, {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ query })
        });
      } else {
        // SUQI - Use semantic search with Sari-Sari context
        const searchResults = semanticSearch(query);
        if (searchResults.length > 0) {
          const topResult = searchResults[0];
          response = await fetch(getEdgeFunctionUrl(EDGE_FUNCTIONS.WREN_QUERY), {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({ 
              query,
              sql: topResult.sql,
              context: 'sari_sari'
            })
          });
        } else {
          throw new Error('No matching queries found for SUQI');
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Query failed: ${response?.status || 'Unknown error'}`);
      }

      const data = await response.json();
      setResult(data);
      
      if (onResult) {
        onResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const placeholderText = source === 'scout' 
    ? "Ask anything about your business data..."
    : "Ask SUQI about sari-sari store insights...";

  const sampleQueries = {
    scout: [
      "What's our total revenue this month?",
      "Show me top performing regions",
      "Which campaigns are most effective?"
    ],
    suqi: [
      "What products does Juan typically buy?",
      "Show me transaction patterns for Maria persona",
      "Which products have highest ROI potential?"
    ]
  };

  return (
    <div className="px-6 py-4" style={{ backgroundColor: tokens.colors.tbwaWhite }}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Search bar with source selector */}
        <div className="flex gap-3">
          {/* Source selector */}
          <div className="relative">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as ChatSource)}
              className="appearance-none px-4 py-3 pr-10 rounded-lg border border-gray-300 font-medium"
              style={{ 
                backgroundColor: source === 'suqi' ? tokens.colors.cookieBrown : tokens.colors.tbwaBlack,
                color: tokens.colors.tbwaWhite
              }}
            >
              <option value="scout">Scout AI</option>
              <option value="suqi">SUQI (Sari-Sari)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {source === 'scout' ? (
                <Brain className="h-4 w-4" style={{ color: tokens.colors.tbwaYellow }} />
              ) : (
                <Cookie className="h-4 w-4" style={{ color: tokens.colors.tbwaYellow }} />
              )}
            </div>
          </div>

          {/* Search input */}
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" 
              style={{ color: tokens.colors.tbwaGray }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholderText}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base"
              style={{ outline: 'none' }}
              onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${tokens.colors.tbwaYellow}`}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            />
          </div>

          {/* Ask button */}
          <button
            onClick={handleQuery}
            disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
              <>Ask {source === 'scout' ? 'Scout' : 'SUQI'}</>
            )}
          </button>
        </div>

        {/* Sample queries */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
            Try:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries[source].map((sample, index) => (
              <button
                key={index}
                onClick={() => setQuery(sample)}
                className="text-sm px-3 py-1 rounded-full transition-all hover:scale-105"
                style={{ 
                  backgroundColor: tokens.colors.tbwaLightGray,
                  color: tokens.colors.tbwaGray,
                  border: `1px solid ${tokens.colors.tbwaYellow}`
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.tbwaYellow;
                  (e.target as HTMLButtonElement).style.color = tokens.colors.tbwaBlack;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.tbwaLightGray;
                  (e.target as HTMLButtonElement).style.color = tokens.colors.tbwaGray;
                }}
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: '#FEF2F2',
              color: '#DC2626'
            }}
          >
            Error: {error}
          </div>
        )}

        {/* Results display */}
        {result && !error && (
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: tokens.colors.tbwaWhite,
              borderColor: tokens.colors.tbwaLightGray
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold" style={{ color: tokens.colors.tbwaBlack }}>
                {source === 'scout' ? 'Scout AI Analysis' : 'SUQI Insights'}
              </h4>
              <span className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
                {result.query_method || 'AI Analysis'} • {result.execution_time || 0}ms
              </span>
            </div>
            
            {/* Render results based on type */}
            {result.data && Array.isArray(result.data) ? (
              <div className="space-y-2">
                {result.data.slice(0, 5).map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-2 rounded"
                    style={{ backgroundColor: tokens.colors.tbwaLightGray }}
                  >
                    <span>{item.metric || item.name || Object.values(item)[0]}</span>
                    <span className="font-bold">
                      {item.value || item.count || Object.values(item)[1]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && !error && !loading && (
          <div 
            className="text-center py-8 text-sm"
            style={{ color: tokens.colors.tbwaGray }}
          >
            Ask a question to see results.
          </div>
        )}
      </div>
    </div>
  );
};