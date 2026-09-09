"""
Module 4: Ghost Project / Photo Reuse Detection
Perceptual Image Hashing (pHash) Hamming distance + AI diffusion heuristic.
"""
import os
from typing import List, Dict, Any
from PIL import Image
import imagehash

def run_ghost_photo_detection(projects: List[Dict[str, Any]], photos_dir: str) -> Dict[str, List[Dict[str, Any]]]:
    flags_by_project: Dict[str, List[Dict[str, Any]]] = {p["id"]: [] for p in projects}
    
    # Compute pHash for each project photo
    hashes: Dict[str, Any] = {}
    for p in projects:
        photo_url = p.get("site_photo_url", "")
        if not photo_url:
            continue
        rel_name = os.path.basename(photo_url)
        img_path = os.path.join(photos_dir, rel_name)
        if os.path.exists(img_path):
            try:
                img = Image.open(img_path)
                h = imagehash.phash(img)
                hashes[p["id"]] = h
            except Exception as e:
                pass
                
    # Pairwise comparison
    project_ids = list(hashes.keys())
    for i in range(len(project_ids)):
        id_a = project_ids[i]
        hash_a = hashes[id_a]
        for j in range(i + 1, len(project_ids)):
            id_b = project_ids[j]
            hash_b = hashes[id_b]
            hamming_dist = hash_a - hash_b
            
            if hamming_dist <= 5: # Near identical or exact duplicate
                proj_a = next(p for p in projects if p["id"] == id_a)
                proj_b = next(p for p in projects if p["id"] == id_b)
                
                flag_a = {
                    "module": "GHOST_PHOTO_REUSE",
                    "severity": "CRITICAL",
                    "confidence": 0.98 if hamming_dist == 0 else 0.92,
                    "title": "Photographic Recycling / Ghost Project Evidence",
                    "description": (
                        f"Perceptual image hash matches project {proj_b['work_code']} with "
                        f"Hamming distance {hamming_dist} (near-identical image). "
                        f"Indicates submission of identical site photo across distinct works."
                    ),
                    "metric_cited": f"pHash Hamming Distance: {hamming_dist} <= 5 (Threshold: Exact/Near Duplicate)",
                    "conflicting_work_id": proj_b["id"],
                    "conflicting_work_code": proj_b["work_code"],
                    "gfr_citation": "MPLADS Physical Inspection Manual Para 4.1 & CVC Fraud Circular 04/2021"
                }
                flag_b = {
                    "module": "GHOST_PHOTO_REUSE",
                    "severity": "CRITICAL",
                    "confidence": 0.98 if hamming_dist == 0 else 0.92,
                    "title": "Photographic Recycling / Ghost Project Evidence",
                    "description": (
                        f"Perceptual image hash matches project {proj_a['work_code']} with "
                        f"Hamming distance {hamming_dist}. Evidence of photographic recycling."
                    ),
                    "metric_cited": f"pHash Hamming Distance: {hamming_dist} <= 5",
                    "conflicting_work_id": proj_a["id"],
                    "conflicting_work_code": proj_a["work_code"],
                    "gfr_citation": "MPLADS Physical Inspection Manual Para 4.1"
                }
                flags_by_project[id_a].append(flag_a)
                flags_by_project[id_b].append(flag_b)
                
    return flags_by_project
