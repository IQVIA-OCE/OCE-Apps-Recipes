import { configureStore } from '@reduxjs/toolkit';
import * as reportApi from '../../api/reportApi';
import {
  testProductAllocationDetailData
} from "../../__mocks__/testData";
import {
  makeSlice,
  productAllocationDetailReportReducer,
  fetchDTPDetailReport,
  fetchMoreDTPDetailReport,
  initialState,
} from "./ProductAllocationDetailReportSlice";
import { REPORT_LIMIT, makeSearchSlice } from '../Search/SearchSlice';
import { makeProductAllocationSlice } from '../ProductAllocationReport/ProductAllocationReportSlice'
import { LOADING_STATUS } from "../../constants";

jest.mock('../../api/reportApi', () => ({
  fetchDTPDetailReportData: jest.fn()
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    sfApiVersion: () => '',
    userID: () => '',
    territory: () => '',
    locale: () => '',
    userId: () => ''
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));

const testInitialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  productAllocationDetailRecords: [],
  error: null,
};

const testProductAllocationState = {
  selectedRow: { startDate: '2022-03-01', endDate: '2022-03-31' },
};


const searchInitialState = {
  params: {
    limit: REPORT_LIMIT,
    offset: 0,
    searchQuery: '',
    searchField: ''
  },
}


describe('ProductAllocationDetailReportSlice.js', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      reportApi.fetchDTPDetailReportData.mockReset();
    });

    it('fetchDTPDetailReportData should return product allocation details', async () => {
      reportApi.fetchDTPDetailReportData.mockResolvedValueOnce(testProductAllocationDetailData);

      const slice = makeSlice(initialState);
      const productAllocationSlice = makeProductAllocationSlice(testProductAllocationState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          productAllocationDetailReport: slice.reducer,
          productAllocationReport: productAllocationSlice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchDTPDetailReport());
      expect(reportApi.fetchDTPDetailReportData).toHaveBeenCalled();
    });

    it('fetchDTPDetailReportData should return product allocation details without date params', async () => {
      reportApi.fetchDTPDetailReportData.mockResolvedValueOnce(testProductAllocationDetailData);
      const emptyDateState = {
        selectedRow: { startDate: '', endDate: '' },
      };
      const slice = makeSlice(initialState);
      const productAllocationSlice = makeProductAllocationSlice(emptyDateState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          productAllocationDetailReport: slice.reducer,
          productAllocationReport: productAllocationSlice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchDTPDetailReport());
      expect(reportApi.fetchDTPDetailReportData).toHaveBeenCalled();
    });

    it('fetchMoreDTPDetailReport should return dtp detail array', async () => {
      reportApi.fetchDTPDetailReportData.mockResolvedValueOnce(testProductAllocationDetailData);

      const slice = makeSlice(initialState);
      const productAllocationSlice = makeProductAllocationSlice(testProductAllocationState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          productAllocationDetailReport: slice.reducer,
          productAllocationReport: productAllocationSlice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchMoreDTPDetailReport());
      expect(reportApi.fetchDTPDetailReportData).toHaveBeenCalled();
    });
    it('fetchMoreDTPDetailReport should return dtp detail array with empty date values', async () => {
      reportApi.fetchDTPDetailReportData.mockResolvedValueOnce(testProductAllocationDetailData);
      const emptyDateState = {
        selectedRow: { startDate: '', endDate: '' },
      };
      const slice = makeSlice(initialState);
      const productAllocationSlice = makeProductAllocationSlice(emptyDateState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const store = configureStore({
        reducer: {
          productAllocationDetailReport: slice.reducer,
          productAllocationReport: productAllocationSlice.reducer,
          search: searchSlice.reducer
        },
      });
      await store.dispatch(fetchMoreDTPDetailReport());
      expect(reportApi.fetchDTPDetailReportData).toHaveBeenCalled();
    });
  });

  describe('reducers and extra reducers', () => {
    let state;
    beforeEach(() => {
      state = testInitialState;
    });

    it('fetchDTPDetailReport.fulfilled extraReducers', () => {
      const newState = productAllocationDetailReportReducer(state,
        fetchDTPDetailReport.fulfilled(testProductAllocationDetailData, '', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.productAllocationDetailRecords).toBe(testProductAllocationDetailData);
    });


    it('fetchDTPDetailReport.rejected extraReducers', () => {
      const newState = productAllocationDetailReportReducer(state,
        fetchDTPDetailReport.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchDTPDetailReport.pending extraReducers', () => {
      const newState = productAllocationDetailReportReducer(state,
        fetchDTPDetailReport.pending('', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });


    it('fetchMoreDTPDetailReport.fulfilled extraReducers', () => {
      const newState = productAllocationDetailReportReducer(state,
        fetchMoreDTPDetailReport.fulfilled(testProductAllocationDetailData, '', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });


    it('fetchMoreDTPDetailReport.rejected extraReducers', () => {
      const newState = productAllocationDetailReportReducer(state,
        fetchMoreDTPDetailReport.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchMoreDTPDetailReport.pending extraReducers', () => {
      const newState = productAllocationDetailReportReducer(state,
        fetchMoreDTPDetailReport.pending('', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.FETCHING_MORE);
      expect(newState.error).toBeNull();
    });
  });
});
