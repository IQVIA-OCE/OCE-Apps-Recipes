import { configureStore } from '@reduxjs/toolkit';
import { saveBudgetSuccessMiddleware } from './budgetPicker/budgetPickerMiddleware';
import { budgetPickerReducer } from './budgetPicker/budgetPickerSlice';
import { notificationSliceReducer } from './notification/notificationSlice';

export default configureStore({
  reducer: {
    budgetPicker: budgetPickerReducer,
    notification: notificationSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(saveBudgetSuccessMiddleware),
});
