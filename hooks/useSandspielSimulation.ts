import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ElementDefinition,
  SimulationStats,
  InspectorData,
  ViewMode,
  BrushShape,
  GravityMode,
  PresetScene,
} from '../lib/sandspiel/types';
import { BASE_ELEMENTS, getElement, getElementByKey } from '../lib/sandspiel/elements';
import { customElementStore } from '../lib/sandspiel/custom-element-store';
import { SimulationEngine } from '../lib/sandspiel/simulation-engine';
import { PRESET_SCENES } from '../lib/sandspiel/presets';

const SIM_WIDTH = 220;
const SIM_HEIGHT = 150;

export function useSandspielSimulation() {
  const [allElements, setAllElements] = useState<ElementDefinition[]>(() =>
    customElementStore.getAllElements()
  );
  const [selectedElement, setSelectedElement] = useState<ElementDefinition>(
    () => getElementByKey('sand') || BASE_ELEMENTS[6]
  );
  const [isPaused, setIsPaused] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('natural');
  const [gravityMode, setGravityMode] = useState<GravityMode>('normal');
  const [brushSize, setBrushSize] = useState(3);
  const [brushShape, setBrushShape] = useState<BrushShape>('circle');
  const [isEraser, setIsEraser] = useState(false);
  const [ambientTemp, setAmbientTemp] = useState(22);

  const [stats, setStats] = useState<SimulationStats>({
    fps: 60,
    particleCount: 0,
    stepTimeMs: 0,
    renderTimeMs: 0,
    isWorkerActive: true,
  });
  const [inspectorData, setInspectorData] = useState<InspectorData | null>(null);

  const engineRef = useRef<SimulationEngine | null>(null);

  const initCanvas = useCallback((canvasEl: HTMLCanvasElement) => {
    if (engineRef.current) return;
    const simEngine = new SimulationEngine({
      width: SIM_WIDTH,
      height: SIM_HEIGHT,
      onFrame: (newStats) => setStats(newStats),
      onInspect: (data) => setInspectorData(data),
    });

    simEngine.init(
      canvasEl,
      customElementStore.getAllElements(),
      customElementStore.getAllReactions()
    );
    const defaultScene = PRESET_SCENES[1];
    const setup = defaultScene.setup(SIM_WIDTH, SIM_HEIGHT);
    simEngine.loadState(setup.types, setup.temps);

    engineRef.current = simEngine;
  }, []);

  useEffect(() => {
    const unsub = customElementStore.subscribe(() => {
      const updatedElements = customElementStore.getAllElements();
      setAllElements(updatedElements);
      engineRef.current?.updateRegistry(updatedElements, customElementStore.getAllReactions());
    });

    return () => {
      unsub();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    if (isEraser) {
      engineRef.current.setActiveElement(41);
    } else {
      engineRef.current.setActiveElement(selectedElement.id);
    }
  }, [selectedElement, isEraser]);

  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.setBrushSize(brushSize);
    engineRef.current.setBrushShape(brushShape);
  }, [brushSize, brushShape]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      engineRef.current?.setPaused(next);
      return next;
    });
  }, []);

  const stepOnce = useCallback(() => {
    engineRef.current?.stepOnce();
  }, []);

  const clearCanvas = useCallback(() => {
    engineRef.current?.clear();
  }, []);

  const changeSpeed = useCallback((spd: number) => {
    setSimSpeed(spd);
    engineRef.current?.setSpeed(spd);
  }, []);

  const changeViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    engineRef.current?.setViewMode(mode);
  }, []);

  const cycleGravity = useCallback(() => {
    setGravityMode((prev) => {
      let next: GravityMode = 'normal';
      if (prev === 'normal') next = 'zero';
      else if (prev === 'zero') next = 'inverted';
      else if (prev === 'inverted') next = 'right';
      else next = 'normal';

      if (engineRef.current) {
        if (next === 'normal') engineRef.current.setGravity(0, 1);
        else if (next === 'zero') engineRef.current.setGravity(0, 0);
        else if (next === 'inverted') engineRef.current.setGravity(0, -1);
        else if (next === 'right') engineRef.current.setGravity(1, 0);
      }
      return next;
    });
  }, []);

  const adjustAmbientTemp = useCallback((delta: number) => {
    setAmbientTemp((prev) => {
      const newTemp = Math.max(-50, Math.min(100, prev + delta));
      engineRef.current?.setAmbientTemp(newTemp);
      return newTemp;
    });
  }, []);

  const loadPreset = useCallback((preset: PresetScene) => {
    if (!engineRef.current) return;
    const { types, temps } = preset.setup(SIM_WIDTH, SIM_HEIGHT);
    engineRef.current.loadState(types, temps);
  }, []);

  const exportScreenshot = useCallback(() => {
    if (!engineRef.current) return;
    const dataUrl = engineRef.current.exportPng();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `sandspiel-snapshot-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  const pointerDown = useCallback((x: number, y: number) => {
    engineRef.current?.pointerDown(x, y);
  }, []);

  const pointerMove = useCallback((x: number, y: number) => {
    engineRef.current?.pointerMove(x, y);
  }, []);

  const pointerUp = useCallback(() => {
    engineRef.current?.pointerUp();
  }, []);

  const pointerLeave = useCallback(() => {
    engineRef.current?.pointerLeave();
  }, []);

  return {
    state: {
      allElements,
      selectedElement,
      isPaused,
      simSpeed,
      viewMode,
      gravityMode,
      brushSize,
      brushShape,
      isEraser,
      ambientTemp,
      stats,
      inspectorData,
      eraserElement: getElement(41),
    },
    actions: {
      setSelectedElement,
      setIsEraser,
      setBrushSize,
      setBrushShape,
      initCanvas,
      togglePause,
      stepOnce,
      clearCanvas,
      changeSpeed,
      changeViewMode,
      cycleGravity,
      adjustAmbientTemp,
      loadPreset,
      exportScreenshot,
      pointerDown,
      pointerMove,
      pointerUp,
      pointerLeave,
    },
  };
}
