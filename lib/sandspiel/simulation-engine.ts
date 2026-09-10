import { ElementDefinition, ChemicalReaction, BrushShape, ViewMode, SimulationStats, InspectorData } from './types';
import { PHYSICS_WORKER_SCRIPT } from './physics-worker-code';
import { getElement } from './elements';

export interface SimulationEngineConfig {
  width: number;
  height: number;
  onFrame?: (stats: SimulationStats) => void;
  onInspect?: (data: InspectorData | null) => void;
}

export class SimulationEngine {
  public width: number;
  public height: number;
  private worker: Worker | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private imgData: ImageData | null = null;

  private isRunning = false;
  private paused = false;
  private speed = 1;
  private gravity = { x: 0, y: 1 };
  private viewMode: ViewMode = 'natural';
  private ambientTemp = 22;

  private activeElementId = 6; // Sand default
  private brushSize = 3;
  private brushShape: BrushShape = 'circle';
  private isDrawing = false;
  private lastX = -1;
  private lastY = -1;

  private inspectX = -1;
  private inspectY = -1;

  private frameCount = 0;
  private lastFpsUpdate = 0;
  private currentFps = 60;

  private onFrameCallback?: (stats: SimulationStats) => void;
  private onInspectCallback?: (data: InspectorData | null) => void;

  private pendingWorkerStep = false;
  private forceNextStep = false;
  private animFrameId: number | null = null;

  constructor(config: SimulationEngineConfig) {
    this.width = config.width;
    this.height = config.height;
    this.onFrameCallback = config.onFrame;
    this.onInspectCallback = config.onInspect;
  }

