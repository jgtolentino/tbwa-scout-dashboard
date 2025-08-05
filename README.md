# TBWA Scout Dashboard

AI-powered retail intelligence dashboard for TBWA client portfolio featuring **Ask SUQI** - the evolution of WrenAI branded specifically for TBWA's Scout Universal Query Intelligence.

## Features

- 📊 Executive Intelligence Dashboard
- 🔍 Performance Analytics
- 🏆 Brand Competitive Intelligence
- 🗺️ Geographic Intelligence Matrix with **Philippines Choropleth Map**
  - Progressive zoom-aware visualization (Region → Province → City → Barangay)
  - Real-time PostGIS data integration
  - Interactive hover and drill-down capabilities
- 🤖 **Ask SUQI** - Natural Language Query Interface (WrenAI Evolution):
  - **Semantic Search** (No LLM required) - Pattern matching & RAG
  - **SUQI Mode** - WrenAI's advanced Text-to-SQL branded for TBWA
  - **Hybrid Intelligence** - Automatic fallback between modes
  - **Voice Input** - Speak your questions naturally
- 💬 Text-to-SQL conversion for real database queries
- 🧠 Works offline with semantic search (no internet/API needed)
- 📱 Fully Responsive Design
- 🎨 TBWA Brand Colors & Design System

## Quick Start

### Basic Setup (Mock Data)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

The dashboard works with mock data out of the box!

### Advanced Setup with SUQI (WrenAI-Powered Real Database Queries)

1. **Set up Wren AI** (15 minutes):
   ```bash
   # Run the automated setup script
   ./scripts/setup-wren.sh
   ```

   Or manually:
   ```bash
   # Start Wren AI services
   docker-compose -f docker-compose.wren.yml up -d
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local`:
   ```env
   # Supabase/Postgres Connection
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Wren AI Configuration
   WREN_URL=http://localhost:4000
   WREN_API_KEY=your-wren-api-key
   WREN_DATABASE=scout_dash

   # OpenAI API Key (for Wren AI)
   OPENAI_API_KEY=sk-your-openai-key
   ```

3. **Configure Wren AI**:
   - Open Wren UI: http://localhost:3001
   - Connect your Postgres/Supabase database
   - Let Wren index your schema

4. **Start the dashboard**:
   ```bash
   npm run dev
   ```

5. **Test natural language queries**:
   - "What were total sales in NCR last month?"
   - "Show me top performing stores by revenue"
   - "Compare brand performance across regions"

## Semantic Search (No LLM Required)

The dashboard includes a powerful semantic search engine that works without any LLM or internet connection:

### How It Works

1. **Pattern Matching**: Pre-defined query templates for common business questions
2. **Keyword Extraction**: Identifies important terms like regions, time periods, metrics
3. **RAG System**: Retrieves relevant context to enhance query understanding
4. **SQL Generation**: Converts natural language to SQL without AI inference

### Supported Query Types

- **Revenue Queries**: "What is total revenue?", "Show sales last month"
- **Regional Analysis**: "Revenue by region", "Top performing locations"
- **Brand Comparison**: "Compare TBWA vs competitors", "Brand market share"
- **Store Performance**: "Top 10 stores", "Best performing outlets"
- **Time Trends**: "Monthly revenue trend", "Growth over time"
- **Customer Segments**: "Customer behavior analysis", "Segment performance"

### Example Queries (Work Offline)

```
"Show me total revenue"
→ SELECT SUM(revenue) as total_revenue FROM transactions...

"Top stores in Metro Manila"
→ SELECT store_name, SUM(revenue) FROM transactions WHERE region = 'Metro Manila'...

"Monthly sales trend"
→ SELECT DATE_TRUNC('month', created_at), SUM(revenue) FROM transactions...
```

### Confidence Scoring

Each query is assigned a confidence score (0-1):
- **0.8-1.0**: High confidence, direct pattern match
- **0.5-0.8**: Medium confidence, RAG-enhanced match
- **0.3-0.5**: Low confidence, fallback query used

## Deployment

This project is configured for Vercel deployment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Ftbwa-scout-dashboard)

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- Supabase (optional - works with mock data if not configured)

## License

Private - TBWA Enterprise