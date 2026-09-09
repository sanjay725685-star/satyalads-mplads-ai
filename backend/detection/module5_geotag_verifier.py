"""
Module 5: Geo-Tagged Photo Verification (Headline Feature)
Extracts embedded GPS EXIF coordinates via Pillow / piexif.
Computes Haversine distance vs claimed location (>500m mismatch).
Flags missing EXIF GPS data and timestamp chronology anomalies.
"""
import math
import os
import datetime
from typing import Dict, Any, Optional
from PIL import Image
import piexif

def haversine_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def extract_exif_gps_and_time(photo_path: str) -> Dict[str, Any]:
    """Extracts decoded lat, lng, and timestamp from image EXIF using piexif."""
    if not os.path.exists(photo_path):
        return {"has_exif": False, "has_gps": False, "lat": None, "lng": None, "timestamp": None}
        
    try:
        exif_dict = piexif.load(photo_path)
        gps = exif_dict.get("GPS", {})
        if not gps or piexif.GPSIFD.GPSLatitude not in gps or piexif.GPSIFD.GPSLongitude not in gps:
            return {"has_exif": True, "has_gps": False, "lat": None, "lng": None, "timestamp": None}
            
        lat_tuple = gps[piexif.GPSIFD.GPSLatitude]
        lat_ref = gps.get(piexif.GPSIFD.GPSLatitudeRef, b'N').decode() if isinstance(gps.get(piexif.GPSIFD.GPSLatitudeRef, b'N'), bytes) else gps.get(piexif.GPSIFD.GPSLatitudeRef, 'N')
        lat = (lat_tuple[0][0] / lat_tuple[0][1]) + ((lat_tuple[1][0] / lat_tuple[1][1]) / 60.0) + ((lat_tuple[2][0] / lat_tuple[2][1]) / 3600.0)
        if lat_ref == 'S': lat = -lat
        
        lng_tuple = gps[piexif.GPSIFD.GPSLongitude]
        lng_ref = gps.get(piexif.GPSIFD.GPSLongitudeRef, b'E').decode() if isinstance(gps.get(piexif.GPSIFD.GPSLongitudeRef, b'E'), bytes) else gps.get(piexif.GPSIFD.GPSLongitudeRef, 'E')
        lng = (lng_tuple[0][0] / lng_tuple[0][1]) + ((lng_tuple[1][0] / lng_tuple[1][1]) / 60.0) + ((lng_tuple[2][0] / lng_tuple[2][1]) / 3600.0)
        if lng_ref == 'W': lng = -lng
        
        # Timestamp
        dt_str = None
        exif_sub = exif_dict.get("Exif", {})
        if piexif.ExifIFD.DateTimeOriginal in exif_sub:
            raw_dt = exif_sub[piexif.ExifIFD.DateTimeOriginal]
            dt_str = raw_dt.decode() if isinstance(raw_dt, bytes) else str(raw_dt)
            
        return {
            "has_exif": True,
            "has_gps": True,
            "lat": round(lat, 5),
            "lng": round(lng, 5),
            "timestamp": dt_str
        }
    except Exception as e:
        return {"has_exif": False, "has_gps": False, "lat": None, "lng": None, "timestamp": None}

def verify_project_geotag(project: Dict[str, Any], photos_dir: str) -> Dict[str, Any]:
    """Runs Module 5 on a single project."""
    photo_url = project.get("site_photo_url", "")
    rel_name = os.path.basename(photo_url) if photo_url else ""
    photo_path = os.path.join(photos_dir, rel_name) if rel_name else ""
    
    exif_data = extract_exif_gps_and_time(photo_path)
    
    flags = []
    has_gps = exif_data["has_gps"]
    photo_lat = exif_data["lat"]
    photo_lng = exif_data["lng"]
    photo_time = exif_data["timestamp"]
    
    dist_m = None
    if not has_gps:
        flags.append({
            "module": "GEOTAG_VERIFICATION",
            "type": "MISSING_GEO_DATA",
            "severity": "HIGH",
            "confidence": 0.95,
            "title": "Missing Embedded EXIF Geo-Data",
            "description": (
                "Site photo contains no embedded GPS coordinates. Indicates an unverified camera, "
                "screenshot, stock photo, or deliberately stripped metadata."
            ),
            "metric_cited": "EXIF GPS Tags: NONE FOUND",
            "gfr_citation": "MoSPI e-SAKSHI Geotag Mandate Clause 4.2 / GFR Rule 144"
        })
    else:
        dist_m = haversine_distance_m(project["latitude"], project["longitude"], photo_lat, photo_lng)
        
        # Location mismatch (>500m)
        if dist_m > 500.0:
            severity = "CRITICAL" if dist_m > 2000.0 else "HIGH"
            flags.append({
                "module": "GEOTAG_VERIFICATION",
                "type": "LOCATION_MISMATCH",
                "severity": severity,
                "confidence": 0.98,
                "title": f"Site Photo Location Mismatch ({dist_m:.0f}m Deviation)",
                "description": (
                    f"Embedded photo GPS ({photo_lat:.4f}° N, {photo_lng:.4f}° E) is {dist_m:.0f}m away from "
                    f"claimed project location ({project['latitude']:.4f}° N, {project['longitude']:.4f}° E). "
                    f"Exceeds 500m regulatory tolerance. Photo was taken at a different location."
                ),
                "metric_cited": f"Measured Deviation: {dist_m:.1f}m > 500m threshold",
                "distance_meters": round(dist_m, 1),
                "photo_coordinates": {"lat": photo_lat, "lng": photo_lng},
                "claimed_coordinates": {"lat": project["latitude"], "lng": project["longitude"]},
                "gfr_citation": "MoSPI e-SAKSHI Spatial Verification Guidelines Para 5.1"
            })
            
        # Timestamp anomaly check
        s_date_str = project.get("sanction_date")
        if photo_time and s_date_str:
            try:
                # photo_time format: "YYYY:MM:DD HH:MM:SS"
                p_dt = datetime.datetime.strptime(photo_time[:10], "%Y:%m:%d").date()
                s_dt = datetime.date.fromisoformat(s_date_str[:10])
                diff_days = abs((p_dt - s_dt).days)
                if diff_days > 120:
                    flags.append({
                        "module": "GEOTAG_VERIFICATION",
                        "type": "TIMESTAMP_ANOMALY",
                        "severity": "MEDIUM",
                        "confidence": 0.88,
                        "title": "Photo Timestamp Chronology Mismatch",
                        "description": (
                            f"Photo capture date ({p_dt.isoformat()}) differs by {diff_days} days from "
                            f"project sanction date ({s_dt.isoformat()}). Photo may predate project approval."
                        ),
                        "metric_cited": f"Chronological Discrepancy: {diff_days} days > 120 days threshold",
                        "photo_date": p_dt.isoformat(),
                        "sanction_date": s_dt.isoformat(),
                        "gfr_citation": "e-SAKSHI Audit Trail Standards Rule 7"
                    })
            except Exception:
                pass
                
    return {
        "project_id": project["id"],
        "has_gps": has_gps,
        "photo_lat": photo_lat,
        "photo_lng": photo_lng,
        "photo_timestamp": photo_time,
        "distance_meters": round(dist_m, 1) if dist_m is not None else None,
        "is_verified": len(flags) == 0,
        "flags": flags
    }
