import { configureStore } from '@reduxjs/toolkit';

import * as insightsApi from '../../api/insightsApi';
import * as commonApi from '../../api/commonApi';
import insightsReducer, { fetchInsightsList, initialState, setInsightsCount } from './insightsSlice';
import { LOADING_STATUS } from '../../constants/loadingStatus';
import meetingReducer from '../meetingSlice/meetingSlice';
import { INSIGHTS_MOCK } from '../../../__mocks__/insightsMocks';

jest.mock('../../api/insightsApi', () => ({
  fetchInsights: jest.fn(),
}));
jest.mock('../../api/commonApi', () => ({
  fetchAllAccounts: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

const makeStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      insights: insightsReducer,
      meeting: meetingReducer,
    },
    preloadedState: {
      insights: initialState,
      meeting: {
        meetingId: '1',
      },
    },
  });
};

describe('insightsSlice', () => {
  describe('async thunks', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('fetchInsightsList', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api', async () => {
        commonApi.fetchAllAccounts.mockResolvedValueOnce([[{ Id: '1' }]]);
        insightsApi.fetchInsights.mockResolvedValueOnce([INSIGHTS_MOCK]);

        await store.dispatch(fetchInsightsList());

        expect(commonApi.fetchAllAccounts).toHaveBeenCalled();
        expect(insightsApi.fetchInsights).toHaveBeenCalled();
      });

      it('should return a success action with payload', async () => {
        commonApi.fetchAllAccounts.mockResolvedValueOnce([[{ Id: '1' }]]);
        insightsApi.fetchInsights.mockResolvedValueOnce([INSIGHTS_MOCK]);

        const successAction = await store.dispatch(fetchInsightsList());

        expect(successAction.payload).toStrictEqual([
          {
            id: '0010p000013E3JiAAK',
            name: 'Aaa BBb',
            insights: [
              { id: 'a3r0p00000059TnAAI', name: 'Test', text: null, parentInsightId: 'a3r0p00000059TmAAI' },
              { id: 'a3r0p00000059TXAAY', name: 'Test', text: 'Test', parentInsightId: 'a3r0p00000059TSAAY' },
            ],
          },
          {
            id: '0010p000013EfUqAAK',
            name: 'AccountRecord1Test',
            insights: [{ id: 'a3r0p000000590eAAA', name: 'Qwer66', text: null, parentInsightId: null }],
          },
          {
            id: '0015g00000Zr42DAAR',
            name: 'Acc1 IPad22 Test1 iPad22',
            insights: [{ id: 'a3r0p00000058U0AAI', name: 'Qwer1', text: null, parentInsightId: null }],
          },
        ]);
      });

      it('should return a fail action with error', async () => {
        commonApi.fetchAllAccounts.mockResolvedValueOnce([[{ Id: '1' }]]);
        insightsApi.fetchInsights.mockRejectedValueOnce('Expected error in fetchInsights');
        const failAction = await store.dispatch(fetchInsightsList());

        expect(failAction.payload).toBe('Expected error in fetchInsights');
      });
    });
  });

  describe('reducers', () => {
    it('fetchInsightsList.pending', () => {
      const nextState = insightsReducer(initialState, fetchInsightsList.pending());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(nextState.error).toBeNull();
    });

    it('fetchInsightsList.fulfilled', () => {
      const nextState = insightsReducer(initialState, fetchInsightsList.fulfilled([{ Id: '1' }]));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.LOADED);
      expect(nextState.accounts).toStrictEqual([{ Id: '1' }]);
    });

    it('fetchInsightsList.rejected', () => {
      const nextState = insightsReducer(
        initialState,
        fetchInsightsList.rejected(null, 1, null, new Error('test error'))
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(nextState.error).toBe('test error');
    });

    it('setInsightsCount', () => {
      const nextState = insightsReducer(initialState, setInsightsCount(1));

      expect(nextState.count).toBe(1);
    });
  });
});
