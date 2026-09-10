import React from 'react';
import { Pencil } from 'lucide-react';
import { ElementDefinition } from '../../lib/sandspiel/types';
import { ColorSwatch } from '../atoms/ColorSwatch';

export interface ElementCardProps {
  element: ElementDefinition;
  isSelected: boolean;
  onSelect: (el: ElementDefinition) => void;
  onEditCustom?: (el: ElementDefinition) => void;
}

export const ElementCard: React.FC<ElementCardProps> = ({
  element,
  isSelected,
  onSelect,
  onEditCustom,
}) => {
  const isCustomElement = Boolean(element.isCustom);
  const canEdit = isCustomElement && Boolean(onEditCustom);

  return (
    <div
      id={`element-btn-${element.key}`}
      onClick={() => onSelect(element)}
      className={`group relative flex items-center gap-2 p-1.5 rounded-md cursor-pointer transition-all border select-none ${
        isSelected
          ? 'bg-[#252c42] border-blue-400 shadow-[0_0_12px_rgba(79,142,255,0.25)]'
          : 'bg-[#181b26]/90 border-[#262c3e] hover:bg-[#202536] hover:border-[#3a435e]'
      }`}
      title={`${element.name} (${element.category}): ${element.description}`}
    >
      <ColorSwatch color={element.color} size="lg" />

      <div className="flex flex-col min-w-0 flex-1 leading-none">
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono font-medium text-[#e4e7f5] truncate">
            {element.name}
          </span>
          {isCustomElement && (
            <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Custom
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-[#7b839f] capitalize mt-0.5 truncate">
          {element.state}
        </span>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditCustom?.(element);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-cyan-300 transition-opacity"
          title="Edit properties"
        >
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
