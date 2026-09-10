/**
 * Thermal IR color mapping snippet for the physics worker
 */
export const THERMAL_PALETTE_CODE = `
function rgbToAbgr(r, g, b, a = 255) {
  return ((a & 0xFF) << 24) | ((b & 0xFF) << 16) | ((g & 0xFF) << 8) | (r & 0xFF);
}

function getThermalColor(celsius) {
  const t = Math.max(-50, Math.min(1200, celsius));
  let r = 0, g = 0, b = 0;
  if (t < 0) {
    const f = (t + 50) / 50;
    r = 20;
    g = Math.floor(80 * f);
    b = Math.floor(180 + 75 * f);
  } else if (t < 100) {
    const f = t / 100;
    r = Math.floor(20 * (1 - f));
    g = Math.floor(160 + 95 * f);
    b = Math.floor(255 * (1 - f));
  } else if (t < 400) {
    const f = (t - 100) / 300;
    r = Math.floor(255 * f);
    g = 255 - Math.floor(100 * f);
    b = 10;
  } else if (t < 800) {
    const f = (t - 400) / 400;
    r = 255;
    g = 155 - Math.floor(120 * f);
    b = 10;
  } else {
    const f = (t - 800) / 400;
    r = 255;
    g = Math.floor(35 + 220 * f);
    b = Math.floor(10 + 245 * f);
  }
  return rgbToAbgr(r, g, b);
}
`;
