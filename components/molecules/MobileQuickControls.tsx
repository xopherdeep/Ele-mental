import React from 'react';
import {
  Play,
  Pause,
  StepForward,
  Trash2,
  Eraser,
  Eye,
  Flame,
  Minus,
  Plus,
  Info,
  Compass,
  Circle,
  Square,
  Sparkles,
} from 'lucide-react';
import { ViewMode, GravityMode, BrushShape } from '../../lib/sandspiel/types';

export interface MobileQuickControlsProps {
  isPaused: boolean;
  speed: number;
  gravityMode: GravityMode;
  viewMode: ViewMode;
  brushSize: number;
  brushShape: BrushShape;
  isEraser: boolean;
  showInspector: boolean;
  onTogglePause: () => void;
  onStep: () => void;
  onClear: () => void;
  onCycleSpeed: () => void;
  onToggleGravity: () => void;
  onToggleViewMode: () => void;
  onBrushSizeChange: (delta: number) => void;
  onCycleBrushShape: () => void;
  onToggleEraser: () => void;
  onToggleInspector: () => void;
}

const GRAVITY_CONFIG: Record<GravityMode, { label: string; arrow: string }> = {
  normal: { label: '1G', arrow: '↓' },
  zero: { label: '0G', arrow: '✦' },
  inverted: { label: 'Inv', arrow: '↑' },
  right: { label: 'Wind', arrow: '→' },
};

export const MobileQuickControls: React.FC<MobileQuickControlsProps> = ({
  isPaused,
  speed,
  gravityMode,
  viewMode,
  brushSize,
  brushShape,
  isEraser,
  showInspector,
  onTogglePause,
  onStep,
  onClear,
  onCycleSpeed,
  onToggleGravity,
  onToggleViewMode,
  onBrushSizeChange,
  onCycleBrushShape,
  onToggleEraser,
  onToggleInspector,
}) => {
  const isThermalView = viewMode === 'thermal';
  const gravity = GRAVITY_CONFIG[gravityMode];

  return (
    <div
      id="mobile-quick-controls"
      className="flex flex-col gap-1.5 w-full px-2 py-1.5 bg-[#121521]/95 backdrop-blur-md border border-[#22273a] rounded-xl text-xs font-mono select-none"
    >
      {/* Row 1: Simulation & Physics Engine Controls */}
      <div className="flex items-center justify-between gap-1 w-full">
        <div className="flex items-center gap-1">
          <button
            id="mobile-play-pause-btn"
            type="button"
            onClick={onTogglePause}
            className={`h-7 px-2 flex items-center gap-1 rounded-lg border transition-all active:scale-95 ${
              isPaused
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-[#1a1f30] border-[#293148] text-[#d6dbf0]'
            }`}
            title={isPaused ? 'Resume simulation' : 'Pause simulation'}
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="text-[11px] font-semibold">{isPaused ? 'Run' : 'Pause'}</span>
          </button>

          {isPaused && (
            <button
              id="mobile-step-btn"
              type="button"
              onClick={onStep}
              className="h-7 px-2 flex items-center gap-0.5 rounded-lg bg-[#1a1f30] border border-[#293148] text-[#d6dbf0] active:scale-95 transition-all"
              title="Step single frame"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span className="text-[10px]">1f</span>
            </button>
          )}

          <button
            id="mobile-speed-btn"
            type="button"
            onClick={onCycleSpeed}
            className="h-7 px-2 flex items-center justify-center rounded-lg bg-[#1a1f30] border border-[#293148] text-blue-300 active:scale-95 transition-all"
            title="Cycle simulation speed (1x, 2x, 4x)"
          >
            <span className="text-[11px] font-semibold">{speed}x</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Gravity Vector Control Button */}
          <button
            id="mobile-gravity-btn"
            type="button"
            onClick={onToggleGravity}
            className={`h-7 px-2 flex items-center gap-1 rounded-lg border active:scale-95 transition-all ${
              gravityMode !== 'normal'
                ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                : 'bg-[#1a1f30] border-[#293148] text-[#9ba4c4]'
            }`}
            title={`Cycle gravity direction (Current: ${gravity.label} ${gravity.arrow})`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold">{gravity.label}</span>
            <span className="text-[10px] text-blue-300 font-bold">{gravity.arrow}</span>
          </button>

          {/* Thermal View Toggle */}
          <button
            id="mobile-view-mode-btn"
            type="button"
            onClick={onToggleViewMode}
            className={`h-7 w-7 flex items-center justify-center rounded-lg border transition-all active:scale-95 ${
              isThermalView
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : 'bg-[#1a1f30] border-[#293148] text-[#9ba4c4]'
            }`}
            title="Toggle thermal infrared heat vision"
          >
            {isThermalView ? <Flame className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Reset / Clear */}
          <button
            id="mobile-clear-btn"
            type="button"
            onClick={onClear}
            className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1a1f30] border border-[#293148] text-[#9ba4c4] hover:text-red-400 active:scale-95 transition-all"
            title="Clear canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Brush, Shape & Inspection Tools */}
      <div className="flex items-center justify-between gap-1 w-full pt-0.5 border-t border-[#1d2233]">
        <div className="flex items-center gap-1">
          {/* Eraser Tool */}
          <button
            id="mobile-eraser-btn"
            type="button"
            onClick={onToggleEraser}
            className={`h-7 px-2 flex items-center gap-1 rounded-lg border transition-all active:scale-95 ${
              isEraser
                ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                : 'bg-[#1a1f30] border-[#293148] text-[#9ba4c4]'
            }`}
            title="Toggle eraser"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="text-[10px]">Eraser</span>
          </button>

          {/* Brush Shape Toggle */}
          <button
            id="mobile-brush-shape-btn"
            type="button"
            onClick={onCycleBrushShape}
            className="h-7 px-2 flex items-center gap-1 rounded-lg bg-[#1a1f30] border border-[#293148] text-[#9ba4c4] active:scale-95 transition-all"
            title="Cycle brush shape: Circle / Square / Spray"
          >
            {brushShape === 'circle' && <Circle className="w-3 h-3 text-cyan-400" />}
            {brushShape === 'square' && <Square className="w-3 h-3 text-emerald-400" />}
            {brushShape === 'spray' && <Sparkles className="w-3 h-3 text-amber-400" />}
            <span className="text-[10px] capitalize">{brushShape}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Brush Size Adjustment */}
          <div className="flex items-center bg-[#181c2a] border border-[#282f44] rounded-lg h-7 px-1">
            <button
              type="button"
              onClick={() => onBrushSizeChange(-1)}
              className="w-5 h-5 flex items-center justify-center rounded text-[#9ba4c4] active:bg-white/10"
              title="Decrease brush size"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono font-semibold px-1 text-blue-300 min-w-[28px] text-center">
              {brushSize}px
            </span>
            <button
              type="button"
              onClick={() => onBrushSizeChange(1)}
              className="w-5 h-5 flex items-center justify-center rounded text-[#9ba4c4] active:bg-white/10"
              title="Increase brush size"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Inspector HUD Toggle */}
          <button
            id="mobile-inspect-hud-btn"
            type="button"
            onClick={onToggleInspector}
            className={`h-7 px-2 flex items-center gap-1 rounded-lg border transition-all active:scale-95 ${
              showInspector
                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                : 'bg-[#1a1f30] border-[#293148] text-[#9ba4c4]'
            }`}
            title="Toggle particle inspector HUD"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="text-[10px]">Inspect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
