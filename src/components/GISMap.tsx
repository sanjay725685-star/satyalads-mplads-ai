import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Satellite, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Constituency, WorkItem } from '../types';

interface GISMapProps {
  constituency: Constituency;
  works: WorkItem[];
  selectedWork: WorkItem | null;
  onSelectWork: (work: WorkItem) => void;
  onNavigateTab: (tab: string) => void;
  onSwitchToGoogle?: () => void;
}

export const GISMap: React.FC<GISMapProps> = ({
  constituency,
  works,
  selectedWork,
  onSelectWork,
  onNavigateTab,
  onSwitchToGoogle
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const buffersLayerRef = useRef<L.LayerGroup | null>(null);

  const [showCollisionBuffers, setShowCollisionBuffers] = useState(true);
  const [showScStZones, setShowScStZones] = useState(true);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Safely remove existing instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Map removal warning:', e);
      }
      mapInstanceRef.current = null;
    }

    // 2. CRUCIAL: Clear any lingering Leaflet ID on the DOM container to prevent "Map container is already initialized" crash
    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    try {
      const centerLat = constituency.centerLat || 25.3176;
      const centerLng = constituency.centerLng || 82.9739;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      // Dark CartoDB Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      buffersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size after rendering to adjust container height/width
      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (e) {}
      }, 250);

    } catch (err: any) {
      console.error('Leaflet Map Init Error:', err);
      setMapError(err?.message || 'Failed to initialize GIS Map');
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, [constituency.id]);

  // Update Markers & Layers when works or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !buffersLayerRef.current) return;

    try {
      markersLayerRef.current.clearLayers();
      buffersLayerRef.current.clearLayers();

      const filtered = works.filter((w) => {
        if (filterRisk === 'ALL') return true;
        return w.riskLevel === filterRisk;
      });

      filtered.forEach((work) => {
        if (typeof work.lat !== 'number' || typeof work.lng !== 'number') return;

        const isCritical = work.riskLevel === 'CRITICAL';
        const isHigh = work.riskLevel === 'HIGH';

        const color = isCritical ? '#EF4444' : isHigh ? '#F97316' : '#10B981';

        // Custom HTML Marker Pin
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              background: ${color};
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #000;
              font-weight: 800;
              font-size: 11px;
              font-family: monospace;
              border: 2px solid #ffffff;
              box-shadow: 0 0 14px ${color};
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              ${work.wiriScore}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([work.lat, work.lng], { icon: customIcon });

        marker.on('click', () => {
          onSelectWork(work);
        });

        marker.bindPopup(`
          <div style="padding: 6px; font-family: sans-serif;">
            <div style="font-size: 10px; color: #38BDF8; font-family: monospace; font-weight: bold;">${work.code}</div>
            <div style="font-size: 13px; font-weight: bold; color: #fff; margin: 4px 0;">${work.title}</div>
            <div style="font-size: 11px; color: #94A3B8;">Budget: <strong>₹${work.sanctionedAmountLakhs} L</strong> | WIRI: <strong style="color:${color}">${work.wiriScore}</strong></div>
            <div style="font-size: 10px; color: #CBD5E1; margin-top: 4px;">IA: ${work.implementingAgency}</div>
          </div>
        `);

        markersLayerRef.current?.addLayer(marker);

        // Add 50m spatial collision buffer circle for double-dipping alert works
        if (showCollisionBuffers && (isCritical || isHigh)) {
          const circle = L.circle([work.lat, work.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.15,
            radius: 120, // visual buffer
            weight: 1.5,
            dashArray: '4, 6'
          });
          buffersLayerRef.current?.addLayer(circle);
        }

        // Add SC/ST Mandated Zone indicator
        if (showScStZones && work.demographicZone !== 'GENERAL') {
          const zoneCircle = L.circle([work.lat, work.lng], {
            color: '#38BDF8',
            fillColor: '#38BDF8',
            fillOpacity: 0.08,
            radius: 200,
            weight: 1
          });
          buffersLayerRef.current?.addLayer(zoneCircle);
        }

        // Plot Photo EXIF location mismatch with dashed connecting line (Module 5 Headline Feature)
        const photoLat = (work as any).photo_exif_lat;
        const photoLng = (work as any).photo_exif_lng;
        if (photoLat && photoLng && (isCritical || isHigh)) {
          const dLat = photoLat - work.lat;
          const dLng = photoLng - work.lng;
          const approxDistM = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 111000);

          if (approxDistM > 500) {
            // Photo Location Marker (Red Camera Pin)
            const photoIcon = L.divIcon({
              className: 'custom-photo-marker',
              html: `
                <div style="
                  background: #ef4444;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  font-size: 10px;
                  border: 2px solid #ffffff;
                  box-shadow: 0 0 12px #ef4444;
                  cursor: pointer;
                  transform: translate(-50%, -50%);
                ">
                  📷
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            const photoMarker = L.marker([photoLat, photoLng], { icon: photoIcon });
            photoMarker.bindPopup(`
              <div style="padding: 6px; font-family: sans-serif; font-size: 11px;">
                <div style="font-weight: bold; color: #ef4444;">⚠️ Photo EXIF Location Mismatch</div>
                <div style="color: #fff; margin: 3px 0;">Photo taken ${approxDistM}m away from claimed site!</div>
                <div style="color: #94a3b8; font-family: monospace;">GPS: ${photoLat.toFixed(4)}°N, ${photoLng.toFixed(4)}°E</div>
              </div>
            `);
            markersLayerRef.current?.addLayer(photoMarker);

            // Red Dashed Line connecting Claimed Site and Photo Location
            const dashedLine = L.polyline([[work.lat, work.lng], [photoLat, photoLng]], {
              color: '#ef4444',
              weight: 2.5,
              dashArray: '6, 8',
              opacity: 0.85
            });
            dashedLine.bindPopup(`
              <div style="font-size: 11px; font-family: sans-serif; color: #ef4444; font-weight: bold;">
                ⚠️ Geotag Discrepancy: ${approxDistM} meters
              </div>
            `);
            buffersLayerRef.current?.addLayer(dashedLine);
          }
        }
      });

      // Pan to selected work safely if valid
      if (selectedWork && typeof selectedWork.lat === 'number' && typeof selectedWork.lng === 'number') {
        mapInstanceRef.current.setView([selectedWork.lat, selectedWork.lng], 14, { animate: true });
      }
    } catch (e) {
      console.error('Error updating map markers:', e);
    }
  }, [works, filterRisk, showCollisionBuffers, showScStZones, selectedWork]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Top Map Toolbar */}
      <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-sm border-t-4 border-[#003366] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FF9933]/15 text-[#B85D00] border border-[#FF9933]/30 uppercase font-mono tracking-wider">
              Geographic Information System • Survey of India Datum
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#002244] font-serif flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#003366]" />
            <span>Geospatial Intelligence & Spatial Collision Radar</span>
          </h2>
          <p className="text-xs text-slate-600">
            Live geo-referenced MPLADS assets with 50m spatial collision buffers and SC/ST demographic bounds
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Risk Filter */}
          <div className="flex items-center space-x-1 bg-[#F8FAFC] p-1 rounded border border-slate-300">
            <span className="text-[10px] text-slate-500 px-2 uppercase font-mono font-bold">Filter Risk:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-2.5 py-1 rounded font-bold font-mono transition-all cursor-pointer ${
                  filterRisk === lvl
                    ? 'bg-[#003366] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Layer Toggles */}
          <button
            onClick={() => setShowCollisionBuffers(!showCollisionBuffers)}
            className={`px-3 py-1.5 rounded border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              showCollisionBuffers
                ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Collision Buffers (50m)</span>
          </button>

          <button
            onClick={() => setShowScStZones(!showScStZones)}
            className={`px-3 py-1.5 rounded border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              showScStZones
                ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>SC/ST Mandated Zones</span>
          </button>

          {onSwitchToGoogle && (
            <button
              onClick={onSwitchToGoogle}
              className="px-3 py-1.5 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-[#0B3D91] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Satellite className="w-3.5 h-3.5 text-[#0B3D91]" />
              <span>Google Maps Engine</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas */}
        <div className="lg:col-span-2 bg-slate-100 border border-slate-300 rounded-lg overflow-hidden shadow-sm relative h-[580px]">
          {mapError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-rose-700 space-y-2">
              <AlertTriangle className="w-10 h-10 text-rose-600" />
              <p className="text-sm font-bold">{mapError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 bg-[#003366] text-white text-xs font-bold rounded cursor-pointer"
              >
                Reload Map
              </button>
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full z-0" />
          )}
          
          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-slate-300 p-3 rounded shadow-md z-[400] text-xs space-y-2">
            <span className="font-bold text-slate-800 text-[10px] uppercase font-mono block border-b border-slate-200 pb-1">Map Layer Legend</span>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white shadow-xs"></span>
              <span className="text-slate-700 text-[11px] font-medium">WIRI 75-100 (Critical Ghost/Fraud)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-xs"></span>
              <span className="text-slate-700 text-[11px] font-medium">WIRI 50-74 (High Anomaly)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
              <span className="text-slate-700 text-[11px] font-medium">WIRI 0-49 (Compliant / Normal)</span>
            </div>
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-200">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-rose-500 bg-rose-100"></span>
              <span className="text-slate-700 text-[11px] font-medium">50m Duplicate Collision Radius</span>
            </div>
          </div>
        </div>

        {/* Selected Project Inspector Card */}
        <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm border-t-4 border-[#003366] flex flex-col justify-between h-[580px] overflow-y-auto">
          {selectedWork ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono text-xs text-[#003366] font-bold block">{selectedWork.code}</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{selectedWork.title}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs border ${
                  selectedWork.riskLevel === 'CRITICAL' 
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : selectedWork.riskLevel === 'HIGH'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  WIRI: {selectedWork.wiriScore}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-medium">
                  {selectedWork.category}
                </span>
                <span className={`px-2 py-0.5 rounded border font-medium ${
                  selectedWork.demographicZone === 'SC_MANDATED' 
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : selectedWork.demographicZone === 'ST_MANDATED'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {selectedWork.demographicZone}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#003366] border border-blue-200 font-mono font-bold">
                  ₹{selectedWork.sanctionedAmountLakhs} Lakhs
                </span>
              </div>

              {/* Key Details */}
              <div className="space-y-2 bg-[#F8FAFC] p-3.5 rounded border border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-900 font-medium">{selectedWork.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-mono text-[#003366] font-bold">{selectedWork.lat.toFixed(4)}, {selectedWork.lng.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Implementing Agency:</span>
                  <span className="text-slate-900 text-right max-w-[180px] truncate">{selectedWork.implementingAgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contractor:</span>
                  <span className="text-slate-900 font-medium text-right max-w-[180px] truncate">{selectedWork.contractorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className={`font-bold ${selectedWork.status === 'COMPLETED' ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {selectedWork.status}
                  </span>
                </div>
              </div>

              {/* Active Flag List */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>AI Risk Flags ({selectedWork.flags.length})</span>
                </h4>
                {selectedWork.flags.length === 0 ? (
                  <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded border border-emerald-200">
                    No anomalies found. Physical & financial verifications are synchronized.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedWork.flags.map((flag) => (
                      <div 
                        key={flag.id}
                        className="bg-rose-50 border border-rose-200 p-2.5 rounded text-xs space-y-1"
                      >
                        <div className="font-bold text-rose-900 flex items-center justify-between">
                          <span>{flag.title}</span>
                          <span className="text-[10px] font-mono bg-rose-200/80 px-1 rounded text-rose-800 font-bold">
                            {Math.round(flag.confidence * 100)}% Conf
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{flag.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons to deep-dive */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                {selectedWork.satelliteScanId && (
                  <button
                    onClick={() => onNavigateTab('satellite')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Satellite className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>Satellite Scan</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('double_dipping')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-white hover:bg-slate-100 text-[#003366] border border-slate-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Collision Radar</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <MapPin className="w-12 h-12 text-slate-400 animate-bounce" />
              <p className="text-sm font-medium">Select any project marker on the map to inspect spatial collision, satellite analysis, and WIRI score.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
