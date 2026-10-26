import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCapaAction, updateCapaAction, removeCapaAction } from '../../store/rcaSlice';
import { ActionTypeBadge } from '../common/StatusBadge';
import { AiSuggestionBadge } from '../common/AiSuggestionBadge';
import { 
  CheckSquare, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Building,
  HelpCircle
} from 'lucide-react';

export const CAPATable = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.rca);
  const capas = formData.capa_actions || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCapa, setNewCapa] = useState({
    action_type: 'Corrective',
    description: '',
    rationale: '',
    department: 'Manufacturing',
    owner: 'API Process Lead',
    due_date: '30 Days from Approval',
    priority: 'High',
    status: 'Proposed'
  });

  const handleUpdate = (index, field, value) => {
    dispatch(updateCapaAction({ index, field, value }));
  };

  const handleRemove = (index) => {
    dispatch(removeCapaAction(index));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCapa.description.trim()) {
      alert("Please provide an action description.");
      return;
    }
    const item = {
      ...newCapa,
      id: `CAPA-${String(capas.length + 1).padStart(2, '0')}`,
      ai_suggested: false
    };
    dispatch(addCapaAction(item));
    setShowAddForm(false);
    setNewCapa({
      action_type: 'Preventive',
      description: '',
      rationale: '',
      department: 'Engineering',
      owner: 'Maintenance Lead',
      due_date: '45 Days from Approval',
      priority: 'High',
      status: 'Proposed'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>5. Corrective & Preventive Action (CAPA) Plan</span>
            <span className="text-xs bg-pharma-100 text-pharma-800 font-semibold px-2 py-0.5 rounded">
              {capas.length} Actions
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ICH Q10 compliant CAPA matrix. Corrective actions remediate the affected lot; preventive actions eliminate recurrence.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-pharma-700 bg-pharma-50 hover:bg-pharma-100 border border-pharma-200 transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel Add' : 'Add CAPA Action'}</span>
        </button>
      </div>

      {/* New CAPA Form (Accordion/Modal) */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Define New CAPA Action
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Action Type</label>
              <select
                value={newCapa.action_type}
                onChange={(e) => setNewCapa({ ...newCapa, action_type: e.target.value })}
                className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
              >
                <option value="Corrective">Corrective (Immediate Batch/Equipment Fix)</option>
                <option value="Preventive">Preventive (Long-term Systemic Elimination)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={newCapa.department}
                onChange={(e) => setNewCapa({ ...newCapa, department: e.target.value })}
                className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={newCapa.priority}
                onChange={(e) => setNewCapa({ ...newCapa, priority: e.target.value })}
                className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Action Description</label>
            <input
              type="text"
              value={newCapa.description}
              onChange={(e) => setNewCapa({ ...newCapa, description: e.target.value })}
              placeholder="e.g. Implement automated DCS temperature rate-of-change trip interlock..."
              className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Rationale / Technical Justification</label>
            <input
              type="text"
              value={newCapa.rationale}
              onChange={(e) => setNewCapa({ ...newCapa, rationale: e.target.value })}
              placeholder="Short explanation of how this action prevents recurrence or resolves the issue..."
              className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Designated Owner</label>
              <input
                type="text"
                value={newCapa.owner}
                onChange={(e) => setNewCapa({ ...newCapa, owner: e.target.value })}
                className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Due Date</label>
              <input
                type="text"
                value={newCapa.due_date}
                onChange={(e) => setNewCapa({ ...newCapa, due_date: e.target.value })}
                className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-pharma-600 text-white text-xs font-semibold rounded-lg hover:bg-pharma-700 shadow-sm"
            >
              Save CAPA Item
            </button>
          </div>
        </form>
      )}

      {/* CAPA Items Grid / Cards */}
      <div className="space-y-4">
        {capas.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold">No CAPA recommendations generated yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Use the AI Panel to extract CAPAs from incident reports.</p>
          </div>
        ) : (
          capas.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl p-4.5 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.id || `CAPA-0${index+1}`}
                  </span>
                  <ActionTypeBadge type={item.action_type} />
                  {item.ai_suggested && (
                    <AiSuggestionBadge isSuggested={true} />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.priority} Priority
                  </span>

                  <button
                    onClick={() => handleRemove(index)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove CAPA"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-0.5">
                    Action Description
                  </label>
                  <textarea
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                    className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 focus:border-pharma-500 outline-none text-slate-900 bg-white"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                    Short Explanation & Justification
                  </label>
                  <input
                    type="text"
                    value={item.rationale || ''}
                    onChange={(e) => handleUpdate(index, 'rationale', e.target.value)}
                    placeholder="Rationale explaining how this action resolves the root cause..."
                    className="w-full text-xs p-1.5 rounded border border-slate-300 focus:border-pharma-500 outline-none text-slate-800 bg-white"
                  />
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Department</label>
                    <input
                      type="text"
                      value={item.department || ''}
                      onChange={(e) => handleUpdate(index, 'department', e.target.value)}
                      className="w-full text-[11px] p-1 rounded border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Owner</label>
                    <input
                      type="text"
                      value={item.owner || ''}
                      onChange={(e) => handleUpdate(index, 'owner', e.target.value)}
                      className="w-full text-[11px] p-1 rounded border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Due Date</label>
                    <input
                      type="text"
                      value={item.due_date || ''}
                      onChange={(e) => handleUpdate(index, 'due_date', e.target.value)}
                      className="w-full text-[11px] p-1 rounded border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Status</label>
                    <select
                      value={item.status || 'Proposed'}
                      onChange={(e) => handleUpdate(index, 'status', e.target.value)}
                      className="w-full text-[11px] p-1 rounded border border-slate-200 bg-white font-semibold"
                    >
                      <option value="Proposed">Proposed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Verified Closed">Verified Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
