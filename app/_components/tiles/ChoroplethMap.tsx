'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ChoroplethMapProps {
  data: any;
  metric: 'revenue' | 'market_share' | 'growth';
}

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({ data, metric = 'revenue' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedMetric, setSelectedMetric] = useState(metric);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [121.774, 12.8797], // Philippines center
      zoom: 5
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add source
      map.current.addSource('regions', {
        type: 'geojson',
        data: `/api/geo_choropleth?level=region&metric=${selectedMetric}`
      });

      // Add fill layer
      map.current.addLayer({
        id: 'regions-fill',
        type: 'fill',
        source: 'regions',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            0, '#dbeafe',
            50, '#93c5fd',
            100, '#60a5fa',
            500, '#3b82f6',
            1000, '#1e40af'
          ],
          'fill-opacity': 0.7
        }
      });

      // Add outline
      map.current.addLayer({
        id: 'regions-outline',
        type: 'line',
        source: 'regions',
        paint: {
          'line-color': '#1e40af',
          'line-width': 1
        }
      });

      // Add hover effect
      map.current.on('mouseenter', 'regions-fill', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'regions-fill', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });

      // Add popup
      map.current.on('click', 'regions-fill', (e) => {
        if (!map.current || !e.features || !e.features[0]) return;

        const properties = e.features[0].properties;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h4 class="font-bold">${properties?.name || 'Unknown'}</h4>
              <p class="text-sm">${selectedMetric}: ${properties?.value || 0}</p>
            </div>
          `)
          .addTo(map.current);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update data when metric changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource('regions') as mapboxgl.GeoJSONSource;
    if (source) {
      fetch(`/api/geo_choropleth?level=region&metric=${selectedMetric}`)
        .then(res => res.json())
        .then(data => {
          source.setData(data);
        })
        .catch(console.error);
    }
  }, [selectedMetric]);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded">
        <div className="text-center">
          <p className="text-gray-500">No geographic data for the selected metric.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-2 right-2 z-10 bg-white rounded shadow-sm p-1">
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as any)}
          className="text-xs px-2 py-1 border rounded"
        >
          <option value="revenue">Revenue</option>
          <option value="market_share">Market Share</option>
          <option value="growth">Growth</option>
        </select>
      </div>
      <div ref={mapContainer} className="h-full rounded" />
    </div>
  );
};

export default ChoroplethMap;