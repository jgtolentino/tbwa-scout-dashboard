'use client';

import React, { useState } from 'react';
import { Search, Cookie } from 'lucide-react';
import { semanticSearch } from '@/lib/nlp/semantic-search';

interface AskPanelProps {
  onResult?: (result: any) => void;
}

export const AskPanel: React.FC<AskPanelProps> = ({ onResult }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // SUQI sample queries
  const sampleQueries = [
    "What products does Juan typically buy?",
    "Show me transaction patterns for Maria persona",
    "Which products have highest ROI potential?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Use semantic search for SUQI queries
      const searchResults = semanticSearch(query);
      
      if (searchResults.length > 0) {
        const topResult = searchResults[0];
        const response = await fetch('/api/wren-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            question: query,
            sql: topResult.sql,
            context: 'sari_sari'
          })
        });
        const data = await response.json();
        setResult(data);
        
        if (onResult) {
          onResult(data);
        }
      } else {
        // Return helpful message if no matches found
        setResult({
          result: 'No specific data found. Try asking about customer personas, transaction patterns, or product recommendations.',
          sql: null,
          confidence: 0.3
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePillClick = (text: string) => {
    setQuery(text);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input row */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-black bg-pink-400">
            SUQI
          </span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your sari-sari operations…"
            className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2 rounded bg-pink-400 text-black font-semibold shadow hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                Asking...
              </>
            ) : (
              <>
                <Cookie className="h-4 w-4" />
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

        {/* Help drawer */}
        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="cursor-pointer font-medium text-sm select-none">
            What can I ask SUQI?
          </summary>

          <div className="mt-3 text-sm leading-6">
            <p className="font-semibold mb-2">SUQI - Sari-Sari Store Intelligence</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Transaction pattern analysis</li>
              <li>Customer persona insights</li>
              <li>Product bundle recommendations</li>
              <li>ROI optimization strategies</li>
              <li>Inventory management tips</li>
              <li>Peak hour analytics</li>
            </ul>
            <p className="mt-3 italic">Example queries:</p>
            <div className="mt-1 space-y-1">
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs">What products does Juan typically buy?</code>
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs">Show me transaction patterns for Maria persona</code>
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs">Which products have highest ROI potential?</code>
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs">What items should I bundle together?</code>
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs">When are my peak selling hours?</code>
            </div>
          </div>
        </details>

        {/* Error display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Result display */}
        {result && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">SUQI Response:</h3>
            <div className="text-sm text-gray-700">
              {result.result || result.answer || 'Processing your query...'}
            </div>
            {result.sql && (
              <details className="mt-3">
                <summary className="text-xs text-gray-500 cursor-pointer">View SQL</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {result.sql}
                </pre>
              </details>
            )}
          </div>
        )}
      </form>
    </div>
  );
};