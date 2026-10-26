import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  FileCheck, 
  AlertTriangle,
  Beaker,
  Mail,
  HelpCircle
} from 'lucide-react';
import { 
  setAiProcessing, 
  setAiProcessingSteps, 
  setAiExtractionResult, 
  setAiAnalysisSummary, 
  setNotification,
  populateFromAi
} from '../../store/rcaSlice';
import { analyzeTextIncident, uploadPdfIncident, getSampleIncidents } from '../../services/api';

export const DocumentIntake = () => {
  const dispatch = useDispatch();
  const { groqApiKey, selectedModel, isAiProcessing } = useSelector((state) => state.rca);
  
  const [activeTab, setActiveTab] = useState('samples'); // 'samples', 'pdf', 'text'
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sampleList, setSampleList] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState('sample-1');
  const [loadingSamples, setLoadingSamples] = useState(false);

  useEffect(() => {
    // Load samples on mount
    const load = async () => {
      try {
        setLoadingSamples(true);
        const data = await getSampleIncidents();
        setSampleList(data);
        if (data.length > 0) {
          setPastedText(data[0].text);
          setSelectedSampleId(data[0].id);
        }
      } catch (e) {
        console.error("Failed to load sample incidents", e);
      } finally {
        setLoadingSamples(false);
      }
    };
    load();
  }, []);

  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setPastedText(sample.text);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert("Please upload a PDF document.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleExecuteAiAnalysis = async () => {
    dispatch(setAiProcessing(true));
    dispatch(setAiProcessingSteps([
      "Intaking deviation document & parsing text structure...",
      "Executing LangGraph Node 1: Extracting batch, product & process metadata...",
      "Executing LangGraph Node 2: Synthesizing 5 Whys causal chain & Fishbone 6Ms...",
      "Executing LangGraph Node 3: Evaluating root cause & detecting missing evidence gaps...",
      "Executing LangGraph Node 4: Formulating ICH Q10 Corrective & Preventive Actions (CAPA)..."
    ]));

    try {
      let result;
      if (activeTab === 'pdf' && selectedFile) {
        result = await uploadPdfIncident(selectedFile, groqApiKey, selectedModel);
      } else {
        const textToAnalyze = pastedText.trim();
        if (!textToAnalyze) {
          alert("Please provide incident text, select a sample, or upload a PDF document.");
          dispatch(setAiProcessing(false));
          return;
        }
        const inputType = activeTab === 'samples' ? 'Sample Incident' : 'Pasted Incident / Email';
        result = await analyzeTextIncident(textToAnalyze, inputType, groqApiKey, selectedModel);
      }

      if (result.success) {
        dispatch(setAiExtractionResult(result.extracted_data));
        dispatch(setAiAnalysisSummary({
          summary: result.summary,
          model: result.model_used,
          rootCause: result.root_cause_summary,
          missingEvidence: result.missing_evidence_summary,
          capaSummary: result.capa_summary
        }));
        
        // Auto-populate the form to streamline the workflow
        dispatch(populateFromAi());
        
        dispatch(setNotification({
          type: 'success',
          message: 'AI successfully analyzed the incident and populated the RCA form!'
        }));
      }
    } catch (err) {
      console.error(err);
      dispatch(setNotification({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to process AI investigation. Please try again.'
      }));
    } finally {
      dispatch(setAiProcessing(false));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-1 flex">
        <button
          onClick={() => setActiveTab('samples')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'samples'
              ? 'bg-white text-pharma-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Beaker className="w-3.5 h-3.5" />
          <span>API Samples</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'pdf'
              ? 'bg-white text-pharma-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload PDF</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'text'
              ? 'bg-white text-pharma-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Paste / Email</span>
        </button>
      </div>

      <div className="p-4">
        {/* Tab 1: API Samples */}
        {activeTab === 'samples' && (
          <div className="space-y-2.5">
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Select an authentic API Manufacturing Incident:</span>
              <span className="text-[11px] text-pharma-600 font-normal">1-Click Test</span>
            </div>
            {sampleList.map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedSampleId === sample.id
                    ? 'border-pharma-500 bg-pharma-50/50 ring-1 ring-pharma-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate pr-2">
                    {sample.title}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {sample.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {sample.summary}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Upload PDF */}
        {activeTab === 'pdf' && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-slate-300 hover:border-pharma-500 rounded-lg p-5 text-center transition-colors bg-slate-50/50 cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-pharma-100 text-pharma-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {selectedFile ? selectedFile.name : 'Drop your deviation PDF here, or browse'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedFile 
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • Ready for LangGraph parser` 
                      : 'Accepts standard GMP deviation forms & lab reports'}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="font-semibold text-slate-700">Tip:</span> A sample PDF is pre-generated at 
              <code className="text-[10px] bg-slate-200 px-1 py-0.5 rounded ml-1">backend/sample_documents/Deviation_DEV-2026-0412...pdf</code>
            </div>
          </div>
        )}

        {/* Tab 3: Paste Text or Email */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Paste deviation report, operator log, or email:</span>
              <span>{pastedText.length} chars</span>
            </div>
            <textarea
              rows={7}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste incident details here... e.g. 'Subject: Quality Incident - Temperature Excursion in Paracetamol Reaction...'"
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-800 resize-none bg-slate-50/30"
            />
          </div>
        )}

        {/* Submit AI Button */}
        <div className="mt-4">
          <button
            onClick={handleExecuteAiAnalysis}
            disabled={isAiProcessing}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-semibold text-xs text-white shadow-md transition-all ${
              isAiProcessing
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pharma-600 via-pharma-700 to-indigo-700 hover:from-pharma-700 hover:to-indigo-800 active:scale-[0.99]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isAiProcessing ? 'animate-spin' : ''}`} />
            <span>
              {isAiProcessing ? 'Analyzing Incident with LangGraph + Groq...' : 'Extract & Populate RCA with AI'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
