'use client';

import React, { useState, useEffect } from 'react';
import { ElementDefinition, ElementCategory, BrushShape } from '../../lib/sandspiel/types';
import { useSandspielSimulation } from '../../hooks/useSandspielSimulation';
import { StudioHeader } from '../molecules/StudioHeader';
import { QuickGuideDrawer } from '../molecules/QuickGuideDrawer';
import { SandboxCanvas } from '../organisms/SandboxCanvas';
import { BrushControls } from '../molecules/BrushControls';
import { InspectorCard } from '../molecules/InspectorCard';
import { ElementPalette } from '../organisms/ElementPalette';
import { CustomElementModal } from '../organisms/CustomElementModal';
import { PresetLibraryModal } from '../organisms/PresetLibraryModal';
import { BrushEraserFab } from '../molecules/BrushEraserFab';
import { MobileInspectHUD } from '../molecules/MobileInspectHUD';
import { MobileCategoryToolbar } from '../organisms/MobileCategoryToolbar';
import { ElementBottomSheet } from '../organisms/ElementBottomSheet';
import { TapeDeckTransport } from '../molecules/TapeDeckTransport';

export const SandspielStudio: React.FC = () => {
  const { state, actions } = useSandspielSimulation();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [elementToEdit, setElementToEdit] = useState<ElementDefinition | null>(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [showQuickGuide, setShowQuickGuide] = useState(false);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetCategory, setBottomSheetCategory] = useState<ElementCategory | 'all'>('powder');
  const [showMobileInspector, setShowMobileInspector] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag);
      if (isInputActive) return;

      if (e.code === 'Space') {
        e.preventDefault();
        actions.togglePause();
      } else if (e.key === 's' || e.key === 'S') {
        if (state.isPaused) actions.stepOnce();
      } else if (e.key === 'c' || e.key === 'C') {
        actions.clearCanvas();
      } else if (e.key === 'e' || e.key === 'E') {
        actions.setIsEraser(!state.isEraser);
      } else if (e.key === 't' || e.key === 'T') {
        actions.changeViewMode(state.viewMode === 'natural' ? 'thermal' : 'natural');
      } else if (e.key === '[') {
        actions.setBrushSize(Math.max(1, state.brushSize - 1));
      } else if (e.key === ']') {
        actions.setBrushSize(Math.min(20, state.brushSize + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, state.isPaused, state.isEraser, state.viewMode, state.brushSize]);

  const handleOpenCategorySheet = (category: ElementCategory | 'all') => {
    setBottomSheetCategory(category);
    setIsBottomSheetOpen(true);
  };

  const handleSelectElement = (element: ElementDefinition) => {
    actions.setIsEraser(false);
    actions.setSelectedElement(element);
  };

  const activeDisplayElement = state.isEraser ? state.eraserElement : state.selectedElement;

  return (
    <div className="h-[100dvh] lg:h-auto min-h-screen bg-[#0a0c13] text-[#e4e7f5] flex flex-col font-sans selection:bg-blue-600/40 overflow-hidden lg:overflow-visible">
      <StudioHeader
        ambientTemp={state.ambientTemp}
        showInspector={showMobileInspector}
        showQuickGuide={showQuickGuide}
        onAdjustAmbientTemp={actions.adjustAmbientTemp}
        onToggleInspector={() => setShowMobileInspector((prev) => !prev)}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onToggleGuide={() => setShowQuickGuide((prev) => !prev)}
      />

      <QuickGuideDrawer isOpen={showQuickGuide} />

      <main className="flex-1 min-h-0 w-full flex flex-col lg:grid lg:grid-cols-12 lg:gap-4 lg:p-4 lg:max-w-[1600px] lg:mx-auto lg:items-start overflow-hidden lg:overflow-visible">
        <section className="flex-1 min-h-0 lg:col-span-8 flex flex-col justify-between lg:justify-start gap-2 p-2 lg:p-0 relative overflow-hidden lg:overflow-visible">
          {showMobileInspector && (
            <div className="lg:hidden">
              <MobileInspectHUD
                data={state.inspectorData}
                stats={state.stats}
                onClose={() => setShowMobileInspector(false)}
              />
            </div>
          )}

          <div className="flex-1 min-h-0 w-full flex items-center justify-center relative overflow-hidden">
            <SandboxCanvas
              className="w-full max-h-full max-w-full aspect-[220/150]"
              onCanvasReady={actions.initCanvas}
              onPointerDown={actions.pointerDown}
              onPointerMove={actions.pointerMove}
              onPointerUp={actions.pointerUp}
              onPointerLeave={actions.pointerLeave}
            />

            {/* Floating Action Button (FAB) for Brush & Eraser on Mobile */}
            <div className="lg:hidden">
              <BrushEraserFab
                brushSize={state.brushSize}
                brushShape={state.brushShape}
                isEraser={state.isEraser}
                onBrushSizeChange={(delta) =>
                  actions.setBrushSize(Math.max(1, Math.min(20, state.brushSize + delta)))
                }
                onSetBrushSize={actions.setBrushSize}
                onCycleBrushShape={() => {
                  const shapes: BrushShape[] = ['circle', 'square', 'spray'];
                  const currentIndex = shapes.indexOf(state.brushShape);
                  const nextShape = shapes[(currentIndex + 1) % shapes.length];
                  actions.setBrushShape(nextShape);
                }}
                onToggleEraser={() => actions.setIsEraser(!state.isEraser)}
              />
            </div>
          </div>

          <div className="hidden lg:flex flex-wrap items-center justify-between gap-2.5">
            <BrushControls
              brushSize={state.brushSize}
              brushShape={state.brushShape}
              isEraser={state.isEraser}
              onSizeChange={actions.setBrushSize}
              onShapeChange={actions.setBrushShape}
              onToggleEraser={() => actions.setIsEraser(!state.isEraser)}
            />
          </div>

          <div className="hidden lg:block">
            <InspectorCard data={state.inspectorData} stats={state.stats} />
          </div>
        </section>

        <section className="hidden lg:block lg:col-span-4 h-full">
          <ElementPalette
            elements={state.allElements}
            selectedElement={activeDisplayElement}
            onSelectElement={handleSelectElement}
            onOpenCustomElementModal={(elToEdit) => {
              setElementToEdit(elToEdit || null);
              setIsCustomModalOpen(true);
            }}
          />
        </section>
      </main>

      <div className="lg:hidden flex-shrink-0">
        <MobileCategoryToolbar
          elements={state.allElements}
          selectedElement={activeDisplayElement}
          onOpenCategorySheet={handleOpenCategorySheet}
        />
      </div>

      <ElementBottomSheet
        isOpen={isBottomSheetOpen}
        category={bottomSheetCategory}
        onCategoryChange={setBottomSheetCategory}
        elements={state.allElements}
        selectedElement={activeDisplayElement}
        onSelectElement={handleSelectElement}
        onOpenCustomElementModal={(elToEdit) => {
          setElementToEdit(elToEdit || null);
          setIsCustomModalOpen(true);
        }}
        onClose={() => setIsBottomSheetOpen(false)}
      />

      <CustomElementModal
        isOpen={isCustomModalOpen}
        elementToEdit={elementToEdit}
        allElements={state.allElements}
        onClose={() => {
          setIsCustomModalOpen(false);
          setElementToEdit(null);
        }}
        onSave={(newEl) => {
          actions.setSelectedElement(newEl);
          actions.setIsEraser(false);
        }}
      />

      <PresetLibraryModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={actions.loadPreset}
      />

      {/* Tape Deck Transport Bar along the very bottom of the app */}
      <TapeDeckTransport
        isPaused={state.isPaused}
        speed={state.simSpeed}
        gravityMode={state.gravityMode}
        viewMode={state.viewMode}
        stats={state.stats}
        onTogglePause={actions.togglePause}
        onStep={actions.stepOnce}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onCycleSpeed={() => {
          const speeds = [1, 2, 4];
          const currentIndex = speeds.indexOf(state.simSpeed);
          const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
          actions.changeSpeed(nextSpeed);
        }}
        onClear={actions.clearCanvas}
        onToggleGravity={actions.cycleGravity}
        onToggleViewMode={() =>
          actions.changeViewMode(state.viewMode === 'natural' ? 'thermal' : 'natural')
        }
      />
    </div>
  );
};
