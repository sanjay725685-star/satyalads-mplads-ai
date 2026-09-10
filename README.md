# SATYALADS (सत्य-LADS)
### Autonomous Multi-Modal AI Sentinel for MPLADS Scheme Integrity & Geotag Verification
**Smart India Hackathon 2026** • **Problem Statement 26102** • **Team: Stack Attack**

---

## Executive Overview
**SATYALADS** is an enterprise-grade full-stack government audit platform engineered for the Ministry of Statistics & Programme Implementation (MoSPI) to autonomously detect fraud, cartels, overpricing, and geospatial anomalies in Member of Parliament Local Area Development Scheme (MPLADS) project filings.

Unlike superficial demonstration dashboards, **SATYALADS executes genuine multi-modal machine learning, graph theory, and geospatial algorithms** on realistic project data, producing transparent, explainable audit dossiers backed by General Financial Rules (GFR 2017) and e-SAKSHI regulatory citations.

---

## Key Differentiators & Highlights
1. **Real-Time EXIF Geo-Tag Verification (Headline Feature)**:
   - Extracts embedded hardware GPS coordinates and capture timestamps directly from field photos using `Pillow`/`piexif`.
   - Computes Haversine geodesic distance against claimed project coordinates and flags location mismatches $>500$m with dual-pin dashed line visualizations on interactive Leaflet maps.
   - Detects stripped EXIF metadata (screenshots, downloaded stock photos) and chronological timestamp tampering.
2. **5 Real Algorithmic Detection Modules**:
   - **Module 1 (Spatial Proximity & Double Dipping)**: DBSCAN clustering on project coordinates ($\epsilon = 150$m) + TF-IDF sentence cosine similarity on project titles & scopes.
   - **Module 2 (Cost / Overpricing Outliers)**: Category-specific statistical distributions calculating Z-score ($>2.0\sigma$) and IQR outlier limits based on PWD Schedule of Rates.
   - **Module 3 (Contractor Cartel Nexus)**: `NetworkX` graph connected components identifying bidding rings sharing PAN, GSTIN, registered addresses, and phone numbers.
   - **Module 4 (Ghost Projects & Photo Reuse)**: Perceptual image hashing (`pHash` 64-bit DCT difference hash) detecting image reuse across distinct works (Hamming distance $\le 5$).
   - **Module 5 (Geotag Verification)**: Haversine distance $>500$m, stripped EXIF, and timestamp chronology anomalies.
3. **High-Impact Return on Investment (ROI) Banner**:
   - Quantifies **₹17.3 Cr in active flagged risk** across 320 projects operating at $<0.01\%$ of scheme operational cost.
4. **Live Re-Scan Button (`POST /analyze/run`)**:
   - Dynamically re-runs all 5 algorithms across the database in real time with live progress indicators.
5. **Interactive Before/After Physical Comparison Slider**:
   - Split-screen comparison of pre-construction baseline vs completion photos with Sentinel-1 SAR Radar ($\Delta	ext{dB}$) and Sentinel-2 NDBI concrete index shifts.
6. **Public Citizen Transparency Portal**:
   - Unauthenticated, open-governance ledger displaying aggregate fund distributions and audit percentages with all contractor PII (PAN, GSTIN) strictly redacted.
7. **Bilingual Localization (English / हिन्दी)**:
   - Live one-click multilingual toggle on navigation bar and reports.
8. **Auditor Bureaucratic Workflow Stepper**:
   - Interactive role-based status transitions: `UNDER_REVIEW` ➔ `FLAGGED` ➔ `ESCALATED` ➔ `CLEARED`.

---

## System Architecture

```
                                    +-------------------------------------------------------+
                                    |                 SATYALADS FRONTEND                    |
                                    |        React 18 + TypeScript + Tailwind CSS           |
                                    |    10 Dedicated Views: Dashboard, Directory, Map,     |
                                    |  Detail, Report, Capture, Slider, Transparency, etc.   |
                                    +---------------------------+---------------------------+
                                                                |
                                             REST API / Dual-Mode Offline Fallback
                                                                |
                                    +---------------------------v---------------------------+
                                    |                 FASTAPI BACKEND (Python)              |
                                    |          JWT Role Auth: Auditor / Nodal / Admin       |
                                    |            13 Dedicated Endpoints & End-to-End Test   |
                                    +---------------------------+---------------------------+
                                                                |
                  +---------------------------------------------+---------------------------------------------+
                  |                             |                               |                             |
      +-----------v-----------+     +-----------v-----------+     +-------------v-----------+     +-----------v-----------+
      |       Module 1        |     |       Module 2        |     |        Module 3         |     |      Module 4 & 5     |
      |   DBSCAN Clustering   |     | Z-Score / IQR Cost    |     | NetworkX Cartel Graph   |     | pHash Photo Reuse &   |
      | + TF-IDF Cosine Sim   |     | Outliers (PWD Rates)  |     |  Shared PAN/GSTIN/Phone |     | EXIF Haversine Geotag |
      +-----------------------+     +-----------------------+     +-------------------------+     +-----------------------+
```

---

