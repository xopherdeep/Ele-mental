import React from 'react';
import { Sparkles } from 'lucide-react';

export interface QuickGuideDrawerProps {
  isOpen: boolean;
}

export const QuickGuideDrawer: React.FC<QuickGuideDrawerProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-[#121624] border-b border-[#242b3e] px-4 py-3 text-xs font-mono animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-lg">
          <span className="text-blue-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Chemical & Physical Simulation Highlights:
          </span>
          <p className="text-[#8c96b5] leading-relaxed">
            • <strong>Water + Fire</strong>: Extinguishes flame, producing rising steam vapor that condenses.<br />
            • <strong>Water + Lava</strong>: Chills molten magma into obsidian & rock walls while venting steam.<br />
            • <strong>Electrolysis</strong>: Run electricity through salt water to split it into Hydrogen & Oxygen!<br />
            • <strong>Thermobaric Blast</strong>: Spark hydrogen & oxygen for an explosive shockwave.<br />
            • <strong>Corrosive Acid</strong>: Dissolves metal, wood, and plant matter into flammable hydrogen gas.<br />
            • <strong>Thermite Reaction</strong>: Heat rust and metal to melt into searing molten iron lava.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-[#8c96b5]">
          <span className="text-emerald-400 font-semibold">Hotkeys:</span>
          <span><strong>[Space]</strong> Play/Pause &nbsp;|&nbsp; <strong>[S]</strong> Step 1 Frame &nbsp;|&nbsp; <strong>[C]</strong> Clear Canvas</span>
          <span><strong>[E]</strong> Eraser &nbsp;|&nbsp; <strong>[T]</strong> Thermal Infrared Mode &nbsp;|&nbsp; <strong>[[] / []]</strong> Brush Size</span>
        </div>
      </div>
    </div>
  );
};
