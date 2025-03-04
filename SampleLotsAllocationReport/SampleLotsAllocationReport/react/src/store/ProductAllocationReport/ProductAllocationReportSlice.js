import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '../../constants';
import * as reportApi from '../../api/reportApi';
import { setOffset, REPORT_LIMIT } from '../Search/SearchSlice';

import { mapDtpRecord } from '../../utils';

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  productAllocationRecords: [],
  productAllocationTotalRecords: 0,
  selectedRow: null,
  error: null,
};

export const fetchDtpAllocationData = createAsyncThunk(
  'productAllocationReport/fetchDtpAllocationData',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));
      const {
        search: { params, sortClause },
      } = getState();
      const totalRecords = await reportApi.fetchDTPReportData({ ...params, isRecordCount: true });
      dispatch(setProductAllocationTotalCount(totalRecords));
      const productAllocationRecords = await reportApi.fetchDTPReportData({ ...params, sortClause });
      return mapDtpRecord(productAllocationRecords);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMoreDtpAllocationData = createAsyncThunk(
  'productAllocationReport/fetchMoreDtpAllocationData',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        search: { params, sortClause },
      } = getState();

      const productAllocationRecords = await reportApi.fetchDTPReportData({
        ...params,
        offset: params.offset + REPORT_LIMIT,
        sortClause
      });
      dispatch(setOffset(params.offset + REPORT_LIMIT));
      return mapDtpRecord(productAllocationRecords);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const makeProductAllocationSlice = (_initialState) =>
  createSlice({
    name: 'productAllocationReport',
    initialState: _initialState,
    reducers: {
      setProductAllocationTotalCount: (state, action) => {
        state.productAllocationTotalRecords = action.payload;
      },
      setRowItem: (state, action) => {
        state.selectedRow = action.payload;
      },
    },
    extraReducers: {
      [fetchDtpAllocationData.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchDtpAllocationData.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.productAllocationRecords = action.payload;
      },
      [fetchDtpAllocationData.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.payload.message;
      },
      [fetchMoreDtpAllocationData.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
        state.error = null;
      },
      [fetchMoreDtpAllocationData.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        const moreProductAllocationRecords = action.payload;
        state.productAllocationRecords = [
          ...state.productAllocationRecords,
          ...moreProductAllocationRecords,
        ];
      },

      [fetchMoreDtpAllocationData.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      }

    },
  });

export const productAllocationReportSlice = makeProductAllocationSlice(initialState);

export const {
  setRowItem,
  setProductAllocationTotalCount
} = productAllocationReportSlice.actions;

export const productAllocationReportReducer = productAllocationReportSlice.reducer;
