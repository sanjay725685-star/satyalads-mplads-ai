"""
Master Fraud Detection Engine Orchestrator
Aggregates all 5 modules and computes Explainable Unified Risk Score (0-100).
"""
import os
import json
import sqlite3
from typing import List, Dict, Any
from .module1_proximity import run_proximity_detection
from .module2_cost_anomaly import run_cost_anomaly_detection
from .module3_cartel import run_cartel_detection
from .module4_ghost_photo import run_ghost_photo_detection
from .module5_geotag_verifier import verify_project_geotag

SEVERITY_WEIGHTS = {
    "CRITICAL": 35.0,
    "HIGH": 20.0,
    "MEDIUM": 10.0,
    "LOW": 5.0
}

def analyze_all_projects(projects: List[Dict[str, Any]], photos_dir: str) -> List[Dict[str, Any]]:
    print(f"[*] Running SatyaLADS Multi-Modal Detection Engine across {len(projects)} projects...")
    
    # 1. Run Modules 1 to 4 in batch
    m1_flags = run_proximity_detection(projects)
    m2_flags = run_cost_anomaly_detection(projects)
    m3_flags = run_cartel_detection(projects)
    m4_flags = run_ghost_photo_detection(projects, photos_dir)
    
    analyzed_projects = []
    
    for p in projects:
        p_id = p["id"]
        all_flags = []
        
        all_flags.extend(m1_flags.get(p_id, []))
        all_flags.extend(m2_flags.get(p_id, []))
        all_flags.extend(m3_flags.get(p_id, []))
        all_flags.extend(m4_flags.get(p_id, []))
        
        # Run Module 5 (Geotag)
        geo_result = verify_project_geotag(p, photos_dir)
        all_flags.extend(geo_result["flags"])
        
        # Calculate unified risk score (0 - 100)
        raw_score = sum(SEVERITY_WEIGHTS.get(f.get("severity", "LOW"), 5.0) for f in all_flags)
        
        # Multi-factor penalty
        if len(all_flags) >= 2:
            raw_score += 15.0 # Multi-anomaly correlation boost
            
        risk_score = round(min(100.0, raw_score), 1)
        
        if risk_score >= 70.0:
            risk_band = "CRITICAL"
        elif risk_score >= 45.0:
            risk_band = "HIGH"
        elif risk_score >= 20.0:
            risk_band = "MEDIUM"
        else:
            risk_band = "LOW"
            
        p_copy = dict(p)
        p_copy["risk_score"] = risk_score
        p_copy["risk_band"] = risk_band
        p_copy["flags"] = all_flags
        p_copy["photo_verification"] = geo_result
        if risk_score >= 45.0 and p_copy.get("workflow_status") == "CLEARED":
            p_copy["workflow_status"] = "FLAGGED"
            
        analyzed_projects.append(p_copy)
        
    return analyzed_projects

def update_database_with_analysis(db_path: str, analyzed_projects: List[Dict[str, Any]]):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    for p in analyzed_projects:
        flags_json = json.dumps(p.get("flags", []))
        cur.execute("""
            UPDATE projects 
            SET risk_score = ?, risk_band = ?, workflow_status = ?, flags_json = ?
            WHERE id = ?
        """, (p["risk_score"], p["risk_band"], p["workflow_status"], flags_json, p["id"]))
    conn.commit()
    conn.close()
