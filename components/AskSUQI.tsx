'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Brain, 
  Sparkles, 
  Clock,
  TrendingUp,
  BarChart3,
  MapPin,
  Users,
  Zap,
  Volume2,
  Bot,
  Info
} from 'lucide-react';

interface SUQIResponse {
  sql?: string;
  data: any[];
  query_method: string;
  confidence: number;
  execution_time: number;
  llm_free?: boolean;
  metadata?: {
    tables_used?: string[];
    columns_referenced?: string[];
  };
}

interface SuggestedQuery {
  text: string;
  category: string;
  icon: React.ReactNode;
}

// Tab-specific suggested queries
const suggestedQueries: Record<string, SuggestedQuery[]> = {
  executive: [
    { text: "What's our total revenue this month?", category: "Revenue", icon: <TrendingUp className="w-4 h-4" /> },
    { text: "Show me TBWA market share percentage", category: "Market", icon: <BarChart3 className="w-4 h-4" /> },
    { text: "Campaign influence rate across all stores", category: "Campaign", icon: <Zap className="w-4 h-4" /> }
  ],
  analytics: [
    { text: "Regional performance breakdown", category: "Regional", icon: <MapPin className="w-4 h-4" /> },
    { text: "Customer behavior by time of day", category: "Behavior", icon: <Clock className="w-4 h-4" /> },
    { text: "Top performing store types", category: "Stores", icon: <Users className="w-4 h-4" /> }
  ],
  brands: [
    { text: "Compare TBWA vs competitor brands", category: "Competitive", icon: <BarChart3 className="w-4 h-4" /> },
    { text: "Brand substitution patterns", category: "Substitution", icon: <TrendingUp className="w-4 h-4" /> },
    { text: "Customer satisfaction by brand", category: "Satisfaction", icon: <Users className="w-4 h-4" /> }
  ],
  geographic: [
    { text: "Sales concentration by barangay", category: "Geographic", icon: <MapPin className="w-4 h-4" /> },
    { text: "Which cities have highest revenue?", category: "Cities", icon: <MapPin className="w-4 h-4" /> },
    { text: "Regional market penetration analysis", category: "Regional", icon: <TrendingUp className="w-4 h-4" /> }
  ]
};

interface AskSUQIProps {
  activeTab?: string;
}

export default function AskSUQI({ activeTab = 'executive' }: AskSUQIProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<SUQIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queryHistory, setQueryHistory] = useState<Array<{query: string, timestamp: Date}>>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setQuery(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setError('Speech recognition error. Please try typing instead.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle voice input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Voice input not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setError(null);
    }
  };

  // Submit query
  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsProcessing(true);
    setError(null);

    // Add to history
    setQueryHistory(prev => [{query, timestamp: new Date()}, ...prev.slice(0, 4)]);

    try {
      const response = await fetch('/api/wren-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: query,
          timestamp: Date.now(),
          useWren: true,
          context: activeTab
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Query failed');
      }

      setResponse(result);

      // Speak response summary if TTS is available
      if (synthRef.current && result.data && result.data.length > 0) {
        const summary = generateVoiceSummary(result);
        speakResponse(summary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
      setResponse(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate voice summary from results
  const generateVoiceSummary = (result: SUQIResponse): string => {
    if (!result.data || result.data.length === 0) {
      return "No results found for your query.";
    }

    const firstRow = result.data[0];
    const keys = Object.keys(firstRow);
    
    if (keys.length === 1 && typeof firstRow[keys[0]] === 'number') {
      return `The result is ${firstRow[keys[0]].toLocaleString()}`;
    }

    return `Found ${result.data.length} results. ${result.query_method === 'Wren AI Text-to-SQL' ? 'Using AI analysis.' : 'Using semantic search.'}`;
  };

  // Text-to-speech
  const speakResponse = (text: string) => {
    if (!synthRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synthRef.current.speak(utterance);
  };

  // Format table data
  const renderDataTable = (data: any[]) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-900">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-400">
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.slice(0, 10).map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-900">
                    {typeof row[col] === 'number' 
                      ? row[col].toLocaleString()
                      : row[col] || '-'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 10 && (
          <p className="text-sm text-gray-500 mt-2 px-4">
            Showing first 10 of {data.length} results
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* SUQI Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 text-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
              <Bot className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Ask SUQI</h2>
              <p className="text-sm opacity-90">Scout Universal Query Intelligence - WrenAI's Evolution for TBWA</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Context: {activeTab}</span>
          </div>
        </div>
      </div>

      {/* Query Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your business data..."
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={isProcessing}
            />
            <button
              onClick={toggleListening}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !query.trim()}
            className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Ask SUQI
              </>
            )}
          </button>
        </div>

        {/* Voice indicator */}
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-red-600 mb-4">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>Listening... Speak your question</span>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Suggested queries */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Suggested queries for {activeTab}:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries[activeTab]?.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(suggestion.text)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {suggestion.icon}
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Response Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-gray-900">SUQI Response</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Method: {response.query_method}
                </span>
                <span>Confidence: {(response.confidence * 100).toFixed(1)}%</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {response.execution_time}ms
                </span>
              </div>
            </div>
          </div>

          {/* SQL Display */}
          {response.sql && (
            <div className="px-6 py-4 bg-gray-900 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-400 mb-2">Generated SQL:</p>
              <pre className="text-xs text-yellow-400 overflow-x-auto">
                <code>{response.sql}</code>
              </pre>
            </div>
          )}

          {/* Data Results */}
          <div className="p-6">
            {response.data && response.data.length > 0 ? (
              renderDataTable(response.data)
            ) : (
              <p className="text-gray-500 text-center py-8">No results found</p>
            )}
          </div>

          {/* Metadata */}
          {response.metadata && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
              {response.metadata.tables_used && (
                <span className="mr-4">Tables: {response.metadata.tables_used.join(', ')}</span>
              )}
              {response.llm_free && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  <Sparkles className="w-3 h-3 mr-1" />
                  LLM-Free Query
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Query History */}
      {queryHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {queryHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(item.query)}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <span className="font-medium">{item.query}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {item.timestamp.toLocaleTimeString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}