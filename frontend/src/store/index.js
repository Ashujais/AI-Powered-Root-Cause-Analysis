import { configureStore } from '@reduxjs/toolkit';
import rcaReducer from './rcaSlice';
import investigationListReducer from './investigationListSlice';

export const store = configureStore({
  reducer: {
    rca: rcaReducer,
    investigationList: investigationListReducer
  }
});

export default store;
