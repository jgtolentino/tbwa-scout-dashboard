import { QueryTemplate } from '../data/query-templates';
import { semanticSearch, buildFallbackQuery, ExtractedEntities } from './semantic-search';

// Pre-computed embeddings for common business terms (simplified)
const businessTermEmbeddings: Record<string, number[]> = {
  // Revenue related
  'revenue': [0.9, 0.1, 0.2, 0.1, 0.1],
  'sales': [0.85, 0.15, 0.2, 0.1, 0.1],
  'income': [0.8, 0.1, 0.15, 0.1, 0.1],
  'earnings': [0.82, 0.12, 0.18, 0.1, 0.1],
  
  // Regional
  'region': [0.1, 0.9, 0.1, 0.1, 0.2],
  'location': [0.1, 0.85, 0.15, 0.1, 0.2],
  'area': [0.1, 0.8, 0.1, 0.1, 0.15],
  'geographic': [0.1, 0.88, 0.1, 0.1, 0.25],
  
  // Performance
  'performance': [0.2, 0.1, 0.9, 0.2, 0.1],
  'effectiveness': [0.15, 0.1, 0.85, 0.25, 0.1],
  'efficiency': [0.1, 0.1, 0.8, 0.2, 0.1],
  
  // Brand
  'brand': [0.1, 0.1, 0.2, 0.9, 0.1],
  'tbwa': [0.1, 0.1, 0.15, 0.95, 0.1],
  'competitor': [0.1, 0.1, 0.2, 0.85, 0.15],
  
  // Customer
  'customer': [0.1, 0.2, 0.1, 0.1, 0.9],
  'client': [0.1, 0.15, 0.1, 0.15, 0.85],
  'consumer': [0.1, 0.2, 0.1, 0.1, 0.88],
};

// Simple cosine similarity
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Generate simple embedding for a query
function generateQueryEmbedding(query: string): number[] {
  const tokens = query.toLowerCase().split(/\s+/);
  const embedding = [0, 0, 0, 0, 0]; // 5 dimensions: revenue, regional, performance, brand, customer
  let count = 0;
  
  tokens.forEach(token => {
    if (businessTermEmbeddings[token]) {
      const termEmbed = businessTermEmbeddings[token];
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] += termEmbed[i];
      }
      count++;
    }
  });
  
  // Normalize
  if (count > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= count;
    }
  }
  
  return embedding;
}

// Context retrieval for RAG
interface RetrievedContext {
  context: string;
  relevance: number;
  source: string;
}

function retrieveContext(query: string): RetrievedContext[] {
  const contexts: RetrievedContext[] = [
    {
      context: "Revenue metrics include total sales, transaction counts, and average order values.",
      relevance: 0,
      source: "revenue_definitions"
    },
    {
      context: "Regional performance is measured by revenue, transaction volume, and market share per location.",
      relevance: 0,
      source: "regional_metrics"
    },
    {
      context: "TBWA brand performance is compared against competitors using market share and customer satisfaction.",
      relevance: 0,
      source: "brand_analysis"
    },
    {
      context: "Customer segments are analyzed by purchase behavior, frequency, and lifetime value.",
      relevance: 0,
      source: "customer_analytics"
    },
    {
      context: "Campaign effectiveness is measured by influenced transactions and attributed revenue.",
      relevance: 0,
      source: "campaign_metrics"
    }
  ];
  
  const queryEmbedding = generateQueryEmbedding(query);
  const contextEmbeddings = [
    [0.8, 0.1, 0.1, 0.1, 0.1], // revenue
    [0.1, 0.8, 0.2, 0.1, 0.1], // regional
    [0.1, 0.1, 0.2, 0.8, 0.1], // brand
    [0.1, 0.1, 0.1, 0.1, 0.8], // customer
    [0.2, 0.1, 0.7, 0.2, 0.1]  // campaign
  ];
  
  // Calculate relevance scores
  contexts.forEach((ctx, idx) => {
    ctx.relevance = cosineSimilarity(queryEmbedding, contextEmbeddings[idx]);
  });
  
  // Sort by relevance
  contexts.sort((a, b) => b.relevance - a.relevance);
  
  return contexts.slice(0, 3); // Return top 3 contexts
}

// Main RAG query processing
export interface RAGQueryResult {
  sql: string;
  confidence: number;
  method: 'semantic' | 'rag' | 'fallback';
  contexts: RetrievedContext[];
  entities: ExtractedEntities;
  explanation: string;
  suggestions?: string[];
}

