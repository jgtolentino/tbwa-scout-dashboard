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
  },

  // Sari-Sari Expert Bot Queries
  {
    id: 'transaction_inference',
    patterns: [
      'infer transaction',
      'predict products',
      'what did customer buy',
      'transaction analysis',
      'payment inference'
    ],
    keywords: ['infer', 'predict', 'transaction', 'payment', 'bought', 'products'],
    sql: `
      SELECT * FROM scout.infer_transaction_with_persona(
        {{payment_amount}}, 
        {{change_given}}, 
        '{{time_of_day}}', 
        '{{customer_behavior}}', 
        ARRAY[{{visible_products}}], 
        '{{location_context}}'
      )
    `,
    parameters: ['payment_amount', 'change_given', 'time_of_day', 'customer_behavior', 'visible_products', 'location_context'],
    category: 'sari_sari',
    confidence: 0.92,
    examples: [
      'Infer transaction from ₱20 payment, ₱3 change',
      'What did customer buy with ₱50 payment?',
      'Predict products from payment pattern'
    ]
  },

  {
    id: 'persona_insights',
    patterns: [
      'customer personas',
      'persona analysis',
      'customer types',
      'buyer personas',
      'persona insights'
    ],
    keywords: ['persona', 'customer', 'buyer', 'type', 'behavior', 'analysis'],
    sql: `
      SELECT 
        persona_type,
        demographic_profile,
        behavioral_patterns,
        product_preferences,
        business_value,
        regional_affinity
      FROM scout.buyer_personas
      WHERE persona_type = COALESCE('{{persona_type}}', persona_type)
      ORDER BY business_value->>'frequency_score' DESC
    `,
    parameters: ['persona_type'],
    category: 'sari_sari',
    confidence: 0.89,
    examples: [
      'Show customer persona insights',
      'What are the buyer personas?',
      'Analyze customer types'
    ]
  },

  {
    id: 'roi_recommendations',
    patterns: [
      'roi recommendations',
      'revenue recommendations',
      'business recommendations',
      'optimization suggestions',
      'improve revenue'
    ],
    keywords: ['roi', 'recommendations', 'revenue', 'optimize', 'improve', 'suggestions'],
    sql: `
      SELECT * FROM scout.get_revenue_recommendations(
        '{{store_id}}'::UUID,
        '{{priority}}',
        '{{category}}',
        {{implemented}}::BOOLEAN,
        {{limit}}
      )
    `,
    parameters: ['store_id', 'priority', 'category', 'implemented', 'limit'],
    category: 'sari_sari',
    confidence: 0.91,
    examples: [
      'Show ROI recommendations',
      'What are revenue optimization suggestions?',
      'Business improvement recommendations'
    ]
  },

  {
    id: 'sari_sari_overview',
    patterns: [
      'sari sari overview',
      'store intelligence',
      'sari sari insights',
      'store summary',
      'retail intelligence'
    ],
    keywords: ['sari', 'sari-sari', 'store', 'retail', 'intelligence', 'overview'],
    sql: `
      WITH store_metrics AS (
        SELECT 
          COUNT(*) as total_inferences,
          AVG(confidence_score) as avg_confidence,
          COUNT(DISTINCT persona_match) as unique_personas
        FROM scout.inferred_transactions
        WHERE DATE(created_at) = CURRENT_DATE
      ),
      revenue_opportunities AS (
        SELECT 
          SUM(revenue_potential) as total_opportunities,
          COUNT(*) as total_recommendations
        FROM scout.revenue_recommendations
        WHERE is_implemented = false
      )
      SELECT 
        sm.total_inferences,
        ROUND(sm.avg_confidence, 3) as average_confidence,
        sm.unique_personas,
        ro.total_opportunities as revenue_opportunities,
        ro.total_recommendations
      FROM store_metrics sm
      CROSS JOIN revenue_opportunities ro
    `,
    parameters: [],
    category: 'sari_sari',
    confidence: 0.87,
    examples: [
      'Sari-sari store overview',
      'Show store intelligence summary',
      'Retail intelligence dashboard'
    ]
  },

  {
    id: 'persona_revenue_analysis',
    patterns: [
      'persona revenue',
      'customer value by type',
      'persona profitability',
      'customer segment value',
      'persona business impact'
    ],
    keywords: ['persona', 'revenue', 'value', 'customer', 'profitability', 'ltv'],
    sql: `
      SELECT 
        bp.persona_type,
        bp.business_value->>'monthly_ltv' as monthly_ltv,
        bp.business_value->>'frequency_score' as frequency_score,
        bp.business_value->>'average_transaction_value' as avg_transaction,
        COUNT(it.id) as total_inferences
      FROM scout.buyer_personas bp
      LEFT JOIN scout.inferred_transactions it ON it.persona_match = bp.persona_type
      WHERE it.created_at >= CURRENT_DATE - INTERVAL '{{period}}'
      GROUP BY bp.persona_type, bp.business_value
      ORDER BY (bp.business_value->>'monthly_ltv')::INTEGER DESC
    `,
    parameters: ['period'],
    category: 'sari_sari',
    confidence: 0.88,
    examples: [
      'Show persona revenue analysis',
      'Which personas generate most value?',
      'Customer segment profitability'
    ]
  },

  {
    id: 'recommendation_impact',
    patterns: [
      'recommendation impact',
      'implemented recommendations',
      'roi impact',
      'recommendation results',
      'improvement results'
    ],
    keywords: ['recommendation', 'impact', 'implemented', 'results', 'improvement', 'roi'],
    sql: `
      SELECT 
        rr.title,
        rr.category,
        rr.roi_percentage,
        rr.revenue_potential,
        rr.implementation_cost,
        rr.is_implemented,
        rr.success_rate,
        CASE 
          WHEN rr.is_implemented THEN 'Implemented'
          ELSE 'Pending'
        END as status
      FROM scout.revenue_recommendations rr
      WHERE rr.priority = COALESCE('{{priority}}', rr.priority)
      ORDER BY rr.roi_percentage DESC
      LIMIT {{limit}}
    `,
    parameters: ['priority', 'limit'],
    category: 'sari_sari',
    confidence: 0.86,
    examples: [
      'Show recommendation impact',
      'Which recommendations were implemented?',
      'ROI from improvements'
    ]
  }
];