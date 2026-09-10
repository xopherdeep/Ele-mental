import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Compass, Flame, Eye } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ViewMode, GravityMode } from '../../lib/sandspiel/types';

export interface PlaybackControlsProps {
  isPaused: boolean;
  speed: number;
  viewMode: ViewMode;
  gravityMode: GravityMode;
  onTogglePause: () => void;
  onStep: () => void;
  onClear: () => void;
  onSpeedChange: (speed: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleGravity: () => void;
}

const GRAVITY_LABELS: Record<GravityMode, string> = {
  normal: '1G ↓',
  zero: '0G ✦',
  inverted: 'Inv ↑',
  right: 'Wind →',
};

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPaused,
  speed,
  viewMode,
  gravityMode,
  onTogglePause,
  onStep,
  onClear,
  onSpeedChange,
  onViewModeChange,
  onToggleGravity,
}) => {
  const isThermal = viewMode === 'thermal';

  return (
    <div className="flex flex-wrap items-center gap-2 bg-[#151822] border border-[#262c3e] px-3 py-1.5 rounded-lg shadow-sm">
      <Button
        id="sim-play-pause-btn"
        size="sm"
        variant={isPaused ? 'primary' : 'secondary'}
        onClick={onTogglePause}
        title={isPaused ? 'Resume simulation' : 'Pause simulation'}
      >
        {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
        <span>{isPaused ? 'Run' : 'Pause'}</span>
      </Button>

      <Button
        id="sim-step-btn"
        size="sm"
        variant="ghost"
        disabled={!isPaused}
        onClick={onStep}
        title="Step 1 frame forward (when paused)"
      >
        <StepForward className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Step</span>
      </Button>

      <div className="h-6 w-px bg-[#262c3e]" />

      <div className="flex items-center bg-[#0e1017] rounded border border-[#262c3e] p-0.5">
        {[1, 2, 4].map((s) => (
          <button
            key={s}
            id={`sim-speed-${s}x`}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
              speed === s ? 'bg-blue-600 text-white font-semibold' : 'text-[#858da8] hover:text-[#e4e7f5]'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-[#262c3e]" />

      <Button id="sim-gravity-toggle" size="sm" variant="ghost" onClick={onToggleGravity} title="Cycle gravity vector">
        <Compass className="w-3.5 h-3.5 text-blue-400" />
        <span>{GRAVITY_LABELS[gravityMode]}</span>
      </Button>

      <Button
        id="sim-view-mode-toggle"
        size="sm"
        variant={isThermal ? 'danger' : 'ghost'}
        active={isThermal}
        onClick={() => onViewModeChange(isThermal ? 'natural' : 'thermal')}
        title="Toggle thermal infrared heat vision"
      >
        {isThermal ? <Flame className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5 text-stone-400" />}
        <span className="hidden sm:inline">{isThermal ? 'Thermal' : 'Pixel Art'}</span>
      </Button>

      <Button id="sim-clear-canvas-btn" size="sm" variant="danger" onClick={onClear} title="Clear canvas">
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Clear</span>
      </Button>
    </div>
  );
};
