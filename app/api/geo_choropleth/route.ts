import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/utils/supabase';

export async function OPTIONS() {
  return NextResponse.json({});
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get('level') || 'region';
  const metric = searchParams.get('metric') || 'revenue';

  try {
    // Call the RPC function instead of Edge Function
    const { data, error } = await supabase.rpc('geo_choropleth', {
      level,
      metric_type: metric
    });

    if (error) {
      throw error;
    }

    // If data is already in GeoJSON format, return it
    if (data && data.type === 'FeatureCollection') {
      return NextResponse.json(data);
    }

    // Otherwise, format as GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: (data || []).map((item: any) => ({
        type: 'Feature',
        properties: {
          name: item.region_name || item.province_name || item.city_name || 'Unknown',
          value: item[metric] || item.metric_value || 0,
          ...item
        },
        geometry: item.geometry || {
          type: 'Polygon',
          coordinates: generateMockCoordinates(item.region_name || item.name)
        }
      }))
    };

    return NextResponse.json(geoJson);
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
        },
        {
          type: 'Feature',
          properties: {
            name: 'Davao',
            value: 765432,
            revenue: 765432,
            market_share: 25.8,
            growth: 6.2
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[125.5, 7.0], [125.7, 7.0], [125.7, 7.2], [125.5, 7.2], [125.5, 7.0]]]
          }
        }
      ]
    };

    return NextResponse.json(mockGeoJson);
  }
}

// Helper to generate mock coordinates for regions without geometry
function generateMockCoordinates(regionName: string): number[][][] {
  const mockCoordinates: Record<string, number[][][]> = {
    'Metro Manila': [[[121.0, 14.5], [121.1, 14.5], [121.1, 14.6], [121.0, 14.6], [121.0, 14.5]]],
    'Cebu': [[[123.7, 10.2], [123.9, 10.2], [123.9, 10.4], [123.7, 10.4], [123.7, 10.2]]],
    'Davao': [[[125.5, 7.0], [125.7, 7.0], [125.7, 7.2], [125.5, 7.2], [125.5, 7.0]]],
    'Iloilo': [[[122.5, 10.7], [122.6, 10.7], [122.6, 10.8], [122.5, 10.8], [122.5, 10.7]]],
    'Baguio': [[[120.5, 16.4], [120.6, 16.4], [120.6, 16.5], [120.5, 16.5], [120.5, 16.4]]]
  };
  
  return mockCoordinates[regionName] || [[[120.0, 10.0], [120.1, 10.0], [120.1, 10.1], [120.0, 10.1], [120.0, 10.0]]];
}