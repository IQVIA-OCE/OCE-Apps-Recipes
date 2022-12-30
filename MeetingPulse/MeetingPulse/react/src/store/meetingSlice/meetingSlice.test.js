import { configureStore } from '@reduxjs/toolkit';
import meetingReducer, { fetchMeeting, setMeetingId } from './meetingSlice';
import * as meetingApi from '../../api/meetingApi';

jest.mock('../../api/meetingApi', () => ({
  fetchMeeting: jest.fn(),
}));

jest.mock('../../constants/namespacePrefix', () => ({ NAMESPACE: '' }));

const MEETING = {
  EndDateTime__c: '2022-01-27T13:45:00.000+0000',
  StartDateTime__c: '2021-12-01T13:45:00.000+0000',
  Status__c: 'Draft',
  CurrencyIsoCode: 'USD',
  TotalEstimatedExpenses__c: 1000,
};

const makeStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      meeting: meetingReducer,
    },
    preloadedState: {
      meeting: initialState,
    },
  });
};

describe('meetingSlice', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe('async thunks', () => {
    describe('fetchMeeting', () => {
      it('should call api', async () => {
        const store = makeStore();
        meetingApi.fetchMeeting.mockResolvedValueOnce([[MEETING]]);

        await store.dispatch(fetchMeeting(1));

        expect(meetingApi.fetchMeeting).toHaveBeenCalled();
      });

      it('should return a success action with meeting in payload', async () => {
        const store = makeStore();
        meetingApi.fetchMeeting.mockResolvedValueOnce([[MEETING]]);

        const successAction = await store.dispatch(fetchMeeting(1));

        expect(successAction.payload).toStrictEqual({
          endDate: '2022-01-27T13:45:00.000+0000',
          startDate: '2021-12-01T13:45:00.000+0000',
          status: 'Draft',
          currencyISOCode: 'USD',
          estimatedBudget: 1000,
        });
      });

      it('should return a fail action with error', async () => {
        const store = makeStore();
        meetingApi.fetchMeeting.mockRejectedValueOnce('Expected error in fetchMeeting');
        const failAction = await store.dispatch(fetchMeeting(1));

        expect(failAction.payload).toBe('Expected error in fetchMeeting');
      });
    });
  });

  describe('reducers', () => {
    it('setMeetingId', () => {
      const initialState = {
        meetingId: null,
        meeting: {},
      };
      const newState = meetingReducer(initialState, setMeetingId(1));
      expect(newState.meetingId).toBe(1);
    });
  });
});
