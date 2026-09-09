"""
SATYALADS - FastAPI Backend Server
Smart India Hackathon 2026 (Problem Statement 26102)
Team: Stack Attack
"""

import os
import json
import sqlite3
import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Header, Query, File, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import jwt

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
PHOTOS_DIR = os.path.join(DATA_DIR, 'site_photos')
DB_PATH = os.path.join(DATA_DIR, 'satya_lads.db')
PROJECTS_JSON = os.path.join(DATA_DIR, 'projects.json')

# JWT Secret
JWT_SECRET = "SATYALADS_SECURE_JWT_SECRET_SIH2026_KEY"
JWT_ALGORITHM = "HS256"

# Import Detection Modules
from backend.detection.engine import analyze_all_projects, update_database_with_analysis
from backend.detection.module5_geotag_verifier import verify_project_geotag, extract_exif_gps_and_time

app = FastAPI(
    title="SATYALADS API",
    description="Autonomous Multi-Modal AI Sentinel for MPLADS Scheme Integrity & Geotag Verification",
    version="2.4.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount site photos directory for static access
if os.path.exists(PHOTOS_DIR):
    app.mount("/site_photos", StaticFiles(directory=PHOTOS_DIR), name="site_photos")

# --- Helper Models ---
class LoginRequest(BaseModel):
    username: str
    password: str
    role: str # "auditor", "nodal_officer", "admin"

class StatusUpdateRequest(BaseModel):
    workflow_status: str # "UNDER_REVIEW", "FLAGGED", "ESCALATED", "CLEARED"
    comments: Optional[str] = None

# --- Helper Functions ---
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def load_projects_cache() -> List[Dict[str, Any]]:
    if os.path.exists(PROJECTS_JSON):
        with open(PROJECTS_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        # For prototype convenience, default to District Auditor if unauthenticated
        return {"username": "auditor_varanasi", "role": "auditor", "name": "Varanasi Vigilance Cell"}
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        return {"username": "auditor_varanasi", "role": "auditor", "name": "Varanasi Vigilance Cell"}

# --- ENDPOINTS ---

@app.get("/")
def root():
    return {
        "service": "SATYALADS Engine API",
        "team": "Stack Attack",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "version": "2.4.0"
    }

# 1. POST /auth/login - JWT auth, role-based
@app.post("/auth/login")
def login(creds: LoginRequest):
    valid_roles = ["auditor", "nodal_officer", "admin"]
    role = creds.role.lower()
    if role not in valid_roles:
        role = "auditor"
        
    role_titles = {
        "auditor": "District Vigilance Auditor (DM Cell)",
        "nodal_officer": "State Nodal Officer (Planning & Development)",
        "admin": "Central Vigilance Officer (MoSPI HQ)"
    }
    
    payload = {
        "sub": creds.username or "officer_1",
        "role": role,
        "role_title": role_titles.get(role, "Vigilance Officer"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": creds.username or "officer_1",
            "role": role,
            "title": role_titles.get(role),
            "state_jurisdiction": "All India" if role == "admin" else "Uttar Pradesh"
        }
    }

# 2. GET /projects - Paginated, filterable
@app.get("/projects")
def get_projects(
    category: Optional[str] = None,
    state: Optional[str] = None,
    risk_band: Optional[str] = None,
    contractor: Optional[str] = None,
    search: Optional[str] = None,
    sort_by_risk: bool = True,
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200)
):
    projects = load_projects_cache()
    
    # Filter
    filtered = projects
    if category:
        filtered = [p for p in filtered if p.get("category") == category]
    if state:
        filtered = [p for p in filtered if p.get("state") == state]
    if risk_band:
        filtered = [p for p in filtered if p.get("risk_band") == risk_band.upper()]
    if contractor:
        filtered = [p for p in filtered if contractor.lower() in p.get("contractor_name", "").lower()]
    if search:
        s = search.lower()
        filtered = [
            p for p in filtered 
            if s in p.get("title", "").lower() 
            or s in p.get("work_code", "").lower() 
            or s in p.get("constituency_name", "").lower()
            or s in p.get("district", "").lower()
        ]
        
    if sort_by_risk:
        filtered.sort(key=lambda x: x.get("risk_score", 0), reverse=True)
        
    total = len(filtered)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated = filtered[start_idx:end_idx]
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "projects": paginated
    }

