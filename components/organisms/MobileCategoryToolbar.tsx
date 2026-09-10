import React from 'react';
import {
  Sparkles,
  Droplets,
  Cloud,
  Box,
  Sprout,
  Zap,
  Wrench,
  FlaskConical,
  ChevronUp,
  LucideIcon,
} from 'lucide-react';
import { ElementDefinition, ElementCategory } from '../../lib/sandspiel/types';
import { CategoryButton } from '../atoms/CategoryButton';
import { ColorSwatch } from '../atoms/ColorSwatch';

export interface MobileCategoryToolbarProps {
  elements: ElementDefinition[];
  selectedElement: ElementDefinition;
  onOpenCategorySheet: (category: ElementCategory | 'all') => void;
}

interface CategoryConfig {
  id: ElementCategory;
  label: string;
  icon: LucideIcon;
  accent: string;
}

const CATEGORIES_ROW_1: CategoryConfig[] = [
  { id: 'powder', label: 'Powders', icon: Sparkles, accent: 'text-amber-400' },
  { id: 'liquid', label: 'Liquids', icon: Droplets, accent: 'text-blue-400' },
  { id: 'gas', label: 'Gases', icon: Cloud, accent: 'text-cyan-400' },
  { id: 'solid', label: 'Solids', icon: Box, accent: 'text-stone-300' },
];

const CATEGORIES_ROW_2: CategoryConfig[] = [
  { id: 'life', label: 'Life', icon: Sprout, accent: 'text-emerald-400' },
  { id: 'energy', label: 'Energy', icon: Zap, accent: 'text-yellow-400' },
  { id: 'special', label: 'Tools', icon: Wrench, accent: 'text-purple-400' },
  { id: 'custom', label: 'Custom', icon: FlaskConical, accent: 'text-pink-400' },
];

export const MobileCategoryToolbar: React.FC<MobileCategoryToolbarProps> = ({
  elements,
  selectedElement,
  onOpenCategorySheet,
}) => {
  const getCategoryCount = (catId: ElementCategory): number => {
    if (catId === 'custom') {
      return elements.filter((el) => el.isCustom).length;
    }
    return elements.filter((el) => el.category === catId && el.id !== 0).length;
  };

  const isCategoryActive = (catId: ElementCategory): boolean => {
    if (catId === 'custom') {
      return Boolean(selectedElement.isCustom);
    }
    return selectedElement.category === catId;
  };

  return (
    <nav
      id="mobile-category-bottom-toolbar"
      aria-label="Element Categories"
      className="bg-[#0f121d] border-t border-[#22273b] p-2 pb-3 flex flex-col gap-1.5 shadow-2xl select-none"
    >
      <div
        id="active-element-banner"
        onClick={() => onOpenCategorySheet(selectedElement.category)}
        className="flex items-center justify-between px-2.5 py-1 bg-[#161a28] border border-[#23293c] rounded-lg cursor-pointer active:bg-[#1c2234] transition-colors"
      >
        <div className="flex items-center gap-2">
          <ColorSwatch color={selectedElement.color} size="sm" />
          <span className="text-xs font-mono font-semibold text-[#e4e7f5]">
            {selectedElement.name}
          </span>
          <span className="text-[10px] font-mono text-[#7b85a3] capitalize">
            ({selectedElement.category})
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-blue-400">
          <span>Browse All</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {CATEGORIES_ROW_1.map((cat) => (
          <CategoryButton
            key={cat.id}
            id={`toolbar-cat-${cat.id}`}
            label={cat.label}
            icon={cat.icon}
            count={getCategoryCount(cat.id)}
            isSelected={isCategoryActive(cat.id)}
            colorAccent={cat.accent}
            onClick={() => onOpenCategorySheet(cat.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {CATEGORIES_ROW_2.map((cat) => (
          <CategoryButton
            key={cat.id}
            id={`toolbar-cat-${cat.id}`}
            label={cat.label}
            icon={cat.icon}
            count={getCategoryCount(cat.id)}
            isSelected={isCategoryActive(cat.id)}
            colorAccent={cat.accent}
            onClick={() => onOpenCategorySheet(cat.id)}
          />
        ))}
      </div>
    </nav>
  );
};
