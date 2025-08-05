'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, Info, Activity } from 'lucide-react';
import useSWR from 'swr';

// Types
interface ChoroplethData {
  gid: string;
  name: string;
  metric_value: number;
  metric_type: string;
  color_hex: string;
  geom: any;
  level: string;
}

interface MapOptions {
  metric: 'revenue' | 'transactions' | 'growth' | 'density';
  style: 'light' | 'dark' | 'satellite';
}

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Map configuration
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoiamd0b2xlbnRpbm8iLCJhIjoiY21jMmNycWRiMDc0ajJqcHZoaDYyeTJ1NiJ9.Dns6WOql16BUQ4l7otaeww';
const PHILIPPINES_BOUNDS = [[116.9, 4.5], [126.6, 21.1]];
const PHILIPPINES_CENTER = [121.774, 12.8797];

// Zoom thresholds for layer switching
const ZOOM_THRESHOLDS = {
  REGION: 5,
  PROVINCE: 7,
  CITY: 9,
  BARANGAY: 11
};

export default function PhilippinesChoropleth() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(5.5);
  const [currentLevel, setCurrentLevel] = useState<'region' | 'province' | 'city' | 'barangay'>('region');
  const [hoveredFeature, setHoveredFeature] = useState<ChoroplethData | null>(null);
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    metric: 'revenue',
    style: 'light'
  });

  // Determine data level based on zoom
  const getDataLevel = useCallback((zoom: number) => {
    if (zoom >= ZOOM_THRESHOLDS.BARANGAY) return 'barangay';
    if (zoom >= ZOOM_THRESHOLDS.CITY) return 'city';
    if (zoom >= ZOOM_THRESHOLDS.PROVINCE) return 'province';
    return 'region';
  }, []);

  // Fetch choropleth data based on zoom level using Edge Function
  const { data: choroplethData, error } = useSWR<ChoroplethData[]>(
    mapLoaded ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/geo_choropleth?level=${currentLevel}&metric_type=${mapOptions.metric}` : null,
    (url: string) => fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      }
    }).then(res => res.json()),
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false
    }
  );

  // Transform Supabase data to GeoJSON
  const transformToGeoJSON = useCallback((data: ChoroplethData[]) => {
    return {
      type: 'FeatureCollection',
      features: data
        .filter(item => item.geom) // Only include items with geometry
        .map(item => ({
          type: 'Feature',
          id: item.gid,
          properties: {
            name: item.name,
            metric_value: item.metric_value,
            metric_type: item.metric_type,
            color_hex: item.color_hex,
            level: item.level
          },
          geometry: item.geom
        }))
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initializeMap = async () => {
      const mapboxgl = await import('mapbox-gl');
      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      // Add CSS
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Create map
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: `mapbox://styles/mapbox/${mapOptions.style}-v11`,
        center: PHILIPPINES_CENTER as [number, number],
        zoom: 5.5,
        bounds: PHILIPPINES_BOUNDS as [[number, number], [number, number]],
        fitBoundsOptions: { padding: 20 }
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Map load handler
      map.current.on('load', () => {
        setMapLoaded(true);

        // Add choropleth source (initially empty)
        map.current.addSource('choropleth', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
          promoteId: 'gid'
        });

        // Add fill layer
        map.current.addLayer({
          id: 'choropleth-fill',
          type: 'fill',
          source: 'choropleth',
          paint: {
            'fill-color': ['get', 'color_hex'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.95,
              0.75
            ]
          }
        });

        // Add outline layer
        map.current.addLayer({
          id: 'choropleth-outline',
          type: 'line',
          source: 'choropleth',
          paint: {
            'line-color': '#ffffff',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              3,
              1
            ]
          }
        });

        // Add label layer
        map.current.addLayer({
          id: 'choropleth-labels',
          type: 'symbol',
          source: 'choropleth',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 10,
              10, 14
            ],
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular']
          },
          paint: {
            'text-color': '#333333',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
          }
        });
      });

      // Zoom change handler
      map.current.on('zoom', () => {
        const zoom = map.current.getZoom();
        setCurrentZoom(zoom);
        
        const newLevel = getDataLevel(zoom);
        if (newLevel !== currentLevel) {
          setCurrentLevel(newLevel);
        }
      });

      // Hover handlers
      let hoveredStateId: string | null = null;

      map.current.on('mousemove', 'choropleth-fill', (e: any) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              { source: 'choropleth', id: hoveredStateId },
              { hover: false }
            );
          }
          
          hoveredStateId = e.features[0].id;
          map.current.setFeatureState(
            { source: 'choropleth', id: hoveredStateId },
            { hover: true }
          );

          setHoveredFeature({
            gid: e.features[0].id,
            name: e.features[0].properties.name,
            metric_value: e.features[0].properties.metric_value,
            metric_type: e.features[0].properties.metric_type,
            color_hex: e.features[0].properties.color_hex,
            level: e.features[0].properties.level,
            geom: null
          });
        }
      });

      map.current.on('mouseleave', 'choropleth-fill', () => {
        if (hoveredStateId !== null) {
          map.current.setFeatureState(
            { source: 'choropleth', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
        setHoveredFeature(null);
      });

      // Click handler for drill-down
      map.current.on('click', 'choropleth-fill', (e: any) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const bounds = getBoundsFromGeometry(feature.geometry);
          
          if (bounds) {
            map.current.fitBounds(bounds, {
              padding: 50,
              duration: 1000
            });
          }
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'choropleth-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'choropleth-fill', () => {
        map.current.getCanvas().style.cursor = '';
      });
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update data when choroplethData changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !choroplethData) return;

    const geojson = transformToGeoJSON(choroplethData);
    const source = map.current.getSource('choropleth');
    
    if (source) {
      source.setData(geojson);
    }
  }, [choroplethData, mapLoaded, transformToGeoJSON]);

  // Update map style
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    map.current.setStyle(`mapbox://styles/mapbox/${mapOptions.style}-v11`);
  }, [mapOptions.style, mapLoaded]);

  // Helper function to get bounds from geometry
  const getBoundsFromGeometry = (geometry: any) => {
    if (!geometry || !geometry.coordinates) return null;

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

    const processCoordinates = (coords: any) => {
      if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
        // Array of coordinate pairs
        coords.forEach(([lng, lat]: [number, number]) => {
          minLng = Math.min(minLng, lng);
          minLat = Math.min(minLat, lat);
          maxLng = Math.max(maxLng, lng);
          maxLat = Math.max(maxLat, lat);
        });
      } else {
        // Nested arrays
        coords.forEach((subCoords: any) => processCoordinates(subCoords));
      }
    };

    processCoordinates(geometry.coordinates);
    
    return [[minLng, minLat], [maxLng, maxLat]];
  };

  // Format metric value
  const formatMetricValue = (value: number, type: string) => {
    switch (type) {
      case 'revenue':
        return `₱${(value / 1000000).toFixed(1)}M`;
      case 'transactions':
        return value.toLocaleString();
      case 'growth':
        return `${value.toFixed(1)}%`;
      case 'density':
        return `₱${value.toFixed(1)}`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="text-lg font-bold mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-yellow-600" />
          Philippines Regional Analytics
        </h3>

        {/* Metric Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Metric</label>
          <select
            value={mapOptions.metric}
            onChange={(e) => setMapOptions(prev => ({ ...prev, metric: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="revenue">Revenue</option>
            <option value="transactions">Transactions</option>
            <option value="growth">Growth Rate</option>
            <option value="density">Spend per Capita</option>
          </select>
        </div>

        {/* Style Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Map Style</label>
          <select
            value={mapOptions.style}
            onChange={(e) => setMapOptions(prev => ({ ...prev, style: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="satellite">Satellite</option>
          </select>
        </div>

        {/* Current Level Indicator */}
        <div className="flex items-center text-sm text-gray-600">
          <Layers className="w-4 h-4 mr-2" />
          <span>Level: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Activity className="w-4 h-4 mr-2" />
          <span>Zoom: {currentZoom.toFixed(1)}</span>
        </div>
      </div>

      {/* Hover Info Box */}
      {hoveredFeature && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-bold text-lg mb-2">{hoveredFeature.name}</h4>
          <div className="text-sm text-gray-600">
            <p>Level: {hoveredFeature.level}</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatMetricValue(hoveredFeature.metric_value, hoveredFeature.metric_type)}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {mapOptions.metric.charAt(0).toUpperCase() + mapOptions.metric.slice(1)} Scale
        </h4>
        <div className="space-y-1">
          {['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'].map((color, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-6 h-4 mr-2" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-600">
                {idx === 0 ? 'Low' : idx === 6 ? 'High' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Loading/Error States */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          <Info className="w-4 h-4 inline mr-2" />
          Error loading data
        </div>
      )}
    </div>
  );
}