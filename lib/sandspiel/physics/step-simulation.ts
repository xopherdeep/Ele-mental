/**
 * Core Physics Step Cellular Automata Simulation Code for Web Worker
 */
export const STEP_SIMULATION_CODE = `
function step() {
  currentTick++;
  flags.fill(0);

  const fireId = 24;
  const smokeId = 25;
  const sparkId = 37;
  const plasmaId = 31;
  const elecId = 36;
  const voidId = 43;
  const cloneId = 42;

  const dirX = gravityX > 0 ? 1 : (gravityX < 0 ? -1 : 0);
  const dirY = gravityY > 0 ? 1 : (gravityY < 0 ? -1 : 0);

  // Stagger scan direction each tick to eliminate directional bias
  const xStart = (currentTick % 2 === 0) ? 0 : width - 1;
  const xEnd = (currentTick % 2 === 0) ? width : -1;
  const xStep = (currentTick % 2 === 0) ? 1 : -1;

  // Scan bottom-to-top for normal gravity; top-to-bottom for inverted gravity
  const yStart = dirY >= 0 ? height - 1 : 0;
  const yEnd = dirY >= 0 ? -1 : height;
  const yStep = dirY >= 0 ? -1 : 1;

  for (let y = yStart; y !== yEnd; y += yStep) {
    const row = y * width;
    for (let x = xStart; x !== xEnd; x += xStep) {
      const idx = row + x;
      const type = types[idx];
      if (type === 0) continue;
      if (flags[idx] === currentTick) continue;

      const state = elState[type];
      const curTemp = temps[idx];

      // 1. Lifespan & Transient element decays
      if (life[idx] > 0) {
        life[idx]--;
        if (life[idx] === 0) {
          if (type === fireId) {
            types[idx] = (Math.random() < 0.35) ? smokeId : 0;
            life[idx] = 120;
          } else if (type === sparkId || type === elecId) {
            types[idx] = 0;
          } else if (type === plasmaId) {
            types[idx] = (Math.random() < 0.5) ? fireId : 0;
            life[idx] = 30;
          } else {
            types[idx] = 0;
          }
          continue;
        }
      }

      // 2. Thermal Phase Changes & Auto-Ignition
      if (curTemp >= elBoilPoint[type]) {
        const prod = elBoilProd[type];
        if (prod > 0) {
          types[idx] = prod;
          life[idx] = elDefaultLife[prod];
          continue;
        }
      }
      if (curTemp <= elFreezePoint[type]) {
        const prod = elFreezeProd[type];
        if (prod > 0) {
          types[idx] = prod;
          life[idx] = elDefaultLife[prod];
          continue;
        }
      }
      if (curTemp >= elBurnTemp[type] && elFlammability[type] > 0) {
        if (Math.random() < elFlammability[type]) {
          types[idx] = fireId;
          life[idx] = 40 + Math.floor(Math.random() * 30);
          temps[idx] += 300;
          continue;
        }
      }

      // 3. Constant Thermal Nodes
      if (type === 39) { // Heater
        temps[idx] = 500;
      } else if (type === 40) { // Cooler
        temps[idx] = -150;
      } else if (type === 38) { // Uranium
        temps[idx] = Math.max(temps[idx], 250);
        if (Math.random() < 0.03) {
          temps[idx] += 40;
        }
      }

      // 4. Neighbor Index Cache
      const neighbors = [];
      if (x > 0) neighbors.push(idx - 1);
      if (x < width - 1) neighbors.push(idx + 1);
      if (y > 0) neighbors.push(idx - width);
      if (y < height - 1) neighbors.push(idx + width);

      // Thermal & Electrical Diffusion
      const k = elHeatCond[type];
      if (k > 0) {
        for (let i = 0; i < neighbors.length; i++) {
          const nIdx = neighbors[i];
          const nType = types[nIdx];
          const diff = temps[idx] - temps[nIdx];
          if (diff !== 0) {
            const transfer = Math.floor(diff * k * 0.25);
            temps[idx] -= transfer;
            temps[nIdx] += transfer;
          }

          if (type === elecId && elElecCond[nType] > 0.4) {
            if (types[nIdx] !== elecId && Math.random() < elElecCond[nType]) {
              types[nIdx] = elecId;
              life[nIdx] = 4;
              temps[nIdx] += 50;
              flags[nIdx] = currentTick;
            }
          }
        }
      }

      // 5. Chemical Reactions
      let reacted = false;
      for (let i = 0; i < neighbors.length; i++) {
        const nIdx = neighbors[i];
        const nType = types[nIdx];
        if (nType === 0) continue;

        if (type === voidId && nType !== voidId) {
          types[nIdx] = 0;
          continue;
        }
        if (type === cloneId && nType !== cloneId && nType !== 0) {
          for (let j = 0; j < neighbors.length; j++) {
            if (types[neighbors[j]] === 0) {
              types[neighbors[j]] = nType;
              temps[neighbors[j]] = temps[nIdx];
              flags[neighbors[j]] = currentTick;
              break;
            }
          }
          continue;
        }

        const rx = reactionMap.get(rxKey(type, nType));
        if (rx && Math.random() < rx.chance) {
          if (rx.destroyA) {
            types[idx] = 0;
          } else if (rx.resA > 0) {
            types[idx] = rx.resA;
            life[idx] = elDefaultLife[rx.resA];
          }

          if (rx.destroyB) {
            types[nIdx] = 0;
          } else if (rx.resB > 0) {
            types[nIdx] = rx.resB;
            life[nIdx] = elDefaultLife[rx.resB];
          }

          temps[idx] += rx.heatDelta;
          temps[nIdx] += rx.heatDelta;

          if (rx.pressureDelta > 0) {
            const rad = Math.min(8, Math.floor(rx.pressureDelta));
            for (let dy = -rad; dy <= rad; dy++) {
              for (let dx = -rad; dx <= rad; dx++) {
                const px = x + dx;
                const py = y + dy;
                if (px >= 0 && px < width && py >= 0 && py < height) {
                  const pIdx = py * width + px;
                  const pType = types[pIdx];
                  if (pType !== 1) {
                    vx[pIdx] += dx * (rx.pressureDelta * 0.4);
                    vy[pIdx] += dy * (rx.pressureDelta * 0.4);
                    temps[pIdx] += rx.heatDelta * 0.3;
                    if (rx.effect === 'explode' && Math.random() < 0.15 && pType === 0) {
                      types[pIdx] = sparkId;
                      life[pIdx] = 15;
                    }
                  }
                }
              }
            }
          }

          flags[idx] = currentTick;
          flags[nIdx] = currentTick;
          reacted = true;
          break;
        }
      }
      if (reacted) continue;

      // 6. Cellular Automata Movement
      if (state === 1) continue; // Static Solid

      // Powder Movement
      if (state === 2) {
        if (dirY !== 0) {
          // Buoyancy: if submerged in a denser liquid, float upwards
          const floatY = y - dirY;
          if (floatY >= 0 && floatY < height) {
            const upIdx = floatY * width + x;
            const upType = types[upIdx];
            if (elState[upType] === 3 && elDensity[upType] > elDensity[type]) {
              swap(idx, upIdx);
              flags[upIdx] = currentTick;
              continue;
            }
          }

          const targetY = y + dirY;
          if (targetY >= 0 && targetY < height) {
            const belowIdx = targetY * width + x;
            const belowType = types[belowIdx];

            if (belowType === 0 || (elState[belowType] === 3 && elDensity[belowType] < elDensity[type])) {
              swap(idx, belowIdx);
              flags[belowIdx] = currentTick;
              continue;
            }

            const leftFirst = (currentTick + x) % 2 === 0;
            const offsets = leftFirst ? [-1, 1] : [1, -1];
            let slipped = false;
            for (let o = 0; o < 2; o++) {
              const ox = x + offsets[o];
              if (ox >= 0 && ox < width) {
                const diagIdx = targetY * width + ox;
                const diagType = types[diagIdx];
                if (diagType === 0 || (elState[diagType] === 3 && elDensity[diagType] < elDensity[type])) {
                  swap(idx, diagIdx);
                  flags[diagIdx] = currentTick;
                  slipped = true;
                  break;
                }
              }
            }
            if (slipped) continue;
          }
        } else if (dirX !== 0) {
          // Gravity Right / Left
          const targetX = x + dirX;
          if (targetX >= 0 && targetX < width) {
            const sideIdx = y * width + targetX;
            const sideType = types[sideIdx];
            if (sideType === 0 || (elState[sideType] === 3 && elDensity[sideType] < elDensity[type])) {
              swap(idx, sideIdx);
              flags[sideIdx] = currentTick;
              continue;
            }
            const upFirst = (currentTick + y) % 2 === 0;
            const yOffsets = upFirst ? [-1, 1] : [1, -1];
            let slipped = false;
            for (let o = 0; o < 2; o++) {
              const oy = y + yOffsets[o];
              if (oy >= 0 && oy < height) {
                const diagIdx = oy * width + targetX;
                const diagType = types[diagIdx];
                if (diagType === 0 || (elState[diagType] === 3 && elDensity[diagType] < elDensity[type])) {
                  swap(idx, diagIdx);
                  flags[diagIdx] = currentTick;
                  slipped = true;
                  break;
                }
              }
            }
            if (slipped) continue;
          }
        }

        // Special Ant tunneling
        if (type === 35) {
          const randDir = (Math.random() < 0.5) ? -1 : 1;
          const targetX = x + randDir;
          if (targetX >= 0 && targetX < width) {
            const sIdx = y * width + targetX;
            const sType = types[sIdx];
            if (sType === 0) {
              swap(idx, sIdx);
              flags[sIdx] = currentTick;
            } else if (sType === 7 || sType === 2) {
              types[sIdx] = (sType === 2) ? 12 : 0;
              swap(idx, sIdx);
              flags[sIdx] = currentTick;
            }
          }
        }
        continue;
      }

      // Liquid Movement
      if (state === 3) {
        let moved = false;
        if (dirY !== 0) {
          const targetY = y + dirY;
          if (targetY >= 0 && targetY < height) {
            const belowIdx = targetY * width + x;
            const belowType = types[belowIdx];
            if (belowType === 0 || ((elState[belowType] === 2 || elState[belowType] === 3 || elState[belowType] === 4) && elDensity[belowType] < elDensity[type])) {
              swap(idx, belowIdx);
              flags[belowIdx] = currentTick;
              moved = true;
            } else {
              // Diagonal down slip
              const leftFirst = (currentTick + x) % 2 === 0;
              const offsets = leftFirst ? [-1, 1] : [1, -1];
              for (let o = 0; o < 2; o++) {
                const ox = x + offsets[o];
                if (ox >= 0 && ox < width) {
                  const diagIdx = targetY * width + ox;
                  const diagType = types[diagIdx];
                  if (diagType === 0 || ((elState[diagType] === 2 || elState[diagType] === 3) && elDensity[diagType] < elDensity[type])) {
                    swap(idx, diagIdx);
                    flags[diagIdx] = currentTick;
                    moved = true;
                    break;
                  }
                }
              }
            }
          }
          if (moved) continue;

          // Lateral dispersion
          const visc = elViscosity[type];
          const flowDir = (currentTick + y + x) % 2 === 0 ? 1 : -1;
          const dirs = [flowDir, -flowDir];
          for (let d = 0; d < 2; d++) {
            const dir = dirs[d];
            let maxDist = 0;
            for (let s = 1; s <= visc; s++) {
              const tx = x + dir * s;
              if (tx < 0 || tx >= width) break;
              const tIdx = y * width + tx;
              const tType = types[tIdx];
              if (tType === 0 || (elState[tType] === 3 && elDensity[tType] < elDensity[type])) {
                maxDist = s;
              } else {
                break;
              }
            }
            if (maxDist > 0) {
              const destIdx = y * width + (x + dir * maxDist);
              swap(idx, destIdx);
              flags[destIdx] = currentTick;
              break;
            }
          }
        } else if (dirX !== 0) {
          // Horizontal gravity liquid flow
          const targetX = x + dirX;
          if (targetX >= 0 && targetX < width) {
            const sideIdx = y * width + targetX;
            const sideType = types[sideIdx];
            if (sideType === 0 || (elState[sideType] === 3 && elDensity[sideType] < elDensity[type])) {
              swap(idx, sideIdx);
              flags[sideIdx] = currentTick;
              moved = true;
            }
          }
          if (moved) continue;
          const visc = elViscosity[type];
          const flowDir = (currentTick + y + x) % 2 === 0 ? 1 : -1;
          const dirs = [flowDir, -flowDir];
          for (let d = 0; d < 2; d++) {
            const dir = dirs[d];
            let maxDist = 0;
            for (let s = 1; s <= visc; s++) {
              const ty = y + dir * s;
              if (ty < 0 || ty >= height) break;
              const tIdx = ty * width + x;
              const tType = types[tIdx];
              if (tType === 0 || (elState[tType] === 3 && elDensity[tType] < elDensity[type])) {
                maxDist = s;
              } else {
                break;
              }
            }
            if (maxDist > 0) {
              const destIdx = (y + dir * maxDist) * width + x;
              swap(idx, destIdx);
              flags[destIdx] = currentTick;
              break;
            }
          }
        }
        continue;
      }

      // Gas Movement (Buoyant drift)
      if (state === 4) {
        const gasRiseY = dirY !== 0 ? -dirY : 0;
        const gasRiseX = dirX !== 0 ? -dirX : 0;
        let moved = false;

        if (gasRiseY !== 0) {
          const targetY = y + gasRiseY;
          if (targetY >= 0 && targetY < height) {
            const aboveIdx = targetY * width + x;
            const aboveType = types[aboveIdx];
            if (aboveType === 0 || (elState[aboveType] === 4 && elDensity[aboveType] > elDensity[type]) || elState[aboveType] === 3) {
              swap(idx, aboveIdx);
              flags[aboveIdx] = currentTick;
              moved = true;
            } else {
              const randX = (Math.random() < 0.5) ? -1 : 1;
              const diagX = x + randX;
              if (diagX >= 0 && diagX < width) {
                const dIdx = targetY * width + diagX;
                const dType = types[dIdx];
                if (dType === 0 || elState[dType] === 3) {
                  swap(idx, dIdx);
                  flags[dIdx] = currentTick;
                  moved = true;
                }
              }
            }
          }
        }
        if (moved) continue;

        // Brownian sideways dispersion
        if (Math.random() < 0.6) {
          const randDx = (Math.random() < 0.5) ? -1 : 1;
          const sideX = x + randDx;
          if (sideX >= 0 && sideX < width) {
            const sIdx = y * width + sideX;
            if (types[sIdx] === 0) {
              swap(idx, sIdx);
              flags[sIdx] = currentTick;
            }
          }
        }
        continue;
      }

      // Energy Movement (Chaotic Drift)
      if (state === 5) {
        const driftY = dirY !== 0 ? -dirY : 0;
        const dx = Math.floor((Math.random() - 0.5) * 3);
        const dy = driftY + Math.floor((Math.random() - 0.5) * 2);
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (types[nIdx] === 0) {
            swap(idx, nIdx);
            flags[nIdx] = currentTick;
          }
        }
        continue;
      }
    }
  }
}
`;
