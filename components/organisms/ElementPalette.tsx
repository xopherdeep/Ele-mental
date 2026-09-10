import React, { useState, useMemo } from 'react';
import { ElementDefinition, ElementCategory } from '../../lib/sandspiel/types';
import { ElementCard } from '../molecules/ElementCard';
import { Button } from '../atoms/Button';
import { Plus, Search, Layers } from 'lucide-react';

export interface ElementPaletteProps {
  elements: ElementDefinition[];
  selectedElement: ElementDefinition;
  onSelectElement: (el: ElementDefinition) => void;
  onOpenCustomElementModal: (elToEdit?: ElementDefinition) => void;
}

const CATEGORIES: { id: 'all' | ElementCategory; label: string }[] = [
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

export const ElementPalette: React.FC<ElementPaletteProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onOpenCustomElementModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | ElementCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredElements = useMemo(() => {
    return elements.filter((el) => {
      // Don't show empty air in palette
      if (el.id === 0) return false;

      // Category filter
      if (activeCategory === 'custom') {
        if (!el.isCustom) return false;
      } else if (activeCategory !== 'all' && el.category !== activeCategory) {
        return false;
      }

      // Search filter
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
  }, [elements, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col bg-[#12141e] border border-[#24293a] rounded-xl p-3 shadow-lg h-full">
      {/* Header & New Custom Element CTA */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold font-mono text-[#e4e7f5] uppercase tracking-wider">
            Elements
          </h2>
          <span className="text-[11px] font-mono text-[#6c7490] bg-[#1a1e2d] px-1.5 py-0.5 rounded">
            {elements.length - 1}
          </span>
        </div>

        <Button
          id="create-custom-element-btn"
          size="sm"
          variant="primary"
          onClick={() => onOpenCustomElementModal()}
          title="Design a brand new custom element with unique physics & chemistry"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Element</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative mb-2.5">
        <Search className="w-3.5 h-3.5 text-[#59617d] absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          id="element-search-input"
          type="text"
          placeholder="Filter elements (e.g. water, nitro)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#181b27] border border-[#282f42] rounded-md pl-8 pr-3 py-1.5 text-xs font-mono text-[#e4e7f5] placeholder-[#59617d] focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#59617d] hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all select-none ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'bg-[#181b27] text-[#868fa8] hover:text-[#e4e7f5] hover:bg-[#222736]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Elements */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 overflow-y-auto max-h-[380px] lg:max-h-[520px] pr-1 select-none">
        {filteredElements.map((el) => (
          <ElementCard
            key={el.id}
            element={el}
            isSelected={selectedElement.id === el.id}
            onSelect={onSelectElement}
            onEditCustom={onOpenCustomElementModal}
          />
        ))}

        {filteredElements.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs font-mono text-[#6c7490]">
            No elements found matching &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};
