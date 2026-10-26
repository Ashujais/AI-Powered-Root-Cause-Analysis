import React from 'react';
import { DocumentIntake } from './DocumentIntake';
import { ExtractionProgress } from './ExtractionProgress';
import { AIInsightCard } from './AIInsightCard';
import { CopilotChat } from './CopilotChat';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const AIPanel = () => {
  return (
    <aside className="w-full lg:w-[420px] xl:w-[460px] shrink-0 space-y-4">
      {/* Panel Title Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              AI Investigation Copilot
            </h2>
            <p className="text-[11px] text-slate-500">
              LangGraph + Groq Extraction Engine
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Active Copilot</span>
        </span>
      </div>

      {/* 1. Document Intake (PDF, Text, Samples) */}
      <DocumentIntake />

      {/* 2. LangGraph Execution Progress Tracker */}
      <ExtractionProgress />

      {/* 3. AI Insights & Form Populate Actions */}
      <AIInsightCard />

      {/* 4. Interactive Copilot Chat */}
      <CopilotChat />
    </aside>
  );
};
