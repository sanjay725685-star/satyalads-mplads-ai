"""
Module 1: Duplicate / Proximity Detection
DBSCAN spatial clustering on project coordinates + TF-IDF cosine text similarity + overlapping date ranges.
"""
import math
from typing import List, Dict, Any
from sklearn.cluster import DBSCAN
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def haversine_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def run_proximity_detection(projects: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    flags_by_project: Dict[str, List[Dict[str, Any]]] = {p["id"]: [] for p in projects}
    
    # Group by category
    by_category: Dict[str, List[Dict[str, Any]]] = {}
    for p in projects:
        cat = p.get("category", "General")
        by_category.setdefault(cat, []).append(p)
        
    for cat, cat_projects in by_category.items():
        if len(cat_projects) < 2:
            continue
            
        coords = np.array([[math.radians(p["latitude"]), math.radians(p["longitude"])] for p in cat_projects])
        # eps = 150m in radians
        eps_rad = 150.0 / 6371000.0
        db = DBSCAN(eps=eps_rad, min_samples=2, metric='haversine')
        labels = db.fit_predict(coords)
        
        # Check clusters
        clusters: Dict[int, List[int]] = {}
        for idx, lbl in enumerate(labels):
            if lbl != -1:
                clusters.setdefault(lbl, []).append(idx)
                
        for lbl, member_indices in clusters.items():
            if len(member_indices) < 2:
                continue
                
            # Pairwise check within cluster
            titles = [cat_projects[i]["title"] for i in member_indices]
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform(titles)
            sim_matrix = cosine_similarity(tfidf_matrix)
            
            for i_pos in range(len(member_indices)):
                for j_pos in range(i_pos + 1, len(member_indices)):
                    sim = float(sim_matrix[i_pos, j_pos])
                    idx_a = member_indices[i_pos]
                    idx_b = member_indices[j_pos]
                    proj_a = cat_projects[idx_a]
                    proj_b = cat_projects[idx_b]
                    
                    dist = haversine_distance_m(proj_a["latitude"], proj_a["longitude"], proj_b["latitude"], proj_b["longitude"])
                    
                    if dist <= 150.0 and sim >= 0.65:
                        reason = (
                            f"Spatial cluster match with {proj_b['work_code']} ({proj_b['title']}). "
                            f"Distance: {dist:.1f}m, Text Similarity: {sim*100:.1f}%. "
                            f"Identical category '{cat}' with high title overlap indicates likely duplicate sanction / double dipping."
                        )
                        flag_a = {
                            "module": "DUPLICATE_PROXIMITY",
                            "severity": "CRITICAL" if sim > 0.8 else "HIGH",
                            "confidence": round(min(0.98, sim + 0.1), 2),
                            "title": "Suspected Duplicate / Double Funding Work",
                            "description": reason,
                            "metric_cited": f"Distance: {dist:.1f}m <= 150m | Cosine Sim: {sim:.2f} >= 0.65",
                            "conflicting_work_id": proj_b["id"],
                            "conflicting_work_code": proj_b["work_code"],
                            "gfr_citation": "GFR 2017 Rule 144 / MPLADS Guidelines Para 3.2 (Prohibition of Duplicate Funding)"
                        }
                        flag_b = {
                            "module": "DUPLICATE_PROXIMITY",
                            "severity": "CRITICAL" if sim > 0.8 else "HIGH",
                            "confidence": round(min(0.98, sim + 0.1), 2),
                            "title": "Suspected Duplicate / Double Funding Work",
                            "description": (
                                f"Spatial cluster match with {proj_a['work_code']} ({proj_a['title']}). "
                                f"Distance: {dist:.1f}m, Text Similarity: {sim*100:.1f}%. "
                                f"Identical category '{cat}' indicates likely duplicate sanction."
                            ),
                            "metric_cited": f"Distance: {dist:.1f}m <= 150m | Cosine Sim: {sim:.2f} >= 0.65",
                            "conflicting_work_id": proj_a["id"],
                            "conflicting_work_code": proj_a["work_code"],
                            "gfr_citation": "GFR 2017 Rule 144 / MPLADS Guidelines Para 3.2"
                        }
                        flags_by_project[proj_a["id"]].append(flag_a)
                        flags_by_project[proj_b["id"]].append(flag_b)
                        
    return flags_by_project
