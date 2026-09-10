export type ReactionEffect =
  | 'none'
  | 'smoke'
  | 'spark'
  | 'flash'
  | 'bubble'
  | 'dissolve'
  | 'explode';

export interface ChemicalReaction {
  id: string;
  reactantA: string;
  reactantB: string;
  resultA: string | null;
  resultB: string | null;
  chance: number;
  heatDelta: number;
  pressureDelta: number;
  effect?: ReactionEffect;
  description?: string;
  isCustom?: boolean;
}
