'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardShell } from '../_components/DashboardShell';
import { Card } from '../_components/Card';
import { MessageSquare, Brain, Cookie, Search } from 'lucide-react';

export default function AskPage() {
  const router = useRouter();

  // Since AskPanel is global, we could redirect to home
  // But let's provide a helpful landing page instead

  return (
    <DashboardShell 
      title="Ask SUQI - Universal Query Interface" 
      activeTab="ask"
    >
      <div className="space-y-6">
        {/* Intro Card */}
        <Card borderColor="#B47921">
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <Cookie className="h-16 w-16 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Welcome to SUQI</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scout Universal Query Intelligence (SUQI) is your AI-powered assistant for natural language 
              business intelligence. Ask questions in plain English and get instant insights from your data.
            </p>
          </div>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Scout AI Mode" borderColor="#4f6ef7">
            <div className="space-y-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <p className="text-gray-600">
                General business intelligence queries across all your data domains.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Executive dashboards and KPIs</li>
                <li>• Performance analytics</li>
                <li>• Brand competitive analysis</li>
                <li>• Geographic intelligence</li>
              </ul>
              <div className="pt-4">
                <h4 className="font-semibold mb-2">Example Queries:</h4>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>"What's our total revenue this month?"</p>
                  <p>"Show me top performing regions"</p>
                  <p>"Which campaigns are most effective?"</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="SUQI Sari-Sari Mode" borderColor="#B47921">
            <div className="space-y-4">
              <Cookie className="h-8 w-8 text-yellow-600" />
              <p className="text-gray-600">
                Specialized queries for sari-sari store operations and insights.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Transaction pattern analysis</li>
                <li>• Customer persona insights</li>
                <li>• Product bundle recommendations</li>
                <li>• ROI optimization strategies</li>
              </ul>
              <div className="pt-4">
                <h4 className="font-semibold mb-2">Example Queries:</h4>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>"What products does Juan typically buy?"</p>
                  <p>"Show me transaction patterns for Maria persona"</p>
                  <p>"Which products have highest ROI potential?"</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card title="Query Tips" subtitle="Get the most out of SUQI">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <h4 className="font-semibold mb-1">Be Specific</h4>
              <p className="text-sm text-gray-600">
                Include time ranges, regions, or specific metrics for better results
              </p>
            </div>
            <div className="text-center p-4">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <h4 className="font-semibold mb-1">Natural Language</h4>
              <p className="text-sm text-gray-600">
                Ask questions as you would to a colleague - no SQL needed
              </p>
            </div>
            <div className="text-center p-4">
              <Brain className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <h4 className="font-semibold mb-1">Context Aware</h4>
              <p className="text-sm text-gray-600">
                SUQI remembers your recent queries for follow-up questions
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">
            Ready to start? Use the Ask Panel at the top of any page!
          </p>
          <button
            onClick={() => {
              // Focus the ask panel input
              const input = document.querySelector('input[placeholder*="Ask anything"]') as HTMLInputElement;
              if (input) {
                input.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:scale-105 transition-all"
          >
            Start Asking Questions
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}