import { configureStore } from '@reduxjs/toolkit';
import * as reportApi from '../../api/reportApi';
import {
  testSamplesLotReportRecords
} from "../../__mocks__/testData";
import {
  bootstrap,
  initialState,
  makeSampleLotsSlice,
  sampleLotsAllocationReportReducer,
  fetchMoreReportData,
} from "./SamplesLotAllocationReportSlice";

import { makeSearchSlice, REPORT_LIMIT } from '../Search/SearchSlice';
import { LOADING_STATUS } from "../../constants";

jest.mock('../../api/reportApi', () => ({
  fetchReportData: jest.fn(),
}));

jest.mock('oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    sfApiVersion: () => '',
    userId: () => '',
    locale: () => '',
    territory: () => '',
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));

const testInitialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  sampleLotsRecords: [],
  totalNumberOfRecords: 0,
  error: null,
};

const searchInitialState = {
  params: {
    limit: REPORT_LIMIT,
    offset: 0,
    searchQuery: '',
    searchField: ''
  },
};

describe('SamplesLotAllocationReportSlice.js', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      reportApi.fetchReportData.mockReset();
    });

    it('bootstrap should return samplesLotsAllocation data array', async () => {
      reportApi.fetchReportData.mockResolvedValueOnce(testSamplesLotReportRecords);

      const slice = makeSampleLotsSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          samplesLotAllocationReport: slice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(bootstrap());
      expect(reportApi.fetchReportData).toHaveBeenCalled();
    });

    it('bootstrap should return empty array', async () => {
      reportApi.fetchReportData.mockResolvedValueOnce([]);

      const slice = makeSampleLotsSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          samplesLotAllocationReport: slice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(bootstrap());
      expect(reportApi.fetchReportData).toHaveBeenCalled();
    });

    it('fetchMoreReportData should return more reports array', async () => {
      reportApi.fetchReportData.mockResolvedValueOnce(testSamplesLotReportRecords);

      const slice = makeSampleLotsSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          samplesLotAllocationReport: slice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchMoreReportData());
      expect(reportApi.fetchReportData).toHaveBeenCalled();
    });
  });

  describe('reducers and extra reducers', () => {
    let state;
    beforeEach(() => {
      state = testInitialState;
    });

    it('bootstrap.fulfilled extraReducers', () => {
      const newState = sampleLotsAllocationReportReducer(state,
        bootstrap.fulfilled(testSamplesLotReportRecords, '', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.sampleLotsRecords).toBe(testSamplesLotReportRecords);
    });

    it('bootstrap.rejected extraReducers', () => {
      const newState = sampleLotsAllocationReportReducer(state,
        bootstrap.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('bootstrap.pending extraReducers', () => {
      const newState = sampleLotsAllocationReportReducer(state,
        bootstrap.pending('', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });

    it('fetchMoreReportData.fulfilled extraReducers', () => {
      const newState = sampleLotsAllocationReportReducer(state,
        fetchMoreReportData.fulfilled(testSamplesLotReportRecords, '', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });


    it('fetchMoreReportData.rejected extraReducers', () => {
      const newState = sampleLotsAllocationReportReducer(state,
        fetchMoreReportData.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchMoreReportData.pending extraReducers', () => {
      const newState = sampleLotsAllocationReportReducer(state,
        fetchMoreReportData.pending('', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FETCHING_MORE);
      expect(newState.error).toBeNull();
    });
  });
});
