'use client';

import { DashboardShell } from '../_components/DashboardShell';
import { Card } from '../_components/Card';
import { Target, Award, TrendingUp, Users } from 'lucide-react';

export default function BrandPage() {
  const brandData = [
    { name: 'TBWA Client A', marketShare: 28.5, revenue: 2345678, satisfaction: 89, color: '#FFD700' },
    { name: 'TBWA Client B', marketShare: 22.1, revenue: 1876543, satisfaction: 85, color: '#4f6ef7' },
    { name: 'Competitor X', marketShare: 19.8, revenue: 1654321, satisfaction: 78, color: '#8a6bff' },
    { name: 'Competitor Y', marketShare: 15.2, revenue: 1234567, satisfaction: 72, color: '#97de9b' },
    { name: 'Others', marketShare: 14.4, revenue: 987654, satisfaction: 68, color: '#ffddb0' }
  ];

  const maxShare = Math.max(...brandData.map(b => b.marketShare));

  return (
    <DashboardShell 
      title="Brand Competitive Analysis" 
      activeTab="brand"
    >
      <div className="space-y-6">
        {/* Market Share Bar List */}
        <Card title="Market Share Analysis" subtitle="Brand performance comparison">
          <div className="space-y-4">
            {brandData.map((brand, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                    <p className="text-sm text-gray-500">
                      Revenue: ₱{(brand.revenue / 1000000).toFixed(2)}M • Satisfaction: {brand.satisfaction}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black" style={{ color: brand.color }}>
                      {brand.marketShare}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(brand.marketShare / maxShare) * 100}%`,
                      backgroundColor: brand.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Brand Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Brand Awareness" borderColor="#4f6ef7">
            <div className="text-center py-4">
              <Award className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <p className="text-3xl font-black text-gray-900">87%</p>
              <p className="text-sm text-gray-500">Top-of-mind recall</p>
              <p className="text-sm font-bold text-green-600 mt-2">↑ 5% vs last quarter</p>
            </div>
          </Card>

          <Card title="Brand Loyalty" borderColor="#8a6bff">
            <div className="text-center py-4">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <p className="text-3xl font-black text-gray-900">72%</p>
              <p className="text-sm text-gray-500">Repeat purchase rate</p>
              <p className="text-sm font-bold text-green-600 mt-2">↑ 3% vs last quarter</p>
            </div>
          </Card>

          <Card title="Brand Momentum" borderColor="#97de9b">
            <div className="text-center py-4">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p className="text-3xl font-black text-gray-900">+18%</p>
              <p className="text-sm text-gray-500">YoY growth rate</p>
              <p className="text-sm font-bold text-green-600 mt-2">Outpacing market by 2x</p>
            </div>
          </Card>
        </div>

        {/* Competitive Positioning */}
        <Card title="Competitive Positioning" subtitle="Price vs Quality perception">
          <div className="h-64 relative border rounded-lg bg-gray-50">
            {/* Quadrant labels */}
            <div className="absolute top-2 left-2 text-xs text-gray-500">Low Price</div>
            <div className="absolute top-2 right-2 text-xs text-gray-500">High Price</div>
            <div className="absolute bottom-2 left-2 text-xs text-gray-500">Low Quality</div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">High Quality</div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="absolute inset-0 flex justify-center">
              <div className="h-full border-l border-gray-300"></div>
            </div>

            {/* Brand positions */}
            <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-xs shadow-lg">
              TBWA A
            </div>
            <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center font-bold text-xs text-white shadow-lg">
              TBWA B
            </div>
            <div className="absolute bottom-1/3 left-1/3 w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center font-bold text-xs text-white shadow-lg">
              Comp X
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}