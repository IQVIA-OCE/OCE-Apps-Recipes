import { configureStore } from '@reduxjs/toolkit';
import { callToDosReducer } from './callToDos/callToDosSlice';
import { notificationReducer } from './notification/notificationSlice';

export const store = configureStore({
  reducer: {
    callToDos: callToDosReducer,
    notification: notificationReducer,
  },
});
