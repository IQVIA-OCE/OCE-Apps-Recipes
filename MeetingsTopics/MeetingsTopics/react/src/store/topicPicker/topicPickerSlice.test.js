import {
  bootstrap,
  fetchTopics,
  fetchMoreTopics,
  saveSelectedTopics,
  initialState,
  topicPickerReducer,
  makeSlice,
  setOffset,
  setTopicSearchQuery,
  toggleSelectTopic,
  toggleSystemGeneratedFilter,
  setMeeting,
  setRecordType,
} from './topicPickerSlice';
import { FETCH_TOPICS_DATA, LOADING_STATUS, TOPIC, MOCK_MEETING } from '../../constants';
import { configureStore } from '@reduxjs/toolkit';
import * as topicsApi from '../../api/topicsApi';
import * as meetingApi from '../../api/meetingApi';
import * as productApi from '../../api/productApi';
import {
  FETCH_MEETING_PRODUCT,
  STATE_FOR_ADDING_TOPICS_TO_MEETING,
  STATE_FOR_DELETING_TOPICS_TO_MEETING,
} from '../../constants/testData';

const TOPICS_LIMIT = 15;

jest.mock('../../../bridge/Database/DatabaseManager', () => ({
  databaseManager: {
    upsert: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../bridge/EnvironmentData/EnvironmentData', () => ({
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    locale: () => '',
  },
}));

jest.mock('../../api/productApi', () => ({
  fetchTopicsProducts: jest.fn(),
  createMeetingProducts: jest.fn(),
  fetchMeetingProduct: jest.fn(),
  deleteMeetingProducts: jest.fn(),
}));

jest.mock('../../api/meetingApi', () => ({
  fetchMeeting: jest.fn(),
}));

jest.mock('../../api/topicsApi', () => ({
  createMeetingTopics: jest.fn(),
  fetchMeetingTopics: jest.fn(),
  fetchTopics: jest.fn(),
  deleteMeetingTopic: jest.fn(),
}));

