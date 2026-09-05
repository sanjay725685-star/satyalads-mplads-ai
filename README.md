# 🛰️ SatyaLADS (सत्य-LADS)
### *AI-Powered Multi-Modal Sentinel for MPLADS Integrity, Asset Verification & Fund Velocity*
**Smart India Hackathon (SIH 2026) Project Prototype**

---

## 🌟 Executive Summary
**SatyaLADS** is a next-generation AI vigilance and audit platform designed for the **Ministry of Statistics and Programme Implementation (MoSPI)** and **District Magistrates (DMs)** to detect fraud, ghost works, cost inflation, and contractor cartels in the **Member of Parliament Local Area Development Scheme (MPLADS)**.

---

## 🚀 Key Modules & Innovations

1. **🛰️ Space-to-Ground Dual-Verification Sentinel**:
   - Compares **ESA Sentinel-1 SAR (Radar)** and **Sentinel-2 (Optical)** time-series rasters between sanction date and completion date.
   - Calculates **NDBI (Normalized Difference Built-up Index)** & surface roughness change to expose **Ghost Projects**.
   - Photo forensics engine using **EXIF GPS validation**, **Error Level Analysis (ELA)**, and **Perceptual Hashing (pHash)** to catch recycled completion photos.

2. **🔀 Cross-Scheme "Double-Dipping" & Collision Radar**:
   - Geospatial Haversine collision engine identifying projects funded concurrently under **MPLADS, PMGSY, MLALADS, PMAY, and Smart Cities Mission** within a 15–50 meter radius.
   - NLP semantic similarity matching on project titles.

3. **🕸️ Cartel Nexus & Bid-Rigging Graph AI (GNN)**:
   - Interactive Knowledge Graph uncovering shell company rings, shared director PAN/GSTINs, shared registered addresses, and rotational cover-bidding patterns across tenders.

4. **📄 Smart DPR & Schedule of Rates (DSR) AI Inspector**:
   - Scans and itemizes Detailed Project Reports (DPRs) against the official **Central Public Works Department (CPWD) Delhi Schedule of Rates (DSR)**.
   - Flags +30% material/labor price inflation and Rule 5.2 violations (e.g. prohibited private religious trust properties or commercial complexes).

5. **⚖️ Statutory Quota & Fund Velocity Predictor**:
   - Audits mandatory **15% (SC)** and **7.5% (ST)** allocation guidelines.
   - Machine learning fund-languishing model predicting stalling risk before releasing the 2nd installment.

6. **🎯 Explainable AI (XAI) Work Integrity Risk Index (WIRI Score)**:
   - Transparent 0–100 risk score with **SHAP factor attribution** and one-click exportable official vigilance dossiers.

7. **📱 Citizen Ground-Truth Portal**:
   - Mobile/WhatsApp-style grievance interface with vernacular voice recognition (Bhashini API) and Computer Vision defect tagging.

---

## 🛠️ How to Run the Prototype

### 1. Frontend Web App (React + Vite + Tailwind + Leaflet)
```bash
# In the project directory:
npm run dev
# Or on Windows PowerShell:
npm.cmd run dev
```
Open your browser at `http://localhost:3000` (or the port shown in the terminal).

### 2. Python AI Backend Test Suite
```bash
python backend/test_backend.py
```

---

## 🏛️ Technology Stack

| Layer | Stack |
|---|---|
| **Frontend UI** | React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet (GIS) |
| **Data Visualization** | Recharts, HTML5 Canvas Network Graph |
| **Satellite & CV** | Sentinel-2 Optical, Sentinel-1 SAR Radar, ELA Forensics, pHash |
| **Backend & Graph AI** | Python 3.14, FastAPI, NetworkX, GeoPandas / Haversine Spatial Engine |
| **XAI & Auditing** | SHAP-style attribution, CPWD DSR 2023 Benchmarks |

---

*Built with ❤️ for Smart India Hackathon 2026.*
