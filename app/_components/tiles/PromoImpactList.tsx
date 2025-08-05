'use client';

import React from 'react';

interface PromoImpactListProps {
  data: any;
  loading: boolean;
}

const PromoImpactList: React.FC<PromoImpactListProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 bg-gray-100 rounded-full animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!data || !data.promos || data.promos.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">No promo data</p>
        <p className="empty-state__description">Campaign impact unavailable</p>
      </div>
    );
  }

  const getImpactColor = (impact: number) => {
    if (impact > 20) return 'text-green-600 bg-green-50';
    if (impact > 10) return 'text-blue-600 bg-blue-50';
    if (impact > 0) return 'text-gray-600 bg-gray-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-2">
      {data.promos.slice(0, 5).map((promo: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1 mr-2">
            <p className="text-xs font-medium text-gray-900 truncate">
              {promo.promo_name}
            </p>
            <p className="text-xs text-gray-500">
              {promo.tactic}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getImpactColor(promo.revenue_impact)}`}>
              {promo.revenue_impact > 0 ? '+' : ''}{promo.revenue_impact}%
            </span>
            <span className="text-xs text-gray-500">
              ₱{(promo.revenue_delta / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromoImpactList;