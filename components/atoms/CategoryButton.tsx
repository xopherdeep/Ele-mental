import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface CategoryButtonProps {
  id: string;
  label: string;
  icon: LucideIcon;
  count: number;
  isSelected: boolean;
  colorAccent?: string;
  onClick: () => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  id,
  label,
  icon: Icon,
  count,
  isSelected,
  colorAccent = 'text-blue-400',
  onClick,
}) => {
  const selectedStyle = isSelected
    ? 'bg-[#222a42] border-blue-500 text-white shadow-md'
    : 'bg-[#141724] border-[#252a3c] text-[#8e98b5] hover:text-[#e4e7f5] hover:bg-[#1c2133]';

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all select-none min-h-[44px] active:scale-95 ${selectedStyle}`}
    >
      <div className="flex items-center gap-1">
        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : colorAccent}`} />
        <span className="text-[10px] font-mono font-medium leading-tight truncate">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[9px] font-mono text-[#6c7490] leading-none">
          {count} items
        </span>
      </div>
      {isSelected && (
        <span className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      )}
    </button>
  );
};
