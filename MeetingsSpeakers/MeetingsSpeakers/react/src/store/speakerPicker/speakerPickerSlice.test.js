import {
  bootstrap,
  fetchMoreSpeakers,
  fetchSpeakers,
  initialState,
  makeSlice,
  saveInvitedSpeakers,
  setMeeting,
  setRecordType,
  speakerPickerReducer,
} from './speakerPickerSlice';
import { LOADING_STATUS } from '../../constants';
import { STATE_FOR_ADDING_SPEAKERS_TO_MEETING, STATE_FOR_DELETING_SPEAKERS_FROM_MEETING } from './utils/testData';
import { configureStore } from '@reduxjs/toolkit';
import * as speakersApi from '../../api/speakersApi';
import * as commonApi from '../../api/commonApi';
import * as meetingApi from '../../api/meetingApi';

jest.mock('../../../bridge/Database/DatabaseManager', () => ({
  databaseManager: {
    upsert: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../bridge/EnvironmentData/EnvironmentData', () => ({
  environment: {
    namespace: () => 'OCE__',
    userID: () => '1',
    sfApiVersion: () => '1',
  },
}));

jest.mock('../../api/speakersApi', () => ({
  createMeetingMembers: jest.fn(),
  deleteMeetingMembers: jest.fn(),
  fetchMeetingMembers: jest.fn(),
}));

jest.mock('../../api/commonApi');
jest.mock('../../api/meetingApi');

describe('speakerPickerSlice', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      speakersApi.createMeetingMembers.mockReset();
      speakersApi.deleteMeetingMembers.mockReset();
      commonApi.checkCanDeleteMeetingMember.mockReset();
      commonApi.checkCanDeleteMeetingMember.mockReset();
      commonApi.checkAccountUtilizationEnabled.mockReset();
    });

    it('[saveInvitedSpeakers] add speakers to meeting', async () => {
      commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
      commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce(true);
      commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
      speakersApi.fetchMeetingMembers.mockResolvedValue([[]]);

      const slice = makeSlice(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);
      const store = configureStore({
        reducer: {
          speakerPicker: slice.reducer,
        },
      });

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

    it('[saveInvitedSpeakers] if the speaker is already added to meeting as an attendee, do not call the api', async () => {
      commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
      meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([]);
      meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([{ 'OCE__Customer__r.Id': '0016g00000Me06YAAR' }]);
      commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce(true);
      commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
      speakersApi.fetchMeetingMembers.mockResolvedValueOnce([[]]);

      const slice = makeSlice(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);
      const store = configureStore({
        reducer: {
          speakerPicker: slice.reducer,
        },
      });

      await store.dispatch(saveInvitedSpeakers());

      expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
    });

    it('[saveInvitedSpeakers] if the speaker is already added to meeting a speaker, do not call the api', async () => {
      commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
      meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([
        { 'OCE__Speaker__r.OCE__Account__r.Id': '0016g00000Me06YAAR' },
      ]);
      meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([]);
      commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce(true);
      commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
      speakersApi.fetchMeetingMembers.mockResolvedValueOnce([[]]);

      const slice = makeSlice(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);
      const store = configureStore({
        reducer: {
          speakerPicker: slice.reducer,
        },
      });

      await store.dispatch(saveInvitedSpeakers());

      expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
    });

    it('[saveInvitedSpeakers] remove speakers from meeting', async () => {
      commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
      commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce(true);
      commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
      speakersApi.fetchMeetingMembers.mockResolvedValue([[]]);

      const slice = makeSlice(STATE_FOR_DELETING_SPEAKERS_FROM_MEETING);
      const store = configureStore({
        reducer: {
          speakerPicker: slice.reducer,
        },
      });

      await store.dispatch(saveInvitedSpeakers());

      expect(speakersApi.deleteMeetingMembers).toHaveBeenCalledWith([
        'oce__meetingmember__c-ACF189B9-DBE0-44C1-8422-67A106AA1D3E',
      ]);
    });

    it('[saveInvitedSpeakers] if deleting is forbidden by Generic Workflow, do not call the api', async () => {
      commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
      commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce(false);
      commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);
      speakersApi.fetchMeetingMembers.mockResolvedValue([[]]);

      const slice = makeSlice(STATE_FOR_DELETING_SPEAKERS_FROM_MEETING);
      const store = configureStore({
        reducer: {
          speakerPicker: slice.reducer,
        },
      });

      await store.dispatch(saveInvitedSpeakers());

      expect(speakersApi.deleteMeetingMembers).not.toHaveBeenCalled();
    });

    it('[saveInvitedSpeakers] if the user does not have access to utilization fields, do not call the api', async () => {
      commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
      meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([]);
      meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([]);
      commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce(true);
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

      const slice = makeSlice(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);
      const store = configureStore({
        reducer: {
          speakerPicker: slice.reducer,
        },
      });

      await store.dispatch(saveInvitedSpeakers());

      expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
    });

    it('[saveInvitedSpeakers] if there is some invalid Activity Plan config, do not call the api', async () => {
      commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(true);
      meetingApi.fetchMeetingSpeakers.mockResolvedValueOnce([]);
      meetingApi.fetchMeetingAttendees.mockResolvedValueOnce([]);
      commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce(true);
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

      const slice = makeSlice(STATE_FOR_ADDING_SPEAKERS_TO_MEETING);
      const store = configureStore({
        reducer: {
          speakerPicker: slice.reducer,
        },
      });

      await store.dispatch(saveInvitedSpeakers());

      expect(speakersApi.createMeetingMembers).not.toHaveBeenCalled();
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
