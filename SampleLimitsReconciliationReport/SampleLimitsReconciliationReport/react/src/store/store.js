import { configureStore } from '@reduxjs/toolkit';
import { reconciliationReportReducer } from './ReconciliationReport/ReconciliationReportSlice';
import { notificationReducer } from './Notification/NotificationSlice';

export const store = configureStore({
  reducer: {
    reconciliationReport: reconciliationReportReducer,
    notification: notificationReducer,
  },
});
