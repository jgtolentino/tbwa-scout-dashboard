import { NextRequest, NextResponse } from 'next/server';
import { getEdgeFunctionUrl, getApiHeaders, EDGE_FUNCTIONS } from '@/lib/config/edge-functions';

// CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get('level') || 'region';
  const metric = searchParams.get('metric') || 'revenue';

  try {
    // Call the geo_choropleth edge function
    const functionUrl = getEdgeFunctionUrl(EDGE_FUNCTIONS.GEO_CHOROPLETH);
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        level,
        metric,
        include_geometry: true
      })
    });

    if (!response.ok) {
      throw new Error(`Edge function returned ${response.status}`);
    }

    const data = await response.json();

    // If data is already in GeoJSON format, return it
    if (data.type === 'FeatureCollection') {
      return NextResponse.json(data);
    }

    // Otherwise, format as GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((item: any) => ({
        type: 'Feature',
        properties: {
          name: item.region_name || item.province_name || item.city_name || 'Unknown',
          value: item[metric] || 0,
          ...item
        },
        geometry: item.geometry || null
      }))
    };

    return NextResponse.json(geoJson, { headers: corsHeaders });
  } catch (error) {
    console.error('Geo choropleth error:', error);
    
    // Return mock data for development
    const mockGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Metro Manila',
            value: 1234567,
            revenue: 1234567,
            market_share: 32.1,
            growth: 12.5
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[121.0, 14.5], [121.1, 14.5], [121.1, 14.6], [121.0, 14.6], [121.0, 14.5]]]
          }
        },
        {
          type: 'Feature',
          properties: {
            name: 'Cebu',
            value: 987654,
            revenue: 987654,
            market_share: 28.5,
            growth: 8.3
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[123.7, 10.2], [123.9, 10.2], [123.9, 10.4], [123.7, 10.4], [123.7, 10.2]]]
          }
        }
      ]
    };

    return NextResponse.json(mockGeoJson, { headers: corsHeaders });
  }
}