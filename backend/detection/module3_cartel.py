"""
Module 3: Contractor Cartel / Collusion Detection
NetworkX graph analysis: Nodes = contractors & credentials; Edges = shared PAN, GSTIN, Address, Phone.
"""
from typing import List, Dict, Any
import networkx as nx

def run_cartel_detection(projects: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    flags_by_project: Dict[str, List[Dict[str, Any]]] = {p["id"]: [] for p in projects}
    
    G = nx.Graph()
    
    # Track contractor details
    contractor_projects: Dict[str, List[Dict[str, Any]]] = {}
    
    for p in projects:
        c_name = p.get("contractor_name")
        if not c_name:
            continue
        contractor_projects.setdefault(c_name, []).append(p)
        
        c_node = f"CONTRACTOR:{c_name}"
        G.add_node(c_node, type="contractor", name=c_name)
        
        pan = p.get("contractor_pan")
        if pan:
            pan_node = f"PAN:{pan}"
            G.add_node(pan_node, type="pan", value=pan)
            G.add_edge(c_node, pan_node, rel="SHARED_PAN")
            
        gstin = p.get("contractor_gstin")
        if gstin:
            gstin_node = f"GSTIN:{gstin}"
            G.add_node(gstin_node, type="gstin", value=gstin)
            G.add_edge(c_node, gstin_node, rel="SHARED_GSTIN")
            
        phone = p.get("contractor_phone")
        if phone:
            phone_node = f"PHONE:{phone}"
            G.add_node(phone_node, type="phone", value=phone)
            G.add_edge(c_node, phone_node, rel="SHARED_PHONE")
            
        addr = p.get("contractor_address")
        if addr:
            addr_node = f"ADDR:{addr}"
            G.add_node(addr_node, type="address", value=addr)
            G.add_edge(c_node, addr_node, rel="SHARED_ADDRESS")
            
    # Connected components
    components = list(nx.connected_components(G))
    cartel_clusters: List[Dict[str, Any]] = []
    
    for comp in components:
        contractors = [node.replace("CONTRACTOR:", "") for node in comp if node.startswith("CONTRACTOR:")]
        if len(contractors) >= 2:
            shared_pans = [node.replace("PAN:", "") for node in comp if node.startswith("PAN:")]
            shared_gstins = [node.replace("GSTIN:", "") for node in comp if node.startswith("GSTIN:")]
            shared_phones = [node.replace("PHONE:", "") for node in comp if node.startswith("PHONE:")]
            shared_addrs = [node.replace("ADDR:", "") for node in comp if node.startswith("ADDR:")]
            
            subg = G.subgraph(comp)
            degree_cent = nx.degree_centrality(subg)
            
            cluster_info = {
                "contractors": contractors,
                "shared_pans": shared_pans,
                "shared_gstins": shared_gstins,
                "shared_phones": shared_phones,
                "shared_addrs": shared_addrs,
                "cluster_size": len(contractors)
            }
            cartel_clusters.append(cluster_info)
            
            # Flag all projects associated with these contractors
            for c_name in contractors:
                related_others = [c for c in contractors if c != c_name]
                shared_attrs = []
                if shared_pans: shared_attrs.append(f"PAN ({shared_pans[0]})")
                if shared_gstins: shared_attrs.append(f"GSTIN ({shared_gstins[0]})")
                if shared_phones: shared_attrs.append(f"Phone ({shared_phones[0]})")
                if shared_addrs: shared_attrs.append(f"Address ({shared_addrs[0]})")
                
                shared_str = ", ".join(shared_attrs) if shared_attrs else "registration credentials"
                
                c_projs = contractor_projects.get(c_name, [])
                for proj in c_projs:
                    flag = {
                        "module": "CARTEL_COLLUSION",
                        "severity": "CRITICAL",
                        "confidence": 0.96,
                        "title": "Contractor Bidding Cartel / Common Ownership Ring",
                        "description": (
                            f"Contractor '{c_name}' shares {shared_str} with "
                            f"{', '.join(related_others[:2])}. Represents a single entity bidding under distinct corporate names."
                        ),
                        "metric_cited": f"Graph Cluster Size: {len(contractors)} entities | Shared: {shared_str}",
                        "cartel_members": contractors,
                        "shared_attributes": shared_attrs,
                        "gfr_citation": "Competition Act 2002 Section 3(3) / GFR Rule 153 (Anti-Cartelization Clause)"
                    }
                    flags_by_project[proj["id"]].append(flag)
                    
    return flags_by_project
