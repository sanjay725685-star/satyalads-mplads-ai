import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  useLoadScript, 
  GoogleMap, 
  Marker, 
  MarkerClusterer, 
  InfoWindow, 
  Circle as GoogleCircle, 
  Polygon 
} from '@react-google-maps/api';
import { 
  MapPin, 
  Layers, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Satellite, 
  ArrowUpRight, 
  Filter, 
  Compass, 
  Search, 
  Key, 
  ExternalLink,
  Eye,
  RefreshCw,
  Info,
  Maximize2
} from 'lucide-react';
import { Constituency, WorkItem, RiskLevel } from '../types';

// Libraries array defined outside component to prevent re-render reloads
const GOOGLE_MAPS_LIBRARIES: ('places' | 'geometry' | 'visualization')[] = ['geometry'];

export interface GeoMapProject {
  work_code: string;
  title: string;
  lat: number;
  lng: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  contractor: string;
  category: string;
  sanctioned_amount: number; // full INR
  status: string;
  anomaly_flags: string[];
}

export interface GeoMapViewProps {
  constituency: Constituency;
  works?: WorkItem[];
  selectedWork?: WorkItem | null;
  onSelectWork?: (work: WorkItem) => void;
  onNavigateTab?: (tab: string) => void;
  apiKey?: string;
  onSwitchToLeaflet?: () => void;
}

// Map Container Styles
const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '620px',
  borderRadius: '4px'
};

// Risk Level Colors (matching SATYALADS scheme)
const RISK_COLORS: Record<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', { pin: string; stroke: string; fill: string; bg: string }> = {
  CRITICAL: { pin: '#DC2626', stroke: '#991B1B', fill: '#FEE2E2', bg: 'bg-red-600' },
  HIGH:     { pin: '#EA580C', stroke: '#9A3412', fill: '#FFEDD5', bg: 'bg-orange-600' },
  MEDIUM:   { pin: '#D97706', stroke: '#92400E', fill: '#FEF3C7', bg: 'bg-amber-600' },
  LOW:      { pin: '#16A34A', stroke: '#166534', fill: '#DCFCE7', bg: 'bg-emerald-600' }
};

// Helper: Generate custom SVG Marker Icon data URI
function getMarkerIcon(riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', isSelected: boolean = false) {
  const color = RISK_COLORS[riskLevel]?.pin || '#0B3D91';
  const size = isSelected ? 36 : 28;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3.5" fill="#FFFFFF"></circle>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: typeof google !== 'undefined' ? new google.maps.Size(size, size) : undefined,
    anchor: typeof google !== 'undefined' ? new google.maps.Point(size / 2, size) : undefined
  };
}

