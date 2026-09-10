import React from 'react';
import { BookOpen, Thermometer, Info } from 'lucide-react';

export interface StudioHeaderProps {
  ambientTemp: number;
  showInspector: boolean;
  showQuickGuide: boolean;
  onAdjustAmbientTemp: (delta: number) => void;
  onToggleInspector: () => void;
  onOpenPresets?: () => void;
  onToggleGuide: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  ambientTemp,
  showInspector,
  showQuickGuide,
  onAdjustAmbientTemp,
  onToggleInspector,
  onToggleGuide,
}) => {
  return (
    <header className="bg-[#0f121d]/90 backdrop-blur-md px-3 sm:px-4 py-2 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#181d2c] flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-xs font-bold text-amber-400">
            ☤
          </span>
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-bold font-mono tracking-tight text-[#f1f3fc] flex items-center gap-1.5 sm:gap-2">
            Elemental Sandspiel
            <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400">
              Tape Studio
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Inspect Particle HUD Toggle - Borderless */}
        <button
          id="header-inspect-btn"
          type="button"
          onClick={onToggleInspector}
          title="Toggle touch and cursor element particle inspector"
          className={`h-7 sm:h-8 px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-mono transition-colors ${
            showInspector
              ? 'bg-blue-600/30 text-blue-300'
              : 'text-[#8c97b5] hover:text-white hover:bg-white/5'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Inspect</span>
        </button>

        {/* Ambient Room Temperature Controls - Borderless */}
        <div className="hidden sm:flex items-center gap-1 bg-[#161a27] px-2 py-1 rounded-md text-xs font-mono">
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[#848ea8] hidden md:inline">Room:</span>
          <span className="font-semibold text-white">{ambientTemp}°C</span>
          <div className="flex items-center ml-1 gap-0.5">
            <button
              type="button"
              onClick={() => onAdjustAmbientTemp(-5)}
              className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 text-cyan-400 text-[10px]"
              title="Cool down ambient room temp"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => onAdjustAmbientTemp(5)}
              className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 text-orange-400 text-[10px]"
              title="Heat up ambient room temp"
            >
              +
            </button>
          </div>
        </div>

        {/* Interaction Guide - Borderless */}
        <button
          id="toggle-guide-btn"
          type="button"
          onClick={onToggleGuide}
          title="Toggle interaction guide & chemical cheat sheet"
          className={`h-7 sm:h-8 px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-mono transition-colors ${
            showQuickGuide
              ? 'bg-amber-500/25 text-amber-300'
              : 'text-[#8c97b5] hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Guide</span>
        </button>
      </div>
    </header>
  );
};
