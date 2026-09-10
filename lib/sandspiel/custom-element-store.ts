import { ElementDefinition, ChemicalReaction } from './types';
import { BASE_ELEMENTS } from './elements';
import { BASE_REACTIONS } from './reactions';

const STORAGE_KEY_ELEMENTS = 'sandspiel_custom_elements_v1';
const STORAGE_KEY_REACTIONS = 'sandspiel_custom_reactions_v1';

class CustomElementStore {
  private customElements: ElementDefinition[] = [];
  private customReactions: ChemicalReaction[] = [];
  private listeners: Set<() => void> = new Set();
  private nextId = 64;

  constructor() {
    this.load();
  }

  private load(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedEls = localStorage.getItem(STORAGE_KEY_ELEMENTS);
      if (storedEls) {
        this.customElements = JSON.parse(storedEls);
        const maxId = this.customElements.reduce((m, e) => Math.max(m, e.id), 63);
        this.nextId = maxId + 1;
      }
      const storedRxs = localStorage.getItem(STORAGE_KEY_REACTIONS);
      if (storedRxs) {
        this.customReactions = JSON.parse(storedRxs);
      }
    } catch (e) {
      console.error('Failed to load custom elements from storage', e);
    }
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_ELEMENTS, JSON.stringify(this.customElements));
      localStorage.setItem(STORAGE_KEY_REACTIONS, JSON.stringify(this.customReactions));
    } catch (e) {
      console.error('Failed to save custom elements to storage', e);
    }
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    for (const cb of this.listeners) {
      cb();
    }
  }

  public getAllElements(): ElementDefinition[] {
    return [...BASE_ELEMENTS, ...this.customElements];
  }

  public getCustomElements(): ElementDefinition[] {
    return [...this.customElements];
  }

  public getAllReactions(): ChemicalReaction[] {
    return [...BASE_REACTIONS, ...this.customReactions];
  }

  public getCustomReactions(): ChemicalReaction[] {
    return [...this.customReactions];
  }

  public createCustomElement(partial: Omit<ElementDefinition, 'id' | 'isCustom'>): ElementDefinition {
    const id = this.nextId++;
    const key = partial.key.toLowerCase().replace(/[^a-z0-9_]/g, '_') || `custom_${id}`;
    const newEl: ElementDefinition = {
      ...partial,
      id,
      key,
      isCustom: true,
    };
    this.customElements.push(newEl);
    this.save();
    return newEl;
  }

  public updateCustomElement(id: number, updates: Partial<ElementDefinition>): boolean {
    const idx = this.customElements.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.customElements[idx] = {
      ...this.customElements[idx],
      ...updates,
      id, // protect id
      isCustom: true,
    };
    this.save();
    return true;
  }

  public deleteCustomElement(id: number): boolean {
    const initialLen = this.customElements.length;
    this.customElements = this.customElements.filter((e) => e.id !== id);
    if (this.customElements.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public addCustomReaction(reaction: Omit<ChemicalReaction, 'id' | 'isCustom'>): ChemicalReaction {
    const newRx: ChemicalReaction = {
      ...reaction,
      id: `custom_rx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      isCustom: true,
    };
    this.customReactions.push(newRx);
    this.save();
    return newRx;
  }

  public deleteCustomReaction(id: string): boolean {
    const initialLen = this.customReactions.length;
    this.customReactions = this.customReactions.filter((r) => r.id !== id);
    if (this.customReactions.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public resetAllToFactory(): void {
    this.customElements = [];
    this.customReactions = [];
    this.nextId = 64;
    this.save();
  }

  public exportConfigJson(): string {
    return JSON.stringify(
      {
        customElements: this.customElements,
        customReactions: this.customReactions,
        version: 1,
      },
      null,
      2
    );
  }

  public importConfigJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.customElements)) {
        this.customElements = data.customElements.map((e: ElementDefinition) => ({
          ...e,
          isCustom: true,
        }));
        const maxId = this.customElements.reduce((m, e) => Math.max(m, e.id), 63);
        this.nextId = maxId + 1;
      }
      if (Array.isArray(data.customReactions)) {
        this.customReactions = data.customReactions.map((r: ChemicalReaction) => ({
          ...r,
          isCustom: true,
        }));
      }
      this.save();
      return true;
    } catch (e) {
      console.error('Failed to parse import config', e);
      return false;
    }
  }
}

export const customElementStore = new CustomElementStore();
