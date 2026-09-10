import { PRESET_SCENES } from './scenes';
import { PresetScene } from '../types';

export { PRESET_SCENES };

export function getPresetById(id: string): PresetScene | undefined {
  return PRESET_SCENES.find((p) => p.id === id);
}
