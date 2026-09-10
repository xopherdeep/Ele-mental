import { ElementDefinition } from '../types';
import { SOLID_ELEMENTS } from './solids';
import { POWDER_ELEMENTS } from './powders';
import { LIQUID_ELEMENTS } from './liquids';
import { GAS_ELEMENTS } from './gases';
import { ENERGY_ELEMENTS } from './energy';
import { LIFE_ELEMENTS } from './life';
import { TOOL_ELEMENTS } from './tools';

export const BASE_ELEMENTS: ElementDefinition[] = [
  ...GAS_ELEMENTS,
  ...SOLID_ELEMENTS,
  ...POWDER_ELEMENTS,
  ...LIQUID_ELEMENTS,
  ...ENERGY_ELEMENTS,
  ...LIFE_ELEMENTS,
  ...TOOL_ELEMENTS,
];

export const ELEMENT_MAP = new Map<number, ElementDefinition>(
  BASE_ELEMENTS.map((el) => [el.id, el])
);

export const KEY_TO_ELEMENT_MAP = new Map<string, ElementDefinition>(
  BASE_ELEMENTS.map((el) => [el.key, el])
);

export function getElement(id: number): ElementDefinition {
  const el = ELEMENT_MAP.get(id);
  if (!el) {
    return BASE_ELEMENTS[0]; // fallback to air
  }
  return el;
}

export function getElementByKey(key: string): ElementDefinition | undefined {
  return KEY_TO_ELEMENT_MAP.get(key);
}

export {
  SOLID_ELEMENTS,
  POWDER_ELEMENTS,
  LIQUID_ELEMENTS,
  GAS_ELEMENTS,
  ENERGY_ELEMENTS,
  LIFE_ELEMENTS,
  TOOL_ELEMENTS,
};
