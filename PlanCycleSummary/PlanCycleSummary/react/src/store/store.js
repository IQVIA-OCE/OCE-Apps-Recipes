import { configureStore } from '@reduxjs/toolkit';
import applicationSlice from './applicationSlice/applicationSlice';
import { combineReducers } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: combineReducers({
    application: applicationSlice
  }),
});