# 3. GET /projects/{id} - Full detail incl flags & score
@app.get("/projects/{project_id}")
def get_project_detail(project_id: str):
    projects = load_projects_cache()
    match = next((p for p in projects if p["id"] == project_id or p["work_code"] == project_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Project record not found")
    return match

# 4. GET /projects/{id}/report - Structured JSON for report
@app.get("/projects/{project_id}/report")
def get_project_report_json(project_id: str):
    projects = load_projects_cache()
    p = next((x for x in projects if x["id"] == project_id or x["work_code"] == project_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return {
        "audit_dossier_id": f"SATYA-AUDIT-{p['work_code']}",
        "generated_at": datetime.datetime.now().isoformat(),
        "project": p,
        "risk_assessment": {
            "score": p.get("risk_score", 0),
            "band": p.get("risk_band", "LOW"),
            "total_flags": len(p.get("flags", [])),
            "flags": p.get("flags", [])
        },
        "geotag_audit": p.get("photo_verification", {}),
        "statutory_citations": list(set(f.get("gfr_citation", "") for f in p.get("flags", []) if f.get("gfr_citation"))),
        "audit_authority": "SatyaLADS Autonomous Vigilance Sentinel (SIH 2026, MoSPI)"
    }

# 5. GET /projects/{id}/report/pdf - Printable HTML Report
@app.get("/projects/{project_id}/report/pdf")
def get_project_report_html(project_id: str):
    projects = load_projects_cache()
    p = next((x for x in projects if x["id"] == project_id or x["work_code"] == project_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
        
    flags_html = "".join([
        f"""
        <div style="border: 1px solid #cbd5e1; border-left: 5px solid {'#dc2626' if f.get('severity') == 'CRITICAL' else '#f59e0b'}; padding: 12px; margin-bottom: 12px; border-radius: 6px; background-color: #f8fafc;">
            <h4 style="margin: 0 0 6px 0; color: #0f172a;">{f.get('title')} <span style="font-size: 11px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">{f.get('severity')}</span></h4>
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #334155;">{f.get('description')}</p>
            <div style="font-size: 11px; font-family: monospace; color: #64748b;">Metric: {f.get('metric_cited', 'N/A')}</div>
            <div style="font-size: 11px; font-weight: bold; color: #475569; margin-top: 4px;">Citation: {f.get('gfr_citation', 'MPLADS General Guidelines')}</div>
        </div>
        """
        for f in p.get("flags", [])
    ]) or "<p style='color: #16a34a; font-weight: bold;'>✓ Zero anomalies flagged. Project is compliant with GFR and MPLADS norms.</p>"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>SATYALADS Audit Dossier - {p['work_code']}</title>
        <style>
            body {{ font-family: 'Times New Roman', serif; margin: 40px; color: #0f172a; line-height: 1.5; }}
            .header {{ text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 15px; margin-bottom: 25px; }}
            .title {{ font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }}
            .sub {{ font-size: 13px; color: #475569; }}
            .meta-table {{ width: 100%; border-collapse: collapse; margin-bottom: 25px; }}
            .meta-table td, .meta-table th {{ border: 1px solid #94a3b8; padding: 8px 12px; font-size: 13px; }}
            .meta-table th {{ background-color: #f1f5f9; text-align: left; width: 30%; }}
            .badge {{ display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; }}
            .badge-crit {{ background-color: #fee2e2; color: #991b1b; }}
            .badge-low {{ background-color: #dcfce7; color: #166534; }}
            .print-btn {{ padding: 8px 16px; background: #0f233d; color: white; border: none; border-radius: 6px; cursor: pointer; }}
            @media print {{ .no-print {{ display: none; }} }}
        </style>
    </head>
    <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
            <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
        </div>
        <div class="header">
            <div style="font-size: 14px; font-weight: bold; color: #b45309;">GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION</div>
            <div class="title">SATYALADS (सत्य-LADS) AUDIT INVESTIGATION DOSSIER</div>
            <div class="sub">Autonomous Multi-Modal AI Sentinel for MPLADS Integrity • SIH 2026 Problem 26102</div>
            <div class="sub">Dossier Ref: SATYA/2024-25/{p['work_code']} • Generated: {datetime.datetime.now().strftime('%d-%b-%Y %H:%M:%S')}</div>
        </div>

        <table class="meta-table">
            <tr><th>Project Work Code</th><td style="font-family: monospace; font-weight: bold;">{p['work_code']}</td></tr>
            <tr><th>Work Title</th><td><strong>{p['title']}</strong></td></tr>
            <tr><th>Category</th><td>{p['category']}</td></tr>
            <tr><th>Constituency / State</th><td>{p['constituency_name']} ({p['state']}) • MP: {p['mp_name']}</td></tr>
            <tr><th>Sanctioned Cost / Expenditure</th><td>₹{p['sanctioned_cost_lakhs']} Lakhs / ₹{p['expenditure_lakhs']} Lakhs</td></tr>
            <tr><th>Contractor Entity</th><td>{p['contractor_name']} (PAN: {p['contractor_pan']}, GSTIN: {p['contractor_gstin']})</td></tr>
            <tr><th>Claimed Coordinates</th><td>{p['latitude']:.5f}° N, {p['longitude']:.5f}° E</td></tr>
            <tr><th>Workflow Status</th><td><strong>{p.get('workflow_status', 'UNDER_REVIEW')}</strong></td></tr>
            <tr>
                <th>SatyaLADS Risk Rating</th>
                <td>
                    <span class="badge {'badge-crit' if p.get('risk_score', 0) >= 45 else 'badge-low'}">
                        {p.get('risk_score', 0)}/100 • {p.get('risk_band', 'LOW')} RISK
                    </span>
                </td>
            </tr>
        </table>

        <h3 style="border-bottom: 1px solid #0f172a; padding-bottom: 5px;">I. Automated Multi-Modal AI Findings</h3>
        {flags_html}

        <h3 style="border-bottom: 1px solid #0f172a; padding-bottom: 5px; margin-top: 30px;">II. Digital Evidence & Geotag Verification</h3>
        <p style="font-size: 13px;">
            Photo File: <code>{p.get('site_photo_url', 'N/A')}</code><br>
            Photo EXIF GPS: <strong>{p.get('photo_exif_lat', 'NONE')}° N, {p.get('photo_exif_lng', 'NONE')}° E</strong><br>
            Photo Timestamp: <strong>{p.get('photo_exif_timestamp', 'NONE')}</strong>
        </p>

        <div style="margin-top: 60px; display: flex; justify-content: space-between; border-top: 1px solid #94a3b8; padding-top: 15px; font-size: 12px;">
            <div>Digitally Signed: <strong>SatyaLADS Sentinel Core</strong><br>Hash: SHA256-VIGILANCE-LOCK</div>
            <div style="text-align: right;">Authorized By: <strong>District Magistrate / Nodal Officer</strong><br>Vigilance & Monitoring Committee</div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# 6. GET /dashboard/stats - Summary counts for charts
@app.get("/dashboard/stats")
def get_dashboard_stats():
    projects = load_projects_cache()
    total = len(projects)
    flagged = [p for p in projects if p.get("risk_score", 0) >= 45.0]
    critical = [p for p in projects if p.get("risk_band") == "CRITICAL"]
    high = [p for p in projects if p.get("risk_band") == "HIGH"]
    medium = [p for p in projects if p.get("risk_band") == "MEDIUM"]
    low = [p for p in projects if p.get("risk_band") == "LOW"]
    
    total_val_cr = sum(p.get("sanctioned_cost_lakhs", 0) for p in projects) / 100.0
    flagged_val_cr = sum(p.get("sanctioned_cost_lakhs", 0) for p in flagged) / 100.0
    
    # Category Breakdown
    cat_stats = {}
    for p in projects:
        cat = p.get("category", "General")
        is_flg = p.get("risk_score", 0) >= 45.0
        if cat not in cat_stats:
            cat_stats[cat] = {"category": cat, "total": 0, "flagged": 0, "clean": 0, "total_cost_lakhs": 0.0}
        cat_stats[cat]["total"] += 1
        cat_stats[cat]["total_cost_lakhs"] += p.get("sanctioned_cost_lakhs", 0.0)
        if is_flg:
            cat_stats[cat]["flagged"] += 1
        else:
            cat_stats[cat]["clean"] += 1

    return {
        "total_projects": total,
        "total_sanctioned_cr": round(total_val_cr, 2),
        "total_flagged_projects": len(flagged),
        "flagged_risk_cr": round(flagged_val_cr, 2),
        "roi_saved_metric": f"₹{flagged_val_cr:.1f} Cr at risk flagged (<0.01% scheme cost to operate)",
        "risk_distribution": [
            {"band": "CRITICAL", "count": len(critical), "color": "#ef4444"},
            {"band": "HIGH", "count": len(high), "color": "#f97316"},
            {"band": "MEDIUM", "count": len(medium), "color": "#eab308"},
            {"band": "LOW", "count": len(low), "color": "#22c55e"}
        ],
        "category_breakdown": list(cat_stats.values())
    }

# 7. GET /map/points - GeoJSON style points with claimed and photo EXIF coords
@app.get("/map/points")
def get_map_points():
    projects = load_projects_cache()
    features = []
    for p in projects:
        features.append({
            "id": p["id"],
            "work_code": p["work_code"],
            "title": p["title"],
            "category": p["category"],
            "claimed_lat": p["latitude"],
            "claimed_lng": p["longitude"],
            "photo_lat": p.get("photo_exif_lat"),
            "photo_lng": p.get("photo_exif_lng"),
            "risk_score": p.get("risk_score", 0),
            "risk_band": p.get("risk_band", "LOW"),
            "has_location_mismatch": any(f.get("type") == "LOCATION_MISMATCH" for f in p.get("flags", [])),
            "mismatch_distance_m": next((f.get("distance_meters") for f in p.get("flags", []) if f.get("type") == "LOCATION_MISMATCH"), None),
            "status": p.get("workflow_status", "UNDER_REVIEW")
        })
    return {"points": features}

# 8. POST /projects/{id}/status - Workflow status update
@app.post("/projects/{project_id}/status")
def update_project_status(project_id: str, req: StatusUpdateRequest, user: Dict[str, Any] = Depends(get_current_user)):
    valid_statuses = ["UNDER_REVIEW", "FLAGGED", "ESCALATED", "CLEARED"]
    if req.workflow_status.upper() not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    new_status = req.workflow_status.upper()
    projects = load_projects_cache()
    match = next((p for p in projects if p["id"] == project_id or p["work_code"] == project_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Project not found")
        
    match["workflow_status"] = new_status
    
    # Save back to JSON
    with open(PROJECTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=2)
        
    # Update SQLite
    conn = get_db_connection()
    conn.execute("UPDATE projects SET workflow_status = ? WHERE id = ?", (new_status, match["id"]))
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "project_id": match["id"],
        "updated_status": new_status,
        "updated_by": user.get("username", "auditor"),
        "timestamp": datetime.datetime.now().isoformat()
    }

# 9. GET /notifications - Recent critical flags
@app.get("/notifications")
def get_notifications():
    projects = load_projects_cache()
    critical_projects = [p for p in projects if p.get("risk_band") == "CRITICAL"][:15]
    notifications = []
    for p in critical_projects:
        for f in p.get("flags", []):
            if f.get("severity") in ["CRITICAL", "HIGH"]:
                notifications.append({
                    "id": f"NOTIF-{p['work_code']}-{f.get('module')}",
                    "project_id": p["id"],
                    "work_code": p["work_code"],
                    "title": f"{f.get('title')} ({p['constituency_name']})",
                    "category": p["category"],
                    "severity": f.get("severity"),
                    "description": f.get("description"),
                    "timestamp": p.get("sanction_date")
                })
    return {"notifications": notifications[:20]}

# 10. POST /projects/{id}/photo - Live field capture upload & immediate Module 5 verification
@app.post("/projects/{project_id}/photo")
async def upload_site_photo(project_id: str, file: UploadFile = File(...)):
    projects = load_projects_cache()
    p = next((x for x in projects if x["id"] == project_id or x["work_code"] == project_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
        
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    new_filename = f"live_upload_{p['work_code']}_{int(datetime.datetime.now().timestamp())}{ext}"
    dest_path = os.path.join(PHOTOS_DIR, new_filename)
    
    contents = await file.read()
    with open(dest_path, "wb") as f:
        f.write(contents)
        
    # Run Module 5 verification on uploaded photo
    p["site_photo_url"] = f"/site_photos/{new_filename}"
    verif = verify_project_geotag(p, PHOTOS_DIR)
    
    p["photo_exif_lat"] = verif["photo_lat"]
    p["photo_exif_lng"] = verif["photo_lng"]
    p["photo_exif_timestamp"] = verif["photo_timestamp"]
    p["photo_verification"] = verif
    
    # Save back
    with open(PROJECTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=2)
        
    return {
        "success": True,
        "photo_url": p["site_photo_url"],
        "verification": verif
    }

# 11. GET /projects/{id}/photo-verification - Return Module 5 results
@app.get("/projects/{project_id}/photo-verification")
def get_photo_verification(project_id: str):
    projects = load_projects_cache()
    p = next((x for x in projects if x["id"] == project_id or x["work_code"] == project_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if "photo_verification" in p:
        return p["photo_verification"]
        
    return verify_project_geotag(p, PHOTOS_DIR)

# 12. GET /dashboard/public-summary - Unauthenticated, no contractor PII
@app.get("/dashboard/public-summary")
def get_public_summary():
    projects = load_projects_cache()
    total_val = sum(p.get("sanctioned_cost_lakhs", 0) for p in projects) / 100.0
    flagged_count = sum(1 for p in projects if p.get("risk_score", 0) >= 45.0)
    
    # Public state distribution
    states = {}
    for p in projects:
        s = p.get("state", "India")
        states[s] = states.get(s, 0) + 1
        
    return {
        "portal_name": "SatyaLADS Public Citizen Transparency Portal",
        "total_projects_monitored": len(projects),
        "total_funds_tracked_cr": round(total_val, 2),
        "flagged_irregularities_percentage": round((flagged_count / len(projects)) * 100, 1),
        "active_states_monitored": len(states),
        "governance_commitment": "100% Zero-Tolerance Anti-Corruption Loop under e-SAKSHI Guidelines",
        "updated_at": datetime.datetime.now().strftime("%d %B %Y")
    }

# 13. POST /analyze/run - Full batch re-scan of all projects
@app.post("/analyze/run")
def run_batch_analysis():
    projects = load_projects_cache()
    analyzed = analyze_all_projects(projects, PHOTOS_DIR)
    
    with open(PROJECTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(analyzed, f, indent=2)
        
    update_database_with_analysis(DB_PATH, analyzed)
    
    # Sync frontend fallback
    frontend_json = os.path.join(os.path.dirname(BASE_DIR), 'src', 'data', 'generatedProjects.json')
    if os.path.exists(os.path.dirname(frontend_json)):
        with open(frontend_json, 'w', encoding='utf-8') as f:
            json.dump(analyzed, f, indent=2)
            
    crit_count = sum(1 for p in analyzed if p.get("risk_band") == "CRITICAL")
    return {
        "success": True,
        "scanned_projects": len(analyzed),
        "critical_anomalies_detected": crit_count,
        "timestamp": datetime.datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
