import React from 'react';

export const SeverityBadge = ({ severity }) => {
  const s = (severity || 'Major').toLowerCase();
  if (s === 'critical') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
        <span className="w-1.5 h-1.5 mr-1.5 bg-red-600 rounded-full animate-pulse"></span>
        Critical
      </span>
    );
  }
  if (s === 'minor') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Minor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
      Major
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    'Draft': 'bg-slate-100 text-slate-700 border-slate-300',
    'Under Investigation': 'bg-blue-50 text-blue-700 border-blue-200',
    'QA Review': 'bg-purple-50 text-purple-700 border-purple-200',
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-300'
  };
  const cls = map[status] || map['Draft'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {status || 'Draft'}
    </span>
  );
};

export const ActionTypeBadge = ({ type }) => {
  const isCorrective = (type || 'Corrective').toLowerCase().includes('corrective');
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
      isCorrective 
        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
    }`}>
      {isCorrective ? 'Corrective (Immediate)' : 'Preventive (Systemic)'}
    </span>
  );
};
