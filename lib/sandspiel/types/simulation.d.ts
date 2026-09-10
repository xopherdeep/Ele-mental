import { ElementDefinition } from './elements';

export type BrushShape = 'circle' | 'square' | 'spray';

export type ViewMode = 'natural' | 'thermal' | 'velocity' | 'pressure';

export type GravityMode = 'normal' | 'zero' | 'inverted' | 'right';

export interface SimulationStats {
  fps: number;
  particleCount: number;
  stepTimeMs: number;
  renderTimeMs: number;
  isWorkerActive: boolean;
}

export interface InspectorData {
  x: number;
  y: number;
  element: ElementDefinition | null;
  temperature: number;
  pressure: number;
  vx: number;
  vy: number;
}

export type PlaybackStatus =
  | { readonly state: 'running'; readonly speed: number }
  | { readonly state: 'paused' };

export type ActiveTool =
  | { readonly type: 'element'; readonly id: number }
  | { readonly type: 'eraser' };
