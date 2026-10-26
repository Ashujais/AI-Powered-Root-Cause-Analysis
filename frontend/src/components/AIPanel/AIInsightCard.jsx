import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { populateFromAi, populateSectionFromAi, setActiveFormTab } from '../../store/rcaSlice';

export const AIInsightCard = () => {
  const dispatch = useDispatch();
  const { aiExtractionResult, aiAnalysisSummary } = useSelector((state) => state.rca);

  if (!aiExtractionResult) return null;

  const handlePopulateAll = () => {
    dispatch(populateFromAi());
  };

  const handleApplySection = (sectionName, targetTab) => {
    dispatch(populateSectionFromAi(sectionName));
    if (targetTab) {
      dispatch(setActiveFormTab(targetTab));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-4 mb-5 relative overflow-hidden">
      {/* Top Banner */}
      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg flex items-center space-x-1">
        <Sparkles className="w-3 h-3" />
        <span>AI Extraction Ready</span>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center">
          AI Investigation Insights
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          {aiAnalysisSummary?.summary || aiExtractionResult.title}
        </p>
      </div>

      {/* Primary Root Cause Highlight */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-2.5 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-indigo-950">
            Detected Primary Root Cause:
          </span>
          <span className="text-[10px] font-semibold bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded">
            {aiExtractionResult.root_cause_category}
          </span>
        </div>
        <p className="text-xs text-slate-800 font-medium leading-snug">
          {aiExtractionResult.primary_root_cause}
        </p>
      </div>

      {/* Missing Evidence Warning Alert */}
      {aiExtractionResult.missing_evidence && aiExtractionResult.missing_evidence.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3">
          <div className="flex items-center space-x-1.5 text-amber-800 text-xs font-bold mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Missing Evidence Gaps ({aiExtractionResult.missing_evidence.length})</span>
          </div>
          <ul className="text-[11px] text-amber-900 list-disc list-inside space-y-0.5">
            {aiExtractionResult.missing_evidence.slice(0, 2).map((gap, i) => (
              <li key={i} className="truncate">
                {gap.gap_description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons to Populate Form */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <button
          onClick={handlePopulateAll}
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow transition-all"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Auto-Populate Entire RCA Form</span>
        </button>

        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <button
            onClick={() => handleApplySection('details', 'details')}
            className="py-1 px-2 text-center rounded border border-slate-200 hover:border-pharma-400 hover:bg-pharma-50/50 text-slate-700 font-medium transition-colors"
          >
            Apply Details
          </button>
          <button
            onClick={() => handleApplySection('5whys', '5whys')}
            className="py-1 px-2 text-center rounded border border-slate-200 hover:border-pharma-400 hover:bg-pharma-50/50 text-slate-700 font-medium transition-colors"
          >
            Apply 5 Whys
          </button>
          <button
            onClick={() => handleApplySection('fishbone', 'fishbone')}
            className="py-1 px-2 text-center rounded border border-slate-200 hover:border-pharma-400 hover:bg-pharma-50/50 text-slate-700 font-medium transition-colors"
          >
            Apply Fishbone
          </button>
          <button
            onClick={() => handleApplySection('capa', 'capa')}
            className="py-1 px-2 text-center rounded border border-slate-200 hover:border-pharma-400 hover:bg-pharma-50/50 text-slate-700 font-medium transition-colors"
          >
            Apply CAPAs
          </button>
        </div>
      </div>
    </div>
  );
};
