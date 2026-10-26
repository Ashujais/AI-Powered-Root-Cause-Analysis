import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export const getSampleIncidents = async () => {
  const response = await axios.get(`${API_BASE}/samples`);
  return response.data;
};

export const analyzeTextIncident = async (rawText, inputType = "Pasted Text", groqApiKey = "", groqModel = "llama-3.3-70b-versatile") => {
  const response = await axios.post(`${API_BASE}/ai/analyze-text`, {
    raw_text: rawText,
    input_type: inputType,
    groq_api_key: groqApiKey || undefined,
    groq_model: groqModel || undefined
  });
  return response.data;
};

export const uploadPdfIncident = async (file, groqApiKey = "", groqModel = "llama-3.3-70b-versatile") => {
  const formData = new FormData();
  formData.append('file', file);
  if (groqApiKey) formData.append('groq_api_key', groqApiKey);
  if (groqModel) formData.append('groq_model', groqModel);

  const response = await axios.post(`${API_BASE}/ai/upload-pdf`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const askCopilot = async (message, context, groqApiKey = "", groqModel = "llama-3.3-70b-versatile") => {
  const response = await axios.post(`${API_BASE}/ai/chat-copilot`, {
    message,
    investigation_context: context,
    groq_api_key: groqApiKey || undefined,
    groq_model: groqModel || undefined
  });
  return response.data;
};

export const getAiStatus = async () => {
  const response = await axios.get(`${API_BASE}/ai/status`);
  return response.data;
};

export const getExportPdfUrl = (investigationId) => {
  return `${API_BASE}/investigations/${investigationId}/export-pdf`;
};