describe('topicPickerSlice', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      meetingApi.fetchMeeting.mockReset();
      topicsApi.fetchTopics.mockReset();
      topicsApi.createMeetingTopics.mockReset();
      topicsApi.deleteMeetingTopic.mockReset();
      productApi.fetchTopicsProducts.mockReset();
      productApi.fetchMeetingProduct.mockReset();
      productApi.createMeetingProducts.mockReset();
      productApi.deleteMeetingProducts.mockReset();
    });

    describe('bootstrap', () => {
      it('bootstrap should return meeting', async () => {
        topicsApi.fetchTopics.mockResolvedValueOnce(FETCH_TOPICS_DATA);

        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            topicPicker: slice.reducer,
          },
        });

        await store.dispatch(bootstrap('a470k0000010B32AAE'));

        expect(meetingApi.fetchMeeting).toHaveBeenCalled();
      });
    });

    describe('fetchTopics', () => {
      it('fetchTopics should return array of topics if meeting is valid', async () => {
        topicsApi.fetchTopics.mockResolvedValueOnce(FETCH_TOPICS_DATA);

        const slice = makeSlice({
          ...initialState,
          meeting: MOCK_MEETING,
        });
        const store = configureStore({
          reducer: {
            topicPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchTopics());

        expect(topicsApi.fetchTopics).toHaveBeenCalled();
      });

      it('fetchTopics should return empty array if meeting is not valid', async () => {
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            topicPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchTopics());

        expect(topicsApi.fetchTopics).not.toHaveBeenCalled();
        expect(store.getState().topicPicker.topics.length).toBe(0);
      });
    });

    describe('fetchMoreTopics', () => {
      it('fetchMoreTopics should return array of topics with new elements', async () => {
        topicsApi.fetchTopics.mockResolvedValueOnce(FETCH_TOPICS_DATA);

        const slice = makeSlice({
          ...initialState,
          meeting: MOCK_MEETING,
          topics: FETCH_TOPICS_DATA,
        });
        const store = configureStore({
          reducer: {
            topicPicker: slice.reducer,
          },
        });

        await store.dispatch(fetchMoreTopics());

        expect(topicsApi.fetchTopics).toHaveBeenCalled();
      });
    });

    describe('saveSelectedTopics', () => {

      it('[saveSelectedTopics] add topics to meeting', async () => {
        productApi.fetchTopicsProducts.mockResolvedValue([[]]);
        productApi.fetchMeetingProduct.mockResolvedValue([[]]);

        const slice = makeSlice(STATE_FOR_ADDING_TOPICS_TO_MEETING);
        const store = configureStore({
          reducer: {
            topicPicker: slice.reducer,
          },
        });

        await store.dispatch(saveSelectedTopics());

        const topicsToAdd = [
          {
            OCE__Meeting__c: 'a3c04000000Gs0UAAS',
            OCE__Topic__c: 'a5T6g0000009JEtEAM',
          },
        ];

        expect(topicsApi.createMeetingTopics).toHaveBeenCalledWith(topicsToAdd);
      });

      it('[saveSelectedTopics] add topics to meeting', async () => {
        productApi.fetchTopicsProducts.mockResolvedValue([[]]);
        productApi.fetchMeetingProduct.mockResolvedValue([[]]);

        const slice = makeSlice(STATE_FOR_ADDING_TOPICS_TO_MEETING);
        const store = configureStore({
          reducer: {
            topicPicker: slice.reducer,
          },
        });

        await store.dispatch(saveSelectedTopics());

        const topicsToAdd = [
          {
            OCE__Meeting__c: 'a3c04000000Gs0UAAS',
            OCE__Topic__c: 'a5T6g0000009JEtEAM',
          },
        ];

        expect(topicsApi.createMeetingTopics).toHaveBeenCalledWith(topicsToAdd);
      });
    });
  });

  describe('reducers', () => {
    let state;

    beforeEach(() => {
      state = initialState;
    });

    it('setOffset reducer', () => {
      const nextState = topicPickerReducer(
        state,
        setOffset(TOPICS_LIMIT + 5)
      );

      expect(nextState.params.offset).toBe(TOPICS_LIMIT + 5);
    });

    it('setTopicSearchQuery', () => {
      const nextState = topicPickerReducer(
        state,
        setTopicSearchQuery('Test' )
      );

      expect(nextState.params.searchQuery).toBe('Test');
    });

    it('bootstrap.fulfilled', () => {
      const nextState = topicPickerReducer(
        state,
        bootstrap.fulfilled({
          meeting: { id: 1 },
          meetingTopics: [{ id: 1, topic: 2 }],
        })
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.IDLE);
      expect(nextState.meeting).toStrictEqual({ id: 1 });
      expect(nextState.meetingTopics).toStrictEqual([{ id: 1, topic: 2 }]);
      expect(nextState.meetingTopicsMap).toStrictEqual({
        2: { id: 1, topic: 2 },
      });
    });

    it('bootstrap.rejected extraReducers', () => {
      const newState = topicPickerReducer(
        state,
        bootstrap.rejected(null, '', () => {}, 'Rejected', {})
      );

      expect(newState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(newState.error).toBe('Rejected');
    });

    it('toggleSelectTopic reducer', () => {
      const newState = topicPickerReducer(
        state,
        toggleSelectTopic( {
          topic: TOPIC,
          topicId: '16384b3ck2',
        })
      );

      expect(newState.selectedTopicsMap).toStrictEqual({[`16384b3ck2`]: TOPIC});
    });

    it('toggleSystemGeneratedFilter reducer', () => {
      const newState = topicPickerReducer(
        state,
        toggleSystemGeneratedFilter()
      );

      expect(newState.isSystemGeneratedFilterEnabled).toBe(
        !state.isSystemGeneratedFilterEnabled
      );
    });

    it('setMeeting', () => {
      const nextState = topicPickerReducer(state, setMeeting({ Id: 1 }));

      expect(nextState.meeting).toStrictEqual({
        Id: 1,
      });
    });

    it('setRecordType', () => {
      const nextState = topicPickerReducer(state, setRecordType({ Id: 1 }));

      expect(nextState.recordType).toStrictEqual({
        Id: 1,
      });
    });

    it('fetchTopics.pending', () => {
      const nextState = topicPickerReducer(
        {
          ...state,
        },
        fetchTopics.pending('', () => {}, {})
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.PENDING);
      expect(nextState.error).toBeNull();
    });

    it('fetchTopics.fulfilled', () => {
      const nextState = topicPickerReducer(
        {
          ...state,
          meetingTopicsMap: {1: {}}
        },
        fetchTopics.fulfilled([{ id: 1 }])
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(nextState.topics).toStrictEqual([{ id: 1 }]);
      expect(nextState.selectedTopicsMap).toStrictEqual({ 1: { id: 1 } });
    });

    it('fetchTopics.rejected', () => {
      const nextState = topicPickerReducer(state, fetchTopics.rejected('error'));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(nextState.error).toBe('error');
    });

    it('fetchMoreTopics.pending', () => {
      const nextState = topicPickerReducer(
        {
          state, topic: [TOPIC]
        },
        fetchMoreTopics.pending('', () => {}, {})
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FETCHING_MORE);
      expect(nextState.error).toBeNull();
    });

    it('fetchMoreTopics.fulfilled', () => {
      const nextState = topicPickerReducer(
        {
          ...state,
          meetingTopicsMap: {1: {}}
        },
        fetchMoreTopics.fulfilled([{ id: 1 }])
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(nextState.topics).toStrictEqual([{ id: 1 }]);
      expect(nextState.selectedTopicsMap).toStrictEqual({ 1: { id: 1 } });
    });

    it('fetchMoreTopics.rejected', () => {
      const nextState = topicPickerReducer(state, fetchMoreTopics.rejected('error'));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(nextState.error).toBe('error');
    });

    it('saveSelectedTopics.pending', () => {
      const nextState = topicPickerReducer(
        {
          state,
        },
        saveSelectedTopics.pending('', () => {}, {})
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.PENDING);
    });

    it('saveSelectedTopics.fulfilled', () => {
      const nextState = topicPickerReducer(
        {
          state,
        },
        saveSelectedTopics.fulfilled( '', () => {}, {})
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SAVED);
    });

    it('saveSelectedTopics.rejected', () => {
      const nextState = topicPickerReducer(
        {
          state,
        },
        saveSelectedTopics.rejected(null, '', () => {}, 'Rejected', {})
    );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });
  });
});
