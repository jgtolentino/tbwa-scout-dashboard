# TBWA Scout Dashboard - UI/UX Specification & API Requirements

## Executive Summary

The TBWA Scout Dashboard is a unified business intelligence platform combining executive analytics with sari-sari store operations insights. This specification details all UI components, interactions, states, and backend API requirements.

---

## 1. Application Structure

### 1.1 Navigation Architecture

```yaml
App:
  - Header (Persistent)
    - Logo
    - Navigation Tabs
    - Ask Intelligence Bar
  - Main Content Area
    - Tab Content
  - Footer (Persistent)
```

### 1.2 Primary Screens

1. **Executive Overview** (Default)
2. **Performance Analytics**
3. **Geographic Intelligence**
4. **Consumer Insights**
5. **Competitive Intelligence**

---

## 2. Component Specifications

### 2.1 Global Header Component

**Component ID:** `GlobalHeader`

#### Visual Specifications
```yaml
Height: 80px
Background: White
Border: 1px solid #e5e7eb (bottom)
Padding: 16px 24px
```

#### Sub-components

##### 2.1.1 Logo Section
```yaml
Component ID: LogoSection
Position: Left
Content:
  - Logo Image: 40x40px
  - Text: "Scout Dashboard"
  - Font: Inter 20px bold
  - Color: #111827
```

##### 2.1.2 Navigation Tabs
```yaml
Component ID: NavigationTabs
Position: Center
Tabs:
  - Executive Overview
  - Performance Analytics
  - Geographic Intelligence
  - Consumer Insights
  - Competitive Intelligence
  
States:
  - Default: Text #6b7280, Background transparent
  - Hover: Text #3b82f6, Background #eff6ff
  - Active: Text #2563eb, Background #dbeafe, Border-bottom 2px #2563eb
  - Loading: Opacity 0.5, Cursor not-allowed
```

**API Requirements:**
```yaml
Endpoint: None (Client-side navigation)
```

##### 2.1.3 Ask Intelligence Bar
```yaml
Component ID: AskIntelligenceBar
Position: Right (spans 40% width)
Structure:
  - Input Field:
    - Placeholder: "Ask anything about your business intelligence or sari-sari operations..."
    - Height: 40px
    - Border: 1px solid #d1d5db
    - Border-radius: 8px
    - Padding: 0 16px
  - Submit Button:
    - Text: "Ask"
    - Icon: Search (16x16)
    - Background: #3b82f6
    - Color: White
    - Padding: 0 20px
    - Border-radius: 8px
    
States:
  - Input Focus: Border #3b82f6, Box-shadow 0 0 0 3px rgba(59, 130, 246, 0.1)
  - Button Hover: Background #2563eb
  - Loading: Show spinner, Text "Searching..."
  - Disabled: Opacity 0.5
```

**API Requirements:**
```yaml
Endpoint: POST /api/wren-query
Method: POST
Headers:
  Content-Type: application/json
Request:
  {
    "question": "string",
    "context": "unified"
  }
Response:
  {
    "result": "string",
    "sql": "string (optional)",
    "confidence": "number",
    "data": "array (optional)"
  }
```

---

## 3. Screen Specifications

### 3.1 Executive Overview Screen

**Screen ID:** `ExecutiveOverview`

#### Layout Grid
```yaml
Type: CSS Grid
Columns: 12
Gap: 24px
Padding: 24px
```

#### Components Layout

##### 3.1.1 KPI Cards Row
```yaml
Component ID: KPICardsRow
Grid: Spans 12 columns
Children: 4 equal-width cards
Height: 120px per card
```

**KPI Card Structure:**
```yaml
Component ID: KPICard
Structure:
  - Icon: 32x32px (top-left)
  - Title: 14px text-gray-600
  - Value: 32px font-bold text-gray-900
  - Trend: 14px with arrow icon
    - Positive: Green (#10b981)
    - Negative: Red (#ef4444)
  - Sparkline: 60x30px (optional)
  
Data Fields:
  - Total Revenue
  - Active Customers
  - Average Order Value
  - Market Share
```

