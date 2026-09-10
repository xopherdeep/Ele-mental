import React from 'react';
import { Flame, Zap, Trash2, ArrowRight } from 'lucide-react';
import { ChemicalReaction } from '../../lib/sandspiel/types';
import { getElementByKey } from '../../lib/sandspiel/elements';
import { ColorSwatch } from '../atoms/ColorSwatch';

export interface ReactionRowProps {
  reaction: ChemicalReaction;
  onDelete?: (id: string) => void;
}

export const ReactionRow: React.FC<ReactionRowProps> = ({ reaction, onDelete }) => {
  const elA = getElementByKey(reaction.reactantA);
  const elB = getElementByKey(reaction.reactantB);
  const resA = reaction.resultA ? getElementByKey(reaction.resultA) : null;
  const resB = reaction.resultB ? getElementByKey(reaction.resultB) : null;

  const heatColor = reaction.heatDelta > 0 ? 'text-orange-400' : 'text-cyan-400';
  const heatSign = reaction.heatDelta > 0 ? `+${reaction.heatDelta}°` : `${reaction.heatDelta}°`;

  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-[#161a25] border border-[#262c3e] text-xs font-mono text-[#d8dceb]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1f2435] border border-[#2f3750]">
          {elA && <ColorSwatch color={elA.color} size="sm" />}
          <span>{elA ? elA.name : reaction.reactantA}</span>
        </span>

        <span className="text-[#6d7592] font-bold">+</span>

        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1f2435] border border-[#2f3750]">
          {elB && <ColorSwatch color={elB.color} size="sm" />}
          <span>{elB ? elB.name : reaction.reactantB}</span>
        </span>

        <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />

        <div className="flex items-center gap-1.5">
          {resA ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
              <ColorSwatch color={resA.color} size="sm" />
              <span>{resA.name}</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900 text-[10px]">
              Consumed
            </span>
          )}

          {resB ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
              <ColorSwatch color={resB.color} size="sm" />
              <span>{resB.name}</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900 text-[10px]">
              Consumed
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {reaction.heatDelta !== 0 && (
          <span className={`flex items-center gap-0.5 text-[11px] ${heatColor}`} title="Thermal Delta">
            <Flame className="w-3 h-3" />
            {heatSign}
          </span>
        )}

        <span className="text-[11px] text-[#78819f]">{Math.round(reaction.chance * 100)}%</span>

        {reaction.effect === 'explode' && (
          <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[9px] flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" />
            Blast
          </span>
        )}

        {reaction.isCustom && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(reaction.id)}
            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded transition-colors"
            title="Delete custom reaction"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
