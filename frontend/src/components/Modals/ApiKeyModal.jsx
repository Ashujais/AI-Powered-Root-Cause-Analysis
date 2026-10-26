import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGroqApiKey, setSelectedModel, setNotification } from '../../store/rcaSlice';
import { X, Key, ExternalLink, Cpu, CheckCircle } from 'lucide-react';

export const ApiKeyModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { groqApiKey, selectedModel } = useSelector((state) => state.rca);

  const [inputKey, setInputKey] = useState(groqApiKey);
  const [model, setModel] = useState(selectedModel);

  if (!isOpen) return null;

  const handleSave = () => {
    dispatch(setGroqApiKey(inputKey.trim()));
    dispatch(setSelectedModel(model));
    dispatch(setNotification({
      type: 'success',
      message: 'Groq AI settings updated successfully.'
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-pharma-100 text-pharma-700 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Groq AI Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory Tech Stack: LangGraph + Groq
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

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Groq API Key</span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-pharma-600 hover:underline flex items-center space-x-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Your key is saved in your local browser session and transmitted securely to your local FastAPI backend.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span>Groq LLM Model</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 outline-none text-slate-900 bg-white"
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended - High Reasoning)</option>
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Fastest Latency)</option>
              <option value="gemma2-9b-it">gemma2-9b-it (Google Gemma 2 on Groq)</option>
            </select>
          </div>

          <div className="p-3 bg-pharma-50 rounded-lg border border-pharma-100 text-[11px] text-pharma-900 leading-relaxed">
            <span className="font-bold">Offline Resilience:</span> If no key is entered, the system automatically runs the high-precision pharmaceutical domain engine with pre-computed LangGraph state graphs.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-pharma-600 text-white rounded-lg text-xs font-bold hover:bg-pharma-700 shadow-sm transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
