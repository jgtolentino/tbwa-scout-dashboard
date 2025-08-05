'use client';

import { DashboardShell } from '../_components/DashboardShell';
import { Card } from '../_components/Card';
import { KpiCard } from '../_components/KpiCard';
import { TrendingUp, BarChart3, Users, Target } from 'lucide-react';

export default function PerformancePage() {
  // Mock data for now - will be replaced with scoutFetch calls
  const kpiData = [
    {
      title: "Total Revenue",
      value: "₱4.7M",
      subtitle: "Last 30 days",
      icon: TrendingUp,
      trend: "+12.5%",
      trendDirection: "up" as const
    },
    {
      title: "Market Share",
      value: "28.3%",
      subtitle: "vs competitors",
      icon: BarChart3,
      trend: "+2.3%",
      trendDirection: "up" as const
    },
    {
      title: "Active Stores",
      value: "1,847",
      subtitle: "Nationwide",
      icon: Users,
      trend: "+87",
      trendDirection: "up" as const
    },
    {
      title: "Campaign ROI",
      value: "3.2x",
      subtitle: "Average return",
      icon: Target,
      trend: "+0.4x",
      trendDirection: "up" as const
    }
  ];

  return (
    <DashboardShell 
      title="Performance Analytics" 
      activeTab="performance"
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </div>

        {/* Regional Performance Table */}
        <Card title="Regional Performance" subtitle="Top performing regions by revenue">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Region</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Transactions</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Market Share</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Metro Manila</td>
                  <td className="py-3 px-4 text-right">₱1.23M</td>
                  <td className="py-3 px-4 text-right">45,678</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">32.1%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Cebu</td>
                  <td className="py-3 px-4 text-right">₱987K</td>
                  <td className="py-3 px-4 text-right">34,567</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">28.5%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Davao</td>
                  <td className="py-3 px-4 text-right">₱765K</td>
                  <td className="py-3 px-4 text-right">23,456</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600">25.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Campaign Effectiveness */}
        <Card title="Campaign Effectiveness" subtitle="Store type performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border-2 border-gray-100 hover:border-yellow-400 transition-all">
              <h4 className="font-bold text-lg mb-2">Premium Retail</h4>
              <p className="text-3xl font-black text-green-600">84.7%</p>
              <p className="text-sm text-gray-500">Influence Score</p>
            </div>
            <div className="p-4 rounded-lg border-2 border-gray-100 hover:border-yellow-400 transition-all">
              <h4 className="font-bold text-lg mb-2">Mass Market</h4>
              <p className="text-3xl font-black text-blue-600">72.3%</p>
              <p className="text-sm text-gray-500">Influence Score</p>
            </div>
            <div className="p-4 rounded-lg border-2 border-gray-100 hover:border-yellow-400 transition-all">
              <h4 className="font-bold text-lg mb-2">E-commerce</h4>
              <p className="text-3xl font-black text-purple-600">69.1%</p>
              <p className="text-sm text-gray-500">Influence Score</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}