import { configureStore } from '@reduxjs/toolkit';
import * as reportApi from '../../api/reportApi';
import {
  testProductAllocationData
} from "../../__mocks__/testData";
import {
  initialState,
  makeProductAllocationSlice,
  productAllocationReportReducer,
  fetchDtpAllocationData,
  fetchMoreDtpAllocationData
} from "./ProductAllocationReportSlice";
import { makeSearchSlice, REPORT_LIMIT } from '../Search/SearchSlice';
import { LOADING_STATUS } from "../../constants";

jest.mock('../../api/reportApi', () => ({
  fetchDTPReportData: jest.fn(),
}));

jest.mock('oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    territory: () => '',
    sfApiVersion: () => '',
    locale: () => '',
    userId: () => ''
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));

const testInitialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  productAllocationRecords: [],
  productAllocationTotalRecords: 0,
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


describe('ProductAllocationReportSlice.js', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      reportApi.fetchDTPReportData.mockReset();
    });

    it('fetchDtpAllocationData should return productAllocation data array', async () => {
      reportApi.fetchDTPReportData.mockResolvedValueOnce(testProductAllocationData);

      const slice = makeProductAllocationSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          productAllocationRecords: slice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchDtpAllocationData());
      expect(reportApi.fetchDTPReportData).toHaveBeenCalled();
    });

    it('fetchDtpAllocationData should return empty array', async () => {
      reportApi.fetchDTPReportData.mockResolvedValueOnce([]);

      const slice = makeProductAllocationSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          productAllocationRecords: slice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchDtpAllocationData());
      expect(reportApi.fetchDTPReportData).toHaveBeenCalled();
    });

    it('fetchMoreDtpAllocationData should return more reports array', async () => {
      reportApi.fetchDTPReportData.mockResolvedValueOnce(testProductAllocationData);

      const slice = makeProductAllocationSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          productAllocationRecords: slice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchMoreDtpAllocationData());
      expect(reportApi.fetchDTPReportData).toHaveBeenCalled();
    });
  });

  describe('reducers and extra reducers', () => {
    let state;
    beforeEach(() => {
      state = testInitialState;
    });

    it('fetchDtpAllocationData.fulfilled extraReducers', () => {
      const newState = productAllocationReportReducer(state,
        fetchDtpAllocationData.fulfilled(testProductAllocationData, '', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.productAllocationRecords).toBe(testProductAllocationData);
    });

    it('fetchDtpAllocationData.rejected extraReducers', () => {
      const newState = productAllocationReportReducer(state,
        fetchDtpAllocationData.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchDtpAllocationData.pending extraReducers', () => {
      const newState = productAllocationReportReducer(state,
        fetchDtpAllocationData.pending('', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });

    it('fetchMoreDtpAllocationData.fulfilled extraReducers', () => {
      const newState = productAllocationReportReducer(state,
        fetchMoreDtpAllocationData.fulfilled(testProductAllocationData, '', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });


    it('fetchMoreDtpAllocationData.rejected extraReducers', () => {
      const newState = productAllocationReportReducer(state,
        fetchMoreDtpAllocationData.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchMoreDtpAllocationData.pending extraReducers', () => {
      const newState = productAllocationReportReducer(state,
        fetchMoreDtpAllocationData.pending('', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FETCHING_MORE);
      expect(newState.error).toBeNull();
    });
  });
});
