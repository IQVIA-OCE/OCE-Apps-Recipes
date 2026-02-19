import {
  bootstrap,
  fetchMoreSpeakers,
  fetchSpeakers,
  initialState,
  saveInvitedSpeakers,
  setMeeting,
  setRecordType,
  speakerPickerReducer,
} from './speakerPickerSlice';
import {
  FETCH_MEETING_MEMBERS_RESPONSE,
  FETCH_MEETING_RESPONSE,
  FETCH_RECORD_TYPE_RESPONSE,
  LOADING_STATUS,
} from '../../constants';
import { STATE_FOR_ADDING_SPEAKERS_TO_MEETING, STATE_FOR_DELETING_SPEAKERS_FROM_MEETING } from './utils/testData';
import { configureStore } from '@reduxjs/toolkit';
import * as speakersApi from '../../api/speakersApi';
import * as commonApi from '../../api/commonApi';
import * as meetingApi from '../../api/meetingApi';
import {
  FETCH_MORE_SPEAKERS_DATA, FETCH_SPEAKERS_DATA,
  FETCH_USER_PREFERRED_COUNTRIES_RESPONSE,
  MAPPED_MEETING,
  MAPPED_MEETING_MEMBERS, MAPPED_MORE_SPEAKERS,
  MAPPED_RECORD_TYPE, MAPPED_SPEAKERS,
} from '../../constants/speakersTestData';

jest.mock('@oce-apps/oce-apps-bridges', () => {
  const actualModule = jest.requireActual('@oce-apps/oce-apps-bridges');

  return {
    ...actualModule,
    environment: {
      ...actualModule.environment,
      namespace: () => 'OCE__',
    },
  };
});

jest.mock('../../api/speakersApi', () => ({
  fetchSpeakers: jest.fn(),
  fetchMoreSpeakers: jest.fn(),
  createMeetingMembers: jest.fn(),
  deleteMeetingMembers: jest.fn(),
  fetchMeetingMembers: jest.fn(),
  fetchMeeting: jest.fn(),
  fetchRecordType: jest.fn(),
  fetchUserPreferredCountries: jest.fn(),
}));

jest.mock('../../api/commonApi');
jest.mock('../../api/meetingApi');

