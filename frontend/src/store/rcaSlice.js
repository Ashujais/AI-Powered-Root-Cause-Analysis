import { createSlice } from '@reduxjs/toolkit';

const defaultEmptyForm = {
  id: null,
  deviation_number: '',
  title: '',
  api_product_name: '',
  batch_lot_number: '',
  manufacturing_stage: '',
  date_of_occurrence: new Date().toISOString().split('T')[0],
  severity: 'Major',
  initial_containment_action: '',
  raw_input_type: 'Pasted Text',
  raw_input_content: '',
  investigation_approach: 'Combined (5 Whys + Fishbone)',
  five_whys_data: [
    { step: 1, why_question: '', answer: '', evidence: '', verified: false, ai_suggested: false }
  ],
  fishbone_data: {
    machine: [],
    method: [],
    material: [],
    man: [],
    measurement: [],
    milieu: []
  },
  primary_root_cause: '',
  root_cause_category: 'Equipment',
  contributing_factors: [],
  missing_evidence: [],
  capa_actions: [],
  status: 'Draft',
  investigator_name: 'Lead Quality Investigator',
  qa_reviewer_name: 'QA Manager',
  ai_confidence_score: null,
  ai_review_status: 'Manual Input'
};

const initialState = {
  formData: { ...defaultEmptyForm },
  isAiProcessing: false,
  aiProcessingSteps: [],
  aiExtractionResult: null,
  aiAnalysisSummary: null,
  copilotChatMessages: [
    {
      sender: 'copilot',
      text: 'Hello. I am the AIVOA Pharma RCA Copilot. Upload a deviation PDF, paste an incident report, or select a sample API incident to initiate AI-assisted root cause analysis.'
    }
  ],
  activeFormTab: 'details', // 'details', '5whys', 'fishbone', 'rootcause', 'capa', 'review'
  groqApiKey: localStorage.getItem('aivoa_groq_api_key') || '',
  selectedModel: 'llama-3.3-70b-versatile',
  isDirty: false,
  notification: null // { type: 'success'|'error'|'info', message: '' }
};

