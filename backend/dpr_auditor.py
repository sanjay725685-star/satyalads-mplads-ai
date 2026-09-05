from typing import List, Dict, Any

# Standard CPWD District Schedule of Rates (DSR 2023) Reference Ceilings
CPWD_DSR_BENCHMARKS = {
    "excavation_soil_cum": 215.0,
    "rmc_concrete_m25_cum": 5200.0,
    "fe500_steel_kg": 68.5,
    "bitumen_vg30_tonne": 44500.0,
    "interlocking_paver_sqm": 480.0,
    "led_display_board_each": 8500.0
}

# Strictly prohibited keywords under MPLADS Guideline Rule 5.2
PROHIBITED_ASSET_KEYWORDS = [
    "temple", "mandir", "masjid", "church", "gurudwara",
    "private trust", "commercial complex", "memorial",
    "statue of political figure", "residential club"
]

def audit_dpr(
    dpr_title: str, 
    land_type: str, 
    line_items: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Audits a Detailed Project Report (DPR) against CPWD DSR ceilings and MPLADS Master Guidelines.
    """
    violations = []
    
    # Check Permissibility
    title_lower = dpr_title.lower()
    for kw in PROHIBITED_ASSET_KEYWORDS:
        if kw in title_lower:
            violations.append(f"CRITICAL: Work title references prohibited asset category ('{kw}') under Rule 5.2.")
            
    if land_type.upper() in ["PRIVATE_TRUST", "COMMERCIAL"]:
        violations.append(f"CRITICAL: Non-public land ownership ('{land_type}'). MPLADS funds barred for private entities.")

    total_claimed = 0.0
    total_permissible = 0.0
    flagged_items = []

    for item in line_items:
        desc = item.get("description", "")
        qty = float(item.get("quantity", 0.0))
        claimed_rate = float(item.get("claimed_rate", 0.0))
        dsr_rate = float(item.get("dsr_rate", 0.0))

        item_claimed_total = qty * claimed_rate
        item_permissible_total = qty * dsr_rate if dsr_rate > 0 else 0.0

        total_claimed += item_claimed_total
        total_permissible += item_permissible_total

        if dsr_rate > 0:
            markup_pct = ((claimed_rate - dsr_rate) / dsr_rate) * 100.0
            if markup_pct > 25.0:
                flagged_items.append({
                    "description": desc,
                    "claimed_rate": claimed_rate,
                    "dsr_rate": dsr_rate,
                    "markup_percent": round(markup_pct, 1),
                    "excess_inr": round(item_claimed_total - item_permissible_total, 2)
                })

    inflation_amount = max(0.0, total_claimed - total_permissible)
    overall_inflation_pct = (inflation_amount / total_permissible * 100.0) if total_permissible > 0 else 100.0

    return {
        "dpr_title": dpr_title,
        "is_permissible": len(violations) == 0,
        "guideline_violations": violations,
        "total_claimed_inr": round(total_claimed, 2),
        "total_permissible_inr": round(total_permissible, 2),
        "total_inflation_inr": round(inflation_amount, 2),
        "overall_markup_percent": round(overall_inflation_pct, 1),
        "flagged_line_items": flagged_items,
        "audit_verdict": "REJECT_OR_REVISE" if (violations or overall_inflation_pct > 25.0) else "APPROVED"
    }
