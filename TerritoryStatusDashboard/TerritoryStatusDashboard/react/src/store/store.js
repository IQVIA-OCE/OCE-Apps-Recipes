import { configureStore } from '@reduxjs/toolkit';
import { notificationSliceReducer } from './notification/notificationSlice';
import { territoryStatusReducer } from './territoryStatus/territoryStatusSlice';

export default configureStore({
  reducer: {
    territoryStatus: territoryStatusReducer,
    notification: notificationSliceReducer,
  },
});
