import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as speakersApi from '../../api/speakersApi';
import * as commonApi from '../../api/commonApi';
import { LOADING_STATUS, LOCALIZATION_NAMESPACE, NAMESPACE } from '../../constants';
import { mapMeeting, mapMeetingMembers, mapRecordType, mapSpeakers } from './utils/mappers';
import { localized, environment } from '@oce-apps/oce-apps-bridges';
import { MEETING_DUPLICATE_MEMBER_HANDLER } from '../../constants/dbTriggerNames';
import { fetchMeetingAttendees, fetchMeetingSpeakers } from '../../api/meetingApi';

export const SPEAKERS_LIMIT = 15;

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  meeting: {},
  recordType: {},
  speakers: [],
  meetingMembers: [],
  meetingMembersMap: {},
  invitedSpeakersMap: {},
  isSystemGeneratedFilterEnabled: true,
  params: {
    limit: SPEAKERS_LIMIT,
    offset: 0,
    searchQuery: '',
    userPreferredCountries: [],
  },
  error: null,
};

export const fetchSpeakers = createAsyncThunk(
  'speakerPicker/fetchSpeakers',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setOffset(0));

      const {
        speakerPicker: { params, isSystemGeneratedFilterEnabled },
      } = getState();

      const _params = { ...params };
      if (!isSystemGeneratedFilterEnabled) {
        delete _params.userPreferredCountries;
      }

      const [records] = await speakersApi.fetchSpeakers(_params);

      return mapSpeakers(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMoreSpeakers = createAsyncThunk(
  'speakerPicker/fetchMoreSpeakers',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        speakerPicker: { params, isSystemGeneratedFilterEnabled },
      } = getState();

      const _params = { ...params };
      if (!isSystemGeneratedFilterEnabled) {
        delete _params.userPreferredCountries;
      }

      const [records] = await speakersApi.fetchSpeakers({
        ..._params,
        offset: params.offset + SPEAKERS_LIMIT,
      });
      dispatch(setOffset(params.offset + SPEAKERS_LIMIT));

      return mapSpeakers(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveInvitedSpeakers = createAsyncThunk(
  'speakerPicker/saveInvitedSpeakers',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const {
      speakerPicker: { invitedSpeakersMap, meeting, recordType, meetingMembers, meetingMembersMap, speakers },
    } = getState();

    if (!meeting.id) {
      return rejectWithValue({
        message: 'Invalid meeting',
      });
    }

    try {
      const membersToAdd = speakers.filter(s => invitedSpeakersMap[s.id] && !meetingMembersMap[s.id]);
      const membersToDelete = meetingMembers.filter(m =>
        Boolean(!invitedSpeakersMap[m.speaker] && meetingMembersMap[m.speaker])
      );
      const membersToDeleteIds = membersToDelete.map(m => m.id);

      if (membersToAdd.length) {
        const membersWithoutAccessToAccount = membersToAdd.filter(m => m.account !== null && m.accountId === null);

        if (membersWithoutAccessToAccount.length) {
          const message = localized(
            `${LOCALIZATION_NAMESPACE}speaker_account_access`,
            'You do not have access to the Accounts linked to Speakers %1$@. Please contact your system administrator.'
          ).replace('%1$@', membersWithoutAccessToAccount.map(x => x.name).join(', '));

          return rejectWithValue({
            message,
          });
        }

        if (await commonApi.checkIfTriggerIsEnabled(MEETING_DUPLICATE_MEMBER_HANDLER)) {
          const meetingSpeakers = (await fetchMeetingSpeakers(meeting.id))
            .map(x => x[`${NAMESPACE}Speaker__r.${NAMESPACE}Account__r.Id`])
            .filter(Boolean);
          const meetingAttendees = (await fetchMeetingAttendees(meeting.id))
            .map(x => x[`${NAMESPACE}Customer__r.Id`])
            .filter(Boolean);

          let duplicateMemberType = '';
          for (const member of membersToAdd) {
            if (meetingAttendees.includes(member.accountId)) {
              duplicateMemberType = 'Attendee';
            } else if (meetingSpeakers.includes(member.accountId)) {
              duplicateMemberType = 'Speaker';
            }

            if (duplicateMemberType) {
              const errorMessage = localized(
                `${LOCALIZATION_NAMESPACE}meeting_duplicatemeetingmember`,
                '%1$@ has already been added as %2$@.'
              )
                .replace('%1$@', member.name)
                .replace('%2$@', duplicateMemberType);

              return rejectWithValue({
                message: errorMessage,
              });
            }
          }
        }
      }

      let warning = null;
      if (membersToDelete.length) {
        const unableToDelete = [];
        for (const meetingMember of membersToDelete) {
          const [canDelete, ignoredConditions] = await commonApi.checkCanDeleteMeetingMember(meeting, meetingMember);

          if (!canDelete) {
            unableToDelete.push(meetingMember.name);
          } else if (ignoredConditions.length > 0) {
            warning = localized(
              `${LOCALIZATION_NAMESPACE}all_changes_saved_warning`,
              'All changes have been saved, but %1$@ workflow context conditions were ignored'
            ).replace('%1$@', String(ignoredConditions.length));
          }
        }

        if (unableToDelete.length > 0) {
          const errorMessage = localized(
            `${LOCALIZATION_NAMESPACE}nopermissiontodelete`,
            'You do not have permission to delete the following %1$@: %2$@'
          )
            .replace('%1$@', 'Speakers')
            .replace('%2$@', unableToDelete.join(', '));

          return rejectWithValue({
            message: errorMessage,
          });
        }
      }

      if (await commonApi.checkAccountUtilizationEnabled()) {
        const fieldsConfig = await commonApi.checkUtilizationFieldsAccessGranted();
        const inaccessibleFields = fieldsConfig.filter(x => !x.isAccessible);

        if (inaccessibleFields.length > 0) {
          const errorMessage = localized(
            `${NAMESPACE}CustomLabel_31`,
            'You do not have access to %1$@. Please contact your administrator.'
          ).replace('%1$@', inaccessibleFields.map(x => x.field).join(', '));

          return rejectWithValue({
            message: errorMessage,
          });
        }

        const error = await commonApi.validateAllActiveActivityPlanConfigs();

        if (error) {
          return rejectWithValue({
            message: error,
          });
        }
      }

      if (membersToAdd.length) {
        const mappedMembersToAdd = membersToAdd.map(speaker => {
          return {
            [`${NAMESPACE}meeting__c`]: meeting.id,
            recordtypeid: recordType.id,
            name: speaker.name,
            [`${NAMESPACE}speaker__c`]: speaker.id,
            ...(speaker.user && { [`${NAMESPACE}colleague__c`]: speaker.user }),
            [`${NAMESPACE}restrictedproductsoverride__c`]: Boolean(speaker.allowRestrictedProducts),
            [`${NAMESPACE}status__c`]: 'Invited',
          };
        });

        await speakersApi.createMeetingMembers(mappedMembersToAdd);
      }

      if (membersToDeleteIds.length) {
        await speakersApi.deleteMeetingMembers(membersToDeleteIds);
      }

      const wasSomeDataSaved = Boolean(membersToAdd.length || membersToDeleteIds.length);

      if (wasSomeDataSaved) {
        const [_meetingMembers] = await speakersApi.fetchMeetingMembers(meeting.id, recordType.id);
        dispatch(setMeetingMembers(mapMeetingMembers(_meetingMembers)));
      }

      return {
        wasSomeDataSaved,
        warning,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const bootstrap = createAsyncThunk(
  'speakerPicker/bootstrap',
  async ({ parentId, recordTypeId }, { rejectWithValue }) => {
    try {
      const [
        [[meeting]],
        [[recordType]],
        [meetingMembers],
        [[{ QIDC__MDM_Preferred_Country_ims__c: userPreferredCountries }]],
      ] = await Promise.all([
        speakersApi.fetchMeeting(parentId),
        speakersApi.fetchRecordType(recordTypeId),
        speakersApi.fetchMeetingMembers(parentId, recordTypeId),
        speakersApi.fetchUserPreferredCountries(environment.userID()),
      ]);

      if (!meeting) {
        const errorMessage = 'Invalid parentId';

        return rejectWithValue({
          message: errorMessage,
        });
      }

      if (!recordType) {
        const errorMessage = 'Invalid recordTypeId';

        return rejectWithValue({
          message: errorMessage,
        });
      }

      return {
        meeting: mapMeeting(meeting),
        recordType: mapRecordType(recordType),
        meetingMembers: mapMeetingMembers(meetingMembers),
        userPreferredCountries: userPreferredCountries ? userPreferredCountries.split(';') : [],
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const speakerPickerSlice = createSlice({
  name: 'speakerPicker',
  initialState,
  reducers: {
    setOffset: (state, action) => {
      state.params.offset = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.params.searchQuery = action.payload;
    },
    toggleInviteSpeaker: (state, action) => {
      const { speaker, speakerId } = action.payload;
      const nextValue = !state.invitedSpeakersMap[speakerId] ? speaker : null;

      state.invitedSpeakersMap[speakerId] = nextValue;
    },
    setMeeting: (state, action) => {
      state.meeting = action.payload;
    },
    setRecordType: (state, action) => {
      state.recordType = action.payload;
    },
    toggleSystemGeneratedFilter: state => {
      state.isSystemGeneratedFilterEnabled = !state.isSystemGeneratedFilterEnabled;
    },
    setMeetingMembers: (state, action) => {
      state.meetingMembers = action.payload;
      state.meetingMembersMap = action.payload.reduce((acc, cur) => {
        acc[cur.speaker] = cur;
        return acc;
      }, {});
    },
  },

  extraReducers: {
    [fetchSpeakers.pending]: state => {
      state.loadingStatus = LOADING_STATUS.PENDING;
      state.error = null;
    },
    [fetchSpeakers.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.SUCCESS;
      state.speakers = action.payload;

      action.payload.forEach(speaker => {
        if (state.meetingMembersMap[speaker.id]) {
          state.invitedSpeakersMap[speaker.id] = speaker;
        }
      });
    },
    [fetchSpeakers.rejected]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.error.message;
    },

    [fetchMoreSpeakers.pending]: state => {
      state.loadingStatus = LOADING_STATUS.FETCHING_MORE;
      state.error = null;
    },
    [fetchMoreSpeakers.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.SUCCESS;
      state.speakers = [...state.speakers, ...action.payload];

      action.payload.forEach(speaker => {
        if (state.meetingMembersMap[speaker.id]) {
          state.invitedSpeakersMap[speaker.id] = speaker;
        }
      });
    },
    [fetchMoreSpeakers.rejected]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.error.message;
    },

    [bootstrap.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.IDLE;
      state.meeting = action.payload.meeting;
      state.recordType = action.payload.recordType;
      state.params.userPreferredCountries = action.payload.userPreferredCountries;
      state.meetingMembers = action.payload.meetingMembers;
      state.meetingMembersMap = action.payload.meetingMembers.reduce((acc, cur) => {
        acc[cur.speaker] = cur;
        return acc;
      }, {});
    },
    [bootstrap.rejected]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.error.message;
    },

    [saveInvitedSpeakers.pending]: state => {
      state.loadingStatus = LOADING_STATUS.SUBMITTING;
    },
    [saveInvitedSpeakers.fulfilled]: state => {
      state.loadingStatus = LOADING_STATUS.SUCCESS;
    },
    [saveInvitedSpeakers.rejected]: state => {
      state.loadingStatus = LOADING_STATUS.SUCCESS;
    },
  },
});

export const {
  setOffset,
  setSearchQuery,
  toggleInviteSpeaker,
  setMeeting,
  setRecordType,
  toggleSystemGeneratedFilter,
  setMeetingMembers,
} = speakerPickerSlice.actions;

export const speakerPickerReducer = speakerPickerSlice.reducer;
