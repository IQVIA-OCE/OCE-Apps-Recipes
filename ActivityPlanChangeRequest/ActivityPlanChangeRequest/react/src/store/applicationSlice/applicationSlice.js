import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';
import {
  fetchAccount,
  fetchAccountGoals,
  fetchAccountPlanCycleDates,
  fetchAccountsList,
  fetchActivityPlan,
  fetchDescribedAPCR,
  fetchRelatedGoals,
  fetchUpdateRecordTypes,
} from '../../api/api';
import { LOADING_STATUS } from '../../constants/loadingStatus';
import { getAccountsValues, getPicklistValues } from './utils';
import { NAMESPACE } from '../../constants/namespacePrefix';
import { layoutBridge } from 'oce-apps-bridges';
import { isValidPlanCycleDate } from '../../helpers';
import { DATES_ERROR, THRESHOLD_ERROR } from '../../constants/errors';
import {
  ADD_ACCOUNT_TYPE,
  REMOVE_ACCOUNT_TYPE,
  UPDATE_ACTIVITY_TYPE,
} from '../../constants/updateRecordTypes';

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  notification: {
    isVisible: false,
    variant: '',
    text: '',
  },
  updateRecordTypes: {},
  account: {
    id: '',
    fullName: '',
    address: '',
    activityPlan: {
      id: '',
      HQGoal: 0,
      allowedThreshold: 0,
      apcrApproved: 0,
      relatedGoalsSize: 0,
      allowedChangeRequestCount: 0,
    },
  },
  describedAPCR: {},
  picklistValues: null,
  accountsList: [],
  planCycleDates: {},
  planCycleTerritory: '',
};

export const performRequest = async (
  objectForRequest,
  rejectWithValue,
  store
) => {
  const {
    application: {
      account: {
        activityPlan: { apcrApproved, allowedChangeRequestCount },
      },
      planCycleDates,
    },
  } = store;

  if (apcrApproved < allowedChangeRequestCount) {
    if (isValidPlanCycleDate(planCycleDates)) {
      await api.create(
        `${NAMESPACE}ActivityPlanChangeRequest__c`,
        objectForRequest
      );
      setTimeout(() => layoutBridge.closeApp(), 2000);
    } else {
      return rejectWithValue({
        message: DATES_ERROR(
          planCycleDates[`${NAMESPACE}PlanCycle__r`][
            `${NAMESPACE}StartDate__c`
          ],
          planCycleDates[`${NAMESPACE}PlanCycle__r`][`${NAMESPACE}EndDate__c`]
        ),
      });
    }
  } else {
    return rejectWithValue({
      message: THRESHOLD_ERROR,
    });
  }
};

export const getPlanCycleDates = (accountId) => async dispatch => {
  try {
    const [[dates]] = await fetchAccountPlanCycleDates(accountId);
    dispatch(setPlanCycleDates(dates));
    return dates;
  } catch (err) {
    return err;
  }
}

export const getAccountsList = () => async dispatch => {
  try {
    const [response] = await fetchAccountsList();
    const accountsList = getAccountsValues(response);
    dispatch(setAccountsValues(accountsList));
    return response;
  } catch (err) {
    return err;
  }
}

