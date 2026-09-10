export interface PresetScene {
  id: string;
  name: string;
  description: string;
  category: 'physics' | 'chemistry' | 'destruction' | 'ecosystem';
  setup: (
    width: number,
    height: number
  ) => {
    types: Uint8Array;
    temps: Int16Array;
  };
}
