import { NextRequest, NextResponse } from 'next/server';
import { queryWithoutLLM } from '@/lib/nlp/rag-engine';
import { supabase } from '@/lib/utils/supabase';

export async function OPTIONS() {
  return NextResponse.json({});
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, useWren = true } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check if we should use semantic search (no LLM) or Wren AI
    const useSemanticSearch = !process.env.WREN_URL || !process.env.WREN_API_KEY || !useWren;
    
    if (useSemanticSearch) {
      // Use our semantic search and RAG system (no LLM required)
      const result = await queryWithoutLLM(question);
      
      // For demo purposes, return mock data based on the generated SQL
      const mockData = generateMockDataFromSQL(result.sql, question);
      
      return NextResponse.json({
        sql: result.sql,
        data: mockData,
        query_method: `SUQI Semantic (${result.method})`,
        confidence: result.confidence,
        execution_time: result.execution_time,
        llm_free: true
      });
    }

    // Call Wren Query RPC function instead of Edge Function
    const { data: wrenData, error: wrenError } = await supabase.rpc('wren_query', {
      question,
      context: body.context || 'general',
      include_sql: true,
      confidence_threshold: 0.6
    });

    if (wrenError) {
      throw wrenError;
    }

    // Transform Wren response to match our dashboard format
    return NextResponse.json({
      sql: wrenData.sql,
      data: wrenData.data || wrenData.results,
      query_method: 'SUQI AI (WrenAI)',
      confidence: wrenData.llm_confidence || wrenData.confidence || 0.85,
      execution_time: wrenData.execution_time || Date.now() - body.timestamp,
      metadata: {
        tables_used: wrenData.tables_used,
        columns_referenced: wrenData.columns_referenced
      }
    });

  } catch (error) {
    console.error('Wren AI query error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process query',
        details: error instanceof Error ? error.message : 'Unknown error',
        query_method: 'Error'
      },
      { status: 500 }
    );
  }
}

// Generate mock data based on SQL pattern
function generateMockDataFromSQL(sql: string, question: string): any[] {
  const sqlLower = sql.toLowerCase();
  
  // Executive KPIs
  if (sqlLower.includes('revenue_millions') || sqlLower.includes('kpi')) {
    return [{
      revenue_millions: 4.7,
      total_transactions: 128453,
      unique_customers: 45678,
      satisfaction_score: 0.82,
      active_stores: 187,
      regions_covered: 15
    }];
  }
  
  // Regional data
  if (sqlLower.includes('group by region')) {
    return [
      { region: 'Metro Manila', revenue: 1234567, transactions: 45678, market_share: 32.1 },
      { region: 'Cebu', revenue: 987654, transactions: 34567, market_share: 28.5 },
      { region: 'Davao', revenue: 765432, transactions: 23456, market_share: 25.8 },
      { region: 'Iloilo', revenue: 543210, transactions: 15678, market_share: 22.3 },
      { region: 'Baguio', revenue: 432109, transactions: 12345, market_share: 19.7 }
    ];
  }
  
  // Brand comparison
  if (sqlLower.includes('brand_name')) {
    return [
      { brand_name: 'TBWA Client A', revenue: 2345678, customers: 12345, satisfaction: 0.89 },
      { brand_name: 'TBWA Client B', revenue: 1876543, customers: 9876, satisfaction: 0.85 },
      { brand_name: 'Competitor X', revenue: 1654321, customers: 8765, satisfaction: 0.78 },
      { brand_name: 'Competitor Y', revenue: 1234567, customers: 6543, satisfaction: 0.72 }
    ];
  }
  
  // Store performance
  if (sqlLower.includes('store_name')) {
    return [
      { store_name: 'Makati Premium', store_type: 'Premium', region: 'NCR', total_revenue: 567890, transactions: 2345, avg_satisfaction: 0.91 },
      { store_name: 'BGC Central', store_type: 'Premium', region: 'NCR', total_revenue: 456789, transactions: 1987, avg_satisfaction: 0.88 },
      { store_name: 'Cebu Ayala', store_type: 'Premium', region: 'Cebu', total_revenue: 345678, transactions: 1654, avg_satisfaction: 0.86 },
      { store_name: 'Davao SM', store_type: 'Mass Market', region: 'Davao', total_revenue: 234567, transactions: 1432, avg_satisfaction: 0.83 }
    ];
  }
  
  // Monthly trends
  if (sqlLower.includes("date_trunc('month'")) {
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
    return months.map((month, idx) => ({
      month,
      revenue: 3500000 + (idx * 200000),
      transactions: 25000 + (idx * 2000),
      growth_rate: idx === 0 ? null : (5 + idx * 0.5)
    }));
  }
  
  // Customer segments
  if (sqlLower.includes('customer_segment')) {
    return [
      { customer_segment: 'Premium', customer_count: 5678, total_revenue: 2345678, avg_order_value: 413, avg_satisfaction: 0.92 },
      { customer_segment: 'Regular', customer_count: 23456, total_revenue: 3456789, avg_order_value: 147, avg_satisfaction: 0.84 },
      { customer_segment: 'Budget', customer_count: 45678, total_revenue: 2345678, avg_order_value: 51, avg_satisfaction: 0.78 }
    ];
  }
  
  // Market share
  if (sqlLower.includes('tbwa_market_share')) {
    return [{
      tbwa_revenue_millions: 4.2,
      market_revenue_millions: 14.8,
      tbwa_market_share_pct: 28.4
    }];
  }
  
  // City performance
  if (sqlLower.includes('city_name')) {
    return [
      { city_name: 'Makati', province_name: 'Metro Manila', region_name: 'NCR', total_revenue: 1234567, store_count: 23, transactions: 8765 },
      { city_name: 'Quezon City', province_name: 'Metro Manila', region_name: 'NCR', total_revenue: 987654, store_count: 19, transactions: 6543 },
      { city_name: 'Cebu City', province_name: 'Cebu', region_name: 'Central Visayas', total_revenue: 765432, store_count: 15, transactions: 5432 },
      { city_name: 'Davao City', province_name: 'Davao del Sur', region_name: 'Davao Region', total_revenue: 654321, store_count: 12, transactions: 4321 }
    ];
  }
  
  // Default summary
  return [{
    metric: 'Total Revenue',
    transactions: 128453,
    total_revenue: 4700000,
    avg_transaction: 36.59,
    unique_customers: 45678
  }];
}

// Health check endpoint
export async function GET() {
  const wrenConfigured = !!(process.env.WREN_URL && process.env.WREN_API_KEY);
  
  return NextResponse.json({
    status: 'ok',
    wren_ai: {
      configured: wrenConfigured,
      url: wrenConfigured ? process.env.WREN_URL : null,
      database: process.env.WREN_DATABASE || 'scout_dash'
    },
    timestamp: new Date().toISOString()
  });
}