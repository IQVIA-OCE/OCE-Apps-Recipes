import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '../../constants';
import * as reportApi from '../../api/reportApi';
import { mapTransaction } from '../../utils';
import { setOffset, REPORT_LIMIT } from '../Search/SearchSlice'

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  transactionReportRecords: [],
  error: null,
  lastInventoryDate: null
};





export const fetchLastInventoryDate = createAsyncThunk(
  'transactionReport/fetchLastInventoryDate',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        samplesLotAllocationReport: { reportId },
      } = getState();
      const lastInventoryDetails = await reportApi.fetchLastInventoryCreatedDate({ reportId });
      return lastInventoryDetails?.date;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const fetchTransactionReportList = createAsyncThunk(
  'transactionReport/fetchTransactionReportList',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));
      const {
        transactionReport: { lastInventoryDate },
        samplesLotAllocationReport: { reportId },
        search: { params, sortClause },
      } = getState();
      const records = await reportApi.fetchTransactionReportData({
        ...params,
        reportId,
        lastInventoryDate,
        sortClause
      });
      return mapTransaction(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMoreTransactionReportList = createAsyncThunk(
  'transactionReport/fetchMoreTransactionReportList',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        transactionReport: { lastInventoryDate },
        samplesLotAllocationReport: { reportId },
        search: { params, sortClause },
      } = getState();
      const records = await reportApi.fetchTransactionReportData({
        ...params,
        offset: params.offset + REPORT_LIMIT,
        reportId,
        lastInventoryDate,
        sortClause
      });
      dispatch(setOffset(params.offset + REPORT_LIMIT));
      return mapTransaction(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'transactionReport',
    initialState: _initialState,
    reducers: {
    },
    extraReducers: {

      [fetchTransactionReportList.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchTransactionReportList.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.transactionReportRecords = action.payload;
      },
      [fetchTransactionReportList.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchLastInventoryDate.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchLastInventoryDate.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.lastInventoryDate = action.payload;
      },
      [fetchLastInventoryDate.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchMoreTransactionReportList.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
        state.error = null;
      },
      [fetchMoreTransactionReportList.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        const moreTransactionList = action.payload;
        state.transactionReportRecords = [
          ...state.transactionReportRecords,
          ...moreTransactionList,
        ];
      },

      [fetchMoreTransactionReportList.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      }
    },
  });

export const transactionReportSlice = makeSlice(initialState);


export const transactionReportReducer = transactionReportSlice.reducer;
