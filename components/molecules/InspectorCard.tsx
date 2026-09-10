import React from 'react';
import { Activity, Thermometer, Box } from 'lucide-react';
import { InspectorData, SimulationStats } from '../../lib/sandspiel/types';
import { formatTemp } from '../atoms/theme';
import { ColorSwatch } from '../atoms/ColorSwatch';

export interface InspectorCardProps {
  data: InspectorData | null;
  stats: SimulationStats;
}

export const InspectorCard: React.FC<InspectorCardProps> = ({ data, stats }) => {
  const fpsColorClass =
    stats.fps >= 50
      ? 'text-emerald-400'
      : stats.fps >= 30
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-1.5 bg-[#12141d] border border-[#232839] rounded-lg text-xs font-mono text-[#8b93ad]">
      <div className="flex items-center gap-3">
        <span className="text-[#59617d] uppercase tracking-wider text-[10px]">Inspect:</span>
        {data && data.element ? (
          <div className="flex items-center gap-2">
            <ColorSwatch color={data.element.color} size="sm" />
            <span className="text-[#e4e7f5] font-semibold">{data.element.name}</span>
            <span className="text-[#68708c]">({data.element.state})</span>
            <span className="flex items-center gap-0.5 text-amber-300">
              <Thermometer className="w-3 h-3" />
              {formatTemp(data.temperature)}
            </span>
            <span className="text-[#59617d]">
              [{data.x}, {data.y}]
            </span>
          </div>
        ) : (
          <span className="text-[#59617d] italic">Hover over particles</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5" title="Active simulated particles count">
          <Box className="w-3 h-3 text-blue-400" />
          <span>Particles:</span>
          <span className="text-[#e4e7f5] font-semibold">{stats.particleCount.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1.5" title="Simulation frame rate">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>FPS:</span>
          <span className={`font-semibold ${fpsColorClass}`}>{stats.fps}</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-[#68708c]">
          <span>Thread:</span>
          <span className="text-cyan-400 font-semibold">WebWorker (Multithreaded)</span>
        </div>
      </div>
    </div>
  );
};
