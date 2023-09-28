import { configureStore } from '@reduxjs/toolkit';
import { filtersSliceReducer } from './filters/filtersSlice';
import { ordersSliceReducer } from './orders/ordersSlice';

export default configureStore({
  reducer: {
    filters: filtersSliceReducer,
    orders: ordersSliceReducer
  },
});
