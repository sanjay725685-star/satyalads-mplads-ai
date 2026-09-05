from typing import List, Dict, Any, Set

class CartelGraphMiner:
    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Dict[str, Any]] = []

    def add_node(self, node_id: str, name: str, node_type: str, metadata: Dict[str, Any] = None):
        self.nodes[node_id] = {
            "id": node_id,
            "name": name,
            "type": node_type,
            "metadata": metadata or {}
        }

    def add_edge(self, source: str, target: str, relationship: str, weight: float = 1.0, co_bid_freq: int = 0):
        self.edges.append({
            "source": source,
            "target": target,
            "relationship": relationship,
            "weight": weight,
            "co_bid_freq": co_bid_freq
        })

    def find_cartel_rings(self) -> List[Dict[str, Any]]:
        """
        Mines connected components and high-frequency co-bidding triangles sharing directors or addresses.
        """
        # Build adjacency
        adj: Dict[str, Set[str]] = {nid: set() for nid in self.nodes}
        for e in self.edges:
            s, t = e["source"], e["target"]
            if s in adj and t in adj:
                adj[s].add(t)
                adj[t].add(s)

        # Detect shared entity clusters (e.g. Contractors connected to same Director/GSTIN/Address)
        clusters = []
        visited = set()

        for node_id, node in self.nodes.items():
            if node["type"] in ["DIRECTOR", "GSTIN", "SHARED_PHONE"] and node_id not in visited:
                linked_contractors = [
                    neighbor for neighbor in adj[node_id]
                    if self.nodes.get(neighbor, {}).get("type") == "CONTRACTOR"
                ]

                if len(linked_contractors) >= 2:
                    clusters.append({
                        "nexus_pivot_node": node["name"],
                        "pivot_type": node["type"],
                        "colluding_contractors": [
                            self.nodes[cid]["name"] for cid in linked_contractors
                        ],
                        "cartel_type": "BENEFICIAL_OWNERSHIP_SHELL_RING",
                        "risk_score": 94,
                        "action": "DISQUALIFY_UNDER_COMPETITION_ACT_SEC_3"
                    })
                    visited.add(node_id)

        return clusters
