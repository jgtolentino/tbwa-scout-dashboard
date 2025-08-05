'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { DashboardShell } from '../_components/DashboardShell';
import { Card } from '../_components/Card';
import { Map, BarChart3, TrendingUp, Users } from 'lucide-react';

// Dynamic import for map
const PhilippinesChoropleth = dynamic(
  () => import('@/components/PhilippinesChoropleth'),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
  }
);

export default function GeographicPage() {
  const [showMap, setShowMap] = useState(true);

  const regionData = [
    { region: 'NCR', sales: 1234567, stores: 324, growth: 12.5 },
    { region: 'Central Visayas', sales: 987654, stores: 287, growth: 8.3 },
    { region: 'Davao Region', sales: 765432, stores: 198, growth: 15.2 },
    { region: 'Western Visayas', sales: 654321, stores: 176, growth: 6.7 },
    { region: 'CAR', sales: 543210, stores: 134, growth: 9.8 },
    { region: 'Central Luzon', sales: 432109, stores: 156, growth: 11.2 }
  ];

  return (
    <DashboardShell 
      title="Geographic Intelligence" 
      activeTab="geographic"
    >
      <div className="space-y-6">
        {/* Toggle between map and grid */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Regional Distribution</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showMap 
                  ? 'bg-black text-yellow-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Map className="h-4 w-4 inline mr-2" />
              Map View
            </button>
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !showMap 
                  ? 'bg-black text-yellow-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Grid View
            </button>
          </div>
        </div>

        {/* Map or Grid Display */}
        {showMap ? (
          <Card>
            <div className="h-96">
              <PhilippinesChoropleth />
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionData.map((region, index) => (
              <Card key={index} borderColor="#8a6bff">
                <h4 className="font-bold text-lg mb-3">{region.region}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Sales</span>
                    <span className="font-bold">₱{(region.sales / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active Stores</span>
                    <span className="font-bold">{region.stores}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">YoY Growth</span>
                    <span className={`font-bold ${region.growth > 10 ? 'text-green-600' : 'text-blue-600'}`}>
                      +{region.growth}%
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${(region.sales / 1234567) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* City Performance Grid */}
        <Card title="Top Cities by Performance" subtitle="Highest revenue generating locations">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">City</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Province</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Sales</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Stores</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Avg Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Makati</td>
                  <td className="py-3 px-4">Metro Manila</td>
                  <td className="py-3 px-4 text-right">₱456K</td>
                  <td className="py-3 px-4 text-right">67</td>
                  <td className="py-3 px-4 text-right font-bold">₱142</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Cebu City</td>
                  <td className="py-3 px-4">Cebu</td>
                  <td className="py-3 px-4 text-right">₱389K</td>
                  <td className="py-3 px-4 text-right">54</td>
                  <td className="py-3 px-4 text-right font-bold">₱128</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Davao City</td>
                  <td className="py-3 px-4">Davao del Sur</td>
                  <td className="py-3 px-4 text-right">₱312K</td>
                  <td className="py-3 px-4 text-right">43</td>
                  <td className="py-3 px-4 text-right font-bold">₱117</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Quezon City</td>
                  <td className="py-3 px-4">Metro Manila</td>
                  <td className="py-3 px-4 text-right">₱298K</td>
                  <td className="py-3 px-4 text-right">48</td>
                  <td className="py-3 px-4 text-right font-bold">₱109</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}