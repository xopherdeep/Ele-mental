export const THEME = {
  bg: '#0f111a',
  surface: '#181b26',
  surfaceBorder: '#292e42',
  surfaceHover: '#222736',
  textPrimary: '#e4e7f5',
  textSecondary: '#9aa0b8',
  textMuted: '#6b728d',
  accent: '#4f8eff',
  accentHover: '#3b78eb',
  danger: '#ff5c5c',
  success: '#38db89',
  warning: '#fca311',
};

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  solid: { bg: 'bg-stone-900/60', text: 'text-stone-300', border: 'border-stone-700' },
  powder: { bg: 'bg-amber-950/50', text: 'text-amber-300', border: 'border-amber-800' },
  liquid: { bg: 'bg-blue-950/60', text: 'text-blue-300', border: 'border-blue-700' },
  gas: { bg: 'bg-purple-950/50', text: 'text-purple-300', border: 'border-purple-700' },
  life: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-700' },
  energy: { bg: 'bg-yellow-950/60', text: 'text-yellow-300', border: 'border-yellow-700' },
  special: { bg: 'bg-pink-950/50', text: 'text-pink-300', border: 'border-pink-700' },
  custom: { bg: 'bg-cyan-950/60', text: 'text-cyan-300', border: 'border-cyan-700' },
};

export function formatTemp(celsius: number): string {
  return `${Math.round(celsius)}°C`;
}

export function formatDensity(density: number): string {
  if (density < 0) return `${density} (buoyant)`;
  return `${density} kg/m³`;
}