describe('speakerPickerSlice', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      speakersApi.fetchSpeakers.mockReset();
      speakersApi.createMeetingMembers.mockReset();
      speakersApi.deleteMeetingMembers.mockReset();
      speakersApi.fetchMeeting.mockReset();
      speakersApi.fetchRecordType.mockReset();
      speakersApi.fetchUserPreferredCountries.mockReset();
      commonApi.checkCanDeleteMeetingMember.mockReset();
      commonApi.checkCanDeleteMeetingMember.mockReset();
      commonApi.checkAccountUtilizationEnabled.mockReset();
    });

    describe('bootstrap', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api', async () => {
        speakersApi.fetchMeeting.mockResolvedValueOnce(FETCH_MEETING_RESPONSE);
        speakersApi.fetchRecordType.mockResolvedValueOnce(FETCH_RECORD_TYPE_RESPONSE);
        speakersApi.fetchMeetingMembers.mockResolvedValueOnce(FETCH_MEETING_MEMBERS_RESPONSE);
        speakersApi.fetchUserPreferredCountries.mockResolvedValueOnce(FETCH_USER_PREFERRED_COUNTRIES_RESPONSE);

        await store.dispatch(bootstrap({ parentId: 1, recordTypeId: '1' }));

        expect(speakersApi.fetchMeeting).toHaveBeenCalledTimes(1);
        expect(speakersApi.fetchRecordType).toHaveBeenCalledTimes(1);
        expect(speakersApi.fetchMeetingMembers).toHaveBeenCalledTimes(1);
        expect(speakersApi.fetchUserPreferredCountries).toHaveBeenCalledTimes(1);
      });

      it('should return a success action with payload', async () => {
        speakersApi.fetchMeeting.mockResolvedValueOnce(FETCH_MEETING_RESPONSE);
        speakersApi.fetchRecordType.mockResolvedValueOnce(FETCH_RECORD_TYPE_RESPONSE);
        speakersApi.fetchMeetingMembers.mockResolvedValueOnce(FETCH_MEETING_MEMBERS_RESPONSE);
        speakersApi.fetchUserPreferredCountries.mockResolvedValueOnce(FETCH_USER_PREFERRED_COUNTRIES_RESPONSE);

        const successAction = await store.dispatch(bootstrap({ parentId: 1, recordTypeId: '1' }));

        expect(successAction.payload.meeting).toStrictEqual(MAPPED_MEETING);
        expect(successAction.payload.recordType).toStrictEqual(MAPPED_RECORD_TYPE);
        expect(successAction.payload.meetingMembers).toStrictEqual(MAPPED_MEETING_MEMBERS);
        expect(successAction.payload.userPreferredCountries).toStrictEqual(['AT']);
      });

      it('should return a fail action with error', async () => {
        speakersApi.fetchMeeting.mockRejectedValueOnce('Expected error in bootstrap');

        const failAction = await store.dispatch(bootstrap({ parentId: 1, recordTypeId: '1' }));

        expect(failAction.payload).toStrictEqual('Expected error in bootstrap');
      });
    });

    describe('fetchSpeakers', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api', async () => {
        speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_SPEAKERS_DATA]);

        await store.dispatch(fetchSpeakers());

        expect(speakersApi.fetchSpeakers).toHaveBeenCalledTimes(1);
        expect(speakersApi.fetchSpeakers).toHaveBeenLastCalledWith({
          limit: 15,
          offset: 0,
          searchQuery: '',
          userPreferredCountries: [],
        });
      });

      it('should handle userPreferredCountries param', async () => {
        speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_SPEAKERS_DATA]);
        store = makeStore({
          ...initialState,
          isSystemGeneratedFilterEnabled: false,
        });

        await store.dispatch(fetchSpeakers());

        expect(speakersApi.fetchSpeakers).toHaveBeenCalledTimes(1);
        expect(speakersApi.fetchSpeakers).toHaveBeenLastCalledWith({
          limit: 15,
          offset: 0,
          searchQuery: '',
        });
      });

      it('should return a success action with payload', async () => {
        speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_SPEAKERS_DATA]);

        const successAction = await store.dispatch(fetchSpeakers());

        expect(successAction.payload).toStrictEqual(MAPPED_SPEAKERS);
      });

      it('should return a fail action with error', async () => {
        speakersApi.fetchSpeakers.mockRejectedValueOnce('Expected error in fetchSpeakers');

        const failAction = await store.dispatch(fetchSpeakers());

        expect(failAction.payload).toStrictEqual('Expected error in fetchSpeakers');
      });
    });

    describe('fetchMoreSpeakers', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api', async () => {
        speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_MORE_SPEAKERS_DATA]);

        await store.dispatch(fetchMoreSpeakers());

        expect(speakersApi.fetchSpeakers).toHaveBeenCalledTimes(1);
        expect(speakersApi.fetchSpeakers).toHaveBeenLastCalledWith({
          limit: 15,
          offset: 15,
          searchQuery: '',
          userPreferredCountries: [],
        });
      });

      it('should handle userPreferredCountries param', async () => {
        speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_MORE_SPEAKERS_DATA]);
        store = makeStore({
          ...initialState,
          isSystemGeneratedFilterEnabled: false,
        });

        await store.dispatch(fetchMoreSpeakers());

        expect(speakersApi.fetchSpeakers).toHaveBeenCalledTimes(1);
        expect(speakersApi.fetchSpeakers).toHaveBeenLastCalledWith({
          limit: 15,
          offset: 15,
          searchQuery: '',
        });
      });

      it('should return a success action with payload', async () => {
        speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_MORE_SPEAKERS_DATA]);

        const successAction = await store.dispatch(fetchMoreSpeakers());

        expect(successAction.payload).toStrictEqual(MAPPED_MORE_SPEAKERS);
      });

      it('should return a fail action with error', async () => {
        speakersApi.fetchSpeakers.mockRejectedValueOnce('Expected error in fetchMoreSpeakers');

        const failAction = await store.dispatch(fetchMoreSpeakers());

        expect(failAction.payload).toStrictEqual('Expected error in fetchMoreSpeakers');
      });
    });

    describe('saveInvitedSpeakers', () => {
      it('add speakers to meeting', async () => {
        commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
        commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, []]);
        commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
        speakersApi.fetchMeetingMembers.mockResolvedValue([[]]);

        const store = makeStore(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);

        await store.dispatch(saveInvitedSpeakers());

        const speakersToAdd = [
          {
            OCE__meeting__c: 'a3c04000000Gs0UAAS',
            OCE__restrictedproductsoverride__c: false,
            OCE__speaker__c: 'a4v040000000MakAAE',
            OCE__status__c: 'Invited',
            name: '- / AHSAN',
            recordtypeid: '0126g000000LvxTAAS',
          },
        ];

        expect(speakersApi.createMeetingMembers).toHaveBeenCalledWith(speakersToAdd);
      });

      it('if the speaker is already added to meeting as an attendee, do not call the api', async () => {
        commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
        meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([]);
        meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([{ 'OCE__Customer__r.Id': '0016g00000Me06YAAR' }]);
        commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, []]);
        commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
        speakersApi.fetchMeetingMembers.mockResolvedValueOnce([[]]);

        const store = makeStore(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);

        await store.dispatch(saveInvitedSpeakers());

        expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
      });

      it('if the speaker is already added to meeting a speaker, do not call the api', async () => {
        commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
        meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([
          { 'OCE__Speaker__r.OCE__Account__r.Id': '0016g00000Me06YAAR' },
        ]);
        meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([]);
        commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, []]);
        commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
        speakersApi.fetchMeetingMembers.mockResolvedValueOnce([[]]);

        const store = makeStore(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);

        await store.dispatch(saveInvitedSpeakers());

        expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
      });

      it('remove speakers from meeting', async () => {
        commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
        commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, []]);
        commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
        speakersApi.fetchMeetingMembers.mockResolvedValue([[]]);

        const store = makeStore(STATE_FOR_DELETING_SPEAKERS_FROM_MEETING);

        await store.dispatch(saveInvitedSpeakers());

        expect(speakersApi.deleteMeetingMembers).toHaveBeenCalledWith([
          'oce__meetingmember__c-ACF189B9-DBE0-44C1-8422-67A106AA1D3E',
        ]);
      });

      it('if deleting is forbidden by Generic Workflow, do not call the api', async () => {
        commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
        commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([false, []]);
        commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
        speakersApi.fetchMeetingMembers.mockResolvedValue([[]]);

        const store = makeStore(STATE_FOR_DELETING_SPEAKERS_FROM_MEETING);

        await store.dispatch(saveInvitedSpeakers());

        expect(speakersApi.deleteMeetingMembers).not.toHaveBeenCalled();
      });

      it('if the user does not have access to utilization fields, do not call the api', async () => {
        commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
        meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([]);
        meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([]);
        commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, []]);
        commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(true);
        speakersApi.fetchMeetingMembers.mockResolvedValueOnce([[]]);
        commonApi.checkUtilizationFieldsAccessGranted.mockResolvedValueOnce([
          {
            field: 'OCE__AccountGoal__c',
            isAccessible: false,
          },
          {
            field: 'OCE__Account__c',
            isAccessible: false,
          },
        ]);

        const store = makeStore(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);

        await store.dispatch(saveInvitedSpeakers());

        expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
      });

      it('if there is some invalid Activity Plan config, do not call the api', async () => {
        commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
        meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([]);
        meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([]);
        commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, []]);
        commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(true);
        speakersApi.fetchMeetingMembers.mockResolvedValueOnce([[]]);
        commonApi.checkUtilizationFieldsAccessGranted.mockResolvedValueOnce([
          {
            field: 'OCE__AccountGoal__c',
            isAccessible: true,
          },
          {
            field: 'OCE__Account__c',
            isAccessible: true,
          },
        ]);
        commonApi.validateAllActiveActivityPlanConfigs.mockResolvedValueOnce(
          'Invalid JSON format/structure of Activity Plan Config'
        );

        const store = makeStore(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);

        await store.dispatch(saveInvitedSpeakers());

        expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
      });
    });
  });

  describe('reducers', () => {
    let state;

    beforeEach(() => {
      state = initialState;
    });

    it('setMeeting', () => {
      const nextState = speakerPickerReducer(state, setMeeting({ Id: 1 }));

      expect(nextState.meeting).toStrictEqual({
        Id: 1,
      });
    });
    it('setRecordType', () => {
      const nextState = speakerPickerReducer(state, setRecordType({ Id: 1 }));

      expect(nextState.recordType).toStrictEqual({
        Id: 1,
      });
    });

    it('bootstrap.fulfilled', () => {
      const nextState = speakerPickerReducer(
        state,
        bootstrap.fulfilled({
          meeting: { id: 1 },
          recordType: { id: 1 },
          meetingMembers: [{ id: 1, speaker: 2 }],
        })
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.IDLE);
      expect(nextState.meeting).toStrictEqual({ id: 1 });
      expect(nextState.recordType).toStrictEqual({ id: 1 });
      expect(nextState.meetingMembers).toStrictEqual([{ id: 1, speaker: 2 }]);
      expect(nextState.meetingMembersMap).toStrictEqual({
        2: { id: 1, speaker: 2 },
      });
    });

    it('fetchSpeakers.fulfilled', () => {
      const nextState = speakerPickerReducer(
        {
          ...state,
          meetingMembersMap: { 1: {} },
        },
        fetchSpeakers.fulfilled([{ id: 1 }])
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(nextState.speakers).toStrictEqual([{ id: 1 }]);
      expect(nextState.invitedSpeakersMap).toStrictEqual({ 1: { id: 1 } });
    });
    it('fetchSpeakers.rejected', () => {
      const nextState = speakerPickerReducer(state, fetchSpeakers.rejected('error'));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(nextState.error).toBe('error');
    });

    it('fetchMoreSpeakers.fulfilled', () => {
      const nextState = speakerPickerReducer(
        {
          ...state,
          meetingMembersMap: { 1: {} },
        },
        fetchMoreSpeakers.fulfilled([{ id: 1 }])
      );

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(nextState.speakers).toStrictEqual([{ id: 1 }]);
      expect(nextState.invitedSpeakersMap).toStrictEqual({ 1: { id: 1 } });
    });
    it('fetchMoreSpeakers.rejected', () => {
      const nextState = speakerPickerReducer(state, fetchMoreSpeakers.rejected('error'));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
      expect(nextState.error).toBe('error');
    });
  });
});

const makeStore = (initState = initialState) => {
  return configureStore({
    reducer: {
      speakerPicker: speakerPickerReducer,
    },
    preloadedState: {
      speakerPicker: initState,
    },
  });
};
