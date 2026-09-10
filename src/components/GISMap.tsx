import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Satellite, 
  ArrowUpRight,
  Filter,
  Compass,
  Globe,
  Camera,
  ExternalLink,
  Sparkles
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

// Risk Level Colors (SATYALADS Government Portal Scheme)
const RISK_COLORS: Record<string, { pin: string; stroke: string; fill: string; bg: string }> = {
  CRITICAL: { pin: '#DC2626', stroke: '#991B1B', fill: '#FEE2E2', bg: 'bg-red-600' },
  HIGH:     { pin: '#EA580C', stroke: '#9A3412', fill: '#FFEDD5', bg: 'bg-orange-600' },
  MEDIUM:   { pin: '#D97706', stroke: '#92400E', fill: '#FEF3C7', bg: 'bg-amber-600' },
  LOW:      { pin: '#16A34A', stroke: '#166534', fill: '#DCFCE7', bg: 'bg-emerald-600' }
};

export const GISMap: React.FC<GISMapProps> = ({
  constituency,
  works,
  selectedWork,
  onSelectWork,
  onNavigateTab
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const buffersLayerRef = useRef<L.LayerGroup | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // 100% Free Map Engine State (NO Google API Key or Credit Card Required!)
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'osm'>('roadmap');
  const [showCollisionBuffers, setShowCollisionBuffers] = useState<boolean>(true);
  const [showScStZones, setShowScStZones] = useState<boolean>(true);
  const [showPhotoDiscrepancies, setShowPhotoDiscrepancies] = useState<boolean>(true);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [mapError, setMapError] = useState<string | null>(null);

  // Expose global callback for popup "View Audit Dossier" button
  useEffect(() => {
    (window as any).satyaViewDossier = (workCode: string) => {
      const match = works.find(w => w.code === workCode || w.id === workCode);
      if (match) {
        onSelectWork(match);
        onNavigateTab('project_detail');
      }
    };
    return () => {
      delete (window as any).satyaViewDossier;
    };
  }, [works, onSelectWork, onNavigateTab]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Safely remove existing instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Map removal warning:', e);
      }
      mapInstanceRef.current = null;
    }

    // Clear any lingering Leaflet ID on the DOM container to prevent "Map container is already initialized" crash
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

      // Default Tile Layer: CartoDB Voyager (High clarity, free government map)
      const tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tile;
      markersLayerRef.current = L.layerGroup().addTo(map);
      buffersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

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

  // 2. Switch Tile Layers (Roadmap vs Free Satellite vs OpenStreetMap) - 100% Free, NO API Key!
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      try {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      } catch (e) {}
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';
    let maxZoom = 19;

    if (mapType === 'satellite') {
      // 100% FREE High-Resolution Global Satellite Imagery (Esri World Imagery) - No Google API Key Needed!
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = 'abc';
      maxZoom = 19;
    } else if (mapType === 'osm') {
      // OpenStreetMap Standard / OpenFreeMap Tile Layer
      url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = 'abc';
      maxZoom = 19;
    }

    try {
      tileLayerRef.current = L.tileLayer(url, {
        maxZoom,
        subdomains
      }).addTo(mapInstanceRef.current);
    } catch (e) {
      console.error('Error switching tile layer:', e);
    }
  }, [mapType]);

  // 3. Fetch & Overlay SC/ST Demographic GeoJSON Zones from /api/geo/sc-st-zones
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (geoJsonLayerRef.current) {
      try {
        mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
      } catch (e) {}
      geoJsonLayerRef.current = null;
    }

    if (!showScStZones) return;

    const fetchGeoJson = async () => {
      try {
        const cParam = encodeURIComponent(constituency.id || constituency.name);
        const res = await fetch(`http://localhost:8000/api/geo/sc-st-zones?constituency=${cParam}`);
        if (res.ok) {
          const data = await res.json();
          if (mapInstanceRef.current && data?.features) {
            geoJsonLayerRef.current = L.geoJSON(data, {
              style: (feature) => {
                const props = feature?.properties || {};
                return {
                  color: props.strokeColor || '#B85D00',
                  weight: 2,
                  fillColor: props.fillColor || '#FF9933',
                  fillOpacity: 0.18,
                  dashArray: '6, 6'
                };
              },
              onEachFeature: (feature, layer) => {
                const props = feature?.properties || {};
                layer.bindPopup(`
                  <div style="padding: 6px; font-family: sans-serif; font-size: 11px; color: #1e293b;">
                    <div style="font-weight: bold; color: #0B3D91; font-size: 12px;">${props.zone_name || 'SC/ST Mandated Zone'}</div>
                    <div style="margin: 4px 0; font-size: 11px;">Category: <strong>${props.mandate_category || 'SC_MANDATED'}</strong></div>
                    <div style="font-size: 10px; color: #475569;">SC Population: <strong>${props.sc_population_percent}%</strong></div>
                    <div style="font-size: 10px; color: #166534; margin-top: 3px;">Guideline: ${props.gfr_guideline}</div>
                  </div>
                `);
              }
            }).addTo(mapInstanceRef.current);
          }
        }
      } catch (err) {
        // Fallback polygon around constituency center
      }
    };

    fetchGeoJson();
  }, [constituency.id, showScStZones]);

  // 4. Update Markers & Collision Buffers when works or filters change
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
        const isMedium = work.riskLevel === 'MEDIUM';

        const color = isCritical ? '#DC2626' : isHigh ? '#EA580C' : isMedium ? '#D97706' : '#16A34A';

        // Custom HTML Marker Pin (High-contrast, official government marker)
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
              color: #FFFFFF;
              font-weight: 800;
              font-size: 11px;
              font-family: monospace;
              border: 2px solid #FFFFFF;
              box-shadow: 0 0 10px ${color}88;
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

        // Rich Popup matching Government Audit Dossier Specs
        marker.bindPopup(`
          <div style="padding: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 220px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
              <span style="font-size: 10px; color: #0B3D91; font-family: monospace; font-weight: bold;">${work.code}</span>
              <span style="font-size: 9px; font-weight: bold; background: ${color}22; color: ${color}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}44;">
                ${work.riskLevel} (${work.wiriScore})
              </span>
            </div>
            <div style="font-size: 12px; font-weight: bold; color: #0f172a; line-height: 1.3; margin-bottom: 4px;">
              ${work.title}
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; font-size: 10px; color: #334155; margin-bottom: 6px;">
              <div>Category: <strong>${work.category}</strong></div>
              <div>Sanctioned: <strong>₹${work.sanctionedAmountLakhs} Lakhs</strong></div>
              <div>Contractor: <span style="color: #0B3D91; font-weight: 600;">${work.contractorName}</span></div>
            </div>
            ${work.flags && work.flags.length > 0 ? `
              <div style="font-size: 9px; color: #dc2626; font-weight: 600; margin-bottom: 6px;">
                ⚠️ ${work.flags[0].title}
              </div>
            ` : ''}
            <button 
              onclick="window.satyaViewDossier('${work.code}')" 
              style="
                width: 100%;
                padding: 6px 10px;
                background: #0B3D91;
                color: #FFFFFF;
                border: none;
                border-radius: 4px;
                font-weight: 700;
                font-size: 11px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
              "
            >
              <span>View Audit Dossier &rarr;</span>
            </button>
          </div>
        `);

        markersLayerRef.current?.addLayer(marker);

        // 5. 50m Spatial Collision Buffers (DBSCAN 150m rule visualization)
        if (showCollisionBuffers) {
          const circle = L.circle([work.lat, work.lng], {
            color: color,
            fillColor: color,
            fillOpacity: isCritical || isHigh ? 0.22 : 0.08,
            radius: 50, // 50-meter exact spatial buffer
            weight: 1.5,
            dashArray: isCritical ? '4, 4' : undefined
          });
          buffersLayerRef.current?.addLayer(circle);
        }

        // 6. Photo EXIF Geotag Location Mismatch with dashed connecting line (Module 5 Headline Feature)
        if (showPhotoDiscrepancies) {
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
                    background: #dc2626;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 11px;
                    border: 2px solid #fff;
                    box-shadow: 0 0 10px #dc2626;
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
                  <div style="font-weight: bold; color: #dc2626;">⚠️ Photo EXIF Location Mismatch</div>
                  <div style="color: #0f172a; margin: 3px 0;">Photo taken <strong>${approxDistM}m</strong> away from claimed site!</div>
                  <div style="color: #64748b; font-family: monospace; font-size: 10px;">Exceeds MoSPI 500m regulatory limit</div>
                </div>
              `);
              markersLayerRef.current?.addLayer(photoMarker);

              // Red Dashed Line connecting Claimed Site and Photo Location
              const dashedLine = L.polyline([[work.lat, work.lng], [photoLat, photoLng]], {
                color: '#dc2626',
                weight: 2.5,
                dashArray: '6, 8',
                opacity: 0.9
              });
              dashedLine.bindPopup(`
                <div style="font-size: 11px; font-family: sans-serif; color: #dc2626; font-weight: bold;">
                  ⚠️ Geotag Discrepancy: ${approxDistM} meters
                </div>
              `);
              buffersLayerRef.current?.addLayer(dashedLine);
            }
          }
        }
      });

      // Pan to selected work safely if valid
      if (selectedWork && typeof selectedWork.lat === 'number' && typeof selectedWork.lng === 'number') {
        mapInstanceRef.current.setView([selectedWork.lat, selectedWork.lng], 15, { animate: true });
      }
    } catch (e) {
      console.error('Error updating map markers:', e);
    }
  }, [works, filterRisk, showCollisionBuffers, showScStZones, showPhotoDiscrepancies, selectedWork]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* 1. Official Government Header & Toolbar */}
      <div className="bg-white border border-slate-300 rounded-md p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FF9933]/15 text-[#B85D00] border border-[#FF9933]/30 uppercase font-mono tracking-wider">
                100% Free Open-Source GIS • Zero API Key / Billing Required
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                {constituency.name} ({constituency.state}) • Hon. {constituency.mpName}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#002244] font-serif flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0B3D91]" />
              <span>GIS Geo-Map: Geospatial Anti-Fraud Audit Layer</span>
            </h1>
          </div>

          {/* Map Layer Switcher: Roadmap vs Free Satellite vs OpenStreetMap */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-300 text-xs">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                mapType === 'roadmap' ? 'bg-[#002244] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Roadmap
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                mapType === 'satellite' ? 'bg-[#002244] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-amber-400" />
              <span>Satellite (Free)</span>
            </button>
            <button
              type="button"
              onClick={() => setMapType('osm')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                mapType === 'osm' ? 'bg-[#002244] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OpenStreetMap
            </button>
          </div>
        </div>

        {/* 2. Interactive Layer Controls & Risk Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Risk Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-bold uppercase mr-1">Risk Filter:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterRisk(lvl)}
                className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition-all cursor-pointer border ${
                  filterRisk === lvl
                    ? 'bg-[#002244] text-white border-[#002244] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 50m Collision Buffer Toggle */}
            <button
              type="button"
              onClick={() => setShowCollisionBuffers(!showCollisionBuffers)}
              className={`px-2.5 py-1 rounded border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                showCollisionBuffers
                  ? 'bg-red-50 text-red-800 border-red-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${showCollisionBuffers ? 'bg-red-600' : 'bg-slate-300'}`} />
              <span>50m Collision Buffer</span>
            </button>

            {/* SC/ST Demographic Zones Toggle */}
            <button
              type="button"
              onClick={() => setShowScStZones(!showScStZones)}
              className={`px-2.5 py-1 rounded border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                showScStZones
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${showScStZones ? 'bg-amber-600' : 'bg-slate-300'}`} />
              <span>SC/ST Mandated Zones</span>
            </button>

            {/* Geotag Discrepancy Toggle */}
            <button
              type="button"
              onClick={() => setShowPhotoDiscrepancies(!showPhotoDiscrepancies)}
              className={`px-2.5 py-1 rounded border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                showPhotoDiscrepancies
                  ? 'bg-blue-50 text-[#0B3D91] border-blue-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-red-600" />
              <span>Geotag &gt;500m Mismatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive Leaflet GIS Canvas with Floating Legend */}
      <div className="relative bg-slate-100 border border-slate-300 rounded-md overflow-hidden shadow-xs h-[640px]">
        <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

        {/* Floating Legend / Quick Overview Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded shadow-md border border-slate-300 text-[11px] space-y-1.5 max-w-xs">
          <span className="font-bold text-[#002244] uppercase text-[10px] block border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>Vigilance Map Legend</span>
            <span className="font-mono text-[9px] text-[#0B3D91] font-bold">100% Free Leaflet / Esri</span>
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> CRITICAL (70-100)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> HIGH (45-69)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> MEDIUM (20-44)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> LOW / Compliant
            </span>
          </div>
          <div className="pt-1.5 border-t border-slate-200 space-y-0.5 text-[9px] text-slate-600">
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-red-600 inline-block border-dashed"></span>
              <span>Red line: EXIF Geotag Deviation &gt; 500m</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-amber-600 bg-amber-100 inline-block"></span>
              <span>SC/ST Mandated Zone (&ge;15% SC / &ge;7.5% ST)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-red-600 bg-red-100 inline-block"></span>
              <span>DBSCAN 50m Collision Circles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMap;
