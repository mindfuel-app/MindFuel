import React from 'react';

interface BreathingControlsProps {
  inhale: number;
  hold: number;
  exhale: number;
  setInhale: (value: number) => void;
  setHold: (value: number) => void;
  setExhale: (value: number) => void;
  enableVibration: boolean;
  setEnableVibration: (value: boolean) => void;
}

const BreathingControls: React.FC<BreathingControlsProps> = ({
  inhale,
  hold,
  exhale,
  setInhale,
  setHold,
  setExhale,
  enableVibration,
  setEnableVibration,
}) => {
  return (
    <div className='m-0'>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Inhalar', value: inhale, onChange: setInhale },
          { label: 'Mantener', value: hold, onChange: setHold },
          { label: 'Exhalar', value: exhale, onChange: setExhale },
        ].map(({ label, value, onChange }) => (
          <div key={label} className="text-center">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              {label}
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-10 px-2 py-1 text-center border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-xs text-slate-500 mt-1">segundos</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <label className="flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            checked={enableVibration}
            onChange={() => setEnableVibration(!enableVibration)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          {enableVibration
            ? <span className="text-sm text-slate-600">Vibración habilitada</span>
            : <span className="text-sm text-slate-600">Habilitar vibracion</span>}
        </label>
      </div>
    </div>
  );
};

export default BreathingControls;
