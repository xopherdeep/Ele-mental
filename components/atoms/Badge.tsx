import React from 'react';
import { CATEGORY_COLORS } from './theme';

export interface BadgeProps {
  label: string;
  category?: string;
  variant?: 'default' | 'outline' | 'dot';
  dotColor?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  category = 'powder',
  variant = 'default',
  dotColor,
  className = '',
}) => {
  const catStyle = CATEGORY_COLORS[category] || {
    bg: 'bg-gray-800',
    text: 'text-gray-300',
    border: 'border-gray-700',
  };

  if (variant === 'dot') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border} ${className}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor || 'currentColor' }}
        />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border} ${className}`}
    >
      {label}
    </span>
  );
};
