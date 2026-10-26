import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const AiSuggestionBadge = ({ isSuggested = true, isVerified = false }) => {
  if (isVerified) {
    return (
      <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
        Verified by QA
      </span>
    );
  }

  if (isSuggested) {
    return (
      <span 
        title="AI-generated suggestion. Must be reviewed & confirmed by a qualified investigator."
        className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shadow-sm"
      >
        <Sparkles className="w-3 h-3 mr-1 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
        AI Suggestion (Review Required)
      </span>
    );
  }

  return null;
};
