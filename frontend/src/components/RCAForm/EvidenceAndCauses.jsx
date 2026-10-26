import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setFormField, 
  updateMissingEvidenceStatus, 
  addMissingEvidenceItem, 
  removeMissingEvidenceItem 
} from '../../store/rcaSlice';
import { AiSuggestionBadge } from '../common/AiSuggestionBadge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  HelpCircle, 
  FileSearch,
  ListFilter,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const EvidenceAndCauses = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.rca);
  const missingEvidence = formData.missing_evidence || [];
  const contributingFactors = formData.contributing_factors || [];

  const [newGapDesc, setNewGapDesc] = useState('');
  const [newGapAction, setNewGapAction] = useState('');
  const [newGapPriority, setNewGapPriority] = useState('High');

  const [newFactorText, setNewFactorText] = useState('');
  const [newFactorEvidence, setNewFactorEvidence] = useState('');

  const handleRootCauseChange = (e) => {
    dispatch(setFormField({ field: 'primary_root_cause', value: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setFormField({ field: 'root_cause_category', value: e.target.value }));
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateMissingEvidenceStatus({ id, status }));
  };

  const handleAddMissingEvidence = (e) => {
    e.preventDefault();
    if (!newGapDesc.trim()) return;
    const newItem = {
      id: `GAP-${String(missingEvidence.length + 1).padStart(2, '0')}`,
      gap_description: newGapDesc.trim(),
      recommended_action: newGapAction.trim() || 'Review historical records and test sample.',
      priority: newGapPriority,
      status: 'Open'
    };
    dispatch(addMissingEvidenceItem(newItem));
    setNewGapDesc('');
    setNewGapAction('');
  };

  const handleAddContributingFactor = (e) => {
    e.preventDefault();
    if (!newFactorText.trim()) return;
    const updated = [
      ...contributingFactors,
      { factor: newFactorText.trim(), evidence: newFactorEvidence.trim() }
    ];
    dispatch(setFormField({ field: 'contributing_factors', value: updated }));
    setNewFactorText('');
    setNewFactorEvidence('');
  };

  const handleRemoveContributingFactor = (index) => {
    const updated = contributingFactors.filter((_, i) => i !== index);
    dispatch(setFormField({ field: 'contributing_factors', value: updated }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            4. Root Cause Synthesis & Missing Evidence Verification
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify the primary root cause, secondary contributing factors, and critical missing evidence required for definitive closure.
          </p>
        </div>
      </div>

      {/* Primary Root Cause Section */}
      <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center space-x-1.5">
            <span>Primary Root Cause Statement</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Root Cause Category:</span>
            <select
              value={formData.root_cause_category || 'Equipment'}
              onChange={handleCategoryChange}
              className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-300 bg-white text-slate-800 outline-none focus:border-pharma-500"
            >
              <option value="Equipment">Equipment / Mechanical Failure</option>
              <option value="Process Drift">Process Drift / Parameter Excursion</option>
              <option value="Human Error">Human Error / Execution Deviation</option>
              <option value="Material">Material / Raw Material Quality Defect</option>
              <option value="Procedure">Procedure / Inadequate SOP or Recipe</option>
              <option value="Environment">Environment / HVAC / Cleanroom Excursion</option>
            </select>
          </div>
        </div>

        <textarea
          rows={4}
          value={formData.primary_root_cause || ''}
          onChange={handleRootCauseChange}
          placeholder="State the confirmed fundamental root cause clearly, differentiating between symptoms and root organizational/mechanical failures..."
          className="w-full text-xs font-medium p-3 rounded-lg border border-indigo-200 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white leading-relaxed"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>ICH Q10 Mandate: Root causes must be substantiated by empirical physical or digital records.</span>
          <AiSuggestionBadge isSuggested={true} isVerified={formData.status === 'Approved'} />
        </div>
      </div>

      {/* Missing Evidence & Information Gaps Section (Mandatory Feature!) */}
      <div className="border border-amber-200 rounded-xl bg-amber-50/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Missing Evidence & Information Gaps Highlighted by AI
              </h4>
              <p className="text-[11px] text-amber-800">
                Critical records or tests needed to verify root cause hypotheses prior to formal QA closure.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
            {missingEvidence.length} Gaps Flagged
          </span>
        </div>

        {/* Missing Evidence Items List */}
        <div className="space-y-2.5">
          {missingEvidence.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-white rounded border border-slate-200">
              No evidence gaps flagged. All required supporting records have been verified.
            </p>
          ) : (
            missingEvidence.map((gap) => (
              <div
                key={gap.id}
                className={`p-3 rounded-lg border transition-all bg-white ${
                  gap.status === 'Gathered' 
                    ? 'border-emerald-300 bg-emerald-50/20' 
                    : 'border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      {gap.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {gap.gap_description}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      gap.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                    {['Open', 'Gathered', 'Not Needed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(gap.id, st)}
                        className={`text-[11px] px-2.5 py-1 rounded font-semibold transition-colors ${
                          gap.status === st
                            ? st === 'Gathered'
                              ? 'bg-emerald-600 text-white'
                              : st === 'Open'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                    <button
                      onClick={() => dispatch(removeMissingEvidenceItem(gap.id))}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-1"
                      title="Remove gap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 flex items-start space-x-1.5">
                  <span className="font-bold text-slate-700 shrink-0">Recommended QA Action:</span>
                  <span>{gap.recommended_action}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Custom Missing Evidence Gap */}
        <form onSubmit={handleAddMissingEvidence} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700">Add Additional Evidence Gap to Investigate:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newGapDesc}
              onChange={(e) => setNewGapDesc(e.target.value)}
              placeholder="e.g. Metallurgical inspection of broken valve stem"
              className="sm:col-span-2 text-xs p-2 rounded border border-slate-300 outline-none focus:border-pharma-500"
            />
            <select
              value={newGapPriority}
              onChange={(e) => setNewGapPriority(e.target.value)}
              className="text-xs p-2 rounded border border-slate-300 outline-none bg-white"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newGapAction}
              onChange={(e) => setNewGapAction(e.target.value)}
              placeholder="Recommended retrieval action (e.g. Request FTIR analysis from materials lab)"
              className="flex-1 text-xs p-2 rounded border border-slate-300 outline-none focus:border-pharma-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-pharma-600 text-white text-xs font-semibold rounded hover:bg-pharma-700 transition-colors"
            >
              Add Gap
            </button>
          </div>
        </form>
      </div>

      {/* Secondary Contributing Factors */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Secondary Contributing Factors
        </h4>
        <div className="space-y-2">
          {contributingFactors.map((cf, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
              <div>
                <span className="font-semibold text-slate-800">{cf.factor}</span>
                {cf.evidence && (
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    Evidence: {cf.evidence}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleRemoveContributingFactor(idx)}
                className="text-slate-400 hover:text-red-500 p-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Contributing Factor */}
        <form onSubmit={handleAddContributingFactor} className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            value={newFactorText}
            onChange={(e) => setNewFactorText(e.target.value)}
            placeholder="Add contributing factor..."
            className="flex-1 text-xs p-2 rounded border border-slate-300 outline-none focus:border-pharma-500"
          />
          <input
            type="text"
            value={newFactorEvidence}
            onChange={(e) => setNewFactorEvidence(e.target.value)}
            placeholder="Evidence citation..."
            className="w-1/3 text-xs p-2 rounded border border-slate-300 outline-none focus:border-pharma-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-900 transition-colors"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};
