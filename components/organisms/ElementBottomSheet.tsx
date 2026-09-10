import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Plus, Sparkles, Layers } from 'lucide-react';
import { ElementDefinition, ElementCategory } from '../../lib/sandspiel/types';
import { SheetHandle } from '../atoms/SheetHandle';
import { ElementCard } from '../molecules/ElementCard';
import { Button } from '../atoms/Button';

export interface ElementBottomSheetProps {
  isOpen: boolean;
  category: ElementCategory | 'all';
  onCategoryChange: (cat: ElementCategory | 'all') => void;
  elements: ElementDefinition[];
  selectedElement: ElementDefinition;
  onSelectElement: (el: ElementDefinition) => void;
  onOpenCustomElementModal: (el?: ElementDefinition) => void;
  onClose: () => void;
}

const SHEET_CATEGORIES: { id: 'all' | ElementCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'powder', label: 'Powders' },
  { id: 'liquid', label: 'Liquids' },
  { id: 'gas', label: 'Gases' },
  { id: 'solid', label: 'Solids' },
  { id: 'life', label: 'Life' },
  { id: 'energy', label: 'Energy' },
  { id: 'special', label: 'Tools' },
  { id: 'custom', label: 'Custom' },
];

export const ElementBottomSheet: React.FC<ElementBottomSheetProps> = ({
  isOpen,
  category,
  onCategoryChange,
  elements,
  selectedElement,
  onSelectElement,
  onOpenCustomElementModal,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredElements = useMemo(() => {
    return elements.filter((el) => {
      if (el.id === 0) return false;

      if (category === 'custom') {
        if (!el.isCustom) return false;
      } else if (category !== 'all' && el.category !== category) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          el.name.toLowerCase().includes(q) ||
          el.category.toLowerCase().includes(q) ||
          el.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [elements, category, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (el: ElementDefinition) => {
    onSelectElement(el);
    onClose();
  };

  return (
    <div
      id="element-bottom-sheet-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end"
      onClick={onClose}
    >
      <div
        id="element-bottom-sheet-container"
        className="bg-[#10131e] border-t border-[#252b3e] rounded-t-2xl shadow-2xl max-h-[82vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHandle />

        <div className="flex items-center justify-between px-4 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold font-mono text-[#f1f3fc]">
              Element Repository
            </span>
            <span className="text-[11px] font-mono text-[#78829f] bg-[#1a1f30] px-1.5 py-0.5 rounded">
              {filteredElements.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onClose();
                onOpenCustomElementModal();
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7c86a6] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#636c8a] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="sheet-element-search-input"
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171b29] border border-[#272e42] rounded-lg pl-8 pr-8 py-1.5 text-xs font-mono text-[#e4e7f5] placeholder-[#636c8a] focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#636c8a] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 px-4 pb-2.5 overflow-x-auto no-scrollbar border-b border-[#1f2536]">
          {SHEET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'bg-[#181c2b] text-[#8690af] hover:text-white hover:bg-[#202538]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="p-3 overflow-y-auto max-h-[55vh] grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredElements.map((el) => (
            <ElementCard
              key={el.id}
              element={el}
              isSelected={selectedElement.id === el.id}
              onSelect={handleSelect}
              onEditCustom={(elToEdit) => {
                onClose();
                onOpenCustomElementModal(elToEdit);
              }}
            />
          ))}

          {filteredElements.length === 0 && (
            <div className="col-span-full py-10 text-center text-xs font-mono text-[#6c7490]">
              No elements found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
