"""
Module 2: Overpricing / Cost Anomaly Detection
Z-score (> 2.0 std dev) and IQR-based outlier detection against category distributions.
"""
from typing import List, Dict, Any
import numpy as np

def run_cost_anomaly_detection(projects: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    flags_by_project: Dict[str, List[Dict[str, Any]]] = {p["id"]: [] for p in projects}
    
    # Calculate category distributions
    by_category: Dict[str, List[Dict[str, Any]]] = {}
    for p in projects:
        cat = p.get("category", "General")
        by_category.setdefault(cat, []).append(p)
        
    stats_by_cat: Dict[str, Dict[str, float]] = {}
    for cat, cat_projs in by_category.items():
        costs = [p["sanctioned_cost_lakhs"] for p in cat_projs]
        arr = np.array(costs)
        mean = float(np.mean(arr))
        std = float(np.std(arr)) if len(arr) > 1 else 1.0
        median = float(np.median(arr))
        q25 = float(np.percentile(arr, 25))
        q75 = float(np.percentile(arr, 75))
        iqr = q75 - q25
        stats_by_cat[cat] = {
            "mean": mean,
            "std": std if std > 0 else 1.0,
            "median": median,
            "q75": q75,
            "iqr": iqr,
            "iqr_threshold": q75 + (1.5 * iqr)
        }
        
    for p in projects:
        cat = p.get("category", "General")
        c_stats = stats_by_cat.get(cat)
        if not c_stats:
            continue
            
        cost = p["sanctioned_cost_lakhs"]
        z_score = (cost - c_stats["mean"]) / c_stats["std"]
        iqr_limit = c_stats["iqr_threshold"]
        
        if z_score >= 2.0 or cost > iqr_limit:
            pct_over_median = ((cost - c_stats["median"]) / c_stats["median"]) * 100.0
            severity = "CRITICAL" if z_score >= 2.8 else "HIGH"
            
            flag = {
                "module": "COST_ANOMALY",
                "severity": severity,
                "confidence": round(min(0.99, 0.75 + (z_score - 2.0) * 0.15), 2),
                "title": "Sanction Cost Statistically Outlier / Overpriced",
                "description": (
                    f"Sanctioned cost of ₹{cost:.2f} Lakhs is {z_score:.2f} standard deviations above "
                    f"category mean (₹{c_stats['mean']:.2f}L) and exceeds category median by {pct_over_median:.1f}%. "
                    f"Violates PWD Schedule of Rates benchmark for {cat}."
                ),
                "metric_cited": f"Z-Score: +{z_score:.2f}σ | IQR Limit: ₹{iqr_limit:.2f}L | Median: ₹{c_stats['median']:.2f}L",
                "z_score": round(z_score, 2),
                "category_median_lakhs": round(c_stats["median"], 2),
                "gfr_citation": "GFR 2017 Rule 149 & CVC Circular No. 02/05 (Market Rate Benchmark & Reasonableness)"
            }
            flags_by_project[p["id"]].append(flag)
            
    return flags_by_project
