import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFormField } from '../../store/rcaSlice';
import { AiSuggestionBadge } from '../common/AiSuggestionBadge';
import { SeverityBadge } from '../common/StatusBadge';
import { AlertTriangle, Clock, Layers, ShieldAlert, Tag, Calendar } from 'lucide-react';

export const IncidentDetails = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.rca);

  const handleChange = (field, value) => {
    dispatch(setFormField({ field, value }));
  };

  const isAiSuggested = formData.ai_review_status?.includes('AI');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            1. Deviation & Incident Identification
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Record the core deviation parameters, affected API product, manufacturing stage, and containment.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AiSuggestionBadge isSuggested={isAiSuggested} isVerified={formData.status === 'Approved'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Deviation Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Deviation Reference Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.deviation_number || ''}
              onChange={(e) => handleChange('deviation_number', e.target.value)}
              placeholder="e.g. DEV-2026-0412"
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
            />
            <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Criticality / Severity Classification</span>
            <SeverityBadge severity={formData.severity} />
          </label>
          <select
            value={formData.severity || 'Major'}
            onChange={(e) => handleChange('severity', e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
          >
            <option value="Critical">Critical (Direct impact on product safety/efficacy)</option>
            <option value="Major">Major (OOS attribute or critical process parameter drift)</option>
            <option value="Minor">Minor (Incidental procedural deviation with no CQA impact)</option>
          </select>
        </div>

        {/* Deviation Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Deviation Title / Incident Description
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Out-of-Specification (OOS) Particle Size Distribution in Atorvastatin Calcium Batch 26ATC-089"
            className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
          />
        </div>

        {/* Active Pharmaceutical Ingredient (API) Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Active Pharmaceutical Ingredient (API) Name
          </label>
          <input
            type="text"
            value={formData.api_product_name || ''}
            onChange={(e) => handleChange('api_product_name', e.target.value)}
            placeholder="e.g. Atorvastatin Calcium Trihydrate API"
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
          />
        </div>

        {/* Batch / Lot Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Batch / Lot Number
          </label>
          <input
            type="text"
            value={formData.batch_lot_number || ''}
            onChange={(e) => handleChange('batch_lot_number', e.target.value)}
            placeholder="e.g. 26ATC-089"
            className="w-full text-xs font-mono px-3 py-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
          />
        </div>

        {/* Manufacturing Stage */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Manufacturing Unit & Stage
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.manufacturing_stage || ''}
              onChange={(e) => handleChange('manufacturing_stage', e.target.value)}
              placeholder="e.g. Crystallization & Centrifugation (Unit 3)"
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
            />
            <Layers className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Date of Occurrence */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Date of Occurrence
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.date_of_occurrence || ''}
              onChange={(e) => handleChange('date_of_occurrence', e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Immediate Containment Actions */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Immediate Containment Actions Taken</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Quarantine, line clearance, lock-out</span>
          </label>
          <textarea
            rows={3}
            value={formData.initial_containment_action || ''}
            onChange={(e) => handleChange('initial_containment_action', e.target.value)}
            placeholder="Describe immediate quarantine of affected batch, line clearance, or instrumentation lock-out..."
            className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white resize-none"
          />
        </div>
      </div>
    </div>
  );
};
