/**
 * Rasterizer, Paint Stroke, and Message Handler for Physics Worker
 */
export const RASTERIZER_CODE = `
function render() {
  const bg = rgbToAbgr(15, 17, 26);

  if (viewMode === 'thermal') {
    for (let i = 0; i < size; i++) {
      if (types[i] === 0) {
        pixelBuffer[i] = bg;
      } else {
        pixelBuffer[i] = getThermalColor(temps[i]);
      }
    }
    return;
  }

  // Natural pixel art rendering with thermal incandescence
  for (let i = 0; i < size; i++) {
    const type = types[i];
    if (type === 0) {
      pixelBuffer[i] = bg;
      continue;
    }

    const baseCol = elColors[type];
    const variance = elColorVariance[type];
    const temp = temps[i];

    if (variance > 0 || temp > 400) {
      const hash = variance > 0
        ? (((i * 1103515245 + 12345) & 0x7FFFFFFF) % (variance * 2 + 1) - variance)
        : 0;

      let a = (baseCol >> 24) & 0xFF;
      let b = (baseCol >> 16) & 0xFF;
      let g = (baseCol >> 8) & 0xFF;
      let r = baseCol & 0xFF;

      r = Math.max(0, Math.min(255, r + hash));
      g = Math.max(0, Math.min(255, g + hash));
      b = Math.max(0, Math.min(255, b + hash));

      // Thermal incandescence glow for hot matter
      if (temp > 400 && type !== 39) {
        const heatBoost = Math.min(60, Math.floor((temp - 400) / 10));
        r = Math.min(255, r + heatBoost);
        g = Math.min(255, g + Math.floor(heatBoost * 0.4));
      }

      pixelBuffer[i] = rgbToAbgr(r, g, b, a);
    } else {
      pixelBuffer[i] = baseCol;
    }
  }
}

function countParticles() {
  let count = 0;
  for (let i = 0; i < size; i++) {
    if (types[i] !== 0) count++;
  }
  return count;
}

function paintStroke(x0, y0, x1, y1, elementId, brushSize, shape) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let cx = x0;
  let cy = y0;
  const radius = Math.max(1, brushSize);

  while (true) {
    for (let pdy = -radius; pdy <= radius; pdy++) {
      for (let pdx = -radius; pdx <= radius; pdx++) {
        const px = cx + pdx;
        const py = cy + pdy;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          let shouldPaint = false;
          if (shape === 'square') {
            shouldPaint = true;
          } else if (shape === 'circle') {
            shouldPaint = (pdx * pdx + pdy * pdy) <= (radius * radius);
          } else if (shape === 'spray') {
            shouldPaint = (pdx * pdx + pdy * pdy) <= (radius * radius) && Math.random() < 0.25;
          }

          if (shouldPaint) {
            const idx = py * width + px;
            if (elementId === 41) { // Eraser
              types[idx] = 0;
              temps[idx] = ambientTemp;
              life[idx] = 0;
              vx[idx] = 0;
              vy[idx] = 0;
            } else {
              types[idx] = elementId;
              const spawnTemp = elDefaultTemp[elementId];
              temps[idx] = spawnTemp !== undefined && spawnTemp !== 9999 ? spawnTemp : ambientTemp;
              life[idx] = elDefaultLife[elementId];
              vx[idx] = 0;
              vy[idx] = 0;
            }
          }
        }
      }
    }

    if (cx === x1 && cy === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      cx += sx;
    }
    if (e2 < dx) {
      err += dx;
      cy += sy;
    }
  }
}

self.onmessage = function (e) {
  const msg = e.data;
  if (!msg) return;

  switch (msg.type) {
    case 'init': {
      width = msg.width || 220;
      height = msg.height || 150;
      size = width * height;
      types = new Uint8Array(size);
      temps = new Int16Array(size);
      life = new Uint8Array(size);
      vx = new Float32Array(size);
      vy = new Float32Array(size);
      flags = new Uint8Array(size);
      pixelBuffer = new Uint32Array(size);
      temps.fill(22);

      initRegistry(msg.elements, msg.reactions);
      self.postMessage({ type: 'ready' });
      break;
    }

    case 'update_registry': {
      initRegistry(msg.elements, msg.reactions);
      break;
    }

    case 'paint': {
      paintStroke(msg.x0, msg.y0, msg.x1, msg.y1, msg.elementId, msg.brushSize, msg.shape);
      break;
    }

    case 'load_state': {
      if (msg.types && msg.types.length === size) {
        types.set(msg.types);
      }
      if (msg.temps && msg.temps.length === size) {
        temps.set(msg.temps);
      }
      break;
    }

    case 'clear': {
      types.fill(0);
      temps.fill(ambientTemp);
      life.fill(0);
      vx.fill(0);
      vy.fill(0);
      break;
    }

    case 'set_config': {
      if (msg.paused !== undefined) paused = msg.paused;
      if (msg.speed !== undefined) speedMultiplier = msg.speed;
      if (msg.gravity !== undefined) {
        gravityX = msg.gravity.x;
        gravityY = msg.gravity.y;
      }
      if (msg.viewMode !== undefined) viewMode = msg.viewMode;
      if (msg.ambientTemp !== undefined) ambientTemp = msg.ambientTemp;
      break;
    }

    case 'step': {
      const t0 = performance.now();

      if (!paused || msg.forceStep) {
        const steps = paused && msg.forceStep ? 1 : Math.max(1, Math.min(4, Math.floor(speedMultiplier)));
        for (let s = 0; s < steps; s++) {
          step();
        }
      }

      const tStep = performance.now() - t0;
      const tRender0 = performance.now();
      render();
      const tRender = performance.now() - tRender0;

      const outBuffer = new Uint32Array(size);
      outBuffer.set(pixelBuffer);

      let inspect = null;
      if (msg.inspectX !== undefined && msg.inspectY !== undefined) {
        const ix = Math.max(0, Math.min(width - 1, Math.floor(msg.inspectX)));
        const iy = Math.max(0, Math.min(height - 1, Math.floor(msg.inspectY)));
        const iIdx = iy * width + ix;
        inspect = {
          x: ix,
          y: iy,
          elementId: types[iIdx],
          temp: temps[iIdx],
          vx: vx[iIdx],
          vy: vy[iIdx]
        };
      }

      self.postMessage(
        {
          type: 'frame',
          pixelBuffer: outBuffer,
          stats: {
            particleCount: countParticles(),
            stepTimeMs: tStep,
            renderTimeMs: tRender
          },
          inspector: inspect
        },
        [outBuffer.buffer]
      );
      break;
    }
  }
};
`;
