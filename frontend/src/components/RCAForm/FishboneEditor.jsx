import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFishboneFactor, removeFishboneFactor } from '../../store/rcaSlice';
import { 
  Cpu, 
  BookOpen, 
  FlaskConical, 
  Users, 
  Gauge, 
  Wind, 
  Plus, 
  X,
  Layers
} from 'lucide-react';

const CATEGORY_CONFIG = {
  machine: {
    label: "Machine / Equipment",
    icon: Cpu,
    color: "from-blue-600 to-blue-800",
    border: "border-blue-200",
    bg: "bg-blue-50/40",
    badge: "bg-blue-100 text-blue-800",
    desc: "Reactors, valves, pumps, sensors, utilities, mechanical seals"
  },
  method: {
    label: "Method / Procedures",
    icon: BookOpen,
    color: "from-purple-600 to-purple-800",
    border: "border-purple-200",
    bg: "bg-purple-50/40",
    badge: "bg-purple-100 text-purple-800",
    desc: "SOPs, recipes, batch records, validation limits, MOC"
  },
  material: {
    label: "Material / Raw Inputs",
    icon: FlaskConical,
    color: "from-amber-600 to-amber-800",
    border: "border-amber-200",
    bg: "bg-amber-50/40",
    badge: "bg-amber-100 text-amber-800",
    desc: "Starting materials, reagents, solvents, seed crystals, purity"
  },
  man: {
    label: "Man / Personnel",
    icon: Users,
    color: "from-rose-600 to-rose-800",
    border: "border-rose-200",
    bg: "bg-rose-50/40",
    badge: "bg-rose-100 text-rose-800",
    desc: "Training, execution, shift handover, supervision, ergonomics"
  },
  measurement: {
    label: "Measurement / Testing",
    icon: Gauge,
    color: "from-teal-600 to-teal-800",
    border: "border-teal-200",
    bg: "bg-teal-50/40",
    badge: "bg-teal-100 text-teal-800",
    desc: "HPLC methods, probe calibration, sampling, system suitability"
  },
  milieu: {
    label: "Milieu / Environment",
    icon: Wind,
    color: "from-emerald-600 to-emerald-800",
    border: "border-emerald-200",
    bg: "bg-emerald-50/40",
    badge: "bg-emerald-100 text-emerald-800",
    desc: "Cleanroom HVAC, ambient temperature, humidity, pressure diff"
  }
};

export const FishboneEditor = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.rca);
  const fishbone = formData.fishbone_data || {};

  const [inputState, setInputState] = useState({
    machine: '',
    method: '',
    material: '',
    man: '',
    measurement: '',
    milieu: ''
  });

  const handleAdd = (cat) => {
    const text = inputState[cat]?.trim();
    if (!text) return;
    dispatch(addFishboneFactor({ category: cat, text }));
    setInputState(prev => ({ ...prev, [cat]: '' }));
  };

  const handleRemove = (cat, idx) => {
    dispatch(removeFishboneFactor({ category: cat, index: idx }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>3. Fishbone (Ishikawa 6Ms) Root Cause Mapping</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Systematic categorization of contributing factors across all 6 manufacturing dimensions in API synthesis.
          </p>
        </div>
      </div>

      {/* Visual Fishbone Spine Overview */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Ishikawa 6Ms Diagram Synthesis
          </span>
          <span className="text-[11px] text-pharma-400 font-medium">
            Problem Spine: {formData.title ? formData.title.substring(0, 50) + '...' : 'API Quality Deviation'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const factors = fishbone[key] || [];
            const Icon = config.icon;

            return (
              <div key={key} className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
                <div className="flex items-center space-x-2 mb-1.5 text-pharma-300">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="font-bold text-[11px]">{config.label.split('/')[0]}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">({factors.length})</span>
                </div>
                <div className="space-y-1">
                  {factors.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic">No factors identified</span>
                  ) : (
                    factors.slice(0, 2).map((f, i) => (
                      <p key={i} className="text-[11px] text-slate-300 truncate">
                        • {f}
                      </p>
                    ))
                  )}
                  {factors.length > 2 && (
                    <span className="text-[9px] text-pharma-400">+{factors.length - 2} more...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive 6M Factor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const factors = fishbone[key] || [];
          const Icon = config.icon;

          return (
            <div
              key={key}
              className={`rounded-xl border ${config.border} ${config.bg} p-4 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {config.label}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {config.desc}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                    {factors.length}
                  </span>
                </div>

                {/* Factors List */}
                <div className="space-y-1.5 mb-3 mt-3">
                  {factors.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No factors currently assigned under this branch.
                    </p>
                  ) : (
                    factors.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs"
                      >
                        <span className="text-slate-800 leading-snug pr-2">{item}</span>
                        <button
                          onClick={() => handleRemove(key, idx)}
                          className="text-slate-400 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                          title="Remove factor"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Factor Input */}
              <div className="flex items-center space-x-1.5 mt-2">
                <input
                  type="text"
                  value={inputState[key]}
                  onChange={(e) => setInputState(prev => ({ ...prev, [key]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd(key))}
                  placeholder={`Add ${key} factor...`}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-300 focus:border-pharma-500 outline-none bg-white text-slate-900"
                />
                <button
                  onClick={() => handleAdd(key)}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-pharma-500 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
