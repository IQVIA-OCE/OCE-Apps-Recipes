import { configureStore } from '@reduxjs/toolkit';
import { approvalRequestsReducer } from './approvalRequests/approvalRequestsSlice';
import { notificationSliceReducer } from './notification/notificationSlice';


export const store = configureStore({
  reducer: {
    approvalRequests: approvalRequestsReducer,
    notification: notificationSliceReducer,
  },
});
