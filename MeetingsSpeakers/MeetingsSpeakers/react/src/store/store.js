import { configureStore } from '@reduxjs/toolkit';
import { speakerPickerReducer } from './speakerPicker/speakerPickerSlice';
import { notificationSliceReducer } from './notification/notificationSlice';
import { saveSpeakersSuccessMiddleware } from './speakerPicker/speakerPickerMiddlewares';

export const store = configureStore({
  reducer: {
    speakerPicker: speakerPickerReducer,
    notification: notificationSliceReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(saveSpeakersSuccessMiddleware),
});
