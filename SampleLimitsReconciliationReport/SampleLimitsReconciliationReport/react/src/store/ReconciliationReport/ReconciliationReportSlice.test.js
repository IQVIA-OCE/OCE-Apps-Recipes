import { configureStore } from '@reduxjs/toolkit';
import * as reportApi from '../../api/reportApi';
import {
  mappedReports,
  testFilterActivityData,
  testSampleLimitErrorRecords,
  testTemplates
} from "../../utils/testData";
import {
  bootstrap, fetchMoreReportData,
  fetchReportData,
  initialState,
  makeSlice,
  reconciliationReportReducer, REPORT_LIMIT, setAccountData,
  setAccountSearchQuery,
  setCallActivityData,
  setOffset,
  setSortField,
  setSortOrder,
  setTemplateFilter
} from "./ReconciliationReportSlice";
import { LOADING_STATUS } from "../../constants";

jest.mock('../../api/reportApi', () => ({
  fetchLimitTemplates: jest.fn(),
  fetchReportData: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => '',
    sfApiVersion: () => '',
    userID: () => '',
    locale: () => '',
  },
  sfNetAPI: {
    query: () => jest.fn()
  }
}));

const testInitialState = {
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

describe('ReconciliationReportSlice.js', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      reportApi.fetchLimitTemplates.mockReset();
      reportApi.fetchReportData.mockReset();
    });

    it('bootstrap should return templates array', async () => {
      reportApi.fetchLimitTemplates.mockResolvedValueOnce(testTemplates);

      const slice = makeSlice(initialState);
      const store = configureStore({
        reducer: {
          templates: slice.reducer,
        },
      });
      await store.dispatch(bootstrap());
      expect(reportApi.fetchLimitTemplates).toHaveBeenCalled();
    });

    it('bootstrap should return empty array', async () => {
      reportApi.fetchLimitTemplates.mockResolvedValueOnce([]);

      const slice = makeSlice(initialState);
      const store = configureStore({
        reducer: {
          templates: slice.reducer,
        },
      });
      await store.dispatch(bootstrap());
      expect(reportApi.fetchLimitTemplates).toHaveBeenCalled();
    });

    it('fetchReportData should return reports array', async () => {
      reportApi.fetchReportData.mockResolvedValueOnce(testSampleLimitErrorRecords);

      const slice = makeSlice(initialState);
      const store = configureStore({
        reducer: {
          reconciliationReport: slice.reducer,
        },
      });
      await store.dispatch(fetchReportData());
      expect(reportApi.fetchReportData).toHaveBeenCalled();
    });

    it('fetchMoreReportData should return reports array', async () => {
      reportApi.fetchReportData.mockResolvedValueOnce(testSampleLimitErrorRecords);

      const slice = makeSlice(initialState);
      const store = configureStore({
        reducer: {
          reconciliationReport: slice.reducer,
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
      const newState = reconciliationReportReducer(state,
        bootstrap.fulfilled( testTemplates, '', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.templates).toBe(testTemplates);
    });

    it('bootstrap.rejected extraReducers', () => {
      const newState = reconciliationReportReducer( state,
        bootstrap.rejected(null, '', () => {}, {message: 'Rejected'}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('bootstrap.pending extraReducers', () => {
      const newState = reconciliationReportReducer( state,
        bootstrap.pending('', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });

    it('fetchReportData.fulfilled extraReducers', () => {
      const newState = reconciliationReportReducer(state,
        fetchReportData.fulfilled( testSampleLimitErrorRecords, '', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(newState.limitErrorRecords).toBe(testSampleLimitErrorRecords);
      expect(newState.accountRecords).toBe(testSampleLimitErrorRecords);
    });

    it('fetchReportData.rejected extraReducers', () => {
      const newState = reconciliationReportReducer( state,
        fetchReportData.rejected(null, '', () => {}, {message: 'Rejected'}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchReportData.pending extraReducers', () => {
      const newState = reconciliationReportReducer( state,
        fetchReportData.pending('', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(newState.error).toBeNull();
    });

    it('fetchMoreReportData.fulfilled extraReducers', () => {
      const newState = reconciliationReportReducer(state,
        fetchMoreReportData.fulfilled( testSampleLimitErrorRecords, '', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });


    it('fetchMoreReportData.rejected extraReducers', () => {
      const newState = reconciliationReportReducer( state,
        fetchMoreReportData.rejected(null, '', () => {}, {message: 'Rejected'}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('fetchMoreReportData.pending extraReducers', () => {
      const newState = reconciliationReportReducer( state,
        fetchMoreReportData.pending('', () => {}, {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FETCHING_MORE);
      expect(newState.error).toBeNull();
    });

    it('setOffset reducer', () => {
      const newState = reconciliationReportReducer(state, setOffset(5));
      expect(newState.params.offset).toStrictEqual(5);
    });

    it('setAccountData reducer', () => {
      const newState = reconciliationReportReducer({
        ...state,
        accountRecords: mappedReports,
        limitErrorRecords: mappedReports
      }, setAccountData(''));

      expect(newState.accountRecords).toStrictEqual(mappedReports);
    });

    it('setAccountSearchQuery reducer', () => {
      const newState = reconciliationReportReducer(state, setAccountSearchQuery('Bill'));
      expect(newState.params.searchQuery).toStrictEqual('Bill');
    });

    it('setTemplateFilter reducer', () => {
      const newState = reconciliationReportReducer(state, setTemplateFilter('Belgian'));
      expect(newState.params.templateFilter).toStrictEqual('Belgian');
    });

    it('setSortField reducer', () => {
      const newState = reconciliationReportReducer(state, setSortField('Templates'));
      expect(newState.params.sortField).toStrictEqual('Templates');
    });

    it('setSortOrder reducer', () => {
      const newState = reconciliationReportReducer(state, setSortOrder(''));
      expect(newState.params.sortOrder).toStrictEqual('');
    });

    it('setCallActivityData reducer', () => {
      const newState = reconciliationReportReducer({
        ...state,
        limitErrorRecords: mappedReports
      }, setCallActivityData('a5EO00000006PbJMAU'));

      expect(newState.callActivityRecords).toStrictEqual(testFilterActivityData);
    });
  });
});
