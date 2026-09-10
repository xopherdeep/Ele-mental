import { ChemicalReaction } from '../types';
import { WATER_REACTIONS } from './water-reactions';
import { COMBUSTION_REACTIONS } from './combustion-reactions';
import { CORROSION_REACTIONS } from './corrosion-reactions';
import { CRYO_NUCLEAR_REACTIONS } from './cryo-nuclear-reactions';
import { LIFE_REACTIONS } from './life-reactions';

export const BASE_REACTIONS: ChemicalReaction[] = [
  ...WATER_REACTIONS,
  ...COMBUSTION_REACTIONS,
  ...CORROSION_REACTIONS,
  ...CRYO_NUCLEAR_REACTIONS,
  ...LIFE_REACTIONS,
];

export {
  WATER_REACTIONS,
  COMBUSTION_REACTIONS,
  CORROSION_REACTIONS,
  CRYO_NUCLEAR_REACTIONS,
  LIFE_REACTIONS,
};
