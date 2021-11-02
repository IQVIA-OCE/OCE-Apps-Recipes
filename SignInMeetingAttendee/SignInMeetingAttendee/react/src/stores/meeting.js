import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLayouts,
  fetchMeetingsInfodb,
  fetchMeetingsMemebersInfodb,
  fetchMeetingConfigdb,
  fetchMeetingOrgLevelConfigdb,
  updateMeetingMemeberDetailsdb,
  fetchAccountDetails,
  fetchDiscrepancyPicklistValues,
  fetchMeetingTopics,
  fetchMeetingHighLightPanel,
  fetchRecordTypeForWriteIn

} from '../api/meetingsApi';
import { userId, profileId, organizationId } from '../constants';
import { DateTime } from 'luxon';
import { NAMESPACE } from '../constants';

export const initialState = {
  meetingDetails: [],
  meetingLayouts: [],
  meetingConfig: [],
  meetingGenConfig: [],
  meetingHighLightPanel: [],
  meetingProductTopics: [],
  firstName: null,
  isMeal: false,
  comments: null,
  mealOption: null,
  signature: null,
  newUserId: null,
  locationData: {
    [`${NAMESPACE}GeolocationCheckDateTimeOnSignature__c`]: null,
    [`${NAMESPACE}GeolocationMissingReasonOnSignature__c`]: null,
    [`${NAMESPACE}GeolocationOnSignature__Latitude__s`]: null,
    [`${NAMESPACE}GeolocationOnSignature__Longitude__s`]: null
  },
  error: null,
  isProcessing: false,
  signedDateTimeForCurrentUser: null,
  validationAlert: null
};

export const makeSlice = initialState => createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeetingDetails: (state, action) =>
      Object.assign({}, state, {
        meetingDetails: action.payload,
      }),
    setMeetingLayouts: (state, action) =>
      Object.assign({}, state, {
        meetingLayouts: action.payload,
      }),
    setMeetingConfig: (state, action) =>
      Object.assign({}, state, {
        meetingConfig: action.payload,
      }),
    setSignature: (state, action) =>
      Object.assign({}, state, {
        signature: action.payload,
      }),
    setMealOption: (state, action) =>
      Object.assign({}, state, {
        mealOption: action.payload,
      }),
    setIsMeal: (state, action) =>
      Object.assign({}, state, {
        isMeal: action.payload,
      }),
    setFirstName: (state, action) =>
      Object.assign({}, state, {
        firstName: action.payload,
      }),
    setComments: (state, action) =>
      Object.assign({}, state, {
        comments: action.payload,
      }),
    setSignatureLocation: (state, action) => ({ ...state, locationData: action.payload }),
    setErrorMessage: (state, action) =>
      Object.assign({}, state, {
        error: action.payload,
      }),
    setIsProcessing: (state, action) =>
      Object.assign({}, state, {
        isProcessing: action.payload,
      }),
    setSignedDateTimeForCurrentUser: (state, action) =>
      Object.assign({}, state, {
        signedDateTimeForCurrentUser: action.payload,
      }),
    setNewUserId: (state, action) =>
      Object.assign({}, state, {
        newUserId: action.payload,
      }),
    setMeetingGenConfig: (state, action) =>
      Object.assign({}, state, {
        meetingGenConfig: action.payload,
      }),
    setMeetingHighLightPanel: (state, action) =>
      Object.assign({}, state, {
        meetingHighLightPanel: action.payload,
      }),
    setMeetingTopics: (state, action) =>
      Object.assign({}, state, {
        meetingProductTopics: action.payload,
      }),
    setRestrictedProductsValidationAlert: (state, action) =>
      Object.assign({}, state, {
        validationAlert: action.payload,
      }),
  }
});
export const meetingSlice = makeSlice(initialState);
// export default slice.reducer;

export const {
  setMeetingDetails,
  setMeetingLayouts,
  setMeetingConfig,
  setSignature,
  setMealOption,
  setIsMeal,
  setSignatureLocation,
  setErrorMessage,
  setIsProcessing,
  setSignedDateTimeForCurrentUser,
  setFirstName,
  setComments,
  setNewUserId,
  setMeetingGenConfig,
  setMeetingHighLightPanel,
  setMeetingTopics,
  setRestrictedProductsValidationAlert,
} = meetingSlice.actions;

export const meeting = meetingSlice.reducer;

export function fetchMeetingsInfoAsync(parentId) {
  return async function (dispatch) {
    try {
      const meetingInfo = [];
      const data = await fetchMeetingsInfodb(parentId);
      if (data.records[0]) {
        meetingInfo.push(data.records[0]);
        const meetingMembersInfo = await fetchMeetingsMemebersInfodb(parentId);
        const meetingTopics = await fetchMeetingTopics(parentId);
        meetingInfo[0][`${NAMESPACE}MeetingMember__r`] = meetingMembersInfo;
        const updateArr = await Promise.all(meetingMembersInfo && meetingMembersInfo.records.map(async (member, index) => {
          const accountDetails = await fetchAccountDetails(member[`${NAMESPACE}Customer__c`]);
          let recordTypeDescribe = await fetchDiscrepancyPicklistValues(`${NAMESPACE}MeetingMember__c`, member.RecordTypeId);
          recordTypeDescribe = recordTypeDescribe[0] && recordTypeDescribe[0].detailLayoutSections && recordTypeDescribe[0].detailLayoutSections.filter((detailLayout) => detailLayout.heading === "Information");
          const discrepancyReasonArr = [];
          recordTypeDescribe && recordTypeDescribe[0].layoutRows.forEach((layout) => {
            const finditem = layout.layoutItems.filter((items) => items.label === "Discrepancy Reason")
            if (finditem[0]) discrepancyReasonArr.push(finditem[0])
          });
          return {
            ...member, accountDetails: accountDetails.records,
            discrepancyReasons: (discrepancyReasonArr[0] && discrepancyReasonArr[0].layoutComponents[0].details.picklistValues.filter((val) => val.label === 'Meeting contains restricted products'))
          }
        }));
        meetingInfo[0][`${NAMESPACE}MeetingMember__r`].records = updateArr;
        dispatch(setMeetingDetails(meetingInfo));
        dispatch(setMeetingTopics(meetingTopics));
        const meetingHightlight = await fetchMeetingHighLightPanel(`${NAMESPACE}Meeting__c`, `describe/compactLayouts/${meetingInfo[0].RecordTypeId}`);
        dispatch(setMeetingHighLightPanel(meetingHightlight));
      }
    } catch (err) {
    }
  };
}


