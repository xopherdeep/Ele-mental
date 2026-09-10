import React from 'react';
import { PRESET_SCENES } from '../../lib/sandspiel/presets';
import { PresetScene } from '../../lib/sandspiel/types';
import { Button } from '../atoms/Button';
import { X, Play, Beaker } from 'lucide-react';

export interface PresetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetScene) => void;
}

export const PresetLibraryModal: React.FC<PresetLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="preset-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="preset-modal-content"
        className="bg-[#12151f] border border-[#272d40] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23293c] bg-[#171b28]">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold font-mono text-[#e4e7f5]">
              Chemical & Physical Simulation Presets
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#7c85a4] hover:text-[#e4e7f5] hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Presets */}
        <div className="p-4 grid grid-cols-1 gap-2.5 max-h-[60vh] overflow-y-auto">
          {PRESET_SCENES.map((preset) => (
            <div
              key={preset.id}
              id={`preset-card-${preset.id}`}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group flex items-start justify-between gap-4 p-3 rounded-xl bg-[#171a26] border border-[#262c3e] hover:bg-[#1e2333] hover:border-blue-500/50 cursor-pointer transition-all"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-[#e4e7f5] group-hover:text-blue-400 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#212738] text-[#939cb8] border border-[#30384f]">
                    {preset.category}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#78819e] leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Load</span>
              </Button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#23293c] bg-[#171b28] flex justify-end">
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
