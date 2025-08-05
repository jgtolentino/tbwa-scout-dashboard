'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopBundlesTableProps {
  data: any;
  loading: boolean;
}

const TopBundlesTable: React.FC<TopBundlesTableProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!data || !data.bundles || data.bundles.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">No bundle data</p>
        <p className="empty-state__description">Product bundle analysis unavailable</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 text-sm font-medium text-gray-700">Bundle</th>
            <th className="pb-3 text-sm font-medium text-gray-700 text-right">Uplift %</th>
            <th className="pb-3 text-sm font-medium text-gray-700 text-right">Revenue</th>
            <th className="pb-3 text-sm font-medium text-gray-700 text-center">Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.bundles.slice(0, 5).map((bundle: any, idx: number) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{bundle.bundle_name}</p>
                  <p className="text-xs text-gray-500">{bundle.products.join(' + ')}</p>
                </div>
              </td>
              <td className="py-3 text-right">
                <span className="text-sm font-bold text-green-600">
                  +{bundle.uplift_percentage}%
                </span>
              </td>
              <td className="py-3 text-right">
                <span className="text-sm font-medium text-gray-900">
                  ₱{bundle.revenue.toLocaleString()}
                </span>
              </td>
              <td className="py-3 text-center">
                {bundle.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mx-auto" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopBundlesTable;