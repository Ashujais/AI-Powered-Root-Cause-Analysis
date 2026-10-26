import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveFormTab } from '../../store/rcaSlice';
import { IncidentDetails } from './IncidentDetails';
import { FiveWhysEditor } from './FiveWhysEditor';
import { FishboneEditor } from './FishboneEditor';
import { EvidenceAndCauses } from './EvidenceAndCauses';
import { CAPATable } from './CAPATable';
import { QualityReview } from './QualityReview';
import { StatusBadge, SeverityBadge } from '../common/StatusBadge';
import { 
  FileText, 
  HelpCircle, 
  GitBranch, 
  Search, 
  CheckSquare, 
  ShieldCheck,
  Tag
} from 'lucide-react';

const TABS = [
  { id: 'details', label: '1. Incident Details', icon: FileText },
  { id: '5whys', label: '2. 5 Whys Analysis', icon: HelpCircle },
  { id: 'fishbone', label: '3. Fishbone (6Ms)', icon: GitBranch },
  { id: 'rootcause', label: '4. Root Cause & Gaps', icon: Search },
  { id: 'capa', label: '5. CAPA Matrix', icon: CheckSquare },
  { id: 'review', label: '6. Quality Review', icon: ShieldCheck },
];

export const RCAForm = () => {
  const dispatch = useDispatch();
  const { activeFormTab, formData } = useSelector((state) => state.rca);

  return (
    <div className="flex-1 min-w-0 space-y-4">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-pharma-700 bg-pharma-50 px-2 py-0.5 rounded border border-pharma-200">
              {formData.deviation_number || 'DEV-DRAFT'}
            </span>
            <SeverityBadge severity={formData.severity} />
            <StatusBadge status={formData.status} />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-xl">
            {formData.title || 'Untitled API Manufacturing Quality Deviation'}
          </h1>
          <p className="text-xs text-slate-500">
            {formData.api_product_name || 'Active Pharmaceutical Ingredient'} • Batch: {formData.batch_lot_number || 'N/A'} • Stage: {formData.manufacturing_stage || 'Not Assigned'}
          </p>
        </div>

        {/* Tab Quick Switch Pills on Header */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden md:inline">Jump to:</span>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveFormTab(tab.id))}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFormTab === tab.id
                  ? 'bg-pharma-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
              title={tab.label}
            >
              <tab.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Primary Tab Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto p-1.5 flex space-x-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFormTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveFormTab(tab.id))}
              className={`flex-1 min-w-[130px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-pharma-50 text-pharma-800 border border-pharma-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pharma-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="min-h-[500px]">
        {activeFormTab === 'details' && <IncidentDetails />}
        {activeFormTab === '5whys' && <FiveWhysEditor />}
        {activeFormTab === 'fishbone' && <FishboneEditor />}
        {activeFormTab === 'rootcause' && <EvidenceAndCauses />}
        {activeFormTab === 'capa' && <CAPATable />}
        {activeFormTab === 'review' && <QualityReview />}
      </div>
    </div>
  );
};
