import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface TapeDeckButtonProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  activeColor?: 'emerald' | 'amber' | 'blue' | 'red' | 'purple';
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  accentKey?: 'play' | 'pause' | 'stop' | 'eject' | 'gravity' | 'heat' | 'step' | 'speed' | 'standard';
}

const ACCENT_COLORS: Record<string, string> = {
  stop: 'text-red-400 group-hover:text-red-300',
  eject: 'text-orange-400 group-hover:text-orange-300',
  gravity: 'text-purple-400 group-hover:text-purple-300',
  heat: 'text-amber-400 group-hover:text-amber-300',
  play: 'text-emerald-400 group-hover:text-emerald-300',
  pause: 'text-amber-400 group-hover:text-amber-300',
  step: 'text-cyan-400 group-hover:text-cyan-300',
  speed: 'text-blue-400 group-hover:text-blue-300',
  standard: 'text-[#9eabcf] group-hover:text-[#f0f4ff]',
};

const ACTIVE_BORDERS: Record<string, string> = {
  emerald: 'border-emerald-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(16,185,129,0.25)]',
  amber: 'border-amber-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(245,158,11,0.25)]',
  blue: 'border-blue-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(59,130,246,0.25)]',
  red: 'border-red-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(239,68,68,0.25)]',
  purple: 'border-purple-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(168,85,247,0.25)]',
};

export const TapeDeckButton: React.FC<TapeDeckButtonProps> = ({
  id,
  label,
  icon: Icon,
  isActive = false,
  activeColor = 'emerald',
  disabled = false,
  onClick,
  title,
  accentKey = 'standard',
}) => {
  const accentText = ACCENT_COLORS[accentKey] || ACCENT_COLORS.standard;
  const activeGlow = ACTIVE_BORDERS[activeColor] || ACTIVE_BORDERS.emerald;

  const keySurface = isActive
    ? `bg-gradient-to-b from-[#1b2235] to-[#0f1320] ${activeGlow} translate-y-[1px]`
    : 'bg-gradient-to-b from-[#242b3e] via-[#1a2030] to-[#111521] border-[#313b56] shadow-[0_3px_0_#090b12,inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-[#45537a] active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]';

  const disabledState = disabled
    ? 'opacity-35 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title || label}
      className={`group relative flex-1 min-w-[40px] sm:min-w-[52px] max-w-[110px] h-13 sm:h-16 rounded-lg border-2 flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-0.5 sm:px-1 font-mono select-none transition-all ${keySurface} ${disabledState}`}
    >
      {/* Centered Transport Icon - no dots or extra badges */}
      <Icon
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-105 flex-shrink-0 ${
          isActive ? 'text-white' : accentText
        }`}
      />

      {/* State or Name Label Underneath */}
      <span
        className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase leading-none truncate max-w-full px-0.5 ${
          isActive ? 'text-white' : 'text-[#828faa] group-hover:text-[#c4d0ef]'
        }`}
      >
        {label}
      </span>
    </button>
  );
};
