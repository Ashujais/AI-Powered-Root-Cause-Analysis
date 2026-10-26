import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchSavedInvestigations, 
  deleteInvestigationRecord 
} from '../../store/investigationListSlice';
import { setFullFormData, setNotification, setActiveFormTab } from '../../store/rcaSlice';
import { StatusBadge, SeverityBadge } from '../common/StatusBadge';
import { getExportPdfUrl } from '../../services/api';
import { 
  X, 
  FolderOpen, 
  Trash2, 
  FileDown, 
  ArrowRight, 
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';

export const SavedInvestigationsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.investigationList);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSavedInvestigations());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleLoad = (item) => {
    dispatch(setFullFormData(item));
    dispatch(setActiveFormTab('details'));
    dispatch(setNotification({
      type: 'info',
      message: `Loaded investigation '${item.deviation_number}' into form for review.`
    }));
    onClose();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this investigation from the database?")) {
      await dispatch(deleteInvestigationRecord(id));
    }
  };

  const handleDownloadPdf = (e, id) => {
    e.stopPropagation();
    window.open(getExportPdfUrl(id), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-pharma-100 text-pharma-700 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Saved Quality Investigations Database
              </h3>
              <p className="text-xs text-slate-500">
                {items.length} investigation records stored in PostgreSQL / SQLite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-pharma-600" />
              <p className="text-xs font-medium">Fetching investigations from database...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FolderOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No saved investigations found</p>
              <p className="text-xs text-slate-400">
                Process an incident with AI on the main page, review the form, and click "Save Investigation".
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLoad(item)}
                className="p-4 rounded-xl border border-slate-200 hover:border-pharma-400 hover:shadow-md transition-all cursor-pointer bg-white group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-pharma-700 bg-pharma-50 px-2 py-0.5 rounded border border-pharma-200">
                      {item.deviation_number}
                    </span>
                    <SeverityBadge severity={item.severity} />
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={(e) => handleDownloadPdf(e, item.id)}
                      className="p-1.5 text-slate-500 hover:text-pharma-600 hover:bg-slate-100 rounded transition-colors"
                      title="Download GMP PDF Report"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete from database"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-pharma-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1 pl-2">
                      <span>Load</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-pharma-700 transition-colors mb-1">
                  {item.title}
                </h4>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span>API: <strong className="text-slate-700">{item.api_product_name}</strong></span>
                  <span>Batch: <strong className="font-mono text-slate-700">{item.batch_lot_number}</strong></span>
                  <span>Stage: <strong className="text-slate-700">{item.manufacturing_stage}</strong></span>
                  <span>Root Cause: <strong className="text-slate-700">{item.root_cause_category}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
