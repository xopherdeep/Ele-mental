import { THERMAL_PALETTE_CODE } from './thermal-palette';
import { STATE_BUFFERS_CODE } from './state-buffers';
import { STEP_SIMULATION_CODE } from './step-simulation';
import { RASTERIZER_CODE } from './rasterizer';

export function createPhysicsWorkerScript(): string {
  return [
    THERMAL_PALETTE_CODE,
    STATE_BUFFERS_CODE,
    STEP_SIMULATION_CODE,
    RASTERIZER_CODE,
  ].join('\n');
}

export const PHYSICS_WORKER_SCRIPT = createPhysicsWorkerScript();
