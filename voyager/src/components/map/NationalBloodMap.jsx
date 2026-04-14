import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const INITIAL_VIEW_STATE = {
    longitude: 24.6849,
    latitude: -22.3285, // Botswana center
    zoom: 5.5,
    pitch: 30,
    bearing: 0
};

// Map style (dark mode Carto)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Fetchers
const fetchNodes = async () => {
    const res = await api.get('/admin/map-nodes');
    return res.data.data;
};

const fetchRoutes = async () => {
    const res = await api.get('/admin/transit-routes');
    return res.data.data;
};

export default function NationalBloodMap() {
    // 1. Fetch GeoJSON Data directly from Phase 2 endpoints
    const { data: nodesData } = useQuery({
        queryKey: ['map-nodes'],
        queryFn: fetchNodes,
        refetchInterval: 30000,
    });

    const { data: routesData } = useQuery({
        queryKey: ['transit-routes'],
        queryFn: fetchRoutes,
        refetchInterval: 15000,
    });

    // 2. Define Deck.GL Layers
    const layers = useMemo(() => {
        const result = [];

        // Route Layer (Active Ambulances / Transits)
        if (routesData) {
            result.push(
                new GeoJsonLayer({
                    id: 'transit-routes-layer',
                    data: routesData,
                    opacity: 0.8,
                    stroked: true,
                    filled: false,
                    lineWidthMinPixels: 3,
                    getLineColor: (f) => {
                        const status = f.properties.status;
                        // Pulsating Orange/Red for Compromised, Blue for Normal Transit
                        if (status === 'COMPROMISED_COLD_CHAIN') return [220, 38, 38, 255]; // Red
                        if (status === 'DELAYED') return [234, 179, 8, 255]; // Yellow
                        return [56, 189, 248, 255]; // Sky Blue
                    },
                    getLineWidth: 4,
                    pickable: true,
                })
            );
        }

        // Node Layer (Hospitals, Blood Banks, Mobile Drives)
        if (nodesData) {
            result.push(
                new GeoJsonLayer({
                    id: 'facility-nodes-layer',
                    data: nodesData,
                    pointType: 'circle+icon',
                    pickable: true,
                    getFillColor: (f) => {
                        const inv = f.properties.currentInventoryLevel;
                        // Red for critical, Yellow for warning, Green for healthy, Gray if unknown
                        if (inv === undefined) return [100, 116, 139, 200]; // Slate
                        if (inv < 20) return [220, 38, 38, 220]; // Critical Red
                        if (inv < 50) return [234, 179, 8, 220]; // Warning Yellow
                        return [16, 185, 129, 220]; // Healthy Green
                    },
                    getLineColor: [255, 255, 255, 255],
                    getLineWidth: 1,
                    lineWidthMinPixels: 1,
                    getRadius: (f) => {
                        const type = f.properties.type;
                        if (type === 'BLOOD_BANK') return 15000;
                        if (type === 'HOSPITAL') return 10000;
                        return 8000; // Mobile drive
                    },
                    radiusMinPixels: 4,
                    radiusMaxPixels: 20,
                })
            );
        }

        return result;
    }, [nodesData, routesData]);

    return (
        <div className="w-full h-full relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
            {/* Tooltip Overlay placeholder (DeckGL handles its own picking engine) */}
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                getTooltip={({ object }) => {
                    if (!object) return null;
                    if (object.geometry.type === 'Point') {
                        return {
                            html: `
                                <div style="padding: 4px">
                                    <div style="font-weight: bold; padding-bottom: 4px; border-bottom: 1px solid #333; margin-bottom: 4px;">
                                        ${object.properties.name}
                                    </div>
                                    <div style="font-size: 11px; color: #aaa;">
                                        Type: ${object.properties.type}<br/>
                                        Status: ${object.properties.status || 'Active'}<br/>
                                        ${object.properties.currentInventoryLevel !== undefined ? `Inventory: <span style="font-family: monospace; color: #fff">${object.properties.currentInventoryLevel} units</span>` : ''}
                                    </div>
                                </div>
                            `,
                            style: {
                                backgroundColor: '#111827',
                                color: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #334155',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                            }
                        };
                    } else if (object.geometry.type === 'LineString') {
                        return {
                            html: `
                                <div style="padding: 4px">
                                    <div style="font-weight: bold; padding-bottom: 4px; border-bottom: 1px solid #333; margin-bottom: 4px;">
                                        Transit: ${object.properties.dispatchId.slice(0, 8)}...
                                    </div>
                                    <div style="font-size: 11px; color: #aaa;">
                                        Courier: ${object.properties.courierName}<br/>
                                        Blood Type: <span style="color: #38bdf8; font-weight: bold">${object.properties.bloodType}</span><br/>
                                        Status: <span style="color: ${object.properties.status === 'COMPROMISED_COLD_CHAIN' ? '#ef4444' : '#10b981 '}">${object.properties.status}</span><br/>
                                        Route: ${object.properties.originFacility} → ${object.properties.destinationFacility}
                                    </div>
                                </div>
                            `,
                            style: {
                                backgroundColor: '#111827',
                                color: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #334155',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                            }
                        };
                    }
                    return null;
                }}
            >
                <Map
                    mapStyle={MAP_STYLE}
                    maplibregl={import('maplibre-gl')}
                    reuseMaps
                    preventStyleDiffing
                />
            </DeckGL>

            {/* Float Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 p-3 rounded-lg pointer-events-none">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Facility Inventory</h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> &gt; 50 Units</div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> &lt; 50 Units</div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-600"></div> Critical Shortage</div>
                </div>
            </div>
        </div>
    );
}
