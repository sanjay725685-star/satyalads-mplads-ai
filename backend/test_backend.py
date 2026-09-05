import sys
import io

# Force UTF-8 output encoding for Windows terminals
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from spatial_engine import haversine_distance_meters, detect_spatial_collisions
from graph_engine import CartelGraphMiner
from dpr_auditor import audit_dpr

def test_all():
    print("=== [SatyaLADS Python AI Backend Test Suite] ===")

    # 1. Test Spatial Collision
    mplads_works = [
        {"id": "W002", "code": "MPLADS-VAR-0108", "title": "Solar Tube Well & Kiosk", "lat": 25.3210, "lng": 82.9810, "sanctioned_amount_lakhs": 42.0}
    ]
    external_schemes = [
        {"code": "PM-KUSUM-091", "scheme": "PMGSY/KUSUM", "title": "Solar Pump Unit", "lat": 25.32105, "lng": 82.98105}
    ]
    collisions = detect_spatial_collisions(mplads_works, external_schemes, proximity_threshold_meters=30.0)
    print(f"[+] Spatial Collisions Detected: {len(collisions)} (Distance: {collisions[0]['distance_meters']}m)")
    assert len(collisions) == 1
    assert collisions[0]["distance_meters"] < 15.0

    # 2. Test Cartel Graph Mining
    miner = CartelGraphMiner()
    miner.add_node("C1", "Shiva Buildtech", "CONTRACTOR")
    miner.add_node("C2", "Om Aqua Infra", "CONTRACTOR")
    miner.add_node("D1", "Rakesh Kumar Singh", "DIRECTOR")
    miner.add_edge("D1", "C1", "DIRECTOR_OF")
    miner.add_edge("D1", "C2", "DIRECTOR_OF")
    rings = miner.find_cartel_rings()
    print(f"[+] Cartel Rings Detected: {len(rings)} (Pivot: {rings[0]['nexus_pivot_node']})")
    assert len(rings) == 1
    assert len(rings[0]["colluding_contractors"]) == 2

    # 3. Test DPR Rate Inflation
    dpr_items = [
        {"description": "RMC Concrete M25", "quantity": 750, "claimed_rate": 7850.0, "dsr_rate": 5200.0},
        {"description": "Fe500 Steel Bars", "quantity": 12500, "claimed_rate": 92.0, "dsr_rate": 68.5}
    ]
    audit_res = audit_dpr("Construction of CC Road", "PANCHAYAT", dpr_items)
    print(f"[+] DPR Audit Result: {audit_res['audit_verdict']} (Inflation: +{audit_res['overall_markup_percent']}%, Excess: INR {audit_res['total_inflation_inr']:,})")
    assert audit_res["audit_verdict"] == "REJECT_OR_REVISE"
    assert audit_res["overall_markup_percent"] > 35.0

    print("\n✅ ALL SATYALADS BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
