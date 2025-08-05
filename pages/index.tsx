import React, { useState } from 'react';
import { Bot, BarChart3, MessageCircle, Home } from 'lucide-react';
import UnifiedIntelligenceBar from '../components/UnifiedIntelligenceBar';
import ExecutiveDashboard from '../components/ExecutiveDashboard';
import AIChatInterface from '../components/AIChatInterface';

type ViewMode = 'dashboard' | 'chat';

const SariSariPlatform: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');

  const handleQueryFromBar = (query: string, type: 'analytics' | 'ai_chat') => {
    if (type === 'ai_chat') {
      setActiveView('chat');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TBWA Scout</h1>
                  <p className="text-xs text-gray-600">Sari-Sari Intelligence Platform</p>
                </div>
              </div>
              
              <nav className="flex items-center gap-1 ml-8">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'chat'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  AI Assistant
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Intelligence Bar */}
      {activeView === 'dashboard' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <UnifiedIntelligenceBar onQuery={handleQueryFromBar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {activeView === 'chat' ? (
          <div className="h-[calc(100vh-4rem)]">
            <AIChatInterface />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ExecutiveDashboard />
          </div>
        )}
      </main>
    </div>
  );
};

export default SariSariPlatform;
