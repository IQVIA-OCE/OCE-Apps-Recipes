import { configureStore } from '@reduxjs/toolkit';

import * as inquiriesApi from '../../api/inquiriesApi';
import * as commonApi from '../../api/commonApi';
import inquiriesReducer, { fetchAccountsWithInquiryQuestions, initialState, setInquiriesCount } from './inquiriesSlice';
import { LOADING_STATUS } from '../../constants/loadingStatus';
import meetingReducer from '../meetingSlice/meetingSlice';
import { GROUPED_QUESTIONS, INQUIRIES_MOCK } from '../../../__mocks__/inquiriesMocks';

jest.mock('../../api/inquiriesApi', () => ({
  fetchInquiryQuestions: jest.fn(),
}));
jest.mock('../../api/commonApi', () => ({
  fetchAllAccounts: jest.fn(),
}));

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

const makeStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      inquiries: inquiriesReducer,
      meeting: meetingReducer,
    },
    preloadedState: {
      inquiries: initialState,
      meeting: {
        meetingId: '1',
      },
    },
  });
};

describe('inquiriesSlice', () => {
  describe('async thunks', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('fetchAccountsWithInquiryQuestions', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api', async () => {
        commonApi.fetchAllAccounts.mockResolvedValueOnce([[{ Id: '1' }]]);
        inquiriesApi.fetchInquiryQuestions.mockResolvedValueOnce([INQUIRIES_MOCK]);

        await store.dispatch(fetchAccountsWithInquiryQuestions());

        expect(commonApi.fetchAllAccounts).toHaveBeenCalled();
        expect(inquiriesApi.fetchInquiryQuestions).toHaveBeenCalled();
      });

      it('should return a success action with payload', async () => {
        commonApi.fetchAllAccounts.mockResolvedValueOnce([[{ Id: '1' }]]);
        inquiriesApi.fetchInquiryQuestions.mockResolvedValueOnce([INQUIRIES_MOCK]);

        const successAction = await store.dispatch(fetchAccountsWithInquiryQuestions());

        expect(successAction.payload).toStrictEqual(GROUPED_QUESTIONS);
      });

      it('should return a fail action with error', async () => {
        commonApi.fetchAllAccounts.mockResolvedValueOnce([[{ Id: '1' }]]);
        inquiriesApi.fetchInquiryQuestions.mockRejectedValueOnce('Expected error in fetchInquiryQuestions');
        const failAction = await store.dispatch(fetchAccountsWithInquiryQuestions());

        expect(failAction.payload).toBe('Expected error in fetchInquiryQuestions');
      });
    });
  });

  describe('reducers', () => {
    it('fetchAccountsWithInquiryQuestions.pending', () => {
      const nextState = inquiriesReducer(initialState, fetchAccountsWithInquiryQuestions.pending());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(nextState.error).toBeNull();
    });

    it('fetchAccountsWithInquiryQuestions.fulfilled', () => {
      const nextState = inquiriesReducer(initialState, fetchAccountsWithInquiryQuestions.fulfilled([{ Id: '1' }]));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.LOADED);
      expect(nextState.accounts).toStrictEqual([{ Id: '1' }]);
    });

    it('fetchAccountsWithInquiryQuestions.rejected', () => {
      const nextState = inquiriesReducer(
        initialState,
        fetchAccountsWithInquiryQuestions.rejected(null, 1, null, new Error('test error'))
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(nextState.error).toBe('test error');
    });

    it('setInquiriesCount', () => {
      const nextState = inquiriesReducer(initialState, setInquiriesCount(1));

      expect(nextState.count).toBe(1);
    });
  });
});
