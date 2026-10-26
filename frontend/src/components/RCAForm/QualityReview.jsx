import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFormField, setNotification } from '../../store/rcaSlice';
import { saveInvestigationRecord } from '../../store/investigationListSlice';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  FileCheck, 
  UserCheck, 
  AlertCircle,
  FileDown
} from 'lucide-react';
import { getExportPdfUrl } from '../../services/api';

export const QualityReview = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.rca);
  const { saveLoading } = useSelector((state) => state.investigationList);

  const [confirmedEvidence, setConfirmedEvidence] = useState(false);
  const [confirmedCAPA, setConfirmedCAPA] = useState(false);

  const handleFieldChange = (field, value) => {
    dispatch(setFormField({ field, value }));
  };

  const handleSaveInvestigation = async () => {
    if (!formData.title || !formData.deviation_number) {
      alert("Please ensure Deviation Number and Title are filled before saving.");
      return;
    }

    try {
      const resultAction = await dispatch(saveInvestigationRecord(formData));
      if (saveInvestigationRecord.fulfilled.match(resultAction)) {
        const savedData = resultAction.payload.data;
        dispatch(setFormField({ field: 'id', value: savedData.id }));
        dispatch(setFormField({ field: 'ai_review_status', value: 'Verified by Qualified Investigator' }));
        dispatch(setNotification({
          type: 'success',
          message: `Investigation '${savedData.deviation_number}' saved successfully to database!`
        }));
      } else {
        dispatch(setNotification({
          type: 'error',
          message: resultAction.payload || 'Failed to save investigation.'
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPdf = () => {
    if (!formData.id) {
      alert("Please click 'Save Investigation' first to assign a database record ID before exporting.");
      return;
    }
    window.open(getExportPdfUrl(formData.id), '_blank');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>6. Quality Review, Governance & Investigation Sign-Off</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal human-in-the-loop verification conforming to FDA 21 CFR Part 211 and EU GMP Annex 11.
          </p>
        </div>
      </div>

      {/* Mandatory Verification Affirmation */}
      <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Qualified Person Verification Affirmation</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with GMP regulations, AI-generated root cause deductions and CAPA recommendations remain tentative advisory suggestions until formally confirmed by empirical evidence and approved by authorized quality personnel.
        </p>

        <div className="space-y-2 pt-1">
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedEvidence}
              onChange={(e) => setConfirmedEvidence(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-pharma-600 focus:ring-pharma-500"
            />
            <span className="text-xs text-slate-800 font-medium leading-snug">
              I confirm that the 5 Whys and Fishbone analyses have been evaluated against verified plant records (BMR, DCS logs, QC analytical results), and empirical evidence substantiates the identified root cause.
            </span>
          </label>

          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedCAPA}
              onChange={(e) => setConfirmedCAPA(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-pharma-600 focus:ring-pharma-500"
            />
            <span className="text-xs text-slate-800 font-medium leading-snug">
              I verify that proposed CAPA actions are appropriate, achievable within target timelines, and assignable to respective department owners without compromising drug substance efficacy or safety.
            </span>
          </label>
        </div>
      </div>

      {/* Sign-off Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Lead Quality Investigator
          </label>
          <input
            type="text"
            value={formData.investigator_name || ''}
            onChange={(e) => handleFieldChange('investigator_name', e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            QA Manager / Reviewer
          </label>
          <input
            type="text"
            value={formData.qa_reviewer_name || ''}
            onChange={(e) => handleFieldChange('qa_reviewer_name', e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Investigation Status
          </label>
          <select
            value={formData.status || 'Draft'}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
          >
            <option value="Draft">Draft (In Progress)</option>
            <option value="Under Investigation">Under Investigation (Evidence Gathering)</option>
            <option value="QA Review">QA Review (Pending QA Approval)</option>
            <option value="Approved">Approved (Finalized & Closed)</option>
          </select>
        </div>
      </div>

      {/* Save & Export Controls */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {formData.id ? (
            <span className="text-emerald-700 font-medium flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Saved in Database (ID: {formData.id.substring(0, 8)}...)
            </span>
          ) : (
            <span className="text-amber-700 font-medium flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Unsaved Investigation (Review all AI suggestions, then save)
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {formData.id && (
            <button
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FileDown className="w-4 h-4 text-pharma-600" />
              <span>Download GMP Report (PDF)</span>
            </button>
          )}

          <button
            onClick={handleSaveInvestigation}
            disabled={saveLoading}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-all ${
              saveLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saveLoading ? 'Saving to Database...' : 'Save Investigation Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
