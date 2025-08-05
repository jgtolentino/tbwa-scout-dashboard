import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BarChart3, RefreshCw, Lightbulb } from 'lucide-react';
import sariSariAI from '../utils/sari-sari-ai-api';
import dashboardAPI from '../utils/dashboard-api';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hello! I'm your **Sari-Sari Expert Bot**. I can analyze your transaction data, identify patterns, and provide actionable business insights.\n\nWhat would you like to know about your business?",
      timestamp: new Date(),
      suggestions: [
        "Show me top performing regions",
        "Which customers drive the most revenue?",
        "What are my best ROI opportunities?",
        "Analyze recent transaction patterns"
      ]
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = async (query: string): Promise<ChatMessage> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('region')) {
      const data = await dashboardAPI.getRegionalPerformance();
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `📍 **Regional Performance Analysis**\n\nHere are your top performing regions:\n\n${data.slice(0, 3).map((region: any, i: number) => 
          `${i + 1}. **${region.region_name || `Region ${i + 1}`}**: ₱${(region.metric_value || 0).toLocaleString()}`
        ).join('\n')}\n\nTotal regions analyzed: ${data.length}`,
        timestamp: new Date(),
        suggestions: [
          "Show me customer demographics by region",
          "Which region has the highest growth potential?",
          "Compare urban vs rural performance"
        ]
      };
    }
    
    if (lowerQuery.includes('customer') || lowerQuery.includes('persona')) {
      const data = await dashboardAPI.getPersonaRegionMetrics();
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `👥 **Customer Analysis**\n\nYour customer segments:\n\n${data.slice(0, 3).map((persona: any, i: number) => 
          `${i + 1}. **${persona.persona_type || `Segment ${i + 1}`}**: ${(persona.percentage || 0)}% of customers in ${persona.region || 'all regions'}`
        ).join('\n')}\n\nTotal segments identified: ${data.length}`,
        timestamp: new Date(),
        suggestions: [
          "What products do these segments prefer?",
          "How can I increase customer lifetime value?",
          "Show me loyalty patterns"
        ]
      };
    }
    
    if (lowerQuery.includes('roi') || lowerQuery.includes('opportunity')) {
      const data = await dashboardAPI.getCampaignEffect();
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `💰 **ROI Opportunities**\n\nTop performing campaigns:\n\n${data.slice(0, 3).map((campaign: any, i: number) => 
          `${i + 1}. **${campaign.campaign_name || `Campaign ${i + 1}`}**: ${(campaign.roi || 0)}% ROI with ${campaign.impact || 'medium'} impact`
        ).join('\n')}\n\nRecommendation: Focus on scaling high-impact campaigns in your top regions.`,
        timestamp: new Date(),
        suggestions: [
          "How can I scale the best campaigns?",
          "What makes campaigns successful?",
          "Show me campaign performance by region"
        ]
      };
    }
    
    // Default response
    const summary = await sariSariAI.getDailyInferences();
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: `🤖 **Business Overview**\n\nCurrent status:\n• **${summary.total_inferences} AI inferences** processed\n• **${summary.customer_segments_identified} customer segments** active\n• **${summary.avg_confidence_score.toFixed(1)}% confidence** in insights\n• **${summary.transaction_volume.toLocaleString()} transactions** analyzed\n\nYour business is performing well with strong data quality and active customer engagement!`,
      timestamp: new Date(),
      suggestions: [
        "Show me detailed regional analysis",
        "Which customers are most profitable?",
        "What are my growth opportunities?"
      ]
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await processQuery(input);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: "I encountered an error processing your request. Please try asking in a different way.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-500">Conversational business intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
              <div className="flex items-start gap-3">
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, index) => (
                      <p key={index} className="mt-2 first:mt-0">
                        {line.includes('**') ? (
                          <>
                            {line.split('**').map((part, partIndex) => 
                              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
                            )}
                          </>
                        ) : line}
                      </p>
                    ))}
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lightbulb className="w-3 h-3" />
                        <span>Follow-up questions:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setInput(suggestion)}
                            className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 border border-blue-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing your data...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about revenue, customers, regions, or growth opportunities..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
