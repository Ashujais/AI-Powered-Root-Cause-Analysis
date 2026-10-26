import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export const fetchSavedInvestigations = createAsyncThunk(
  'investigationList/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/investigations`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const saveInvestigationRecord = createAsyncThunk(
  'investigationList/save',
  async (formData, { rejectWithValue }) => {
    try {
      if (formData.id) {
        // Update existing
        const response = await axios.put(`${API_BASE}/investigations/${formData.id}`, formData);
        return { isNew: false, data: response.data };
      } else {
        // Create new
        const response = await axios.post(`${API_BASE}/investigations`, formData);
        return { isNew: true, data: response.data };
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const deleteInvestigationRecord = createAsyncThunk(
  'investigationList/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/investigations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

const investigationListSlice = createSlice({
  name: 'investigationList',
  initialState: {
    items: [],
    loading: false,
    error: null,
    saveLoading: false,
    saveSuccess: false
  },
  reducers: {
    clearSaveSuccess: (state) => {
      state.saveSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchSavedInvestigations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedInvestigations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSavedInvestigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save
      .addCase(saveInvestigationRecord.pending, (state) => {
        state.saveLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(saveInvestigationRecord.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.saveSuccess = true;
        const { isNew, data } = action.payload;
        if (isNew) {
          state.items.unshift(data);
        } else {
          const index = state.items.findIndex(item => item.id === data.id);
          if (index !== -1) {
            state.items[index] = data;
          }
        }
      })
      .addCase(saveInvestigationRecord.rejected, (state, action) => {
        state.saveLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteInvestigationRecord.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearSaveSuccess } = investigationListSlice.actions;
export default investigationListSlice.reducer;