## 10 Core Application Views
1. **Landing Page**: Official audit product overview with MoSPI context, Problem 26102 statement, and "Access Vigilance Audit System" CTA.
2. **Login Portal**: Role selector (District Auditor, State Nodal Officer, Central Vigilance Officer) with JWT token authorization.
3. **Overview Dashboard**: ROI banner (₹17.3 Cr flagged), Live Re-Scan button, Recharts category breakdown, risk distribution gauge, and notification bell.
4. **Project Audit Directory**: Searchable, filterable table covering 320 projects across 25 Lok Sabha seats, sortable by risk score.
5. **Project Detail View**: Animated risk score gauge (0-100), explainable anomaly cards citing exact metrics & GFR rules, and interactive workflow stepper.
6. **GIS Geo-Map**: Leaflet spatial view with risk-colored markers, clustering, and **red dashed lines connecting claimed location to photo EXIF GPS location on mismatch**.
7. **Audit Investigation Dossier**: Letterhead-style printable audit dossier with Ashoka emblem, reference numbers, digital signature, and PDF export.
8. **Capture Site Photo**: Real-time camera viewfinder with live GPS coordinate acquisition (`navigator.geolocation`), crosshair, and immediate Module 5 verification.
9. **Before/After Comparison Slider**: Split-screen comparison between pre-sanction baseline and completion photos with SAR Radar and NDBI spectral toggles.
10. **Public Citizen Transparency View**: Citizen-facing accountability ledger with aggregate funds monitored and sanitized of contractor PII.

---

## Quick Start & Setup

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ (Tested on Python 3.14)

### 1. Generate Realistic Synthetic Dataset (320+ Projects)
```bash
python backend/seed_data.py
```
*Generates 320 project records across 25 Lok Sabha seats, seeds cartels, double-funding pairs, cost outliers, and creates genuine EXIF GPS-embedded site photos in `backend/data/site_photos/`.*

### 2. Run Backend Fast-API Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
*API documentation available at `http://localhost:8000/docs`.*

### 3. Run Frontend (React 18 + Vite)
```bash
npm install
npm run dev
```
*Open `http://localhost:3000/` in your browser.*

---

## Docker Compose Deployment
To spin up the entire multi-container stack (Frontend, FastAPI Backend, and PostgreSQL with PostGIS):
```bash
docker-compose up --build
```

---

## Statutory References & Legal Citations
Every finding in SatyaLADS correlates directly to official Indian procurement regulations:
- **General Financial Rules (GFR 2017) Rule 144**: Fundamental principles of public buying and prohibition of duplicate fund allocations.
- **GFR 2017 Rule 149 & CVC Circular 02/05**: Reasonableness of rates against official Schedule of Rates (SOR).
- **GFR 2017 Rule 153 & Competition Act 2002 Sec 3(3)**: Prohibition of cartelization, collusive bidding, and shared beneficial ownership.
- **MoSPI e-SAKSHI Geotagging Guidelines 2024**: Mandatory hardware-embedded EXIF GPS and timestamp logging within 500m tolerance.

---
**Team Stack Attack** • Smart India Hackathon 2026


---

## Google Maps JavaScript API Integration (`GeoMapView`)

SATYALADS includes an enterprise Google Maps interface (`GeoMapView.tsx`) located in the **GIS Geo-Map** tab, powered by `@react-google-maps/api` and `@googlemaps/markerclusterer`.

### 1. API Key Configuration (`.env.local`)
Create or edit `.env.local` in the project root:
```env
# Google Maps JavaScript API Key (required for GeoMapView)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...YourKeyHere
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...YourKeyHere
```
> **Note**: Both `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `VITE_GOOGLE_MAPS_API_KEY` are supported. In addition, an on-screen API key input is provided in the UI for instant testing without rebuilding. If no key is set, a 1-click fallback to the Leaflet OpenStreetMap engine is always available.

### 2. Capabilities & Layer Architecture
- **Interactive Project Markers & Risk Clustering**:
  - Color-coded pins: LOW (Green `#16A34A`), MEDIUM (Amber `#D97706`), HIGH (Orange `#EA580C`), CRITICAL (Red `#DC2626`).
  - `@googlemaps/markerclusterer` clusters 320+ nationwide projects cleanly.
- **Interactive InfoWindow**:
  - Displays work code, project title, contractor, risk score, sanctioned cost in INR, and anomaly flags with a direct `"View Audit Dossier →"` link.
- **50m Spatial Collision Buffers**:
  - Rendered using `google.maps.Circle` to visualize the DBSCAN 150m spatial overlap rule across schemes (PMGSY, MLALADS).
- **SC/ST Mandated Demographic Zones**:
  - Rendered using `google.maps.Polygon` / `google.maps.Data` layer from `/api/geo/sc-st-zones` to enforce MoSPI Guidelines Para 2.5 (≥15% SC) and Para 2.6 (≥7.5% ST).
- **Roadmap & Satellite Dual View**:
  - Instant toggle between high-res Google Maps satellite imagery and roadmap view for quick ground verification prior to deep Sentinel-1 SAR analysis.

### 3. Backend Endpoints Added
- `GET /api/projects?constituency={id}`: Returns formatted GeoMap project array with coordinates, risk score, contractor, and anomaly flags.
- `GET /api/geo/sc-st-zones?constituency={id}`: Returns PostGIS `ST_AsGeoJSON` compliant FeatureCollection of mandated demographic polygons.
