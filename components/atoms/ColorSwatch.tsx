import React from 'react';

export interface ColorSwatchProps {
  color: [number, number, number];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-2.5 h-2.5 rounded-sm',
    md: 'w-3.5 h-3.5 rounded-full',
    lg: 'w-5 h-5 rounded-md',
  };

  const [r, g, b] = color;
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  return (
    <span
      id="color-swatch-atom"
      className={`inline-block shrink-0 shadow-xs border border-white/20 ${sizeClasses[size]} ${className}`}
      style={{ '--swatch-color': rgbString, backgroundColor: 'var(--swatch-color)' } as React.CSSProperties}
    />
  );
};