export const getDescribedAPCR = createAsyncThunk(
  'application/getDescribedAPCR',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const [response] = await fetchDescribedAPCR();
      const [updateRecordTypes] = await fetchUpdateRecordTypes();
      const picklistValues = getPicklistValues(response);

      dispatch(setPicklistValues(picklistValues));
      return {
        describedAPCR: response,
        updateRecordTypes: updateRecordTypes,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAccountInfo = createAsyncThunk(
  'application/getAccountInfo',
  async (accountId, { dispatch, rejectWithValue }) => {
    try {
      const [[account]] = await fetchAccount(accountId);
      const [accountGoals] = await fetchAccountGoals(accountId);
      const [[activityPlan]] = await fetchActivityPlan(accountGoals);

      const accountGoal = accountGoals.find(
        (el) => el.Id === activityPlan[`${NAMESPACE}AccountGoal__c`]
      );
      const relatedGoals = await fetchRelatedGoals(
        accountGoal[`${NAMESPACE}PlanCycle__c`]
      );

      dispatch(
        setPlanCycleTerrirtory(
          accountGoal[`${NAMESPACE}PlanCycle__r`][`${NAMESPACE}Territory__c`]
        )
      );

      const relatedGoalsSize = relatedGoals[1].totalSize;
      const allowedThreshold =
        accountGoal[`${NAMESPACE}PlanCycle__r`][`${NAMESPACE}APCRThreshold__c`];

      return {
        id: accountId,
        fullName: `${account['FirstName']} ${account['LastName']}`,
        address:
          account[`${NAMESPACE}PrimaryAccountAddress__r`][
            `${NAMESPACE}FullAddress__c`
          ],
        activityPlan: {
          id: activityPlan.Id,
          HQGoal: activityPlan[`${NAMESPACE}HQGoal__c`] || 0,
          apcrApproved:
            accountGoal[`${NAMESPACE}PlanCycle__r`][
              `${NAMESPACE}APCRApproved__c`
            ] || 0,
          relatedGoalsSize: relatedGoalsSize,
          allowedChangeRequestCount: Math.floor(
            (relatedGoalsSize * allowedThreshold) / 100
          ),
          allowedThreshold,
        },
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateActivityPlan = createAsyncThunk(
  'application/updateActivityPlan',
  async (formState, { getState, rejectWithValue }) => {
    try {
      const {
        application: {
          updateRecordTypes,
          account: { id },
          planCycleTerritory,
        },
      } = getState();

      const objectToSave = {
        RecordTypeId: updateRecordTypes.find(
          (el) => el.Name === UPDATE_ACTIVITY_TYPE
        ).Id,
        [`${NAMESPACE}Account__c`]: id,
        [`${NAMESPACE}RepGoal__c`]: formState.updatedValue,
        [`${NAMESPACE}ActivityType__c`]: formState[
          `${NAMESPACE}ActivityType__c`
        ].value,
        [`${NAMESPACE}Territory__c`]: planCycleTerritory,
        [`${NAMESPACE}Reason__c`]: formState[`${NAMESPACE}Reason__c`].value,
      };

      return await performRequest(objectToSave, rejectWithValue, getState());
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addActivityToPlan = createAsyncThunk(
  'application/addActivityToPlan',
  async (formState, { getState, rejectWithValue }) => {
    try {
      const {
        application: { updateRecordTypes, planCycleTerritory },
      } = getState();

      const objectToAdd = {
        RecordTypeId: updateRecordTypes.find(
          (el) => el.Name === ADD_ACCOUNT_TYPE
        ).Id,
        [`${NAMESPACE}Account__c`]: formState[`${NAMESPACE}Account__c`].value,
        [`${NAMESPACE}RepGoal__c`]: formState.updatedValue,
        [`${NAMESPACE}ActivityType__c`]: formState[
          `${NAMESPACE}ActivityType__c`
        ].value,
        [`${NAMESPACE}Territory__c`]: planCycleTerritory,
        [`${NAMESPACE}Reason__c`]: formState[`${NAMESPACE}Reason__c`].value,
      };

      return await performRequest(objectToAdd, rejectWithValue, getState());
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeActivityPlan = createAsyncThunk(
  'application/removeActivityPlan',
  async (formState, { getState, rejectWithValue }) => {
    try {
      const {
        application: {
          updateRecordTypes,
          account: { id },
          planCycleTerritory,
        },
      } = getState();

      const objectToRemove = {
        RecordTypeId: updateRecordTypes.find(
          (el) => el.Name === REMOVE_ACCOUNT_TYPE
        ).Id,
        [`${NAMESPACE}Account__c`]: id,
        [`${NAMESPACE}Territory__c`]: planCycleTerritory,
        [`${NAMESPACE}Confirmation__c`]: formState[
          `${NAMESPACE}Confirmation__c`
        ],
      };

      return await performRequest(objectToRemove, rejectWithValue, getState());
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const makeSlice = (initialState) =>
  createSlice({
    name: 'application',
    initialState,
    reducers: {
      setPicklistValues: (state, action) => {
        state.picklistValues = action.payload;
      },
      setAccountsValues: (state, action) => {
        state.accountsList = action.payload;
      },
      showNotification: (state, action) => {
        state.notification = action.payload;
      },
      closeNotification: (state) => {
        state.notification = initialState.notification;
      },
      setPlanCycleDates: (state, action) => {
        state.planCycleDates = action.payload;
      },
      setPlanCycleTerrirtory: (state, action) => {
        state.planCycleTerritory = action.payload;
      },
    },
    extraReducers: {
      [getDescribedAPCR.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.notification = initialState.notification;
      },
      [getDescribedAPCR.fulfilled]: (state, action) => {
        state.notification = initialState.notification;
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.updateRecordTypes = action.payload.updateRecordTypes;
        state.describedAPCR = action.payload.describedAPCR;
      },
      [getDescribedAPCR.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.notification = {
          isVisible: true,
          variant: 'error',
          text: action.error.message,
        };
      },
      [getAccountInfo.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
      },
      [getAccountInfo.fulfilled]: (state, action) => {
        state.notification = initialState.notification;
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.account = action.payload;
      },
      [getAccountInfo.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.notification = {
          isVisible: true,
          variant: 'error',
          text: action.error.message,
        };
      },
      [updateActivityPlan.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
      },
      [updateActivityPlan.fulfilled]: (state) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.notification = {
          isVisible: true,
          variant: 'success',
          text: 'Activity Plan Change Request submitted for Approval',
        };
      },
      [updateActivityPlan.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.notification = {
          isVisible: true,
          variant: 'error',
          text: action.payload.message,
        };
      },
      [addActivityToPlan.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
      },
      [addActivityToPlan.fulfilled]: (state) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.notification = {
          isVisible: true,
          variant: 'success',
          text: 'Activity Type add request submitted for approval',
        };
      },
      [addActivityToPlan.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.notification = {
          isVisible: true,
          variant: 'error',
          text: action.payload.message,
        };
      },
      [removeActivityPlan.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
      },
      [removeActivityPlan.fulfilled]: (state) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.notification = {
          isVisible: true,
          variant: 'success',
          text: 'Activity Type remove request submitted for approval',
        };
      },
      [removeActivityPlan.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.notification = {
          isVisible: true,
          variant: 'error',
          text: action.payload.message,
        };
      },
    },
  });

export const applicationSlice = makeSlice(initialState);

export const {
  setPicklistValues,
  closeNotification,
  setAccountsValues,
  setPlanCycleDates,
  setPlanCycleTerrirtory,
} = applicationSlice.actions;

export default applicationSlice.reducer;