export function fetchLayoutsAsync(objType) {
  return async function (dispatch) {
    try {
      const [meetingLayouts, metadata] = await fetchLayouts(objType);
      dispatch(setMeetingLayouts(meetingLayouts));
    } catch (err) {
    }
  };
}

export function updateMeetingWithSignatureAsync(parentId) {
  return async function (dispatch, getState) {
    dispatch(setIsProcessing(true));
    const { meeting } = getState();
    const dt = DateTime.now();
    const transactionOneObj = {
      ...{
        [`${NAMESPACE}Meal__c`]: meeting.isMeal,
        [`${NAMESPACE}AttendanceStatus__c`]: 'Attended-eSigned',
        [`${NAMESPACE}MealOption__c`]: meeting.mealOption,
      }, ...meeting.locationData
    };
    const transactionTwoObj = {
      [`${NAMESPACE}Signature__c`]: meeting.signature,
      [`${NAMESPACE}SignatureDate__c`]: dt.toISO(),
    }
    const failedTranscationObj = {
      [`${NAMESPACE}Meal__c`]: false,
      [`${NAMESPACE}AttendanceStatus__c`]: '',
      [`${NAMESPACE}MealOption__c`]: '',
    }

    try {
      if (!parentId) {
        const recordTypes = await fetchRecordTypeForWriteIn();
        transactionOneObj['recordtypeid'] = (recordTypes.records && recordTypes.records[0]) ? recordTypes.records[0].Id : null;
        transactionOneObj['sobject'] = `${NAMESPACE}MeetingMember__c`.toLowerCase();
        transactionOneObj['Name'] = meeting.firstName;
        transactionOneObj[`${NAMESPACE}Comments__c`] = meeting.comments
        transactionOneObj[`${NAMESPACE}Meeting__c`] = meeting.meetingDetails[0].Id;
      } else {
        transactionOneObj['Id'] = parentId;
      }
      const isSigned = await updateMeetingMemeberDetailsdb([transactionOneObj]);
      transactionTwoObj['Id'] = isSigned[0];
      failedTranscationObj['Id'] = isSigned[0];
      try {
        await updateMeetingMemeberDetailsdb([transactionTwoObj]);
        dispatch(setSignedDateTimeForCurrentUser(dt.toISO()));
        dispatch(setSignature(null));
        dispatch(setFirstName(null));
        dispatch(setComments(null));
        dispatch(setIsProcessing(false));
      } catch (error) {
        await updateMeetingMemeberDetailsdb([failedTranscationObj]);
        dispatch(setErrorMessage({
          code: error.code,
          message: error.message
        }))
        dispatch(setSignature(null));
        dispatch(setFirstName(null));
        dispatch(setComments(null));
        dispatch(setSignedDateTimeForCurrentUser(null));
        dispatch(setIsProcessing(false));
      }
    } catch (err) {
      dispatch(setErrorMessage({
        code: err.code,
        message: err.message
      }))
      dispatch(setSignedDateTimeForCurrentUser(null));
      dispatch(setSignature(null));
      dispatch(setFirstName(null));
      dispatch(setComments(null));
      dispatch(setIsProcessing(false));
    }
  }
}



export function updateMeal(isMeal) {
  return async function (dispatch, getState) {
    dispatch(setIsMeal(isMeal));
  }
}

export function updateMealOption(mealOption) {
  return async function (dispatch, getState) {
    dispatch(setMealOption(mealOption));
  }
}

export function updateSignatureLocation(locationData) {
  return async function (dispatch, getState) {
    const dt = DateTime.now();
    locationData[`${NAMESPACE}GeolocationCheckDateTimeOnSignature__c`] = dt.toISO();
    dispatch(setSignatureLocation(locationData));
  }
}


export function updateFirstName(firstName) {
  return async function (dispatch, getState) {
    dispatch(setFirstName(firstName));
  }
}


export function updateComments(comments) {
  return async function (dispatch, getState) {
    dispatch(setComments(comments));
  }
}


/* As of now fetching config setting in user level. This has to be changed once organization id available 
through environmental variable
*/
export function fetchOrganizationSettingsAsync() {
  return async function (dispatch) {
    try {
      const ownerId = profileId ? profileId : (organizationId ? organizationId : userId);
      const meetingConfig = await fetchMeetingConfigdb(ownerId);
      const meetingConfigData = await fetchMeetingOrgLevelConfigdb(ownerId);
      dispatch(setMeetingGenConfig(meetingConfig.records));
      dispatch(setMeetingConfig(meetingConfigData.records));
    } catch (err) {
    }
  }
}

