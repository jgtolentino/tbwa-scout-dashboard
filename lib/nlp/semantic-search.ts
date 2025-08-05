import { queryTemplates, QueryTemplate } from '../data/query-templates';

// Simple tokenizer for text processing
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

// Calculate Jaccard similarity between two sets of tokens
function jaccardSimilarity(tokens1: string[], tokens2: string[]): number {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = new Set(Array.from(set1).filter(x => set2.has(x)));
  const union = new Set([...Array.from(set1), ...Array.from(set2)]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Calculate TF-IDF weighted similarity
function calculateTFIDF(tokens: string[], allDocuments: string[][]): Map<string, number> {
  const termFrequency = new Map<string, number>();
  const documentFrequency = new Map<string, number>();
  
  // Calculate term frequency
  tokens.forEach(token => {
    termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
  });
  
  // Calculate document frequency
  tokens.forEach(token => {
    let docCount = 0;
    allDocuments.forEach(doc => {
      if (doc.includes(token)) docCount++;
    });
    documentFrequency.set(token, docCount);
  });
  
  // Calculate TF-IDF
  const tfidf = new Map<string, number>();
  tokens.forEach(token => {
    const tf = (termFrequency.get(token) || 0) / tokens.length;
    const idf = Math.log(allDocuments.length / (documentFrequency.get(token) || 1));
    tfidf.set(token, tf * idf);
  });
  
  return tfidf;
}

// Extract entities and parameters from query
export interface ExtractedEntities {
  timeframe?: string;
  region?: string;
  limit?: number;
  brand?: string;
  period?: string;
}

function extractEntities(query: string): ExtractedEntities {
  const entities: ExtractedEntities = {};
  
  // Time period extraction
  const timePatterns = [
    { pattern: /last (\d+) (days?|weeks?|months?|years?)/i, extract: (m: RegExpMatchArray) => `${m[1]} ${m[2]}` },
    { pattern: /past (\d+) (days?|weeks?|months?|years?)/i, extract: (m: RegExpMatchArray) => `${m[1]} ${m[2]}` },
    { pattern: /yesterday/i, extract: () => '1 day' },
    { pattern: /today/i, extract: () => '0 days' },
    { pattern: /this week/i, extract: () => '7 days' },
    { pattern: /this month/i, extract: () => '30 days' },
    { pattern: /this year/i, extract: () => '365 days' },
  ];
  
  for (const { pattern, extract } of timePatterns) {
    const match = query.match(pattern);
    if (match) {
      entities.period = extract(match);
      entities.timeframe = entities.period;
      break;
    }
  }
  
  // Default time period if not specified
  if (!entities.period) {
    entities.period = '30 days';
    entities.timeframe = '30 days';
  }
  
  // Region extraction
  const regions = ['NCR', 'Metro Manila', 'Cebu', 'Davao', 'Iloilo', 'Baguio', 'Central Luzon', 'Visayas', 'Mindanao'];
  for (const region of regions) {
    if (query.toLowerCase().includes(region.toLowerCase())) {
      entities.region = region;
      break;
    }
  }
  
  // Limit extraction
  const limitMatch = query.match(/top (\d+)|(\d+) (stores?|locations?|brands?)/i);
  if (limitMatch) {
    entities.limit = parseInt(limitMatch[1] || limitMatch[2]);
  } else {
    entities.limit = 10; // default limit
  }
  
  return entities;
}

// Main semantic search function
export interface SearchResult {
  template: QueryTemplate;
  score: number;
  sql: string;
  entities: ExtractedEntities;
  explanation: string;
}

export function semanticSearch(query: string): SearchResult[] {
  const queryTokens = tokenize(query);
  const results: SearchResult[] = [];
  
  // Create document collection for TF-IDF
  const allDocuments = queryTemplates.map(template => 
    [...template.patterns, ...template.keywords, ...template.examples]
      .flatMap(text => tokenize(text))
  );
  
  // Extract entities from query
  const entities = extractEntities(query);
  
  // Score each template
  queryTemplates.forEach(template => {
    let score = 0;
    let matchedPatterns: string[] = [];
    
    // 1. Pattern matching score (40%)
    template.patterns.forEach(pattern => {
      const patternTokens = tokenize(pattern);
      const similarity = jaccardSimilarity(queryTokens, patternTokens);
      if (similarity > 0.3) {
        score += similarity * 0.4;
        matchedPatterns.push(pattern);
      }
    });
    
    // 2. Keyword matching score (30%)
    const keywordMatches = template.keywords.filter(keyword => 
      queryTokens.includes(keyword.toLowerCase())
    );
    score += (keywordMatches.length / template.keywords.length) * 0.3;
    
    // 3. Example similarity score (20%)
    let maxExampleScore = 0;
    template.examples.forEach(example => {
      const exampleTokens = tokenize(example);
      const similarity = jaccardSimilarity(queryTokens, exampleTokens);
      maxExampleScore = Math.max(maxExampleScore, similarity);
    });
    score += maxExampleScore * 0.2;
    
    // 4. Entity bonus score (10%)
    let entityBonus = 0;
    if (entities.region && template.category === 'regional') entityBonus += 0.05;
    if (entities.timeframe && template.parameters.includes('period')) entityBonus += 0.05;
    score += entityBonus;
    
    // Apply base confidence
    score *= template.confidence;
    
    if (score > 0.3) { // Threshold for relevance
      // Generate SQL with parameters
      let sql = template.sql;
      
      // Replace parameters
      if (entities.period) {
        sql = sql.replace('{{period}}', entities.period);
      }
      if (entities.limit) {
        sql = sql.replace('{{limit}}', entities.limit.toString());
      }
      if (entities.region) {
        sql = sql.replace('{{region_filter}}', `AND region = '${entities.region}'`);
      } else {
        sql = sql.replace('{{region_filter}}', '');
      }
      
      // Clean up SQL
      sql = sql.trim().replace(/\s+/g, ' ');
      
      results.push({
        template,
        score,
        sql,
        entities,
        explanation: `Matched patterns: ${matchedPatterns.join(', ')}. Keywords found: ${keywordMatches.join(', ')}.`
      });
    }
  });
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  // Return top 3 results
  return results.slice(0, 3);
}

// Fallback query builder for unmatched queries
export function buildFallbackQuery(query: string, entities: ExtractedEntities): string {
  // Simple fallback - return general summary
  const period = entities.period || '30 days';
  
  return `
    -- Fallback query for: "${query}"
    SELECT 
      'Summary' as metric,
      COUNT(DISTINCT transaction_id) as transactions,
      SUM(revenue) as total_revenue,
      AVG(revenue) as avg_transaction,
      COUNT(DISTINCT customer_id) as unique_customers
    FROM transactions
    WHERE created_at >= CURRENT_DATE - INTERVAL '${period}'
    ${entities.region ? `AND region = '${entities.region}'` : ''}
  `;
}

// Query suggestion system
export function getSuggestions(partialQuery: string): string[] {
  const suggestions: string[] = [];
  const tokens = tokenize(partialQuery);
  
  queryTemplates.forEach(template => {
    template.examples.forEach(example => {
      const exampleTokens = tokenize(example);
      const matches = tokens.every(token => 
        exampleTokens.some(exToken => exToken.startsWith(token))
      );
      
      if (matches) {
        suggestions.push(example);
      }
    });
  });
  
  return Array.from(new Set(suggestions)).slice(0, 5);
}