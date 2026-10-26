import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShieldCheck, 
  PlusCircle, 
  FolderOpen, 
  FileDown, 
  Key, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { resetForm, setNotification } from '../store/rcaSlice';
import { getExportPdfUrl } from '../services/api';

export const Header = ({ onOpenSavedModal, onOpenKeyModal }) => {
  const dispatch = useDispatch();
  const { formData, groqApiKey, selectedModel, isDirty } = useSelector((state) => state.rca);
  const { items } = useSelector((state) => state.investigationList);

  const handleNew = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Clear form and start a new investigation?")) {
      return;
    }
    dispatch(resetForm());
    dispatch(setNotification({ type: 'info', message: 'Form reset for new investigation.' }));
  };

  const handleExportPdf = () => {
    if (!formData.id) {
      alert("Please save the investigation first before generating the formal GMP PDF report.");
      return;
    }
    window.open(getExportPdfUrl(formData.id), '_blank');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-pharma-700 to-pharma-500 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">AIVOA.AI</span>
              <span className="bg-pharma-50 text-pharma-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-pharma-200 uppercase tracking-wide">
                API Pharma RCA
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              AI-Powered Root Cause Analysis & CAPA Workflow • ICH Q10 / 21 CFR Part 211
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          
          {/* Active Model Indicator */}
          <button
            onClick={onOpenKeyModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Configure Groq API Key and Model"
          >
            <Key className="w-3.5 h-3.5 text-pharma-600" />
            <span className="hidden md:inline">Model:</span>
            <span className="font-semibold text-pharma-800">{selectedModel.split('-')[0] + '-' + selectedModel.split('-')[1]}</span>
            {groqApiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Key Configured" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Running in Domain Fallback Mode" />
            )}
          </button>

          {/* New Investigation */}
          <button
            onClick={handleNew}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">New RCA</span>
          </button>

          {/* Saved Investigations List */}
          <button
            onClick={onOpenSavedModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-colors relative"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Saved Incidents</span>
            {items.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-pharma-100 text-pharma-800 text-[10px] font-bold rounded-full">
                {items.length}
              </span>
            )}
          </button>

          {/* Export Report PDF */}
          <button
            onClick={handleExportPdf}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-pharma-600 hover:bg-pharma-700 shadow-sm transition-colors"
            title="Download Formal GMP Root Cause Analysis Report"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export GMP Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
