import React, { useRef, useEffect } from 'react';
import { SimulationEngine } from '../../lib/sandspiel/simulation-engine';

export interface SandboxCanvasProps {
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  onPointerDown: (x: number, y: number) => void;
  onPointerMove: (x: number, y: number) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  className?: string;
}

export const SandboxCanvas: React.FC<SandboxCanvasProps> = ({
  onCanvasReady,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    onCanvasReady(canvas);

    const preventTouch = (e: TouchEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('touchstart', preventTouch, { passive: false });
    canvas.addEventListener('touchmove', preventTouch, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventTouch);
      canvas.removeEventListener('touchmove', preventTouch);
    };
  }, [onCanvasReady]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onPointerDown(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onPointerMove(x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    onPointerUp();
  };

  return (
    <div
      id="sandbox-canvas-container"
      className={`relative aspect-[220/150] bg-[#0c0e15] border-2 border-[#262c3e] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center cursor-crosshair select-none touch-none ${className || 'w-full max-h-[580px]'}`}
    >
      <canvas
        ref={canvasRef}
        id="sandspiel-viewport-canvas"
        className="w-full h-full object-contain [image-rendering:pixelated] [image-rendering:crisp-edges] touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={onPointerLeave}
      />
    </div>
  );
};
