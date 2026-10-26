import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateFiveWhyStep, 
  addFiveWhyStep, 
  removeFiveWhyStep 
} from '../../store/rcaSlice';
import { AiSuggestionBadge } from '../common/AiSuggestionBadge';
import { 
  HelpCircle, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ArrowDown, 
  FileText,
  ShieldCheck
} from 'lucide-react';

export const FiveWhysEditor = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.rca);
  const steps = formData.five_whys_data || [];

  const handleUpdate = (index, field, value) => {
    dispatch(updateFiveWhyStep({ index, field, value }));
  };

  const handleToggleVerified = (index, currentVal) => {
    dispatch(updateFiveWhyStep({ index, field: 'verified', value: !currentVal }));
  };

  const handleAdd = () => {
    dispatch(addFiveWhyStep());
  };

  const handleRemove = (index) => {
    if (steps.length <= 1) {
      alert("At least one Why step is required.");
      return;
    }
    dispatch(removeFiveWhyStep(index));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>2. 5 Whys Causal Hierarchy Analysis</span>
            <span className="text-xs bg-pharma-100 text-pharma-800 font-semibold px-2 py-0.5 rounded">
              {steps.length} Steps
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential root cause drill-down from observable effect to fundamental system failure. AI suggestions require investigator verification.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-pharma-700 bg-pharma-50 hover:bg-pharma-100 border border-pharma-200 transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Why Step</span>
        </button>
      </div>

      {/* Steps List */}
      <div className="relative space-y-4">
        {steps.map((item, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-5 top-12 bottom-[-18px] w-0.5 bg-slate-200 z-0" />
              )}

              <div className={`p-4 rounded-xl border transition-all relative z-10 ${
                item.verified 
                  ? 'border-emerald-300 bg-emerald-50/20' 
                  : isLast 
                    ? 'border-indigo-300 bg-indigo-50/20 shadow-sm' 
                    : 'border-slate-200 bg-slate-50/50'
              }`}>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.verified
                        ? 'bg-emerald-600 text-white'
                        : isLast
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                          : 'bg-slate-700 text-white'
                    }`}>
                      W{item.step || index + 1}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        Level {item.step || index + 1}
                        {isLast && ' (Derived Fundamental Root Cause)'}
                      </span>
                      {item.ai_suggested && (
                        <div className="mt-0.5">
                          <AiSuggestionBadge isSuggested={!item.verified} isVerified={item.verified} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Verified Toggle */}
                    <button
                      onClick={() => handleToggleVerified(index, item.verified)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        item.verified
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-400'
                      }`}
                      title="Confirm evidence verifies this step"
                    >
                      {item.verified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Confirmed by QA</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Mark Verified</span>
                        </>
                      )}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove this step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form fields for this Why step */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Why Question
                    </label>
                    <input
                      type="text"
                      value={item.why_question || ''}
                      onChange={(e) => handleUpdate(index, 'why_question', e.target.value)}
                      placeholder="e.g. Why did the reaction temperature exceed limit?"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-pharma-500 outline-none text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Answer / Causal Mechanism
                    </label>
                    <input
                      type="text"
                      value={item.answer || ''}
                      onChange={(e) => handleUpdate(index, 'answer', e.target.value)}
                      placeholder="e.g. Cooling valve CV-301 became stuck at 85% open..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-pharma-500 outline-none text-slate-800 bg-white font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>Supporting Technical Evidence / Record Reference</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        BMR, DCS tag, inspection report, or maintenance work order
                      </span>
                    </label>
                    <input
                      type="text"
                      value={item.evidence || ''}
                      onChange={(e) => handleUpdate(index, 'evidence', e.target.value)}
                      placeholder="e.g. DCS Historian log TAG:CR-301-TT-04 and Maintenance Work Order WO-49201"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-pharma-500 outline-none text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
