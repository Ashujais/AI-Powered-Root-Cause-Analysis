import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Header } from './components/Header';
import { AIPanel } from './components/AIPanel/AIPanel';
import { RCAForm } from './components/RCAForm/RCAForm';
import { SavedInvestigationsModal } from './components/Modals/SavedInvestigationsModal';
import { ApiKeyModal } from './components/Modals/ApiKeyModal';
import { Toast } from './components/common/Toast';
import { fetchSavedInvestigations } from './store/investigationListSlice';

export function App() {
  const dispatch = useDispatch();
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  useEffect(() => {
    // Fetch initial list of saved investigations from database
    dispatch(fetchSavedInvestigations());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Workspace: Split Copilot Layout */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Sidecar: AI Copilot Panel */}
          <AIPanel />

          {/* Right Canvas: Pharmaceutical RCA Form */}
          <RCAForm />
        </div>
      </main>

      {/* Modals & Floating Notifications */}
      <SavedInvestigationsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
      />
      
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />

      <Toast />
    </div>
  );
}

export default App;