  public init(canvas: HTMLCanvasElement, elements: ElementDefinition[], reactions: ChemicalReaction[]): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: false, alpha: false });
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
      this.imgData = this.ctx.createImageData(this.width, this.height);
    }

    try {
      const blob = new Blob([PHYSICS_WORKER_SCRIPT], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);

      this.worker.onmessage = (e) => this.handleWorkerMessage(e);

      this.worker.postMessage({
        type: 'init',
        width: this.width,
        height: this.height,
        elements,
        reactions,
      });

      this.startLoop();
    } catch (err) {
      console.warn('Failed to start Web Worker, physics falling back', err);
    }
  }

  public updateRegistry(elements: ElementDefinition[], reactions: ChemicalReaction[]): void {
    if (this.worker) {
      this.worker.postMessage({
        type: 'update_registry',
        elements,
        reactions,
      });
    }
  }

  public setPaused(paused: boolean): void {
    this.paused = paused;
    this.worker?.postMessage({
      type: 'set_config',
      paused,
    });
  }

  public stepOnce(): void {
    this.forceNextStep = true;
    if (this.worker && !this.pendingWorkerStep) {
      this.pendingWorkerStep = true;
      this.forceNextStep = false;
      this.worker.postMessage({
        type: 'step',
        forceStep: true,
        inspectX: this.inspectX,
        inspectY: this.inspectY,
      });
    }
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
    this.worker?.postMessage({
      type: 'set_config',
      speed,
    });
  }

  public setGravity(gx: number, gy: number): void {
    this.gravity = { x: gx, y: gy };
    this.worker?.postMessage({
      type: 'set_config',
      gravity: this.gravity,
    });
  }

  public setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.worker?.postMessage({
      type: 'set_config',
      viewMode: mode,
    });
  }

  public setAmbientTemp(temp: number): void {
    this.ambientTemp = temp;
    this.worker?.postMessage({
      type: 'set_config',
      ambientTemp: temp,
    });
  }

  public setActiveElement(id: number): void {
    this.activeElementId = id;
  }

  public setBrushSize(size: number): void {
    this.brushSize = Math.max(1, Math.min(25, size));
  }

  public setBrushShape(shape: BrushShape): void {
    this.brushShape = shape;
  }

  public clear(): void {
    this.worker?.postMessage({ type: 'clear' });
  }

  public loadState(types: Uint8Array, temps: Int16Array): void {
    this.worker?.postMessage({
      type: 'load_state',
      types,
      temps,
    });
  }

  // --- Pointer & Input Handling ---
  public pointerDown(canvasX: number, canvasY: number): void {
    this.isDrawing = true;
    const simX = Math.floor((canvasX / this.canvas!.clientWidth) * this.width);
    const simY = Math.floor((canvasY / this.canvas!.clientHeight) * this.height);

    this.lastX = simX;
    this.lastY = simY;
    this.sendPaintStroke(simX, simY, simX, simY);
  }

  public pointerMove(canvasX: number, canvasY: number): void {
    if (!this.canvas) return;
    const simX = Math.floor((canvasX / this.canvas.clientWidth) * this.width);
    const simY = Math.floor((canvasY / this.canvas.clientHeight) * this.height);

    this.inspectX = simX;
    this.inspectY = simY;

    if (this.isDrawing) {
      this.sendPaintStroke(this.lastX, this.lastY, simX, simY);
      this.lastX = simX;
      this.lastY = simY;
    }
  }

  public pointerUp(): void {
    this.isDrawing = false;
    this.lastX = -1;
    this.lastY = -1;
  }

  public pointerLeave(): void {
    this.isDrawing = false;
    this.inspectX = -1;
    this.inspectY = -1;
    this.onInspectCallback?.(null);
  }

  private sendPaintStroke(x0: number, y0: number, x1: number, y1: number): void {
    this.worker?.postMessage({
      type: 'paint',
      x0,
      y0,
      x1,
      y1,
      elementId: this.activeElementId,
      brushSize: this.brushSize,
      shape: this.brushShape,
    });
  }

  // --- Main Tick Loop ---
  private startLoop(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFpsUpdate = performance.now();

    const loop = () => {
      if (!this.isRunning) return;

      if (this.worker && !this.pendingWorkerStep) {
        const isForced = this.forceNextStep;
        if (isForced || !this.paused || this.isDrawing) {
          this.pendingWorkerStep = true;
          this.forceNextStep = false;
          this.worker.postMessage({
            type: 'step',
            forceStep: isForced,
            inspectX: this.inspectX,
            inspectY: this.inspectY,
          });
        }
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private handleWorkerMessage(e: MessageEvent): void {
    const msg = e.data;
    if (!msg) return;

    if (msg.type === 'frame') {
      this.pendingWorkerStep = false;

      // Put pixel buffer directly to canvas
      if (this.ctx && this.imgData && msg.pixelBuffer) {
        const u8View = new Uint8ClampedArray(msg.pixelBuffer.buffer);
        this.imgData.data.set(u8View);
        this.ctx.putImageData(this.imgData, 0, 0);
      }

      // FPS calculation
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsUpdate >= 500) {
        this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
        this.frameCount = 0;
        this.lastFpsUpdate = now;
      }

      if (this.onFrameCallback && msg.stats) {
        this.onFrameCallback({
          fps: this.currentFps,
          particleCount: msg.stats.particleCount || 0,
          stepTimeMs: Math.round((msg.stats.stepTimeMs || 0) * 10) / 10,
          renderTimeMs: Math.round((msg.stats.renderTimeMs || 0) * 10) / 10,
          isWorkerActive: true,
        });
      }

      // Inspect data
      if (this.onInspectCallback && msg.inspector) {
        const el = getElement(msg.inspector.elementId);
        this.onInspectCallback({
          x: msg.inspector.x,
          y: msg.inspector.y,
          element: el.id === 0 ? null : el,
          temperature: msg.inspector.temp,
          pressure: 1.0,
          vx: msg.inspector.vx,
          vy: msg.inspector.vy,
        });
      }
    }
  }

  public exportPng(): string | null {
    if (!this.canvas) return null;
    return this.canvas.toDataURL('image/png');
  }

  public destroy(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
