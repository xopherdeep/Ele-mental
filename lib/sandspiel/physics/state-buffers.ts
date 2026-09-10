/**
 * State Buffers and Element Parameter Registry for Physics Worker
 */
export const STATE_BUFFERS_CODE = `
let width = 220;
let height = 150;
let size = width * height;

let types = new Uint8Array(size);
let temps = new Int16Array(size);
let life = new Uint8Array(size);
let vx = new Float32Array(size);
let vy = new Float32Array(size);
let flags = new Uint8Array(size);
let pixelBuffer = new Uint32Array(size);

let gravityX = 0;
let gravityY = 1;
let paused = false;
let speedMultiplier = 1;
let ambientTemp = 22;
let viewMode = 'natural';
let currentTick = 0;

const MAX_ELEMENTS = 256;
const elState = new Uint8Array(MAX_ELEMENTS);
const elDensity = new Int32Array(MAX_ELEMENTS);
const elViscosity = new Uint8Array(MAX_ELEMENTS);
const elFlammability = new Float32Array(MAX_ELEMENTS);
const elBurnTemp = new Int16Array(MAX_ELEMENTS);
const elDefaultTemp = new Int16Array(MAX_ELEMENTS);
const elHeatCond = new Float32Array(MAX_ELEMENTS);
const elCorrosiveness = new Float32Array(MAX_ELEMENTS);
const elCorrosionRes = new Float32Array(MAX_ELEMENTS);
const elElecCond = new Float32Array(MAX_ELEMENTS);
const elBoilPoint = new Int16Array(MAX_ELEMENTS);
const elBoilProd = new Uint8Array(MAX_ELEMENTS);
const elFreezePoint = new Int16Array(MAX_ELEMENTS);
const elFreezeProd = new Uint8Array(MAX_ELEMENTS);
const elDefaultLife = new Uint8Array(MAX_ELEMENTS);
const elColors = new Uint32Array(MAX_ELEMENTS);
const elColorVariance = new Uint8Array(MAX_ELEMENTS);

let reactionMap = new Map();

function rxKey(a, b) {
  return (a << 8) | b;
}

function stateToInt(s) {
  switch (s) {
    case 'solid': return 1;
    case 'powder': return 2;
    case 'liquid': return 3;
    case 'gas': return 4;
    case 'energy': return 5;
    case 'special': return 6;
    default: return 0;
  }
}

function initRegistry(elements, reactions) {
  elState.fill(0);
  elDensity.fill(0);
  elViscosity.fill(1);
  elFlammability.fill(0);
  elBurnTemp.fill(9999);
  elDefaultTemp.fill(22);
  elHeatCond.fill(0);
  elCorrosiveness.fill(0);
  elCorrosionRes.fill(1);
  elElecCond.fill(0);
  elBoilPoint.fill(9999);
  elBoilProd.fill(0);
  elFreezePoint.fill(-9999);
  elFreezeProd.fill(0);
  elDefaultLife.fill(0);
  elColors.fill(0);
  elColorVariance.fill(0);
  reactionMap.clear();

  const keyToId = new Map();
  for (const el of elements) {
    const id = el.id;
    keyToId.set(el.key, id);
    elState[id] = stateToInt(el.state || el.category);
    elDensity[id] = el.density || 0;
    elViscosity[id] = el.viscosity || 1;
    elFlammability[id] = el.flammability || 0;
    elBurnTemp[id] = el.burnTemp != null ? el.burnTemp : 9999;
    elDefaultTemp[id] = el.defaultTemp != null ? el.defaultTemp : 22;
    elHeatCond[id] = el.heatConductivity || 0;
    elCorrosiveness[id] = el.corrosiveness || 0;
    elCorrosionRes[id] = el.corrosionResistance != null ? el.corrosionResistance : 1;
    elElecCond[id] = el.electricalConductivity || 0;
    elBoilPoint[id] = el.boilingPoint != null ? el.boilingPoint : 9999;
    elFreezePoint[id] = el.freezingPoint != null ? el.freezingPoint : -9999;
    elDefaultLife[id] = el.life || 0;
    elColorVariance[id] = el.colorVariance || 0;

    const [r, g, b] = el.color;
    elColors[id] = rgbToAbgr(r, g, b);
  }

  for (const el of elements) {
    const id = el.id;
    if (el.boilProduct && keyToId.has(el.boilProduct)) {
      elBoilProd[id] = keyToId.get(el.boilProduct);
    }
    if (el.freezeProduct && keyToId.has(el.freezeProduct)) {
      elFreezeProd[id] = keyToId.get(el.freezeProduct);
    }
  }

  for (const rx of reactions) {
    const idA = keyToId.get(rx.reactantA);
    const idB = keyToId.get(rx.reactantB);
    if (idA !== undefined && idB !== undefined) {
      const resA = rx.resultA ? (keyToId.get(rx.resultA) ?? 0) : 0;
      const resB = rx.resultB ? (keyToId.get(rx.resultB) ?? 0) : 0;
      const rule = {
        resA,
        resB,
        destroyA: rx.resultA === null,
        destroyB: rx.resultB === null,
        chance: rx.chance,
        heatDelta: rx.heatDelta,
        pressureDelta: rx.pressureDelta,
        effect: rx.effect || 'none'
      };
      reactionMap.set(rxKey(idA, idB), rule);
      if (!reactionMap.has(rxKey(idB, idA))) {
        reactionMap.set(rxKey(idB, idA), {
          resA: rule.resB,
          resB: rule.resA,
          destroyA: rule.destroyB,
          destroyB: rule.destroyA,
          chance: rule.chance,
          heatDelta: rule.heatDelta,
          pressureDelta: rule.pressureDelta,
          effect: rule.effect
        });
      }
    }
  }
}

function swap(idx1, idx2) {
  const t = types[idx1];
  types[idx1] = types[idx2];
  types[idx2] = t;

  const tmp = temps[idx1];
  temps[idx1] = temps[idx2];
  temps[idx2] = tmp;

  const l = life[idx1];
  life[idx1] = life[idx2];
  life[idx2] = l;

  const v_x = vx[idx1];
  vx[idx1] = vx[idx2];
  vx[idx2] = v_x;

  const v_y = vy[idx1];
  vy[idx1] = vy[idx2];
  vy[idx2] = v_y;
}
`;
