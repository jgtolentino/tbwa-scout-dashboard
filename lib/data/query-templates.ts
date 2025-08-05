// SQL Query Templates with semantic patterns
export interface QueryTemplate {
  id: string;
  patterns: string[]; // Natural language patterns
  keywords: string[]; // Important keywords for matching
  sql: string; // SQL template with placeholders
  parameters: string[]; // Parameters to extract
  category: string;
  confidence: number; // Base confidence score
  examples: string[]; // Example questions
}

export const queryTemplates: QueryTemplate[] = [
  // Revenue Queries
  {
    id: 'total_revenue',
    patterns: [
      'total revenue',
      'how much revenue',
      'total sales',
      'revenue amount',
      'money made',
      'earnings'
    ],
    keywords: ['revenue', 'sales', 'total', 'earnings', 'income'],
    sql: `
      SELECT 
        SUM(revenue) as total_revenue,
        COUNT(DISTINCT transaction_id) as transaction_count,
        AVG(revenue) as avg_transaction_value
      FROM transactions
      WHERE created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      {{region_filter}}
    `,
    parameters: ['period', 'region'],
    category: 'revenue',
    confidence: 0.9,
    examples: [
      'What is the total revenue?',
      'Show me total sales last month',
      'How much money did we make?'
    ]
  },
  
  // Regional Performance
  {
    id: 'revenue_by_region',
    patterns: [
      'revenue by region',
      'sales by location',
      'regional performance',
      'performance by area',
      'location revenue'
    ],
    keywords: ['region', 'location', 'area', 'regional', 'by', 'per'],
    sql: `
      SELECT 
        region,
        SUM(revenue) as total_revenue,
        COUNT(DISTINCT transaction_id) as transactions,
        ROUND(AVG(revenue), 2) as avg_transaction,
        RANK() OVER (ORDER BY SUM(revenue) DESC) as rank
      FROM transactions
      WHERE created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      GROUP BY region
      ORDER BY total_revenue DESC
      LIMIT {{limit}}
    `,
    parameters: ['period', 'limit'],
    category: 'regional',
    confidence: 0.85,
    examples: [
      'Show revenue by region',
      'What are sales in each location?',
      'Regional performance breakdown'
    ]
  },

  // Store Performance
  {
    id: 'top_stores',
    patterns: [
      'top stores',
      'best performing stores',
      'highest revenue stores',
      'top locations',
      'best outlets'
    ],
    keywords: ['top', 'best', 'highest', 'stores', 'outlets', 'performing'],
    sql: `
      SELECT 
        store_name,
        store_type,
        region,
        SUM(revenue) as total_revenue,
        COUNT(DISTINCT transaction_id) as transactions,
        ROUND(AVG(customer_satisfaction), 2) as avg_satisfaction
      FROM transactions t
      JOIN stores s ON t.store_id = s.store_id
      WHERE created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      GROUP BY store_name, store_type, region
      ORDER BY total_revenue DESC
      LIMIT {{limit}}
    `,
    parameters: ['period', 'limit'],
    category: 'stores',
    confidence: 0.88,
    examples: [
      'Show me top 10 stores',
      'Which stores are performing best?',
      'Top revenue generating locations'
    ]
  },

  // Brand Performance
  {
    id: 'brand_comparison',
    patterns: [
      'brand performance',
      'compare brands',
      'brand comparison',
      'tbwa vs',
      'brand market share'
    ],
    keywords: ['brand', 'compare', 'vs', 'versus', 'comparison', 'tbwa'],
    sql: `
      SELECT 
        brand_name,
        SUM(revenue) as total_revenue,
        COUNT(DISTINCT customer_id) as unique_customers,
        ROUND(SUM(revenue) * 100.0 / SUM(SUM(revenue)) OVER (), 2) as market_share_pct,
        AVG(customer_satisfaction) as avg_satisfaction
      FROM transactions
      WHERE created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      GROUP BY brand_name
      ORDER BY total_revenue DESC
    `,
    parameters: ['period'],
    category: 'brands',
    confidence: 0.87,
    examples: [
      'Compare brand performance',
      'How is TBWA doing vs competitors?',
      'Show brand market share'
    ]
  },

  // Time-based Analysis
  {
    id: 'monthly_trend',
    patterns: [
      'monthly trend',
      'month over month',
      'monthly revenue',
      'trend analysis',
      'revenue trend'
    ],
    keywords: ['monthly', 'trend', 'month', 'over', 'time', 'growth'],
    sql: `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(revenue) as revenue,
        COUNT(DISTINCT transaction_id) as transactions,
        ROUND(
          (SUM(revenue) - LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC('month', created_at))) 
          * 100.0 / LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC('month', created_at)), 
          2
        ) as growth_rate
      FROM transactions
      WHERE created_at >= CURRENT_DATE - INTERVAL '{{months}} months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `,
    parameters: ['months'],
    category: 'trends',
    confidence: 0.85,
    examples: [
      'Show monthly revenue trend',
      'Month over month growth',
      'Revenue trend last 6 months'
    ]
  },

  // Customer Analysis
  {
    id: 'customer_segments',
    patterns: [
      'customer segments',
      'customer analysis',
      'customer behavior',
      'customer types',
      'segment performance'
    ],
    keywords: ['customer', 'segment', 'behavior', 'analysis', 'types'],
    sql: `
      SELECT 
        customer_segment,
        COUNT(DISTINCT customer_id) as customer_count,
        SUM(revenue) as total_revenue,
        AVG(revenue) as avg_order_value,
        AVG(customer_satisfaction) as avg_satisfaction
      FROM transactions
      WHERE created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      GROUP BY customer_segment
      ORDER BY total_revenue DESC
    `,
    parameters: ['period'],
    category: 'customers',
    confidence: 0.84,
    examples: [
      'Analyze customer segments',
      'Customer behavior by type',
      'Which customer segment spends most?'
    ]
  },

  // Campaign Effectiveness
  {
    id: 'campaign_impact',
    patterns: [
      'campaign effectiveness',
      'campaign impact',
      'marketing effectiveness',
      'campaign performance',
      'marketing roi'
    ],
    keywords: ['campaign', 'marketing', 'effectiveness', 'impact', 'roi'],
    sql: `
      SELECT 
        campaign_name,
        campaign_type,
        COUNT(DISTINCT influenced_transactions) as influenced_sales,
        SUM(influenced_revenue) as attributed_revenue,
        ROUND(influence_score * 100, 2) as influence_percentage
      FROM campaign_performance
      WHERE start_date >= CURRENT_DATE - INTERVAL '{{period}}'
      ORDER BY attributed_revenue DESC
      LIMIT {{limit}}
    `,
    parameters: ['period', 'limit'],
    category: 'campaigns',
    confidence: 0.83,
    examples: [
      'How effective are our campaigns?',
      'Campaign performance analysis',
      'Marketing ROI breakdown'
    ]
  },

  // Geographic Intelligence
  {
    id: 'city_performance',
    patterns: [
      'city performance',
      'performance by city',
      'city revenue',
      'urban analysis',
      'city breakdown'
    ],
    keywords: ['city', 'urban', 'cities', 'municipal', 'metro'],
    sql: `
      SELECT 
        city_name,
        province_name,
        region_name,
        SUM(revenue) as total_revenue,
        COUNT(DISTINCT store_id) as store_count,
        COUNT(DISTINCT transaction_id) as transactions
      FROM transactions t
      JOIN geographic_data g ON t.location_id = g.location_id
      WHERE created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      GROUP BY city_name, province_name, region_name
      ORDER BY total_revenue DESC
      LIMIT {{limit}}
    `,
    parameters: ['period', 'limit'],
    category: 'geographic',
    confidence: 0.86,
    examples: [
      'Show performance by city',
      'Which cities generate most revenue?',
      'City-level breakdown'
    ]
  },

  // KPI Summary
  {
    id: 'executive_kpis',
    patterns: [
      'executive summary',
      'kpi summary',
      'key metrics',
      'dashboard kpis',
      'performance summary'
    ],
    keywords: ['kpi', 'summary', 'executive', 'metrics', 'dashboard'],
    sql: `
      WITH kpis AS (
        SELECT 
          SUM(revenue) as total_revenue,
          COUNT(DISTINCT transaction_id) as total_transactions,
          COUNT(DISTINCT customer_id) as unique_customers,
          AVG(customer_satisfaction) as avg_satisfaction,
          COUNT(DISTINCT store_id) as active_stores,
          COUNT(DISTINCT region) as regions_covered
        FROM transactions
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      )
      SELECT 
        ROUND(total_revenue / 1000000, 2) as revenue_millions,
        total_transactions,
        unique_customers,
        ROUND(avg_satisfaction, 2) as satisfaction_score,
        active_stores,
        regions_covered
      FROM kpis
    `,
    parameters: [],
    category: 'executive',
    confidence: 0.9,
    examples: [
      'Show executive dashboard',
      'Key performance indicators',
      'Summary metrics'
    ]
  },

  // Market Share
  {
    id: 'market_share',
    patterns: [
      'market share',
      'tbwa market share',
      'share of market',
      'market position',
      'competitive share'
    ],
    keywords: ['market', 'share', 'position', 'competitive', 'tbwa'],
    sql: `
      WITH market_totals AS (
        SELECT 
          SUM(CASE WHEN brand_category = 'TBWA' THEN revenue ELSE 0 END) as tbwa_revenue,
          SUM(revenue) as total_market_revenue
        FROM transactions
        WHERE created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      )
      SELECT 
        ROUND(tbwa_revenue / 1000000, 2) as tbwa_revenue_millions,
        ROUND(total_market_revenue / 1000000, 2) as market_revenue_millions,
        ROUND(tbwa_revenue * 100.0 / total_market_revenue, 2) as tbwa_market_share_pct
      FROM market_totals
    `,
    parameters: ['period'],
    category: 'competitive',
    confidence: 0.88,
    examples: [
      'What is TBWA market share?',
      'Our market position',
      'TBWA share of market'
    ]
  }
];