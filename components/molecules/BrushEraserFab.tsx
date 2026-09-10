import React, { useState } from 'react';
import {
  Eraser,
  Circle,
  Square,
  Sparkles,
  Minus,
  Plus,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { BrushShape } from '../../lib/sandspiel/types';

export interface BrushEraserFabProps {
  brushSize: number;
  brushShape: BrushShape;
  isEraser: boolean;
  onBrushSizeChange: (delta: number) => void;
  onSetBrushSize?: (size: number) => void;
  onCycleBrushShape: () => void;
  onToggleEraser: () => void;
  className?: string;
}

const BRUSH_SIZE_PRESETS = [1, 3, 6, 12, 20];

export const BrushEraserFab: React.FC<BrushEraserFabProps> = ({
  brushSize,
  brushShape,
  isEraser,
  onBrushSizeChange,
  onSetBrushSize,
  onCycleBrushShape,
  onToggleEraser,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderShapeIcon = () => {
    if (brushShape === 'square') return <Square className="w-3.5 h-3.5 text-emerald-400" />;
    if (brushShape === 'spray') return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    return <Circle className="w-3.5 h-3.5 text-cyan-400" />;
  };

  return (
    <div
      id="brush-eraser-fab-container"
      className={`absolute bottom-3 right-3 z-30 flex flex-col items-end gap-2 select-none ${className}`}
    >
      {/* Floating Settings Popover */}
      {isOpen && (
        <div
          id="brush-settings-popover"
          className="w-56 p-3 bg-[#131726]/95 backdrop-blur-md border border-[#273048] rounded-2xl shadow-2xl flex flex-col gap-3 font-mono animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between text-xs text-[#9eb0d6]">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              Brush Size & Shape
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-md text-[#7887aa] hover:text-white hover:bg-white/10"
              title="Close settings"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Shape Selector */}
          <div className="flex items-center justify-between gap-1 p-1 bg-[#0b0e18] rounded-xl border border-[#1e2538]">
            <button
              type="button"
              onClick={onCycleBrushShape}
              className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs hover:bg-white/5 active:scale-95 transition-all text-[#c5d2f0]"
              title="Cycle shape: Circle / Square / Spray"
            >
              {renderShapeIcon()}
              <span className="capitalize text-[11px] font-medium">{brushShape}</span>
            </button>
          </div>

          {/* Size Stepper */}
          <div className="flex items-center justify-between gap-2 bg-[#0b0e18] p-1.5 rounded-xl border border-[#1e2538]">
            <button
              type="button"
              onClick={() => onBrushSizeChange(-1)}
              disabled={brushSize <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#192033] hover:bg-[#232c45] active:scale-90 text-[#c5d2f0] disabled:opacity-30 disabled:pointer-events-none"
              title="Decrease brush size"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-blue-300">{brushSize}px</span>
              <span className="text-[9px] text-[#6d7b9e] uppercase">Radius</span>
            </div>

            <button
              type="button"
              onClick={() => onBrushSizeChange(1)}
              disabled={brushSize >= 25}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#192033] hover:bg-[#232c45] active:scale-90 text-[#c5d2f0] disabled:opacity-30 disabled:pointer-events-none"
              title="Increase brush size"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fast Preset Chips */}
          {onSetBrushSize && (
            <div className="flex items-center justify-between gap-1 pt-0.5">
              {BRUSH_SIZE_PRESETS.map((preset) => {
                const isSelected = brushSize === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onSetBrushSize(preset)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#181d2e] text-[#8695bc] hover:text-white hover:bg-[#222a42]'
                    }`}
                  >
                    {preset}px
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Floating Action Buttons Dock */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0f1322]/90 backdrop-blur-md border border-[#262f48] rounded-full shadow-2xl">
        {/* Quick Eraser Toggle FAB */}
        <button
          id="fab-eraser-btn"
          type="button"
          onClick={onToggleEraser}
          title={isEraser ? 'Eraser is active (Tap to switch to brush)' : 'Equip eraser'}
          className={`h-9 px-3 flex items-center gap-1.5 rounded-full font-mono text-xs font-semibold transition-all active:scale-95 ${
            isEraser
              ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
              : 'bg-[#181f33] text-[#9eb0d6] hover:text-white hover:bg-[#222b45]'
          }`}
        >
          <Eraser className="w-4 h-4" />
          <span className="text-[11px]">{isEraser ? 'Erasing' : 'Eraser'}</span>
        </button>

        {/* Brush Size / Settings FAB */}
        <button
          id="fab-brush-settings-btn"
          type="button"
          onClick={handleToggleOpen}
          title="Open brush size & shape controls"
          className={`h-9 px-2.5 flex items-center gap-1.5 rounded-full font-mono text-xs transition-all active:scale-95 ${
            isOpen
              ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]'
              : 'bg-[#181f33] text-[#9eb0d6] hover:text-white hover:bg-[#222b45]'
          }`}
        >
          {renderShapeIcon()}
          <span className="text-[11px] font-bold text-blue-300">{brushSize}px</span>
        </button>
      </div>
    </div>
  );
};
