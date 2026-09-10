import React from 'react';

export interface SliderProps {
  id?: string;
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 text-xs font-mono ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-[#9aa0b8]">
          <span>{label}</span>
          <span className="text-[#e4e7f5] font-semibold">
            {value}
            {unit}
          </span>
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-[#252a3d] rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
      />
    </div>
  );
};
