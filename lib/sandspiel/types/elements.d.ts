export type ElementCategory =
  | 'solid'
  | 'powder'
  | 'liquid'
  | 'gas'
  | 'energy'
  | 'life'
  | 'special'
  | 'custom';

export type ElementState = 'solid' | 'powder' | 'liquid' | 'gas' | 'energy';

export interface ElementDefinition {
  id: number;
  key: string;
  name: string;
  category: ElementCategory;
  state: ElementState;
  color: [number, number, number];
  colorVariance: number;
  density: number;
  viscosity: number;
  flammability: number;
  burnTemp: number;
  defaultTemp: number;
  heatConductivity: number;
  corrosiveness: number;
  corrosionResistance: number;
  electricalConductivity: number;
  boilingPoint: number | null;
  boilProduct: string | null;
  freezingPoint: number | null;
  freezeProduct: string | null;
  life: number;
  description: string;
  isCustom?: boolean;
}
