import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle2, Loader2, Workflow } from 'lucide-react';

export const ExtractionProgress = () => {
  const { isAiProcessing, aiProcessingSteps, aiExtractionResult } = useSelector((state) => state.rca);

  if (!isAiProcessing && (!aiProcessingSteps || aiProcessingSteps.length === 0)) {
    return null;
  }

  const defaultNodes = [
    { title: "Intake & Document Parsing", desc: "Extracting raw text & metadata from document" },
    { title: "Node 1: Context & Metadata Extraction", desc: "Batch #, API, Stage, Severity, Containment" },
    { title: "Node 2: 5 Whys & Fishbone (6Ms)", desc: "Analyzing causal hierarchy & Ishikawa branches" },
    { title: "Node 3: Root Cause & Missing Evidence", desc: "Synthesizing true cause & identifying gaps" },
    { title: "Node 4: ICH Q10 CAPA Formulation", desc: "Generating corrective & preventive actions" }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 mb-5 shadow-lg border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Workflow className="w-4 h-4 text-pharma-400" />
          <span className="text-xs font-bold tracking-wide uppercase text-slate-300">
            LangGraph RCA Pipeline
          </span>
        </div>
        {isAiProcessing ? (
          <span className="flex items-center text-[11px] font-medium text-pharma-300 bg-pharma-950 px-2 py-0.5 rounded border border-pharma-700/50">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Executing Graph
          </span>
        ) : (
          <span className="flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {defaultNodes.map((node, idx) => {
          const isDone = !isAiProcessing || idx < aiProcessingSteps.length;
          const isCurrent = isAiProcessing && idx === aiProcessingSteps.length - 1;

          return (
            <div key={idx} className="flex items-start space-x-2.5 text-xs">
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-pharma-400 animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center text-[9px] text-slate-500">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div>
                <p className={`font-semibold ${isDone ? 'text-slate-200' : isCurrent ? 'text-pharma-300' : 'text-slate-500'}`}>
                  {node.title}
                </p>
                <p className="text-[10px] text-slate-400">
                  {node.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
