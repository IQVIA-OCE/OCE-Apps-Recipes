import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '../../constants';
import * as reportApi from '../../api/reportApi';
import { setOffset, REPORT_LIMIT } from '../Search/SearchSlice';

import { mapReport } from '../../utils';

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  sampleLotsRecords: [],
  samplesLotTotalRecords: 0,
  reportId: null,
  error: null,
};

export const bootstrap = createAsyncThunk(
  'samplesLotAllocationReport/bootstrap',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));
      const {
        search: { params, sortClause },
      } = getState();
      const totalRecords = await reportApi.fetchReportData({ ...params, isRecordCount: true })
      dispatch(setSamplesLotsTotalCount(totalRecords));
      const sampleLotRecords = await reportApi.fetchReportData({ ...params, sortClause });
      return mapReport(sampleLotRecords);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMoreReportData = createAsyncThunk(
  'samplesLotAllocationReport/fetchMoreReportData',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        search: { params, sortClause },
      } = getState();

      const records = await reportApi.fetchReportData({
        ...params,
        offset: params.offset + REPORT_LIMIT,
        sortClause
      });
      dispatch(setOffset(params.offset + REPORT_LIMIT));

      return mapReport(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const makeSampleLotsSlice = (_initialState) =>
  createSlice({
    name: 'samplesLotAllocationReport',
    initialState: _initialState,
    reducers: {
      setReportId: (state, action) => {
        state.reportId = action.payload;
      },
      setSamplesLotsTotalCount: (state, action) => {
        state.samplesLotTotalRecords = action.payload;
      }
    },
    extraReducers: {
      [bootstrap.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [bootstrap.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.sampleLotsRecords = action.payload;
      },
      [bootstrap.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.payload.message;
      },
      [fetchMoreReportData.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
        state.error = null;
      },
      [fetchMoreReportData.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        const moreSampleLotsRecords = action.payload;
        state.sampleLotsRecords = [
          ...state.sampleLotsRecords,
          ...moreSampleLotsRecords,
        ];
      },

      [fetchMoreReportData.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      }

    },
  });

export const sampleLotsAllocationReportSlice = makeSampleLotsSlice(initialState);

export const {
  setReportId,
  setSamplesLotsTotalCount
} = sampleLotsAllocationReportSlice.actions;

export const sampleLotsAllocationReportReducer = sampleLotsAllocationReportSlice.reducer;