**API Requirements:**
```yaml
Endpoint: GET /api/kpi-metrics
Method: GET
Response:
  {
    "metrics": [
      {
        "id": "total_revenue",
        "title": "Total Revenue",
        "value": 1234567,
        "formatted_value": "₱1.23M",
        "trend": 12.5,
        "trend_direction": "up",
        "sparkline_data": [100, 110, 105, 120, 115, 125]
      }
    ]
  }
```

##### 3.1.2 Persona Mix Chart
```yaml
Component ID: PersonaMixChart
Grid: Columns 1-4
Height: 400px
Type: Donut Chart
```

**Chart Specifications:**
```yaml
Title: "Customer Persona Mix"
Chart Type: Donut
Colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
Legend: Right side
Data Labels: Show percentage
Hover: Show tooltip with count
```

**API Requirements:**
```yaml
Endpoint: GET /api/persona-metrics
Method: GET
Response:
  {
    "personas": [
      {
        "persona_type": "Price Sensitive",
        "percentage": 35,
        "count": 3500,
        "color": "#3b82f6"
      }
    ]
  }
```

##### 3.1.3 Regional Performance Map
```yaml
Component ID: RegionalPerformanceMap
Grid: Columns 5-12
Height: 400px
Type: Choropleth Map
```

**Map Specifications:**
```yaml
Base Map: Mapbox Light
Initial View: Philippines center
Zoom: 5
Regions: Color-coded by metric
Legend: Bottom-right
Controls: Zoom, Metric selector
```

**Interaction States:**
```yaml
Hover:
  - Highlight region border
  - Show tooltip with details
Click:
  - Zoom to region
  - Update side panel
Select Metric:
  - Revenue (default)
  - Transactions
  - Market Share
```

**API Requirements:**
```yaml
Endpoint: GET /api/geo-performance
Method: GET
Query Params:
  - metric: revenue|transactions|market_share
  - level: region|province|city
Response:
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "name": "Metro Manila",
          "value": 1234567,
          "formatted_value": "₱1.23M",
          "market_share": 32.1,
          "growth": 12.5
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [...]
        }
      }
    ]
  }
```

##### 3.1.4 Campaign Effectiveness Table
```yaml
Component ID: CampaignEffectivenessTable
Grid: Columns 1-6
Height: 300px
Type: Data Table
```

**Table Specifications:**
```yaml
Columns:
  - Campaign Name (sortable)
  - Brand
  - ROI % (sortable)
  - Revenue Impact (sortable)
  - Status (badge)
  
Row States:
  - Default: White background
  - Hover: Gray-50 background
  - Selected: Blue-50 background
  
Pagination: 5 rows per page
```

**API Requirements:**
```yaml
Endpoint: GET /api/campaign-effectiveness
Method: GET
Query Params:
  - page: 1
  - limit: 5
  - sort: roi_desc
Response:
  {
    "campaigns": [
      {
        "id": "uuid",
        "campaign_name": "Summer Sale 2024",
        "brand_name": "Brand A",
        "roi_percentage": 320,
        "revenue_impact": 450000,
        "status": "active",
        "effectiveness_score": "high"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 10
    }
  }
```

##### 3.1.5 Product Performance Grid
```yaml
Component ID: ProductPerformanceGrid
Grid: Columns 7-12
Height: 300px
Type: Category Cards
```

**Card Specifications:**
```yaml
Layout: 2x3 grid
Card Content:
  - Category Icon
  - Category Name
  - Sales Percentage
  - Mini Bar Chart
  
Colors: Gradient based on performance
Interaction: Click to drill down
```

**API Requirements:**
```yaml
Endpoint: GET /api/product-metrics
Method: GET
Response:
  {
    "categories": [
      {
        "category_name": "Beverages",
        "percentage": 28,
        "sales_amount": 280000,
        "trend": "up",
        "top_products": ["Coffee", "Soft Drinks", "Water"]
      }
    ]
  }
```

---

## 4. Interaction States & Validation