export const rcaSlice = createSlice({
  name: 'rca',
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      state.isDirty = true;
    },
    setFullFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
      state.isDirty = true;
    },
    resetForm: (state) => {
      state.formData = { ...defaultEmptyForm, date_of_occurrence: new Date().toISOString().split('T')[0] };
      state.aiExtractionResult = null;
      state.aiAnalysisSummary = null;
      state.aiProcessingSteps = [];
      state.isDirty = false;
    },
    setAiProcessing: (state, action) => {
      state.isAiProcessing = action.payload;
    },
    setAiProcessingSteps: (state, action) => {
      state.aiProcessingSteps = action.payload;
    },
    setAiExtractionResult: (state, action) => {
      state.aiExtractionResult = action.payload;
    },
    setAiAnalysisSummary: (state, action) => {
      state.aiAnalysisSummary = action.payload;
    },
    populateFromAi: (state) => {
      if (state.aiExtractionResult) {
        state.formData = {
          ...state.formData,
          ...state.aiExtractionResult,
          ai_review_status: 'AI Suggestions Populated - Pending Review'
        };
        state.isDirty = true;
      }
    },
    populateSectionFromAi: (state, action) => {
      const section = action.payload; // 'details', '5whys', 'fishbone', 'rootcause', 'capa'
      if (!state.aiExtractionResult) return;
      
      const r = state.aiExtractionResult;
      if (section === 'details') {
        state.formData.deviation_number = r.deviation_number;
        state.formData.title = r.title;
        state.formData.api_product_name = r.api_product_name;
        state.formData.batch_lot_number = r.batch_lot_number;
        state.formData.manufacturing_stage = r.manufacturing_stage;
        state.formData.date_of_occurrence = r.date_of_occurrence;
        state.formData.severity = r.severity;
        state.formData.initial_containment_action = r.initial_containment_action;
      } else if (section === '5whys') {
        state.formData.five_whys_data = r.five_whys_data;
      } else if (section === 'fishbone') {
        state.formData.fishbone_data = r.fishbone_data;
      } else if (section === 'rootcause') {
        state.formData.primary_root_cause = r.primary_root_cause;
        state.formData.root_cause_category = r.root_cause_category;
        state.formData.contributing_factors = r.contributing_factors;
        state.formData.missing_evidence = r.missing_evidence;
      } else if (section === 'capa') {
        state.formData.capa_actions = r.capa_actions;
      }
      state.isDirty = true;
    },
    // 5 Whys actions
    updateFiveWhyStep: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.formData.five_whys_data[index]) {
        state.formData.five_whys_data[index][field] = value;
        state.isDirty = true;
      }
    },
    addFiveWhyStep: (state) => {
      const nextStep = state.formData.five_whys_data.length + 1;
      state.formData.five_whys_data.push({
        step: nextStep,
        why_question: `Why did step ${nextStep - 1} occur?`,
        answer: '',
        evidence: '',
        verified: false,
        ai_suggested: false
      });
      state.isDirty = true;
    },
    removeFiveWhyStep: (state, action) => {
      const index = action.payload;
      state.formData.five_whys_data.splice(index, 1);
      // Re-index steps
      state.formData.five_whys_data.forEach((item, idx) => {
        item.step = idx + 1;
      });
      state.isDirty = true;
    },
    // Fishbone actions
    addFishboneFactor: (state, action) => {
      const { category, text } = action.payload;
      if (state.formData.fishbone_data[category]) {
        state.formData.fishbone_data[category].push(text);
        state.isDirty = true;
      }
    },
    removeFishboneFactor: (state, action) => {
      const { category, index } = action.payload;
      if (state.formData.fishbone_data[category]) {
        state.formData.fishbone_data[category].splice(index, 1);
        state.isDirty = true;
      }
    },
    // Missing Evidence actions
    updateMissingEvidenceStatus: (state, action) => {
      const { id, status } = action.payload;
      const item = state.formData.missing_evidence.find(x => x.id === id);
      if (item) {
        item.status = status;
        state.isDirty = true;
      }
    },
    addMissingEvidenceItem: (state, action) => {
      state.formData.missing_evidence.push(action.payload);
      state.isDirty = true;
    },
    removeMissingEvidenceItem: (state, action) => {
      const id = action.payload;
      state.formData.missing_evidence = state.formData.missing_evidence.filter(x => x.id !== id);
      state.isDirty = true;
    },
    // CAPA actions
    addCapaAction: (state, action) => {
      state.formData.capa_actions.push(action.payload);
      state.isDirty = true;
    },
    updateCapaAction: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.formData.capa_actions[index]) {
        state.formData.capa_actions[index][field] = value;
        state.isDirty = true;
      }
    },
    removeCapaAction: (state, action) => {
      state.formData.capa_actions.splice(action.payload, 1);
      state.isDirty = true;
    },
    // Navigation & UI
    setActiveFormTab: (state, action) => {
      state.activeFormTab = action.payload;
    },
    setGroqApiKey: (state, action) => {
      state.groqApiKey = action.payload;
      localStorage.setItem('aivoa_groq_api_key', action.payload);
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    addCopilotMessage: (state, action) => {
      state.copilotChatMessages.push(action.payload);
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

export const {
  setFormField,
  setFullFormData,
  resetForm,
  setAiProcessing,
  setAiProcessingSteps,
  setAiExtractionResult,
  setAiAnalysisSummary,
  populateFromAi,
  populateSectionFromAi,
  updateFiveWhyStep,
  addFiveWhyStep,
  removeFiveWhyStep,
  addFishboneFactor,
  removeFishboneFactor,
  updateMissingEvidenceStatus,
  addMissingEvidenceItem,
  removeMissingEvidenceItem,
  addCapaAction,
  updateCapaAction,
  removeCapaAction,
  setActiveFormTab,
  setGroqApiKey,
  setSelectedModel,
  addCopilotMessage,
  setNotification,
  clearNotification
} = rcaSlice.actions;

export default rcaSlice.reducer;
