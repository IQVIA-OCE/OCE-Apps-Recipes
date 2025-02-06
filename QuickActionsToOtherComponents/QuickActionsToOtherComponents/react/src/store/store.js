import { configureStore } from '@reduxjs/toolkit';
import { callReducer } from './call/callSlice';
import { meetingReducer } from './meeting/meetingSlice';
import { notificationReducer } from './notification/notificationSlice';
import { settingsReducer } from './settings/settingsSlice';

export default configureStore({
  reducer: {
    callStore: callReducer,
    meetingStore: meetingReducer,
    settingsStore: settingsReducer,
    notification: notificationReducer,
  },
});