### 4.1 Loading States

```yaml
Initial Load:
  - Show skeleton screens for each component
  - Progressive loading (KPIs first, then charts)
  - Loading time threshold: 3 seconds

Data Refresh:
  - Subtle spinner in component corner
  - Maintain previous data during refresh
  - Error fallback after 10 seconds
```

### 4.2 Error States

```yaml
Network Error:
  - Icon: Warning triangle
  - Message: "Unable to load data"
  - Action: "Retry" button
  - Fallback: Show cached data if available

No Data:
  - Icon: Empty state illustration
  - Message: "No data available for selected period"
  - Action: "Change filters" button

Partial Failure:
  - Load successful components
  - Show error state for failed components
  - Log errors to monitoring
```

### 4.3 Empty States

```yaml
First Time User:
  - Welcome message
  - Sample data option
  - Quick tour overlay

No Results:
  - Friendly message
  - Suggestion chips
  - Alternative queries
```

---

## 5. Responsive Design

### 5.1 Breakpoints

```yaml
Desktop: 1280px+ (12 columns)
Tablet: 768px-1279px (8 columns)
Mobile: <768px (4 columns)
```

### 5.2 Component Adaptations

```yaml
Desktop:
  - Full layout as specified
  - Side-by-side components
  - Hover interactions

Tablet:
  - Stack maps below charts
  - Collapse table columns
  - Touch-optimized controls

Mobile:
  - Single column layout
  - Swipeable cards
  - Bottom sheet for filters
  - Simplified charts
```

---

## 6. Performance Requirements

### 6.1 Loading Performance

```yaml
Target Metrics:
  - First Contentful Paint: <1.5s
  - Time to Interactive: <3s
  - Largest Contentful Paint: <2.5s
  
Optimization:
  - Lazy load below-fold components
  - Progressive chart rendering
  - Cache API responses (5 min)
  - Debounce search input (300ms)
```

### 6.2 Data Freshness

```yaml
Real-time Data:
  - KPI metrics: 1-minute cache
  - Campaign data: 5-minute cache
  
Daily Data:
  - Persona analytics: 24-hour cache
  - Geographic data: 24-hour cache
  
Auto-refresh:
  - Dashboard: Every 5 minutes
  - User-triggered refresh available
```

---

## 7. Accessibility Requirements

```yaml
WCAG 2.1 AA Compliance:
  - Color contrast: 4.5:1 minimum
  - Keyboard navigation: All interactive elements
  - Screen reader: ARIA labels and landmarks
  - Focus indicators: Visible and high contrast
  
Specific Requirements:
  - Charts: Data tables as alternative
  - Maps: List view option
  - Animations: Respect prefers-reduced-motion
  - Forms: Clear error messages and labels
```

---

## 8. Backend API Summary

### 8.1 Core Endpoints

| Endpoint | Method | Purpose | Cache |
|----------|---------|---------|--------|
| `/api/kpi-metrics` | GET | Dashboard KPIs | 1 min |
| `/api/persona-metrics` | GET | Customer personas | 24 hrs |
| `/api/geo-performance` | GET | Geographic data | 24 hrs |
| `/api/campaign-effectiveness` | GET | Campaign ROI | 5 min |
| `/api/product-metrics` | GET | Product performance | 1 hr |
| `/api/wren-query` | POST | Natural language query | No cache |

### 8.2 Authentication

```yaml
Method: JWT Bearer Token
Header: Authorization: Bearer <token>
Expiry: 24 hours
Refresh: Auto-refresh before expiry
```

### 8.3 Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {},
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

## 9. Future Enhancements

1. **Real-time Updates**: WebSocket for live data
2. **Customizable Dashboard**: Drag-and-drop widgets
3. **Advanced Filtering**: Date ranges, segments
4. **Export Functionality**: PDF/Excel reports
5. **Mobile App**: Native iOS/Android apps
6. **AI Insights**: Automated anomaly detection

---

This specification serves as the single source of truth for frontend implementation and backend API development. All components should be built following these specifications to ensure consistency and maintainability.