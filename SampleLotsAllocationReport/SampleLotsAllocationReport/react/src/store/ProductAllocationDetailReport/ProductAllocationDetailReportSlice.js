import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '../../constants';
import * as reportApi from '../../api/reportApi';
import { mapDtpAllocationDetails } from '../../utils';
import { setOffset, REPORT_LIMIT } from '../Search/SearchSlice'

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  productAllocationDetailRecords: [],
  error: null,
};



export const fetchDTPDetailReport = createAsyncThunk(
  'productAllocationDetailReport/fetchDtpDetailReport',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));
      const {
        search: { params, sortClause },
        productAllocationReport: { selectedRow }
      } = getState();
      const { startDate, endDate, id } = selectedRow;
      const startDateTime = startDate ? new Date(startDate).toISOString() : null;
      const endDateTime = endDate ? new Date(endDate).toISOString() : null;
      const records = await reportApi.fetchDTPDetailReportData({
        ...params,
        startDate: startDateTime,
        endDate: endDateTime,
        productId: id,
        sortClause
      });
      return mapDtpAllocationDetails(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



export const fetchMoreDTPDetailReport = createAsyncThunk(
  'transactionReport/fetchMoreDTPDetailReport',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        search: { params, sortClause },
        productAllocationReport: { selectedRow }
      } = getState();
      const { startDate, endDate, id } = selectedRow;
      const startDateTime = startDate ? new Date(startDate).toISOString() : null;
      const endDateTime = endDate ? new Date(endDate).toISOString() : null;
      const records = await reportApi.fetchDTPDetailReportData({
        ...params,
        offset: params.offset + REPORT_LIMIT,
        startDate: startDateTime,
        endDate: endDateTime,
        productId: id,
        sortClause
      });
      dispatch(setOffset(params.offset + REPORT_LIMIT));
      return mapDtpAllocationDetails(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'productAllocationDetailReport',
    initialState: _initialState,
    reducers: {
    },
    extraReducers: {
      [fetchDTPDetailReport.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchDTPDetailReport.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.productAllocationDetailRecords = action.payload;
      },
      [fetchDTPDetailReport.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchMoreDTPDetailReport.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
        state.error = null;
      },
      [fetchMoreDTPDetailReport.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        const moreDTPDetailRecords = action.payload;
        state.productAllocationDetailRecords = [
          ...state.productAllocationDetailRecords,
          ...moreDTPDetailRecords,
        ];
      },

      [fetchMoreDTPDetailReport.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      }
    },
  });

export const productAllocationDetailReportSlice = makeSlice(initialState);

export const productAllocationDetailReportReducer = productAllocationDetailReportSlice.reducer;
