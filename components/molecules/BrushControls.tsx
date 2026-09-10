import React from 'react';
import { BrushShape } from '../../lib/sandspiel/types';
import { Slider } from '../atoms/Slider';
import { Button } from '../atoms/Button';
import { Circle, Square, Sparkles, Eraser } from 'lucide-react';

export interface BrushControlsProps {
  brushSize: number;
  brushShape: BrushShape;
  isEraser: boolean;
  onSizeChange: (size: number) => void;
  onShapeChange: (shape: BrushShape) => void;
  onToggleEraser: () => void;
}

export const BrushControls: React.FC<BrushControlsProps> = ({
  brushSize,
  brushShape,
  isEraser,
  onSizeChange,
  onShapeChange,
  onToggleEraser,
}) => {
  return (
    <div className="flex items-center gap-3 bg-[#151822] border border-[#262c3e] px-3 py-1.5 rounded-lg shadow-sm">
      {/* Brush Size Slider */}
      <div className="w-32">
        <Slider
          id="brush-size-slider"
          label="Brush"
          value={brushSize}
          min={1}
          max={20}
          unit="px"
          onChange={onSizeChange}
        />
      </div>

      <div className="h-6 w-px bg-[#262c3e]" />

      {/* Shapes */}
      <div className="flex items-center gap-1">
        <Button
          id="brush-shape-circle"
          size="sm"
          variant="ghost"
          active={brushShape === 'circle' && !isEraser}
          onClick={() => onShapeChange('circle')}
          title="Round brush"
        >
          <Circle className="w-3.5 h-3.5" />
        </Button>
        <Button
          id="brush-shape-square"
          size="sm"
          variant="ghost"
          active={brushShape === 'square' && !isEraser}
          onClick={() => onShapeChange('square')}
          title="Square brush"
        >
          <Square className="w-3.5 h-3.5" />
        </Button>
        <Button
          id="brush-shape-spray"
          size="sm"
          variant="ghost"
          active={brushShape === 'spray' && !isEraser}
          onClick={() => onShapeChange('spray')}
          title="Spray / diffuse particles"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="h-6 w-px bg-[#262c3e]" />

      {/* Quick Eraser Toggle */}
      <Button
        id="tool-eraser-btn"
        size="sm"
        variant={isEraser ? 'danger' : 'ghost'}
        active={isEraser}
        onClick={onToggleEraser}
        title="Eraser tool"
      >
        <Eraser className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Eraser</span>
      </Button>
    </div>
  );
};
