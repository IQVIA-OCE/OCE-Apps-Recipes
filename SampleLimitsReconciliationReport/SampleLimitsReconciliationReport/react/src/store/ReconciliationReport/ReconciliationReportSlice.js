import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '../../constants';
import * as reportApi from '../../api/reportApi';
import { mapReport, mapTemplate } from '../../utils';

export const REPORT_LIMIT = 15;

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  limitErrorRecords: [],
  accountRecords: [],
  callActivityRecords: [],
  templates: [],
  params: {
    limit: REPORT_LIMIT,
    offset: 0,
    searchQuery: '',
    templateFilter: '',
    sortField: '',
    sortOrder: '',
  },
  error: null,
};

export const bootstrap = createAsyncThunk(
  'reconciliationReport/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const templateRecords = await reportApi.fetchLimitTemplates();

      return mapTemplate(templateRecords);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchReportData = createAsyncThunk(
  'reconciliationReport/fetchReportData',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));

      const {
        reconciliationReport: { params },
      } = getState();

      const records = await reportApi.fetchReportData({ ...params });

      return mapReport(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMoreReportData = createAsyncThunk(
  'reconciliationReport/fetchMoreReportData',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        reconciliationReport: { params },
      } = getState();

      const records = await reportApi.fetchReportData({
        ...params,
        offset: params.offset + REPORT_LIMIT,
      });
      dispatch(setOffset(params.offset + REPORT_LIMIT));

      return mapReport(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'reconciliationReport',
    initialState: _initialState,
    reducers: {
      setOffset: (state, action) => {
        state.params.offset = action.payload;
      },
      setAccountSearchQuery: (state, action) => {
        state.params.searchQuery = action.payload;
      },
      setAccountData: (state, action) => {
        state.accountRecords = action.payload ? action.payload : state.limitErrorRecords;
      },
      setTemplateFilter: (state, action) => {
        state.params.templateFilter = action.payload;
      },
      setSortField: (state, action) => {
        state.params.sortField = action.payload;
      },
      setSortOrder: (state, action) => {
        state.params.sortOrder = action.payload;
      },
      setCallActivityData: (state, action) => {
        state.callActivityRecords = state.limitErrorRecords.filter(
          (report) => report.sampleLimitErrorId === action.payload
        );
      },
    },
    extraReducers: {
      [bootstrap.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [bootstrap.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.templates = action.payload;
      },
      [bootstrap.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.payload.message;
      },

      [fetchReportData.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchReportData.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.limitErrorRecords = action.payload;
        state.accountRecords = state.limitErrorRecords;
      },
      [fetchReportData.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },

      [fetchMoreReportData.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
        state.error = null;
      },
      [fetchMoreReportData.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        const moreLimitErrorRecords = action.payload;
        state.limitErrorRecords = [
          ...state.limitErrorRecords,
          ...moreLimitErrorRecords,
        ];
        state.accountRecords = [
          ...state.accountRecords,
          ...moreLimitErrorRecords,
        ];
      },
      [fetchMoreReportData.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
    },
  });

export const reconciliationReportSlice = makeSlice(initialState);

export const {
  setOffset,
  setAccountSearchQuery,
  setCallActivityData,
  setTemplateFilter,
  setAccountData,
  setSortField,
  setSortOrder,
} = reconciliationReportSlice.actions;

export const reconciliationReportReducer = reconciliationReportSlice.reducer;
