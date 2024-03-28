import { configureStore } from '@reduxjs/toolkit';
import { sampleLotsAllocationReportReducer } from './SamplesLotAllocationReport/SamplesLotAllocationReportSlice';
import { productAllocationReportReducer } from './ProductAllocationReport/ProductAllocationReportSlice';
import { productAllocationDetailReportReducer } from './ProductAllocationDetailReport/ProductAllocationDetailReportSlice';
import { transactionReportReducer } from './TransactionReport/TransactionReportSlice';
import { searchReducer } from './Search/SearchSlice'
import { notificationReducer } from './Notification/NotificationSlice'

export const store = configureStore({
  reducer: {
    samplesLotAllocationReport: sampleLotsAllocationReportReducer,
    productAllocationReport: productAllocationReportReducer,
    transactionReport: transactionReportReducer,
    search: searchReducer,
    notification: notificationReducer,
    productAllocationDetailReport: productAllocationDetailReportReducer
  },
});
