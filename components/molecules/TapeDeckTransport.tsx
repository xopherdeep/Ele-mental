import React from 'react';
import {
  Square,
  ArrowUpFromLine,
  Compass,
  Flame,
  Play,
  Pause,
  StepForward,
  FastForward,
} from 'lucide-react';
import { GravityMode, ViewMode, SimulationStats } from '../../lib/sandspiel/types';
import { TapeDeckButton } from '../atoms/TapeDeckButton';
import { TapeCounter } from '../atoms/TapeCounter';

export interface TapeDeckTransportProps {
  isPaused: boolean;
  speed: number;
  gravityMode: GravityMode;
  viewMode: ViewMode;
  stats: SimulationStats;
  onTogglePause: () => void;
  onStep: () => void;
  onOpenPresets: () => void;
  onCycleSpeed: () => void;
  onClear: () => void;
  onToggleGravity: () => void;
  onToggleViewMode: () => void;
}

const GRAVITY_STATE_LABELS: Record<GravityMode, string> = {
  normal: '1G ↓',
  zero: '0G',
  inverted: 'Invert',
  right: 'Wind',
};

export const TapeDeckTransport: React.FC<TapeDeckTransportProps> = ({
  isPaused,
  speed,
  gravityMode,
  viewMode,
  stats,
  onTogglePause,
  onStep,
  onOpenPresets,
  onCycleSpeed,
  onClear,
  onToggleGravity,
  onToggleViewMode,
}) => {
  const isPlaying = !isPaused;
  const isFastSpeed = speed > 1;
  const isThermal = viewMode === 'thermal';
  const gravityState = GRAVITY_STATE_LABELS[gravityMode];
  const heatState = isThermal ? 'Thermal' : 'Normal';

  return (
    <footer
      id="tape-deck-transport-bar"
      className="w-full bg-[#0a0d16] border-t-2 border-[#2b354d] px-1 sm:px-4 py-2 sm:py-2.5 shadow-[0_-8px_20px_rgba(0,0,0,0.6)] select-none z-30 flex-shrink-0"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 sm:gap-3">
        {/* Left Hi-Fi Brand Accent */}
        <div className="hidden xl:flex flex-col items-start min-w-[70px] border-r border-[#1f263b] pr-2.5">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#8b97bc] uppercase">
            Deck 1
          </span>
          <span className="text-[8px] font-mono text-[#546080] uppercase tracking-wider mt-0.5">
            {isPlaying ? 'Running' : 'Paused'}
          </span>
        </div>

        {/* The Tape Deck Transport Piano Keys:
            1. Presets (Eject Icon)
            2. Gravity (State on bottom)
            3. Heat (State on bottom)
            4. Play (Toggle)
            5. Step
            6. Fast Forward
            7. Clear (Stop Icon) */}
        <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 max-w-3xl">
          {/* 1. PRESETS (Eject icon) */}
          <TapeDeckButton
            id="deck-presets-btn"
            label="Presets"
            icon={ArrowUpFromLine}
            accentKey="eject"
            onClick={onOpenPresets}
            title="Presets: Open scene presets library"
          />

          {/* 2. GRAVITY (Compass icon, state on bottom) */}
          <TapeDeckButton
            id="deck-gravity-btn"
            label={gravityState}
            icon={Compass}
            isActive={gravityMode !== 'normal'}
            activeColor="purple"
            accentKey="gravity"
            onClick={onToggleGravity}
            title={`Gravity: Cycle gravitational vector (Current: ${gravityState})`}
          />

          {/* 3. HEAT (Flame icon, state on bottom) */}
          <TapeDeckButton
            id="deck-heat-btn"
            label={heatState}
            icon={Flame}
            isActive={isThermal}
            activeColor="amber"
            accentKey="heat"
            onClick={onToggleViewMode}
            title={isThermal ? 'Heat: Switch to normal view' : 'Heat: Switch to thermal view'}
          />

          {/* 4. PLAY / PAUSE (Toggle) */}
          <TapeDeckButton
            id="deck-play-btn"
            label={isPlaying ? 'Pause' : 'Play'}
            icon={isPlaying ? Pause : Play}
            isActive={isPlaying}
            activeColor="emerald"
            accentKey="play"
            onClick={onTogglePause}
            title={isPlaying ? 'Click to Pause' : 'Click to Play'}
          />

          {/* 5. STEP */}
          <TapeDeckButton
            id="deck-step-btn"
            label="Step"
            icon={StepForward}
            accentKey="step"
            onClick={onStep}
            title="Step: Advance simulation 1 frame"
          />

          {/* 6. FAST FORWARD */}
          <TapeDeckButton
            id="deck-ffwd-btn"
            label={`${speed}X`}
            icon={FastForward}
            isActive={isFastSpeed}
            activeColor="blue"
            accentKey="speed"
            onClick={onCycleSpeed}
            title="Fast Forward: Cycle simulation speed (1X / 2X / 4X)"
          />

          {/* 7. CLEAR (Stop icon) */}
          <TapeDeckButton
            id="deck-clear-btn"
            label="Clear"
            icon={Square}
            accentKey="stop"
            onClick={onClear}
            title="Clear: Wipe canvas"
          />
        </div>

        {/* Right Tape Counter Telemetry */}
        <div className="hidden lg:flex items-center pl-2 border-l border-[#1f263b]">
          <TapeCounter fps={stats.fps} particleCount={stats.particleCount} />
        </div>
      </div>
    </footer>
  );
};
