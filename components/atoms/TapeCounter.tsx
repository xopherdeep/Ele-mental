import React from 'react';

export interface TapeCounterProps {
  fps: number;
  particleCount: number;
}

export const TapeCounter: React.FC<TapeCounterProps> = ({ fps, particleCount }) => {
  const formattedCount = String(particleCount).padStart(5, '0');
  const formattedFps = String(Math.round(fps)).padStart(2, '0');

  return (
    <div
      id="tape-counter-display"
      className="hidden sm:flex items-center gap-2 bg-[#0a0c12] border border-[#23293a] px-2.5 py-1 rounded shadow-inner font-mono text-xs select-none"
      title="Simulation telemetry counter"
    >
      <div className="flex flex-col items-start leading-none">
        <span className="text-[7px] uppercase tracking-widest text-[#5d6884]">
          Index
        </span>
        <span className="text-emerald-400 font-bold tracking-wider text-[11px]">
          {formattedCount}
        </span>
      </div>

      <div className="h-4 w-px bg-[#202536]" />

      <div className="flex flex-col items-start leading-none">
        <span className="text-[7px] uppercase tracking-widest text-[#5d6884]">
          Rate
        </span>
        <span className="text-cyan-400 font-bold tracking-wider text-[11px]">
          {formattedFps} <span className="text-[8px] font-normal text-cyan-600">FPS</span>
        </span>
      </div>
    </div>
  );
};
