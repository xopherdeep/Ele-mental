import React from 'react';
import { Sparkles } from 'lucide-react';
import { ElementDefinition, ElementCategory, ElementState } from '../../../lib/sandspiel/types';
import { Slider } from '../../atoms/Slider';
import { ColorSwatch } from '../../atoms/ColorSwatch';

export interface ElementPropertiesTabProps {
  name: string;
  setName: (v: string) => void;
  state: ElementState;
  setState: (v: ElementState) => void;
  setCategory: (v: ElementCategory) => void;
  colorR: number;
  setColorR: (v: number) => void;
  colorG: number;
  setColorG: (v: number) => void;
  colorB: number;
  setColorB: (v: number) => void;
  colorVariance: number;
  setColorVariance: (v: number) => void;
  density: number;
  setDensity: (v: number) => void;
  viscosity: number;
  setViscosity: (v: number) => void;
  flammability: number;
  setFlammability: (v: number) => void;
  burnTemp: number;
  setBurnTemp: (v: number) => void;
  electricalConductivity: number;
  setElectricalConductivity: (v: number) => void;
  corrosiveness: number;
  setCorrosiveness: (v: number) => void;
  boilingPoint: number;
  setBoilingPoint: (v: number) => void;
  boilProduct: string;
  setBoilProduct: (v: string) => void;
  freezingPoint: number;
  setFreezingPoint: (v: number) => void;
  freezeProduct: string;
  setFreezeProduct: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  allElements: ElementDefinition[];
}

export const ElementPropertiesTab: React.FC<ElementPropertiesTabProps> = ({
  name,
  setName,
  state,
  setState,
  setCategory,
  colorR,
  setColorR,
  colorG,
  setColorG,
  colorB,
  setColorB,
  colorVariance,
  setColorVariance,
  density,
  setDensity,
  viscosity,
  setViscosity,
  flammability,
  setFlammability,
  burnTemp,
  setBurnTemp,
  electricalConductivity,
  setElectricalConductivity,
  corrosiveness,
  setCorrosiveness,
  boilingPoint,
  setBoilingPoint,
  boilProduct,
  setBoilProduct,
  freezingPoint,
  setFreezingPoint,
  freezeProduct,
  setFreezeProduct,
  description,
  setDescription,
  allElements,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono text-[#9aa0b8] mb-1">Element Name</label>
          <input
            id="custom-el-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#191d2c] border border-[#2b3247] rounded-md px-3 py-1.5 text-xs font-mono text-[#e4e7f5] focus:outline-none focus:border-blue-500"
            placeholder="e.g. Pyroslime"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#9aa0b8] mb-1">State of Matter</label>
          <select
            id="custom-el-state-select"
            value={state}
            onChange={(e) => {
              const st = e.target.value as ElementState;
              setState(st);
              if (st === 'powder' || st === 'liquid' || st === 'gas' || st === 'solid') {
                setCategory(st as ElementCategory);
              }
            }}
            className="w-full bg-[#191d2c] border border-[#2b3247] rounded-md px-3 py-1.5 text-xs font-mono text-[#e4e7f5] focus:outline-none focus:border-blue-500"
          >
            <option value="solid">Solid (Static block)</option>
            <option value="powder">Powder (Falling grains)</option>
            <option value="liquid">Liquid (Flowing fluid)</option>
            <option value="gas">Gas (Buoyant vapor)</option>
            <option value="energy">Energy / Plasma</option>
          </select>
        </div>
      </div>

      <div className="p-3 bg-[#161a27] border border-[#262c3e] rounded-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#9aa0b8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Color Palette (RGB)
          </span>
          <div className="flex items-center gap-2">
            <ColorSwatch color={[colorR, colorG, colorB]} size="lg" />
            <span className="font-mono text-[11px] text-[#9aa0b8]">Preview</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Slider label="Red" value={colorR} min={0} max={255} onChange={setColorR} />
          <Slider label="Green" value={colorG} min={0} max={255} onChange={setColorG} />
          <Slider label="Blue" value={colorB} min={0} max={255} onChange={setColorB} />
        </div>
        <Slider
          label="Color Variance (Pixel Art Noise)"
          value={colorVariance}
          min={0}
          max={35}
          onChange={setColorVariance}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-[#161a27] border border-[#262c3e] rounded-xl">
        <Slider label="Density" value={density} min={-500} max={15000} step={50} unit=" kg/m³" onChange={setDensity} />
        <Slider label="Fluid Viscosity" value={viscosity} min={1} max={10} onChange={setViscosity} />
        <Slider label="Flammability" value={flammability} min={0} max={100} unit="%" onChange={setFlammability} />
        <Slider label="Ignition Temp" value={burnTemp} min={50} max={2000} unit="°C" onChange={setBurnTemp} />
        <Slider label="Electrical Cond." value={electricalConductivity} min={0} max={100} unit="%" onChange={setElectricalConductivity} />
        <Slider label="Corrosiveness" value={corrosiveness} min={0} max={100} unit="%" onChange={setCorrosiveness} />
      </div>

      <div className="p-3 bg-[#161a27] border border-[#262c3e] rounded-xl flex flex-col gap-3">
        <span className="text-xs font-mono text-[#9aa0b8]">Phase Transition Thresholds</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Slider label="Boiling Point" value={boilingPoint} min={0} max={2500} unit="°C" onChange={setBoilingPoint} />
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#767e9c]">Yields:</span>
              <select
                value={boilProduct}
                onChange={(e) => setBoilProduct(e.target.value)}
                className="bg-[#1c2132] border border-[#2b3247] rounded px-2 py-0.5 text-xs font-mono text-[#d8dceb]"
              >
                {allElements.map((el) => (
                  <option key={el.key} value={el.key}>{el.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Slider label="Freezing Point" value={freezingPoint} min={-200} max={500} unit="°C" onChange={setFreezingPoint} />
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#767e9c]">Yields:</span>
              <select
                value={freezeProduct}
                onChange={(e) => setFreezeProduct(e.target.value)}
                className="bg-[#1c2132] border border-[#2b3247] rounded px-2 py-0.5 text-xs font-mono text-[#d8dceb]"
              >
                {allElements.map((el) => (
                  <option key={el.key} value={el.key}>{el.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-[#9aa0b8] mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-[#191d2c] border border-[#2b3247] rounded-md px-3 py-1.5 text-xs font-mono text-[#e4e7f5] focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};