export const GeoMapView: React.FC<GeoMapViewProps> = ({
  constituency,
  works = [],
  selectedWork = null,
  onSelectWork,
  onNavigateTab,
  apiKey: propApiKey,
  onSwitchToLeaflet
}) => {
  // 1. Resolve API Key from Environment or Props
  const envKey = 
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) ||
    (import.meta as any)?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY ||
    propApiKey ||
    '';

  const [activeApiKey, setActiveApiKey] = useState<string>(envKey);
  const [keyInputVal, setKeyInputVal] = useState<string>('');
  const [isKeyDrawerOpen, setIsKeyDrawerOpen] = useState<boolean>(false);

  // 2. Load Google Maps Script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: activeApiKey || 'DEMO_KEY_FALLBACK',
    libraries: GOOGLE_MAPS_LIBRARIES,
    preventGoogleFontsLoading: false
  });

  // Map state
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [showCollisionBuffers, setShowCollisionBuffers] = useState<boolean>(true);
  const [showScStZones, setShowScStZones] = useState<boolean>(true);
  const [activeMarkerProject, setActiveMarkerProject] = useState<GeoMapProject | null>(null);
  const [scStGeoJson, setScStGeoJson] = useState<any | null>(null);
  const [backendProjects, setBackendProjects] = useState<GeoMapProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);

  // Default Center
  const defaultCenter = useMemo(() => ({
    lat: constituency.centerLat || 25.3176,
    lng: constituency.centerLng || 82.9739
  }), [constituency.id, constituency.centerLat, constituency.centerLng]);

  // 3. Fetch Project Data from Backend GET /api/projects?constituency={id}
  useEffect(() => {
    let isSubscribed = true;
    const fetchGeoProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const cParam = encodeURIComponent(constituency.id || constituency.name);
        const res = await fetch(`http://localhost:8000/api/projects?constituency=${cParam}&limit=500`);
        if (res.ok) {
          const data: GeoMapProject[] = await res.json();
          if (isSubscribed && Array.isArray(data) && data.length > 0) {
            setBackendProjects(data);
            return;
          }
        }
      } catch (err) {
        // backend offline or fallback to props
      } finally {
        if (isSubscribed) setIsLoadingProjects(false);
      }

      // Fallback: Convert existing `works` prop into GeoMapProject format
      if (works && works.length > 0) {
        const fallback: GeoMapProject[] = works.map(w => ({
          work_code: w.code,
          title: w.title,
          lat: w.lat,
          lng: w.lng,
          risk_score: w.wiriScore,
          risk_level: w.riskLevel,
          contractor: w.contractorName,
          category: w.category,
          sanctioned_amount: Math.round(w.sanctionedAmountLakhs * 100000),
          status: w.status,
          anomaly_flags: w.flags.map(f => f.title)
        }));
        if (isSubscribed) setBackendProjects(fallback);
      }
    };

    fetchGeoProjects();
    return () => { isSubscribed = false; };
  }, [constituency.id, works]);

  // 4. Fetch SC/ST Demographic Zones GeoJSON from /api/geo/sc-st-zones
  useEffect(() => {
    let isSubscribed = true;
    const fetchZones = async () => {
      try {
        const cParam = encodeURIComponent(constituency.id || constituency.name);
        const res = await fetch(`http://localhost:8000/api/geo/sc-st-zones?constituency=${cParam}`);
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed) setScStGeoJson(data);
        }
      } catch (e) {}
    };
    fetchZones();
    return () => { isSubscribed = false; };
  }, [constituency.id]);

  // 5. Memoized Filtered Project List
  const displayProjects = useMemo(() => {
    return backendProjects.filter(p => {
      if (filterRisk === 'ALL') return true;
      return p.risk_level === filterRisk;
    });
  }, [backendProjects, filterRisk]);

  // Center change when constituency changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(defaultCenter);
      mapRef.current.setZoom(12);
    }
  }, [defaultCenter]);

  // Fly to selected work
  useEffect(() => {
    if (selectedWork && mapRef.current && selectedWork.lat && selectedWork.lng) {
      mapRef.current.panTo({ lat: selectedWork.lat, lng: selectedWork.lng });
      mapRef.current.setZoom(15);
      const match = backendProjects.find(p => p.work_code === selectedWork.code);
      if (match) {
        setActiveMarkerProject(match);
      }
    }
  }, [selectedWork, backendProjects]);

  // Debounced bounds changed handler
  const boundsTimerRef = useRef<any>(null);
  const handleBoundsChanged = useCallback(() => {
    if (boundsTimerRef.current) clearTimeout(boundsTimerRef.current);
    boundsTimerRef.current = setTimeout(() => {
      if (!mapRef.current) return;
      const bounds = mapRef.current.getBounds();
      // Future hook: lazy load projects currently in viewport
    }, 300);
  }, []);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Format currency
  const formatINR = (amount: number) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // Convert GeoMapProject to WorkItem for parent callback
  const handleViewDossier = (proj: GeoMapProject) => {
    const existingWork = works.find(w => w.code === proj.work_code);
    if (existingWork && onSelectWork) {
      onSelectWork(existingWork);
      if (onNavigateTab) onNavigateTab('project_detail');
    } else {
      // Direct navigation
      window.location.hash = `#/dossier/${encodeURIComponent(proj.work_code)}`;
    }
  };

  // RENDER: Error or Missing Key Guidance
  const hasNoKey = !activeApiKey || activeApiKey === 'DEMO_KEY_FALLBACK';
  if (loadError || hasNoKey) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Setup Banner */}
        <div className="bg-white border-2 border-amber-400 rounded-md p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-md border border-amber-300 flex-shrink-0">
              <Key className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase font-mono border border-amber-300">
                  GOOGLE MAPS API SETUP REQUIRED
                </span>
                <h2 className="text-xl font-bold text-[#002244] font-serif mt-1">
                  Google Maps JavaScript API Integration
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  To render the high-resolution Google Maps satellite and roadmap layer for <strong>{constituency.name} Parliamentary Constituency</strong>, please provide a Google Maps API key with <em>Maps JavaScript API</em> enabled.
                </p>
              </div>

              {/* Instructions Box */}
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2">
                <span className="font-bold text-slate-900 block">Where to configure your API key:</span>
                <div className="font-mono text-[11px] bg-white p-2.5 rounded border border-slate-300 text-slate-800">
                  <span className="text-slate-400"># In file:</span> .env.local<br />
                  <strong className="text-[#0B3D91]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</strong>=AIzaSy...YourKeyHere<br />
                  <strong className="text-slate-600">VITE_GOOGLE_MAPS_API_KEY</strong>=AIzaSy...YourKeyHere
                </div>
                <p className="text-[11px] text-slate-500">
                  Get your free API key at <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noreferrer" className="text-[#0B3D91] underline font-bold inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-3 h-3" /></a>.
                </p>
              </div>

              {/* Paste Key Directly Form for Immediate Testing */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="password"
                    placeholder="Or paste AIzaSy... key directly here to test immediately"
                    value={keyInputVal}
                    onChange={(e) => setKeyInputVal(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 font-mono outline-none focus:border-[#0B3D91]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (keyInputVal.trim()) {
                      setActiveApiKey(keyInputVal.trim());
                    }
                  }}
                  className="px-4 py-2 bg-[#0B3D91] hover:bg-[#002244] text-white font-bold rounded text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Load Google Map
                </button>
                {onSwitchToLeaflet && (
                  <button
                    type="button"
                    onClick={onSwitchToLeaflet}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs border border-slate-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Use OpenStreetMap Fallback
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informational Cards on Map Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white border border-slate-300 rounded p-4 space-y-1">
            <span className="font-bold text-[#002244] flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-red-600 bg-red-100 inline-block"></span>
              50m Collision Buffer
            </span>
            <p className="text-slate-600 text-[11px]">
              Visualizes 50m circles around each MPLADS project to verify spatial non-overlap with PMGSY / MLALADS schemes.
            </p>
          </div>
          <div className="bg-white border border-slate-300 rounded p-4 space-y-1">
            <span className="font-bold text-[#002244] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              SC/ST Mandated Zones
            </span>
            <p className="text-slate-600 text-[11px]">
              PostGIS GeoJSON polygons overlaid on Google Maps Data layer for statutory &ge;15% SC / &ge;7.5% ST quota compliance.
            </p>
          </div>
          <div className="bg-white border border-slate-300 rounded p-4 space-y-1">
            <span className="font-bold text-[#002244] flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-blue-600" />
              Satellite Imagery Quick Reference
            </span>
            <p className="text-slate-600 text-[11px]">
              Instant roadmap vs satellite view toggle prior to launching the deep Sentinel-1 SAR backscatter comparison.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Loading Script State
  if (!isLoaded) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[450px] bg-white border border-slate-300 rounded-md space-y-3">
        <RefreshCw className="w-8 h-8 text-[#0B3D91] animate-spin" />
        <span className="text-sm font-bold text-[#002244] font-serif">
          Initializing Google Maps JavaScript API...
        </span>
        <span className="text-xs text-slate-500 font-mono">
          Loading layers for {constituency.name} ({constituency.state})
        </span>
      </div>
    );
  }

  // RENDER: Full Interactive Google Map View
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* 1. Official Government Header & Toolbar */}
      <div className="bg-white border border-slate-300 rounded-md p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FF9933]/15 text-[#B85D00] border border-[#FF9933]/30 uppercase tracking-wider font-mono">
                Google Maps JavaScript API Sentinel • e-SAKSHI Spatial Engine
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                {constituency.name} ({constituency.state}) • Hon. {constituency.mpName}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#002244] font-serif flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0B3D91]" />
              <span>GIS Geo-Map: Spatial Anti-Fraud Audit Layer</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Satellite / Roadmap Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-300 text-xs">
              <button
                type="button"
                aria-label="Switch to Roadmap View"
                onClick={() => setMapType('roadmap')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  mapType === 'roadmap' ? 'bg-[#002244] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Roadmap
              </button>
              <button
                type="button"
                aria-label="Switch to Satellite Imagery View"
                onClick={() => setMapType('satellite')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  mapType === 'satellite' ? 'bg-[#002244] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Satellite className="w-3.5 h-3.5 text-amber-400" />
                <span>Satellite</span>
              </button>
            </div>

            {/* Switch to Leaflet Toggle */}
            {onSwitchToLeaflet && (
              <button
                type="button"
                aria-label="Switch to OpenStreetMap Leaflet Engine"
                onClick={onSwitchToLeaflet}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs border border-slate-300 transition-all cursor-pointer"
                title="Switch to Leaflet OpenStreetMap"
              >
                Leaflet OSM
              </button>
            )}
          </div>
        </div>

        {/* 2. Interactive Layer Controls & Risk Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Risk Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-bold uppercase mr-1">Risk Filter:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((r) => {
              const count = r === 'ALL' 
                ? backendProjects.length 
                : backendProjects.filter(p => p.risk_level === r).length;
              return (
                <button
                  key={r}
                  type="button"
                  aria-label={`Filter by ${r} risk level`}
                  onClick={() => setFilterRisk(r)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    filterRisk === r 
                      ? 'bg-[#002244] text-white border-[#002244]' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{r}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/15 font-mono">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Overlays Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Collision Buffer Toggle */}
            <button
              type="button"
              aria-label="Toggle 50m Spatial Collision Buffers"
              onClick={() => setShowCollisionBuffers(!showCollisionBuffers)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                showCollisionBuffers 
                  ? 'bg-red-50 text-red-800 border-red-300' 
                  : 'bg-slate-50 text-slate-500 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full border ${showCollisionBuffers ? 'bg-red-500 border-red-700' : 'bg-slate-300 border-slate-400'}`} />
              <span>50m Collision Buffer</span>
            </button>

            {/* SC/ST Zones Toggle */}
            <button
              type="button"
              aria-label="Toggle SC/ST Mandated Demographic Zones"
              onClick={() => setShowScStZones(!showScStZones)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                showScStZones 
                  ? 'bg-amber-50 text-amber-900 border-amber-300' 
                  : 'bg-slate-50 text-slate-500 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full border ${showScStZones ? 'bg-amber-500 border-amber-700' : 'bg-slate-300 border-slate-400'}`} />
              <span>SC/ST Mandated Zones</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Google Map Canvas */}
      <div className="relative bg-slate-200 border border-slate-300 rounded-md overflow-hidden shadow-sm h-[640px]">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          mapTypeId={mapType}
          onLoad={handleMapLoad}
          onBoundsChanged={handleBoundsChanged}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            styles: mapType === 'roadmap' ? [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ] : []
          }}
        >
          {/* 3A. Marker Clustering with Color-Coded Risk Markers */}
          <MarkerClusterer
            options={{
              gridSize: 50,
              maxZoom: 15,
              minimumClusterSize: 3
            }}
          >
            {(clusterer) => (
              <>
                {displayProjects.map((project) => {
                  const isSelected = selectedWork?.code === project.work_code || activeMarkerProject?.work_code === project.work_code;
                  return (
                    <Marker
                      key={project.work_code}
                      position={{ lat: project.lat, lng: project.lng }}
                      clusterer={clusterer}
                      icon={getMarkerIcon(project.risk_level, isSelected)}
                      title={`${project.work_code} — ${project.title}`}
                      onClick={() => setActiveMarkerProject(project)}
                    />
                  );
                })}
              </>
            )}
          </MarkerClusterer>

          {/* 3B. 50m Collision Buffers (DBSCAN Spatial Rule Visualization) */}
          {showCollisionBuffers && displayProjects.map((project) => {
            const colors = RISK_COLORS[project.risk_level] || RISK_COLORS.LOW;
            return (
              <GoogleCircle
                key={`circle-${project.work_code}`}
                center={{ lat: project.lat, lng: project.lng }}
                radius={50} // 50 meters buffer
                options={{
                  strokeColor: colors.pin,
                  strokeOpacity: 0.8,
                  strokeWeight: 1.5,
                  fillColor: colors.pin,
                  fillOpacity: 0.15,
                  clickable: false
                }}
              />
            );
          })}

          {/* 3C. SC/ST Mandated Zones Polygons (GeoJSON FeatureCollection) */}
          {showScStZones && scStGeoJson?.features?.map((feature: any) => {
            const coords = feature.geometry.coordinates[0].map(([lng, lat]: [number, number]) => ({
              lat,
              lng
            }));
            const props = feature.properties;
            return (
              <Polygon
                key={props.zone_id || Math.random()}
                paths={coords}
                options={{
                  strokeColor: props.strokeColor || '#B85D00',
                  strokeOpacity: 0.85,
                  strokeWeight: 2,
                  fillColor: props.fillColor || '#FF9933',
                  fillOpacity: props.fillOpacity || 0.2,
                  clickable: true
                }}
                onClick={() => {
                  alert(`${props.zone_name}\nMandate: ${props.gfr_guideline}\nSC Population: ${props.sc_population_percent}%\nStatus: ${props.compliance_status}`);
                }}
              />
            );
          })}

          {/* 3D. Interactive InfoWindow on Marker Click */}
          {activeMarkerProject && (
            <InfoWindow
              position={{ lat: activeMarkerProject.lat, lng: activeMarkerProject.lng }}
              onCloseClick={() => setActiveMarkerProject(null)}
              options={{
                pixelOffset: new google.maps.Size(0, -28)
              }}
            >
              <div className="p-1 max-w-xs space-y-2 text-slate-800 font-sans">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-1.5">
                  <div>
                    <span className="font-mono text-[10px] text-[#0B3D91] font-bold block">
                      {activeMarkerProject.work_code}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">
                      {activeMarkerProject.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white font-mono ${RISK_COLORS[activeMarkerProject.risk_level]?.bg || 'bg-slate-700'}`}>
                    {activeMarkerProject.risk_level} ({activeMarkerProject.risk_score})
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {activeMarkerProject.title}
                </h4>

                {/* Financials & Contractor */}
                <div className="space-y-1 text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sanctioned:</span>
                    <strong className="font-mono text-slate-800">{formatINR(activeMarkerProject.sanctioned_amount)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contractor:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">{activeMarkerProject.contractor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-mono text-[10px] text-[#0B3D91] font-bold">{activeMarkerProject.status}</span>
                  </div>
                </div>

                {/* Anomaly Flags */}
                {activeMarkerProject.anomaly_flags && activeMarkerProject.anomaly_flags.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">Detected Flags:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeMarkerProject.anomaly_flags.map((flag, idx) => (
                        <span key={idx} className="bg-red-50 text-red-700 border border-red-200 rounded px-1.5 py-0.5 text-[9px] font-medium">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Audit Dossier Action Link */}
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleViewDossier(activeMarkerProject)}
                    className="w-full py-1.5 px-3 bg-[#0B3D91] hover:bg-[#002244] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View Audit Dossier</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Floating Legend / Quick Overview Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-2.5 rounded shadow-md border border-slate-300 text-[11px] space-y-1.5 pointer-events-auto">
          <span className="font-bold text-[#002244] uppercase text-[10px] block border-b border-slate-200 pb-1">
            Vigilance Legend
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
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> LOW / COMPLIANT
            </span>
          </div>
          <div className="pt-1 border-t border-slate-200 text-[9px] text-slate-500">
            DBSCAN 50m circle buffers active
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoMapView;
