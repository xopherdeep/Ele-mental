import { PresetScene } from '../types';
import { getElementByKey } from '../elements';

function idOf(key: string, fallbackId: number): number {
  const el = getElementByKey(key);
  return el ? el.id : fallbackId;
}

export const PRESET_SCENES: PresetScene[] = [
  {
    id: 'clean_canvas',
    name: 'Clean Sandbox',
    category: 'physics',
    description: 'Empty testing chamber with indestructible perimeter boundary walls.',
    setup: (w: number, h: number) => {
      const types = new Uint8Array(w * h);
      const temps = new Int16Array(w * h);
      const wallId = idOf('wall', 1);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          temps[idx] = 22;
          if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
            types[idx] = wallId;
          }
        }
      }
      return { types, temps };
    },
  },
  {
    id: 'chem_lab',
    name: 'Chemical Laboratory',
    category: 'chemistry',
    description: 'Beakers of Water, Acid, and Oil separated by Glass walls with an overhead Bunsen Heater and Spark dropper.',
    setup: (w: number, h: number) => {
      const types = new Uint8Array(w * h);
      const temps = new Int16Array(w * h);

      const wallId = idOf('wall', 1);
      const glassId = idOf('glass', 3);
      const waterId = idOf('water', 10);
      const acidId = idOf('acid', 21);
      const oilId = idOf('oil', 11);
      const heaterId = idOf('heater', 39);
      const metalId = idOf('metal', 17);
      const saltId = idOf('salt', 9);

      temps.fill(22);

      for (let x = 0; x < w; x++) {
        types[x] = wallId;
        types[(h - 1) * w + x] = wallId;
      }
      for (let y = 0; y < h; y++) {
        types[y * w] = wallId;
        types[y * w + (w - 1)] = wallId;
      }

      const beakers = [
        { x0: Math.floor(w * 0.1), x1: Math.floor(w * 0.35), fluid: waterId, temp: 20 },
        { x0: Math.floor(w * 0.4), x1: Math.floor(w * 0.65), fluid: acidId, temp: 25 },
        { x0: Math.floor(w * 0.7), x1: Math.floor(w * 0.95), fluid: oilId, temp: 22 },
      ];

      const beakerBottom = Math.floor(h * 0.82);
      const beakerTop = Math.floor(h * 0.45);
      const fillTop = Math.floor(h * 0.58);

      for (const b of beakers) {
        for (let y = beakerTop; y <= beakerBottom; y++) {
          types[y * w + b.x0] = glassId;
          types[y * w + b.x1] = glassId;
        }
        for (let x = b.x0; x <= b.x1; x++) {
          types[beakerBottom * w + x] = glassId;
        }
        for (let y = fillTop; y < beakerBottom; y++) {
          for (let x = b.x0 + 1; x < b.x1; x++) {
            const idx = y * w + x;
            types[idx] = b.fluid;
            temps[idx] = b.temp;
          }
        }
      }

      for (let y = beakerTop - 12; y < beakerTop - 4; y++) {
        for (let x = beakers[0].x0 + 4; x < beakers[0].x1 - 4; x++) {
          types[y * w + x] = saltId;
        }
      }

      for (let y = beakerTop - 5; y < beakerBottom - 4; y++) {
        types[y * w + Math.floor((beakers[1].x0 + beakers[1].x1) / 2)] = metalId;
      }

      for (let x = beakers[0].x0 + 6; x < beakers[0].x1 - 6; x++) {
        types[(beakerBottom + 2) * w + x] = heaterId;
        temps[(beakerBottom + 2) * w + x] = 450;
      }

      return { types, temps };
    },
  },
  {
    id: 'volcano_oil',
    name: 'Volcano & Oil Reservoir',
    category: 'physics',
    description: 'Mountain caldera of boiling Lava separated by Stone from a subterranean Oil and Methane pocket.',
    setup: (w: number, h: number) => {
      const types = new Uint8Array(w * h);
      const temps = new Int16Array(w * h);
      temps.fill(22);

      const wallId = idOf('wall', 1);
      const lavaId = idOf('lava', 22);
      const oilId = idOf('oil', 11);
      const sandId = idOf('sand', 6);
      const dirtId = idOf('dirt', 7);
      const plantId = idOf('plant', 51);
      const methaneId = idOf('methane', 49);

      for (let x = 0; x < w; x++) {
        types[x] = wallId;
        types[(h - 1) * w + x] = wallId;
      }
      for (let y = 0; y < h; y++) {
        types[y * w] = wallId;
        types[y * w + (w - 1)] = wallId;
      }

      const midX = Math.floor(w * 0.45);
      for (let y = Math.floor(h * 0.35); y < h - 1; y++) {
        for (let x = 1; x < midX; x++) {
          const dy = y - Math.floor(h * 0.35);
          const slope = Math.floor(dy * 0.6);
          if (x < 15 + slope || x > midX - slope) {
            types[y * w + x] = wallId;
          } else if (y > Math.floor(h * 0.55)) {
            types[y * w + x] = lavaId;
            temps[y * w + x] = 1100;
          }
        }
      }

      for (let y = Math.floor(h * 0.5); y < h - 1; y++) {
        for (let x = midX + 5; x < w - 1; x++) {
          types[y * w + x] = dirtId;
        }
      }

      const vegY = Math.floor(h * 0.49);
      for (let x = midX + 6; x < w - 1; x++) {
        types[vegY * w + x] = plantId;
        if (x % 3 === 0) {
          types[(vegY - 1) * w + x] = plantId;
        }
      }

      const pocketY0 = Math.floor(h * 0.68);
      const pocketY1 = Math.floor(h * 0.88);
      for (let y = pocketY0; y < pocketY1; y++) {
        for (let x = midX + 15; x < w - 15; x++) {
          const idx = y * w + x;
          types[idx] = y < pocketY0 + 4 ? methaneId : oilId;
        }
      }

      for (let y = Math.floor(h * 0.4); y < Math.floor(h * 0.5); y++) {
        for (let x = midX - 8; x <= midX + 5; x++) {
          if (types[y * w + x] === 0) {
            types[y * w + x] = sandId;
          }
        }
      }

      return { types, temps };
    },
  },
  {
    id: 'electrolysis_rig',
    name: 'Electrolysis Station',
    category: 'chemistry',
    description: 'Salt water bath with active electrical cathodes splitting brine into combustible Hydrogen and Oxygen gases.',
    setup: (w: number, h: number) => {
      const types = new Uint8Array(w * h);
      const temps = new Int16Array(w * h);
      temps.fill(20);

      const wallId = idOf('wall', 1);
      const glassId = idOf('glass', 3);
      const saltWaterId = idOf('salt_water', 27);
      const metalId = idOf('metal', 17);
      const elecId = idOf('electricity', 36);
      const sparkId = idOf('spark', 37);

      for (let x = 0; x < w; x++) {
        types[x] = wallId;
        types[(h - 1) * w + x] = wallId;
      }
      for (let y = 0; y < h; y++) {
        types[y * w] = wallId;
        types[y * w + (w - 1)] = wallId;
      }

      const tX0 = Math.floor(w * 0.2);
      const tX1 = Math.floor(w * 0.8);
      const tY0 = Math.floor(h * 0.25);
      const tY1 = Math.floor(h * 0.85);

      for (let y = tY0; y <= tY1; y++) {
        types[y * w + tX0] = glassId;
        types[y * w + tX1] = glassId;
      }
      for (let x = tX0; x <= tX1; x++) {
        types[tY1 * w + x] = glassId;
      }

      const mid = Math.floor((tX0 + tX1) / 2);
      for (let y = tY0; y < tY1 - 8; y++) {
        types[y * w + mid] = glassId;
      }

      for (let y = Math.floor(h * 0.45); y < tY1; y++) {
        for (let x = tX0 + 1; x < tX1; x++) {
          if (x !== mid) {
            types[y * w + x] = saltWaterId;
          }
        }
      }

      const rod1X = Math.floor((tX0 + mid) / 2);
      const rod2X = Math.floor((mid + tX1) / 2);
      for (let y = Math.floor(h * 0.4); y < tY1 - 3; y++) {
        types[y * w + rod1X] = metalId;
        types[y * w + rod2X] = metalId;
      }

      types[(tY1 - 2) * w + rod1X] = elecId;
      types[(tY1 - 2) * w + rod2X] = elecId;
      types[tY0 * w + rod1X] = sparkId;

      return { types, temps };
    },
  },
  {
    id: 'nuclear_reactor',
    name: 'Nuclear Reactor Core',
    category: 'physics',
    description: 'Enriched Uranium fuel core submerged in water cooling jacket with Cryo-Coolers.',
    setup: (w: number, h: number) => {
      const types = new Uint8Array(w * h);
      const temps = new Int16Array(w * h);
      temps.fill(22);

      const wallId = idOf('wall', 1);
      const metalId = idOf('metal', 17);
      const waterId = idOf('water', 10);
      const uraniumId = idOf('uranium', 38);
      const coolerId = idOf('cooler', 40);

      for (let x = 0; x < w; x++) {
        types[x] = wallId;
        types[(h - 1) * w + x] = wallId;
      }
      for (let y = 0; y < h; y++) {
        types[y * w] = wallId;
        types[y * w + (w - 1)] = wallId;
      }

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h * 0.6);
      const radius = Math.floor(Math.min(w, h) * 0.3);

      for (let y = cy - radius; y <= cy + radius; y++) {
        for (let x = cx - radius; x <= cx + radius; x++) {
          const dist = Math.hypot(x - cx, y - cy);
          const idx = y * w + x;
          if (dist >= radius - 2 && dist <= radius) {
            types[idx] = metalId;
          } else if (dist < radius - 2) {
            types[idx] = waterId;
          }
        }
      }

      for (let y = cy - 6; y <= cy + 6; y++) {
        for (let x = cx - 6; x <= cx + 6; x++) {
          const idx = y * w + x;
          types[idx] = uraniumId;
          temps[idx] = 280;
        }
      }

      for (let y = cy - 14; y <= cy + 14; y += 4) {
        types[y * w + (cx - 16)] = coolerId;
        types[y * w + (cx + 16)] = coolerId;
        temps[y * w + (cx - 16)] = -120;
        temps[y * w + (cx + 16)] = -120;
      }

      return { types, temps };
    },
  },
  {
    id: 'nitro_demolition',
    name: 'Demolition Depot',
    category: 'destruction',
    description: 'Wood scaffolding loaded with Gunpowder kegs and Nitroglycerin vials ready for high-yield detonation.',
    setup: (w: number, h: number) => {
      const types = new Uint8Array(w * h);
      const temps = new Int16Array(w * h);
      temps.fill(22);

      const wallId = idOf('wall', 1);
      const woodId = idOf('wood', 2);
      const gunpowderId = idOf('gunpowder', 8);
      const nitroId = idOf('nitro', 23);
      const sparkId = idOf('spark', 37);

      for (let x = 0; x < w; x++) {
        types[x] = wallId;
        types[(h - 1) * w + x] = wallId;
      }
      for (let y = 0; y < h; y++) {
        types[y * w] = wallId;
        types[y * w + (w - 1)] = wallId;
      }

      const floorH = Math.floor(h * 0.2);
      for (let level = 1; level <= 3; level++) {
        const floorY = h - 2 - level * floorH;
        const x0 = Math.floor(w * 0.25);
        const x1 = Math.floor(w * 0.75);

        for (let x = x0; x <= x1; x++) {
          types[floorY * w + x] = woodId;
        }

        for (let y = floorY; y < floorY + floorH; y++) {
          types[y * w + x0] = woodId;
          types[y * w + x1] = woodId;
          types[y * w + Math.floor((x0 + x1) / 2)] = woodId;
        }

        for (let x = x0 + 4; x < x1 - 4; x++) {
          if (x % 6 === 0) continue;
          const isNitro = level === 3 && x % 4 === 0;
          for (let dy = 1; dy <= 4; dy++) {
            types[(floorY - dy) * w + x] = isNitro ? nitroId : gunpowderId;
          }
        }
      }

      const topY = Math.floor(h * 0.15);
      const midX = Math.floor(w * 0.5);
      types[topY * w + midX] = sparkId;

      return { types, temps };
    },
  },
];
