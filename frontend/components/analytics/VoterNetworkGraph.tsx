'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { VoterMetrics } from '../../utils/analytics/dataCollector';

interface VoterNetworkGraphProps {
  voters: VoterMetrics[];
  minVoteCount?: number;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  totalVotes: number;
  avgWeight: number;
  radius: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface NetworkData {
  nodes: Node[];
  edges: Edge[];
}

const buildNetworkData = (voters: VoterMetrics[], minVoteCount: number): NetworkData => {
  const filteredVoters = voters.filter(v => v.totalVotes >= minVoteCount);
  const width = 800;
  const height = 600;

  const nodes: Node[] = filteredVoters.map((voter, index) => {
    const angle = filteredVoters.length > 0 ? (index / filteredVoters.length) * 2 * Math.PI : 0;
    const orbitRadius = Math.min(width, height) / 3;

    return {
      id: voter.address,
      x: width / 2 + Math.cos(angle) * orbitRadius,
      y: height / 2 + Math.sin(angle) * orbitRadius,
      vx: 0,
      vy: 0,
      totalVotes: voter.totalVotes,
      avgWeight: voter.averageWeight,
      radius: Math.max(5, Math.min(20, Math.sqrt(voter.totalVotes) * 2)),
    };
  });

  const edges: Edge[] = [];

  for (let i = 0; i < filteredVoters.length; i++) {
    for (let j = i + 1; j < filteredVoters.length; j++) {
      const voter1 = filteredVoters[i];
      const voter2 = filteredVoters[j];
      const sharedCategories = voter1.categories.filter(c => voter2.categories.includes(c));

      if (sharedCategories.length > 0) {
        edges.push({
          source: voter1.address,
          target: voter2.address,
          weight: sharedCategories.length,
        });
      }
    }
  }

  return { nodes, edges };
};

export default function VoterNetworkGraph({ voters, minVoteCount = 5 }: VoterNetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [viewMode, setViewMode] = useState<'influence' | 'delegation' | 'specialization'>('influence');

  const filteredVoters = useMemo(() => {
    return voters.filter(v => v.totalVotes >= minVoteCount);
  }, [voters, minVoteCount]);

  const networkData = useMemo(() => {
    return buildNetworkData(voters, minVoteCount);
  }, [voters, minVoteCount]);

  useEffect(() => {
    nodesRef.current = networkData.nodes.map(node => ({ ...node }));
    edgesRef.current = networkData.edges;
  }, [networkData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const drawFrame = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      ctx.clearRect(0, 0, width, height);

      const nextNodes = nodes.map(node => ({ ...node }));

      nextNodes.forEach(node => {
        let fx = 0;
        let fy = 0;

        nextNodes.forEach(other => {
          if (node.id === other.id) return;

          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const repulsion = -100 / (dist * dist);

          fx += (dx / dist) * repulsion;
          fy += (dy / dist) * repulsion;
        });

        edges.forEach(edge => {
          if (edge.source === node.id) {
            const target = nextNodes.find(n => n.id === edge.target);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const attraction = (dist - 100) * 0.01 * edge.weight;
              fx += (dx / dist) * attraction;
              fy += (dy / dist) * attraction;
            }
          }

          if (edge.target === node.id) {
            const source = nextNodes.find(n => n.id === edge.source);
            if (source) {
              const dx = source.x - node.x;
              const dy = source.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const attraction = (dist - 100) * 0.01 * edge.weight;
              fx += (dx / dist) * attraction;
              fy += (dy / dist) * attraction;
            }
          }
        });

        const centerX = width / 2;
        const centerY = height / 2;
        const toCenterX = centerX - node.x;
        const toCenterY = centerY - node.y;
        const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);

        if (distToCenter > width / 3) {
          fx += toCenterX * 0.001;
          fy += toCenterY * 0.001;
        }

        node.vx = (node.vx + fx) * 0.9;
        node.vy = (node.vy + fy) * 0.9;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      });

      nodesRef.current = nextNodes;

      edges.forEach(edge => {
        const source = nextNodes.find(n => n.id === edge.source);
        const target = nextNodes.find(n => n.id === edge.target);

        if (source && target) {
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = edge.weight * 0.5;
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      const maxAvgWeight = Math.max(1, ...nextNodes.map(n => n.avgWeight));

      nextNodes.forEach(node => {
        const normalizedWeight = node.avgWeight / maxAvgWeight;
        const hue = normalizedWeight * 120;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = hoveredNode?.id === node.id ? '#fff' : '#1f2937';
        ctx.lineWidth = hoveredNode?.id === node.id ? 3 : 1;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredNode, networkData]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodesRef.current.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    if (clickedNode) {
      const voter = filteredVoters.find(v => v.address === clickedNode.id);
      if (voter) {
        console.log('Voter profile:', voter);
      }
    }
  };

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hovered = nodesRef.current.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    setHoveredNode(hovered || null);
  };

  const keyInfluencers = useMemo(() => {
    return [...filteredVoters]
      .sort((a, b) => b.totalVotes * b.averageWeight - a.totalVotes * a.averageWeight)
      .slice(0, 5);
  }, [filteredVoters]);

  const independentVoters = useMemo(() => {
    const voterConnections = new Map<string, number>();

    networkData.edges.forEach(edge => {
      voterConnections.set(edge.source, (voterConnections.get(edge.source) || 0) + 1);
      voterConnections.set(edge.target, (voterConnections.get(edge.target) || 0) + 1);
    });

    return filteredVoters.filter(v => (voterConnections.get(v.address) || 0) < 2);
  }, [filteredVoters, networkData.edges]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Voter Network Graph</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connections based on voting similarity
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { value: 'influence' as const, label: 'Influence Map' },
            { value: 'delegation' as const, label: 'Delegation Chains' },
            { value: 'specialization' as const, label: 'Category Focus' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setViewMode(option.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasHover}
            className="w-full cursor-pointer"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Node size:</span>
              <span className="text-gray-900 dark:text-white">Total votes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Node color:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: 'hsl(0, 70%, 50%)' }} />
                <span className="text-gray-900 dark:text-white">Low weight</span>
                <div className="w-4 h-4 rounded ml-2" style={{ background: 'hsl(120, 70%, 50%)' }} />
                <span className="text-gray-900 dark:text-white">High weight</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-semibold mb-3">Key Influencers</h4>
            <div className="space-y-2">
              {keyInfluencers.map((voter, idx) => (
                <div key={voter.address} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">#{idx + 1}</span>
                    <span className="font-mono text-xs text-gray-900 dark:text-white">
                      {voter.address.slice(0, 8)}...
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{voter.totalVotes} votes</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-semibold mb-3">Network Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Nodes:</span>
                <span className="font-medium text-gray-900 dark:text-white">{networkData.nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Edges:</span>
                <span className="font-medium text-gray-900 dark:text-white">{networkData.edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Independent Voters:</span>
                <span className="font-medium text-gray-900 dark:text-white">{independentVoters.length}</span>
              </div>
            </div>
          </div>

          {hoveredNode && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Voter Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Address:</span>
                  <span className="font-mono text-xs text-gray-900 dark:text-white">
                    {hoveredNode.id.slice(0, 12)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Votes:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{hoveredNode.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Weight:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{hoveredNode.avgWeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
