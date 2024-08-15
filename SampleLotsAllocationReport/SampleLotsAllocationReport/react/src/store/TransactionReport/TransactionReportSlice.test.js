import { configureStore } from '@reduxjs/toolkit';
import * as reportApi from '../../api/reportApi';
import {
  testTransactionRecords,
  testLastInventoryDateData
} from "../../__mocks__/testData";
import {
  makeSlice,
  transactionReportReducer,
  fetchLastInventoryDate,
  fetchTransactionReportList,
  fetchMoreTransactionReportList,
  initialState
} from "./TransactionReportSlice";
import { REPORT_LIMIT, makeSearchSlice } from '../Search/SearchSlice';
import { makeSampleLotsSlice } from '../SamplesLotAllocationReport/SamplesLotAllocationReportSlice';
import { LOADING_STATUS } from "../../constants";

jest.mock('../../api/reportApi', () => ({
  fetchTransactionReportData: jest.fn(),
  fetchLastInventoryCreatedDate: jest.fn()
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
  transactionReportRecords: [],
  error: null,
  lastInventoryDate: null
};

const searchInitialState = {
  params: {
    limit: REPORT_LIMIT,
    offset: 0,
    searchQuery: '',
    searchField: ''
  },
}

const sampleLotAllocationInitialState = {
  reportId: 'a5HO00000003q9zMAA'
}

describe('TransactionReportSlice.js', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      reportApi.fetchTransactionReportData.mockReset();
      reportApi.fetchLastInventoryCreatedDate.mockReset();
    });


    it('fetchLastInventoryDate should fetch last inventory date', async () => {
      reportApi.fetchLastInventoryCreatedDate.mockResolvedValueOnce(testLastInventoryDateData);

      const slaSlice = makeSampleLotsSlice(sampleLotAllocationInitialState);
      const store = configureStore({
        reducer: {
          samplesLotAllocationReport: slaSlice.reducer
        },
      });
      await store.dispatch(fetchLastInventoryDate());
      expect(reportApi.fetchLastInventoryCreatedDate).toHaveBeenCalled();
    });



    it('fetchTransactionReportData should fetch transaction details for the report id', async () => {
      reportApi.fetchTransactionReportData.mockResolvedValueOnce(testTransactionRecords);

      const slice = makeSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const slaSlice = makeSampleLotsSlice(sampleLotAllocationInitialState);
      const store = configureStore({
        reducer: {
          transactionReport: slice.reducer,
          search: searchSlice.reducer,
          samplesLotAllocationReport: slaSlice.reducer
        },
      });
      await store.dispatch(fetchTransactionReportList());
      expect(reportApi.fetchTransactionReportData).toHaveBeenCalled();
    });



    it('fetchMoreTransactionReportList should return more transaction array', async () => {
      reportApi.fetchTransactionReportData.mockResolvedValueOnce(testTransactionRecords);

      const slice = makeSlice(initialState);
      const searchSlice = makeSearchSlice(searchInitialState);
      const slaSlice = makeSampleLotsSlice(sampleLotAllocationInitialState);
      const store = configureStore({
        reducer: {
          transactionReport: slice.reducer,
          search: searchSlice.reducer,
          samplesLotAllocationReport: slaSlice.reducer
        },
      });
      await store.dispatch(fetchMoreTransactionReportList());
      expect(reportApi.fetchTransactionReportData).toHaveBeenCalled();
    });

  });

  describe('reducers and extra reducers', () => {
    let state;
    beforeEach(() => {
      state = testInitialState;
    });



    it('fetchLastInventoryDate.fulfilled extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchLastInventoryDate.fulfilled(testLastInventoryDateData, '', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });

    it('fetchLastInventoryDate.rejected extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchLastInventoryDate.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchLastInventoryDate.pending extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchLastInventoryDate.pending('', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });



    it('fetchTransactionReportData.fulfilled extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchTransactionReportList.fulfilled(testTransactionRecords, '', () => { }, {})
      );
      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });

    it('fetchTransactionReportData.rejected extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchTransactionReportList.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchMoreTransactionReportList.fulfilled extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchMoreTransactionReportList.fulfilled(testTransactionRecords, '', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });

    it('fetchMoreTransactionReportList.rejected extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchMoreTransactionReportList.rejected(null, '', () => { }, { message: 'Rejected' }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchMoreTransactionReportList.pending extraReducers', () => {
      const newState = transactionReportReducer(state,
        fetchMoreTransactionReportList.pending('', () => { }, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FETCHING_MORE);
      expect(newState.error).toBeNull();
    });
  });
});
