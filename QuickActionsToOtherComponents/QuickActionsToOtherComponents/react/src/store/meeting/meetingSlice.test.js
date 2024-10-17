import { configureStore } from '@reduxjs/toolkit';
import * as meetingApi from '../../api/meetingApi';
import {
  CALLS_MAPPED_DATA,
  CALLS_ORIG_DATA,
  MEETING_ATTENDEES_MAPPED_DATA,
  MEETING_ATTENDEES_ORIG_DATA,
  MEETING_MAPPED_DATA,
  MEETING_ORIG_DATA,
} from '../../mocks/meetingTestData';
import {
  fetchCalls,
  fetchMeetingAttendees,
  initialState,
  makeSlice,
  meetingBootstrap,
} from './meetingSlice';

jest.mock('../../api/meetingApi', () => ({
  fetchMeeting: jest.fn(),
  fetchCalls: jest.fn(),
  fetchMeetingAttendees: jest.fn(),
}));

describe('meetingSlice', () => {
  beforeEach(() => {
    meetingApi.fetchMeeting.mockReset();
    meetingApi.fetchCalls.mockReset();
    meetingApi.fetchMeetingAttendees.mockReset();
  });

  describe('meetingBootstrap asyncThunk', () => {
    test('should return meeting from API if recordId is valid', async () => {
      meetingApi.fetchMeeting.mockResolvedValueOnce({
        records: [MEETING_ORIG_DATA],
      });

      const slice = makeSlice({
        ...initialState,
      });
      const store = configureStore({
        reducer: {
          meetingStore: slice.reducer,
        },
      });

      await store.dispatch(meetingBootstrap('111'));

      expect(meetingApi.fetchMeeting).toHaveBeenCalled();
      expect(store.getState().meetingStore.meetingObj).toEqual(
        MEETING_MAPPED_DATA
      );
    });

    test('should return ERROR if API returns error', async () => {
      meetingApi.fetchMeeting.mockRejectedValueOnce(new Error('Test error'));

      const slice = makeSlice({
        ...initialState,
      });
      const store = configureStore({
        reducer: {
          meetingStore: slice.reducer,
        },
      });

      await store.dispatch(meetingBootstrap('111'));

      expect(meetingApi.fetchMeeting).toHaveBeenCalled();
      expect(store.getState().meetingStore.error).toEqual('Rejected');
    });
  });

  describe('fetchCalls asyncThunk', () => {
    test('should return calls from API if meeting object is valid', async () => {
      meetingApi.fetchCalls.mockResolvedValueOnce({
        records: CALLS_ORIG_DATA,
        totalSize: CALLS_ORIG_DATA.length,
      });

      const slice = makeSlice({
        ...initialState,
        meetingObj: MEETING_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          meetingStore: slice.reducer,
        },
      });

      await store.dispatch(fetchCalls());

      expect(meetingApi.fetchCalls).toHaveBeenCalled();
      expect(store.getState().meetingStore.calls).toEqual({
        data: CALLS_MAPPED_DATA,
        totalSize: CALLS_MAPPED_DATA.length,
      });
    });

    test('should return ERROR if API returns error', async () => {
      meetingApi.fetchCalls.mockRejectedValueOnce(new Error('Test error'));

      const slice = makeSlice({
        ...initialState,
        meetingObj: MEETING_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          meetingStore: slice.reducer,
        },
      });

      await store.dispatch(fetchCalls());

      expect(meetingApi.fetchCalls).toHaveBeenCalled();
      expect(store.getState().meetingStore.error).toEqual('Rejected');
    });
  });

  describe('fetchMeetingAttendees asyncThunk', () => {
    test('should return meeting attendees from API if meeting object is valid', async () => {
      meetingApi.fetchMeetingAttendees.mockResolvedValueOnce({
        records: MEETING_ATTENDEES_ORIG_DATA,
      });

      const slice = makeSlice({
        ...initialState,
        meetingObj: MEETING_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          meetingStore: slice.reducer,
        },
      });

      await store.dispatch(fetchMeetingAttendees());

      expect(meetingApi.fetchMeetingAttendees).toHaveBeenCalled();
      expect(store.getState().meetingStore.meetingAttendees).toEqual(
        MEETING_ATTENDEES_MAPPED_DATA
      );
    });

    test('should return ERROR if API returns error', async () => {
      meetingApi.fetchMeetingAttendees.mockRejectedValueOnce(
        new Error('Test error')
      );

      const slice = makeSlice({
        ...initialState,
        meetingObj: MEETING_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          meetingStore: slice.reducer,
        },
      });

      await store.dispatch(fetchMeetingAttendees());

      expect(meetingApi.fetchMeetingAttendees).toHaveBeenCalled();
      expect(store.getState().meetingStore.error).toEqual('Rejected');
    });
  });
});