export async function processQueryWithRAG(query: string): Promise<RAGQueryResult> {
  // Step 1: Retrieve relevant contexts
  const contexts = retrieveContext(query);
  
  // Step 2: Try semantic search first
  const semanticResults = semanticSearch(query);
  
  if (semanticResults.length > 0 && semanticResults[0].score > 0.7) {
    // High confidence semantic match
    return {
      sql: semanticResults[0].sql,
      confidence: semanticResults[0].score,
      method: 'semantic',
      contexts,
      entities: semanticResults[0].entities,
      explanation: semanticResults[0].explanation,
      suggestions: semanticResults.slice(1).map(r => r.template.examples[0])
    };
  }
  
  // Step 3: Use RAG for enhanced query understanding
  const augmentedQuery = augmentQuery(query, contexts);
  const ragResults = performRAGSearch(augmentedQuery, contexts);
  
  if (ragResults.confidence > 0.5) {
    return {
      sql: ragResults.sql,
      confidence: ragResults.confidence,
      method: 'rag',
      contexts,
      entities: ragResults.entities,
      explanation: ragResults.explanation
    };
  }
  
  // Step 4: Fallback to basic query
  const entities = extractEntitiesFromQuery(query);
  const fallbackSQL = buildFallbackQuery(query, entities);
  
  return {
    sql: fallbackSQL,
    confidence: 0.3,
    method: 'fallback',
    contexts,
    entities,
    explanation: 'Using fallback query. Try being more specific or use suggested queries.',
    suggestions: getSuggestedQueries(query)
  };
}

// Augment query with retrieved context
function augmentQuery(query: string, contexts: RetrievedContext[]): string {
  const relevantContext = contexts
    .filter(ctx => ctx.relevance > 0.5)
    .map(ctx => ctx.context)
    .join(' ');
  
  return `${query} ${relevantContext}`;
}

// Enhanced RAG search with context
function performRAGSearch(augmentedQuery: string, contexts: RetrievedContext[]): {
  sql: string;
  confidence: number;
  entities: ExtractedEntities;
  explanation: string;
} {
  // Determine query intent based on context relevance
  const topContext = contexts[0];
  let sql = '';
  let confidence = 0;
  const entities = extractEntitiesFromQuery(augmentedQuery);
  
  // Build SQL based on dominant context
  switch (topContext.source) {
    case 'revenue_definitions':
      sql = `
        SELECT 
          SUM(revenue) as total_revenue,
          COUNT(*) as transaction_count,
          AVG(revenue) as avg_order_value
        FROM transactions
        WHERE created_at >= CURRENT_DATE - INTERVAL '${entities.period || '30 days'}'
      `;
      confidence = 0.7;
      break;
      
    case 'regional_metrics':
      sql = `
        SELECT 
          region,
          SUM(revenue) as revenue,
          COUNT(*) as transactions,
          ROUND(SUM(revenue) * 100.0 / SUM(SUM(revenue)) OVER (), 2) as market_share
        FROM transactions
        WHERE created_at >= CURRENT_DATE - INTERVAL '${entities.period || '30 days'}'
        GROUP BY region
        ORDER BY revenue DESC
      `;
      confidence = 0.75;
      break;
      
    case 'brand_analysis':
      sql = `
        SELECT 
          brand_name,
          SUM(revenue) as revenue,
          AVG(customer_satisfaction) as satisfaction,
          COUNT(DISTINCT customer_id) as customers
        FROM transactions
        WHERE created_at >= CURRENT_DATE - INTERVAL '${entities.period || '30 days'}'
        GROUP BY brand_name
        ORDER BY revenue DESC
      `;
      confidence = 0.72;
      break;
      
    default:
      // Use semantic search as backup
      const backupResults = semanticSearch(augmentedQuery);
      if (backupResults.length > 0) {
        sql = backupResults[0].sql;
        confidence = backupResults[0].score * 0.8;
      }
  }
  
  return {
    sql,
    confidence,
    entities,
    explanation: `Query understood through context: ${topContext.source}`
  };
}

// Extract entities helper
function extractEntitiesFromQuery(query: string): ExtractedEntities {
  const entities: ExtractedEntities = {};
  
  // Time extraction
  const timeMatch = query.match(/last (\d+) (days?|months?|years?)/i);
  if (timeMatch) {
    entities.period = `${timeMatch[1]} ${timeMatch[2]}`;
  } else {
    entities.period = '30 days';
  }
  
  // Limit extraction
  const limitMatch = query.match(/top (\d+)/i);
  if (limitMatch) {
    entities.limit = parseInt(limitMatch[1]);
  }
  
  return entities;
}

// Get suggested queries based on partial input
function getSuggestedQueries(query: string): string[] {
  const suggestions = [
    "What is the total revenue last month?",
    "Show top 10 performing stores",
    "Compare TBWA brand performance",
    "Regional sales breakdown",
    "Customer segment analysis"
  ];
  
  // Filter suggestions based on query tokens
  const queryTokens = query.toLowerCase().split(/\s+/);
  return suggestions.filter(suggestion => 
    queryTokens.some(token => 
      suggestion.toLowerCase().includes(token)
    )
  ).slice(0, 3);
}

// Export main function for API use
export async function queryWithoutLLM(question: string): Promise<{
  sql: string;
  data?: any[];
  confidence: number;
  method: string;
  execution_time: number;
}> {
  const startTime = Date.now();
  const result = await processQueryWithRAG(question);
  
  return {
    sql: result.sql,
    confidence: result.confidence,
    method: result.method,
    execution_time: Date.now() - startTime
  };
}