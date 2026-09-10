import React from 'react';
import { InspectorData, SimulationStats } from '../../lib/sandspiel/types';
import { ColorSwatch } from '../atoms/ColorSwatch';

export interface MobileInspectHUDProps {
  data: InspectorData | null;
  stats: SimulationStats;
  onClose: () => void;
}

export const MobileInspectHUD: React.FC<MobileInspectHUDProps> = ({
  data,
  stats,
  onClose,
}) => {
  return (
    <div className="absolute top-2 left-2 right-2 z-20 bg-[#0e111a]/95 backdrop-blur-md border border-[#22283a] rounded-xl px-3 py-2 text-xs font-mono text-[#d6dbe9] shadow-xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        {data && data.element ? (
          <>
            <ColorSwatch color={data.element.color} size="md" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-bold">
                <span>{data.element.name}</span>
                <span className="text-[10px] text-amber-400 font-normal">{data.temperature}°C</span>
              </div>
              <span className="text-[10px] text-[#7d87a5] capitalize">
                {data.element.state} • {data.element.density} kg/m³
              </span>
            </div>
          </>
        ) : (
          <span className="text-[11px] text-[#7d87a5]">
            Touch anywhere on canvas to inspect particle physics
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col text-right text-[10px] text-[#7d87a5]">
          <span>{stats.particleCount.toLocaleString()} pts</span>
          <span className="text-emerald-400 font-semibold">{stats.fps} FPS</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[#6e7795] hover:text-white p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
