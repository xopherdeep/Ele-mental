import React from 'react';
import { Plus } from 'lucide-react';
import { ElementDefinition, ChemicalReaction, ReactionEffect } from '../../../lib/sandspiel/types';
import { Button } from '../../atoms/Button';
import { Slider } from '../../atoms/Slider';
import { ReactionRow } from '../../molecules/ReactionRow';

export interface ElementReactionsTabProps {
  name: string;
  allElements: ElementDefinition[];
  rxReactantB: string;
  setRxReactantB: (v: string) => void;
  rxResultA: string;
  setRxResultA: (v: string) => void;
  rxResultB: string;
  setRxResultB: (v: string) => void;
  rxEffect: ReactionEffect;
  setRxEffect: (v: ReactionEffect) => void;
  rxChance: number;
  setRxChance: (v: number) => void;
  rxHeatDelta: number;
  setRxHeatDelta: (v: number) => void;
  rxPressure: number;
  setRxPressure: (v: number) => void;
  onAddReaction: () => void;
  currentReactions: ChemicalReaction[];
  onDeleteReaction: (id: string) => void;
}

export const ElementReactionsTab: React.FC<ElementReactionsTabProps> = ({
  name,
  allElements,
  rxReactantB,
  setRxReactantB,
  rxResultA,
  setRxResultA,
  rxResultB,
  setRxResultB,
  rxEffect,
  setRxEffect,
  rxChance,
  setRxChance,
  rxHeatDelta,
  setRxHeatDelta,
  rxPressure,
  setRxPressure,
  onAddReaction,
  currentReactions,
  onDeleteReaction,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 bg-[#161a27] border border-[#262c3e] rounded-xl flex flex-col gap-3">
        <span className="text-xs font-mono font-semibold text-[#e4e7f5] flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-blue-400" />
          Add Reaction Rule for {name}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>
            <label className="text-[10px] text-[#767e9c] block mb-0.5">Reactant B</label>
            <select
              value={rxReactantB}
              onChange={(e) => setRxReactantB(e.target.value)}
              className="w-full bg-[#1c2132] border border-[#2b3247] rounded px-2 py-1 text-xs text-[#d8dceb]"
            >
              {allElements.map((el) => (
                <option key={el.key} value={el.key}>{el.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#767e9c] block mb-0.5">Result A</label>
            <select
              value={rxResultA}
              onChange={(e) => setRxResultA(e.target.value)}
              className="w-full bg-[#1c2132] border border-[#2b3247] rounded px-2 py-1 text-xs text-[#d8dceb]"
            >
              <option value="">[Consumed]</option>
              {allElements.map((el) => (
                <option key={el.key} value={el.key}>{el.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#767e9c] block mb-0.5">Result B</label>
            <select
              value={rxResultB}
              onChange={(e) => setRxResultB(e.target.value)}
              className="w-full bg-[#1c2132] border border-[#2b3247] rounded px-2 py-1 text-xs text-[#d8dceb]"
            >
              <option value="">[Consumed]</option>
              {allElements.map((el) => (
                <option key={el.key} value={el.key}>{el.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#767e9c] block mb-0.5">FX Effect</label>
            <select
              value={rxEffect}
              onChange={(e) => setRxEffect(e.target.value as ReactionEffect)}
              className="w-full bg-[#1c2132] border border-[#2b3247] rounded px-2 py-1 text-xs text-[#d8dceb]"
            >
              <option value="none">None</option>
              <option value="explode">Explosion</option>
              <option value="spark">Sparks</option>
              <option value="flash">Thermal Flash</option>
              <option value="dissolve">Dissolve</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Slider label="Probability" value={rxChance} min={10} max={100} unit="%" onChange={setRxChance} />
          <Slider label="Thermal Delta" value={rxHeatDelta} min={-200} max={800} unit="°C" onChange={setRxHeatDelta} />
          <Slider label="Blast Shockwave" value={rxPressure} min={0} max={10} onChange={setRxPressure} />
        </div>

        <div className="flex justify-end pt-1">
          <Button size="sm" variant="primary" onClick={onAddReaction}>
            <Plus className="w-3 h-3" />
            Add Reaction
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono text-[#8a93b0]">Active Reactions Involving {name}:</span>
        {currentReactions.length === 0 ? (
          <div className="p-4 text-center text-xs font-mono text-[#616985] bg-[#161a27] rounded-lg">
            No custom chemical reactions registered for this element yet.
          </div>
        ) : (
          currentReactions.map((rx) => (
            <ReactionRow
              key={rx.id}
              reaction={rx}
              onDelete={onDeleteReaction}
            />
          ))
        )}
      </div>
    </div>
  );
};
