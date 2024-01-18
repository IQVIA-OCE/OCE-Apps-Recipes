import { configureStore } from '@reduxjs/toolkit';
import { topicPickerReducer } from './topicPicker/topicPickerSlice';
import { notificationReducer } from './notification/notificationSlice';
import { saveTopicsSuccessMiddleware } from './topicPicker/topicPickerMiddleware';

export const store = configureStore({
  reducer: {
    topicPicker: topicPickerReducer,
    notification: notificationReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(saveTopicsSuccessMiddleware)
});
