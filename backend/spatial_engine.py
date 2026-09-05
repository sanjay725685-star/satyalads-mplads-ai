import math
from typing import List, Dict, Any

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance in meters between two points on Earth.
    """
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def detect_spatial_collisions(
    mplads_works: List[Dict[str, Any]], 
    external_schemes: List[Dict[str, Any]], 
    proximity_threshold_meters: float = 30.0
) -> List[Dict[str, Any]]:
    """
    Detects double-dipping collision where an MPLADS asset is within proximity_threshold_meters
    of an existing state or central scheme project.
    """
    collisions = []
    for work in mplads_works:
        w_lat = work.get("lat")
        w_lng = work.get("lng")
        if w_lat is None or w_lng is None:
            continue

        for ext in external_schemes:
            ext_lat = ext.get("lat")
            ext_lng = ext.get("lng")
            if ext_lat is None or ext_lng is None:
                continue

            dist = haversine_distance_meters(w_lat, w_lng, ext_lat, ext_lng)
            if dist <= proximity_threshold_meters:
                # Approximate semantic match
                w_title = work.get("title", "").lower()
                ext_title = ext.get("title", "").lower()
                common_tokens = set(w_title.split()).intersection(set(ext_title.split()))
                similarity = len(common_tokens) / max(1, len(set(w_title.split())))

                collisions.append({
                    "mplads_work_id": work.get("id"),
                    "mplads_code": work.get("code"),
                    "mplads_title": work.get("title"),
                    "colliding_scheme": ext.get("scheme"),
                    "colliding_project_code": ext.get("code"),
                    "colliding_title": ext.get("title"),
                    "distance_meters": round(dist, 1),
                    "semantic_similarity_percent": round(similarity * 100, 1),
                    "duplicate_loss_lakhs": work.get("sanctioned_amount_lakhs", 0.0),
                    "verdict": "CRITICAL_DOUBLE_DIPPING_CONFIRMED" if dist < 15.0 else "HIGH_COLLISION_WARNING"
                })

    return collisions
