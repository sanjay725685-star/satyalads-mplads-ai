import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  Building2, 
  UserCheck, 
  CreditCard, 
  Phone, 
  Sparkles, 
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { CARTEL_NODES, CARTEL_EDGES, CARTEL_CLUSTERS } from '../data/mockData';
import { CartelNode } from '../types';

export const CartelGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<CartelNode | null>(CARTEL_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<CartelNode | null>(null);

  // Position coordinates for nodes in interactive canvas layout
  const nodePositions: Record<string, { x: number; y: number }> = {
    'C1': { x: 260, y: 180 },
    'C2': { x: 480, y: 180 },
    'C3': { x: 370, y: 340 },
    'C4': { x: 120, y: 360 },
    'D1': { x: 370, y: 80 },
    'D2': { x: 580, y: 320 },
    'G1': { x: 370, y: 220 },
    'A1': { x: 370, y: 440 },
    'IA1': { x: 140, y: 180 },
    'B1': { x: 580, y: 140 },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const width = 720;
    const height = 500;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Edges
    CARTEL_EDGES.forEach((edge) => {
      const srcPos = nodePositions[edge.source];
      const tgtPos = nodePositions[edge.target];
      if (!srcPos || !tgtPos) return;

      const isConnectedToSelected = 
        selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

      ctx.beginPath();
      ctx.moveTo(srcPos.x, srcPos.y);
      ctx.lineTo(tgtPos.x, tgtPos.y);

      if (isConnectedToSelected) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 2]);
      } else if (edge.relationship === 'CO_BIDDER') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
      }
      ctx.stroke();

      // Draw edge label if co-bidder
      if (edge.coBidFrequency && isConnectedToSelected) {
        const midX = (srcPos.x + tgtPos.x) / 2;
        const midY = (srcPos.y + tgtPos.y) / 2;
        ctx.fillStyle = '#F59E0B';
        ctx.font = '9px monospace';
        ctx.fillText(`${edge.coBidFrequency} Co-Bids`, midX - 20, midY - 6);
      }
    });

    // Draw Nodes
    CARTEL_NODES.forEach((node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;

      // Outer glow for selected
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 22, 0, 2 * Math.PI);
        ctx.fillStyle = node.isFlagged ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)';
        ctx.fill();
      }

      // Node Circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 16, 0, 2 * Math.PI);

      if (node.type === 'CONTRACTOR') {
        ctx.fillStyle = node.isFlagged ? '#EF4444' : '#10B981';
      } else if (node.type === 'DIRECTOR') {
        ctx.fillStyle = '#F59E0B';
      } else if (node.type === 'GSTIN') {
        ctx.fillStyle = '#8B5CF6';
      } else if (node.type === 'IMPLEMENTING_AGENCY') {
        ctx.fillStyle = '#38BDF8';
      } else {
        ctx.fillStyle = '#64748B';
      }
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Node Label
      ctx.fillStyle = isSelected ? '#38BDF8' : '#CBD5E1';
      ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      
      const shortName = node.name.length > 18 ? node.name.substring(0, 16) + '...' : node.name;
      ctx.fillText(shortName, pos.x, pos.y + 26);
    });
  }, [selectedNode, hoveredNode]);

  // Handle canvas click to select node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check collision with nodes
    for (const node of CARTEL_NODES) {
      const pos = nodePositions[node.id];
      if (!pos) continue;
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (dist <= 22) {
        setSelectedNode(node);
        return;
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              Graph Neural Network (GNN) Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Tender Collusion & Nexus Mining</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Contractor Cartel & Beneficial Ownership Graph AI</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Uncovers covert bid-rigging rings, shell companies, shared directors, and common banking nodes across MPLADS tenders.
          </p>
        </div>

        {/* Ring Summary */}
        <div className="bg-[#020C1B] border border-amber-500/40 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Identified Ring</span>
            <span className="text-lg font-extrabold text-amber-400 font-mono">
              Purvanchal Cover-Bidding Nexus
            </span>
            <span className="text-[10px] text-slate-400 block">₹25.4 Cr Monopolized across 30 works</span>
          </div>
        </div>
      </div>

      {/* Main Graph & Entity Dossier Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Interactive Knowledge Graph</span>
              <span className="text-[10px] font-mono text-slate-400">(Click any node to inspect links)</span>
            </h3>
            
            {/* Graph Legend */}
            <div className="flex items-center gap-3 text-[10px] text-slate-300">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Contractor</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Director</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> PAN/GSTIN</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> IA Officer</span>
            </div>
          </div>

          {/* Interactive Canvas Container */}
          <div className="bg-[#020C1B] rounded-xl border border-[#1E3A5F] flex items-center justify-center p-2 relative overflow-hidden radar-grid">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-pointer w-full max-w-[720px] h-[480px]"
            />
          </div>
        </div>

        {/* Selected Entity Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#1E3A5F] pb-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {selectedNode.type} NODE
                  </span>
                  <h3 className="font-bold text-base text-white mt-1">{selectedNode.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-sm border ${
                  selectedNode.riskScore > 75 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  Risk: {selectedNode.riskScore}/100
                </span>
              </div>

              {/* Node Stats */}
              {selectedNode.type === 'CONTRACTOR' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#020C1B] p-3 rounded-lg border border-[#1E3A5F]">
                    <span className="text-slate-400 block">Total Works Won:</span>
                    <span className="text-lg font-bold text-white font-mono">{selectedNode.totalContractsWon}</span>
                  </div>
                  <div className="bg-[#020C1B] p-3 rounded-lg border border-[#1E3A5F]">
                    <span className="text-slate-400 block">Total Value:</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">₹{selectedNode.totalValueCrores} Cr</span>
                  </div>
                </div>
              )}

              {/* Cartel Evidence Details */}
              <div className="space-y-2 bg-[#020C1B] p-3.5 rounded-xl border border-[#1E3A5F] text-xs">
                <h4 className="font-bold text-slate-200 uppercase text-[10px] tracking-wider mb-2">
                  Graph Neural Network Anomaly Signals
                </h4>
                
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-2 text-rose-300 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Rotational Bidding: Co-bidded with Om Infra 18 times in 2 years.</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Common Director: Rakesh Kumar Singh controls both entities.</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Identical Registered Address: Office 402, Kashi Commercial Complex.</span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
                <span className="font-bold text-rose-300 block">Recommended Vigilance Action:</span>
                <p className="text-slate-300 text-[11px]">
                  Initiate Section 3 of Competition Act investigation for tender collusion. Freeze e-tendering vendor ID across district portal.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-slate-400">
              Select any graph node to inspect cartel connectivity.
            </div>
          )}

          <div className="text-[10px] text-slate-500 pt-3 border-t border-[#1E3A5F]">
            Algorithm: Louvain Community Detection + GCN Subgraph Embedding on e-Procurement Portal Data.
          </div>
        </div>
      </div>
    </div>
  );
};
