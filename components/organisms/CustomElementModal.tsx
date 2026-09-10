import React, { useState } from 'react';
import { X, Sliders, Beaker, Trash2, Check } from 'lucide-react';
import { ElementDefinition, ElementCategory, ElementState, ReactionEffect } from '../../lib/sandspiel/types';
import { customElementStore } from '../../lib/sandspiel/custom-element-store';
import { Button } from '../atoms/Button';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { ElementPropertiesTab } from './custom-element/ElementPropertiesTab';
import { ElementReactionsTab } from './custom-element/ElementReactionsTab';

export interface CustomElementModalProps {
  isOpen: boolean;
  elementToEdit?: ElementDefinition | null;
  allElements: ElementDefinition[];
  onClose: () => void;
  onSave: (element: ElementDefinition) => void;
}

export const CustomElementModal: React.FC<CustomElementModalProps> = ({
  isOpen,
  elementToEdit,
  allElements,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'reactions'>('properties');

  const [name, setName] = useState(elementToEdit?.name || 'Magma Jelly');
  const [category, setCategory] = useState<ElementCategory>(elementToEdit?.category || 'liquid');
  const [state, setState] = useState<ElementState>(elementToEdit?.state || 'liquid');
  const [colorR, setColorR] = useState(elementToEdit?.color[0] ?? 250);
  const [colorG, setColorG] = useState(elementToEdit?.color[1] ?? 80);
  const [colorB, setColorB] = useState(elementToEdit?.color[2] ?? 120);
  const [colorVariance, setColorVariance] = useState(elementToEdit?.colorVariance ?? 15);
  const [density, setDensity] = useState(elementToEdit?.density ?? 1100);
  const [viscosity, setViscosity] = useState(elementToEdit?.viscosity ?? 3);
  const [flammability, setFlammability] = useState(elementToEdit ? Math.round(elementToEdit.flammability * 100) : 40);
  const [burnTemp, setBurnTemp] = useState(elementToEdit?.burnTemp ?? 300);
  const [defaultTemp] = useState(elementToEdit?.defaultTemp ?? 25);
  const [boilingPoint, setBoilingPoint] = useState(elementToEdit?.boilingPoint ?? 180);
  const [boilProduct, setBoilProduct] = useState(elementToEdit?.boilProduct || 'fire');
  const [freezingPoint, setFreezingPoint] = useState(elementToEdit?.freezingPoint ?? -10);
  const [freezeProduct, setFreezeProduct] = useState(elementToEdit?.freezeProduct || 'wall');
  const [electricalConductivity, setElectricalConductivity] = useState(
    elementToEdit ? Math.round(elementToEdit.electricalConductivity * 100) : 50
  );
  const [corrosiveness, setCorrosiveness] = useState(
    elementToEdit ? Math.round(elementToEdit.corrosiveness * 100) : 0
  );
  const [description, setDescription] = useState(
    elementToEdit?.description || 'Custom synthesised laboratory compound with unique thermodynamic qualities.'
  );

  const [rxReactantB, setRxReactantB] = useState('water');
  const [rxResultA, setRxResultA] = useState('steam');
  const [rxResultB, setRxResultB] = useState('wall');
  const [rxChance, setRxChance] = useState(80);
  const [rxHeatDelta, setRxHeatDelta] = useState(150);
  const [rxPressure, setRxPressure] = useState(4);
  const [rxEffect, setRxEffect] = useState<ReactionEffect>('explode');

  if (!isOpen) return null;

  const currentKey = elementToEdit?.key || name.toLowerCase().replace(/[^a-z0-9_]/g, '_') || 'custom_el';

  const handleSave = () => {
    if (!name.trim()) return;
    const payload: Omit<ElementDefinition, 'id' | 'isCustom'> = {
      key: currentKey,
      name: name.trim(),
      category,
      state,
      color: [colorR, colorG, colorB],
      colorVariance,
      density,
      viscosity,
      flammability: flammability / 100,
      burnTemp,
      defaultTemp,
      heatConductivity: 0.5,
      corrosiveness: corrosiveness / 100,
      corrosionResistance: 0.5,
      electricalConductivity: electricalConductivity / 100,
      boilingPoint,
      boilProduct: boilProduct || null,
      freezingPoint,
      freezeProduct: freezeProduct || null,
      life: 0,
      description: description.trim(),
    };

    let saved: ElementDefinition;
    if (elementToEdit && elementToEdit.isCustom) {
      customElementStore.updateCustomElement(elementToEdit.id, payload);
      saved = { ...elementToEdit, ...payload };
    } else {
      saved = customElementStore.createCustomElement(payload);
    }
    onSave(saved);
    onClose();
  };

  const handleDelete = () => {
    if (elementToEdit && elementToEdit.isCustom) {
      customElementStore.deleteCustomElement(elementToEdit.id);
      onClose();
    }
  };

  const handleAddReaction = () => {
    customElementStore.addCustomReaction({
      reactantA: currentKey,
      reactantB: rxReactantB,
      resultA: rxResultA || null,
      resultB: rxResultB || null,
      chance: rxChance / 100,
      heatDelta: rxHeatDelta,
      pressureDelta: rxPressure,
      effect: rxEffect,
      description: `${name} reacts with ${rxReactantB}`,
    });
  };

  const currentReactions = customElementStore
    .getAllReactions()
    .filter((r) => r.reactantA === currentKey || r.reactantB === currentKey);

  return (
    <div
      id="custom-element-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="custom-element-modal-content"
        className="bg-[#12151f] border border-[#272d40] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23293c] bg-[#171b28]">
          <div className="flex items-center gap-2.5">
            <ColorSwatch color={[colorR, colorG, colorB]} size="lg" />
            <div>
              <h2 className="text-sm font-semibold font-mono text-[#e4e7f5] flex items-center gap-2">
                {elementToEdit ? `Edit: ${elementToEdit.name}` : 'Element Property Synthesizer'}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Custom
                </span>
              </h2>
              <p className="text-[11px] font-mono text-[#767e9c]">
                Configure physical states, thermal phase transitions & reaction rules
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#7c85a4] hover:text-[#e4e7f5] hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-[#23293c] px-5 bg-[#141824]">
          <button
            id="tab-properties"
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-mono text-xs transition-colors ${
              activeTab === 'properties'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-[#7c85a4] hover:text-[#d8dceb]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Physical Properties
          </button>
          <button
            id="tab-reactions"
            type="button"
            onClick={() => setActiveTab('reactions')}
            className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-mono text-xs transition-colors ${
              activeTab === 'reactions'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-[#7c85a4] hover:text-[#d8dceb]'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" />
            Chemical Reactions ({currentReactions.length})
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {activeTab === 'properties' ? (
            <ElementPropertiesTab
              name={name}
              setName={setName}
              state={state}
              setState={setState}
              setCategory={setCategory}
              colorR={colorR}
              setColorR={setColorR}
              colorG={colorG}
              setColorG={setColorG}
              colorB={colorB}
              setColorB={setColorB}
              colorVariance={colorVariance}
              setColorVariance={setColorVariance}
              density={density}
              setDensity={setDensity}
              viscosity={viscosity}
              setViscosity={setViscosity}
              flammability={flammability}
              setFlammability={setFlammability}
              burnTemp={burnTemp}
              setBurnTemp={setBurnTemp}
              electricalConductivity={electricalConductivity}
              setElectricalConductivity={setElectricalConductivity}
              corrosiveness={corrosiveness}
              setCorrosiveness={setCorrosiveness}
              boilingPoint={boilingPoint}
              setBoilingPoint={setBoilingPoint}
              boilProduct={boilProduct}
              setBoilProduct={setBoilProduct}
              freezingPoint={freezingPoint}
              setFreezingPoint={setFreezingPoint}
              freezeProduct={freezeProduct}
              setFreezeProduct={setFreezeProduct}
              description={description}
              setDescription={setDescription}
              allElements={allElements}
            />
          ) : (
            <ElementReactionsTab
              name={name}
              allElements={allElements}
              rxReactantB={rxReactantB}
              setRxReactantB={setRxReactantB}
              rxResultA={rxResultA}
              setRxResultA={setRxResultA}
              rxResultB={rxResultB}
              setRxResultB={setRxResultB}
              rxEffect={rxEffect}
              setRxEffect={setRxEffect}
              rxChance={rxChance}
              setRxChance={setRxChance}
              rxHeatDelta={rxHeatDelta}
              setRxHeatDelta={setRxHeatDelta}
              rxPressure={rxPressure}
              setRxPressure={setRxPressure}
              onAddReaction={handleAddReaction}
              currentReactions={currentReactions}
              onDeleteReaction={(id) => customElementStore.deleteCustomReaction(id)}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-[#23293c] bg-[#171b28]">
          {elementToEdit && elementToEdit.isCustom ? (
            <Button size="sm" variant="danger" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5" />
              Delete Element
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button id="save-custom-element-btn" size="sm" variant="primary" onClick={handleSave}>
              <Check className="w-3.5 h-3.5" />
              {elementToEdit ? 'Save Changes' : 'Create Element'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
