import { configureStore } from '@reduxjs/toolkit';
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
import {
  getAccountInfo,
  getAccountsList,
  getDescribedAPCR,
  getPlanCycleDates,
  makeSlice,
  updateActivityPlan,
  initialState,
  performRequest,
  addActivityToPlan,
  removeActivityPlan,
} from './applicationSlice';
import api from '../../utils/api';
import {
  ADD_ACCOUNT_TYPE,
  REMOVE_ACCOUNT_TYPE,
  UPDATE_ACTIVITY_TYPE,
} from '../../constants/updateRecordTypes';
import { NAMESPACE } from '../../constants/namespacePrefix';
import reduxStore from '../store';
import { DATES_ERROR, THRESHOLD_ERROR } from '../../constants/errors';

jest.mock('../../utils/api', () => ({
  create: jest.fn(),
}));

jest.mock('../store.js', () => ({
  getState: jest.fn(),
}));

jest.mock('../../constants/namespacePrefix', () => ({ NAMESPACE: 'OCE__' }));

jest.mock('../../api/api', () => ({
  fetchAccount: jest.fn(),
  fetchAccountGoals: jest.fn(),
  fetchAccountPlanCycleDates: jest.fn(),
  fetchAccountsList: jest.fn(),
  fetchActivityPlan: jest.fn(),
  fetchDescribedAPCR: jest.fn(),
  fetchRelatedGoals: jest.fn(),
  fetchUpdateRecordTypes: jest.fn(),
}));

describe('ApplicationSlice', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  describe('async thunks', () => {
    beforeEach(() => {
      fetchAccount.mockReset();
      fetchAccountGoals.mockReset();
      fetchAccountPlanCycleDates.mockReset();
      fetchAccountsList.mockReset();
      fetchActivityPlan.mockReset();
      fetchDescribedAPCR.mockReset();
      fetchRelatedGoals.mockReset();
      fetchUpdateRecordTypes.mockReset();
    });

    describe('getPlanCycleDates', () => {
      it('should return planCycle dates', async () => {
        fetchAccountPlanCycleDates.mockResolvedValueOnce([[{}]]);
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });

        await store.dispatch(getPlanCycleDates('0014x000009EWqiAAG'));

        expect(fetchAccountPlanCycleDates).toHaveBeenCalled();
      });

      it('should throw error', async () => {
        fetchAccountPlanCycleDates.mockRejectedValueOnce({
          message: 'NO DATES'
        });

        const slice = makeSlice(initialState);

        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });

        await store.dispatch(getPlanCycleDates('123'));

        const storedDates = store.getState().application.planCycleDates

        expect(storedDates).toEqual({});
      });
    });

    describe('getAccountsList', () => {
      it('should return accounts list', async () => {
        fetchAccountsList.mockResolvedValueOnce([[{ Name: 'test', Id: 1 }]]);
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(getAccountsList());
        expect(fetchAccountsList).toHaveBeenCalled();
      });

      it('should throw error', async () => {
        fetchAccountPlanCycleDates.mockRejectedValueOnce({
            message: 'NO DATA'
        });
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(getAccountsList());

        const storedDates = store.getState().application.accountsList

        expect(storedDates).toEqual([]);
      });
    });

    describe('getDescribedAPCR', () => {
      it('should return describedAPCR', async () => {
        fetchDescribedAPCR.mockResolvedValueOnce([{ fields: [] }]);
        fetchUpdateRecordTypes.mockResolvedValueOnce([{}]);

        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(getDescribedAPCR());
        expect(fetchDescribedAPCR).toHaveBeenCalled();
        expect(fetchUpdateRecordTypes).toHaveBeenCalled();
      });

      it('should throw error', async () => {
        fetchDescribedAPCR.mockRejectedValue();
        fetchUpdateRecordTypes.mockResolvedValueOnce();
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(getDescribedAPCR());
        const errorText = store.getState().application.notification.text;
        expect(errorText).toEqual('Rejected');
      });
    });

    describe('getAccountInfo', () => {
      it('getAccountInfo should return account info', async () => {
        fetchAccount.mockResolvedValueOnce([
          [
            {
              [`${NAMESPACE}PrimaryAccountAddress__r`]: {
                [`${NAMESPACE}FullAddress__c`]: 'test',
              },
            },
          ],
        ]);
        fetchAccountGoals.mockResolvedValueOnce([
          [
            {
              Id: 1,
              [`${NAMESPACE}PlanCycle__r`]: {
                [`${NAMESPACE}Territory__c`]: 'test',
                [`${NAMESPACE}APCRThreshold__c`]: 50,
              },
            },
          ],
        ]);
        fetchActivityPlan.mockResolvedValueOnce([
          [
            {
              [`${NAMESPACE}AccountGoal__c`]: 1,
            },
          ],
        ]);
        fetchRelatedGoals.mockResolvedValueOnce([{}, { totalSize: 1 }]);
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(getAccountInfo('0014x000009EWqiAAG'));

        expect(fetchAccount).toHaveBeenCalled();
        expect(fetchAccountGoals).toHaveBeenCalled();
        expect(fetchActivityPlan).toHaveBeenCalled();
        expect(fetchRelatedGoals).toHaveBeenCalled();
      });

      it('should throw error', async () => {
        fetchAccount.mockRejectedValue();
        fetchAccountGoals.mockResolvedValueOnce();
        fetchActivityPlan.mockResolvedValueOnce();
        fetchRelatedGoals.mockResolvedValueOnce();
        const slice = makeSlice(initialState);
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(getAccountInfo('0014x000009EWqiAAG'));
        const errorText = store.getState().application.notification.text;
        expect(errorText).toEqual('Rejected');
      });

    });

    const planCycleDates = {
      [`${NAMESPACE}PlanCycle__r`]: {
        [`${NAMESPACE}EmployeeReviewEndDate__c`]: '2021-11-20',
        [`${NAMESPACE}EmployeeReviewStartDate__c`]: '2021-11-11',
        [`${NAMESPACE}EndDate__c`]: '2022-11-21',
        [`${NAMESPACE}StartDate__c`]: '2021-10-21',
        [`${NAMESPACE}ManagerReviewEndDate__c`]: '2021-11-20',
        [`${NAMESPACE}ManagerReviewStartDate__c`]: '2021-11-11',
      },
    };
    const formState = {
      [`${NAMESPACE}Account__c`]: {
        value: 'test',
      },
      updatedValue: 1,
      [`${NAMESPACE}ActivityType__c`]: {
        value: 'test',
      },
      [`${NAMESPACE}Reason__c`]: {
        value: 'test',
      },
      [`${NAMESPACE}Confirmation__c`]: true
    };

    describe('updateActivityPlan', () => {
      it('updateActivityPlan should execute api.create', async () => {
        const slice = makeSlice({
          ...initialState,
          updateRecordTypes: [{ Name: UPDATE_ACTIVITY_TYPE }],
          account: {
            activityPlan: { apcrApproved: 1, allowedChangeRequestCount: 100 },
          },
          planCycleDates,
        });
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(updateActivityPlan(formState));
        expect(api.create).toHaveBeenCalled();
      });

      it('should throw error with threshold', async () => {
        const slice = makeSlice({
          ...initialState,
          updateRecordTypes: [{ Name: UPDATE_ACTIVITY_TYPE }],
          account: {
            activityPlan: { apcrApproved: 50, allowedChangeRequestCount: 30 },
          },
          planCycleDates,
        });
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(updateActivityPlan(formState));
        const errorText = store.getState().application.notification.text;

        expect(errorText).toEqual(THRESHOLD_ERROR);
      });
      it('should throw error with dates', async () => {
        
        const slice = makeSlice({
          ...initialState,
          updateRecordTypes: [{ Name: UPDATE_ACTIVITY_TYPE }],
          account: {
            activityPlan: { apcrApproved: 1, allowedChangeRequestCount: 100 },
          },
          planCycleDates: {
            [`${NAMESPACE}PlanCycle__r`]: {
                ...planCycleDates[`${NAMESPACE}PlanCycle__r`],
                [`${NAMESPACE}EndDate__c`]: '2021-10-23',
            },
          },
        });
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(updateActivityPlan(formState));
        const errorText = store.getState().application.notification.text;

        expect(errorText).toEqual(DATES_ERROR(planCycleDates[`${NAMESPACE}PlanCycle__r`][
            `${NAMESPACE}StartDate__c`
          ],
          '2021-10-23'));
      });
    });

    describe('addActivityPlan', () => {
      it('addActivityPlan should execute api.create', async () => {
        const slice = makeSlice({
          ...initialState,
          updateRecordTypes: [{ Name: ADD_ACCOUNT_TYPE }],
          planCycleTerritory: 'test',
          account: {
            activityPlan: { apcrApproved: 1, allowedChangeRequestCount: 100 },
          },
          planCycleDates,
        });
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(addActivityToPlan(formState));
        expect(api.create).toHaveBeenCalled();
      });

      it('should throw error with threshold', async () => {
        const slice = makeSlice({
          ...initialState,
          updateRecordTypes: [{ Name: ADD_ACCOUNT_TYPE }],
          account: {
            activityPlan: { apcrApproved: 50, allowedChangeRequestCount: 30 },
          },
          planCycleDates,
        });

        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });

        await store.dispatch(addActivityToPlan(formState));

        const errorText = store.getState().application.notification.text;

        expect(errorText).toEqual(THRESHOLD_ERROR);
      });

      it('should throw error with dates', async () => {
        
        const slice = makeSlice({
          ...initialState,
          updateRecordTypes: [{ Name: ADD_ACCOUNT_TYPE }],
          account: {
            activityPlan: { apcrApproved: 1, allowedChangeRequestCount: 100 },
          },
          planCycleDates: {
            [`${NAMESPACE}PlanCycle__r`]: {
                ...planCycleDates[`${NAMESPACE}PlanCycle__r`],
                [`${NAMESPACE}EndDate__c`]: '2021-10-23',
                
            },
          },
        });
        const store = configureStore({
          reducer: {
            application: slice.reducer,
          },
        });
        await store.dispatch(addActivityToPlan(formState));
        const errorText = store.getState().application.notification.text;

        expect(errorText).toEqual(DATES_ERROR(planCycleDates[`${NAMESPACE}PlanCycle__r`][
            `${NAMESPACE}StartDate__c`
          ],
          '2021-10-23'));
      });
    });

    describe('removeAccount', () => {
        it('removeAccount should execute api.create', async () => {
          const slice = makeSlice({
            ...initialState,
            updateRecordTypes: [{ Name: REMOVE_ACCOUNT_TYPE }],
            planCycleTerritory: 'test',
            account: {
              activityPlan: { apcrApproved: 1, allowedChangeRequestCount: 100 },
              id: 1
            },
            planCycleDates
          });
          const store = configureStore({
            reducer: {
              application: slice.reducer,
            },
          });
          await store.dispatch(removeActivityPlan(formState));
          expect(api.create).toHaveBeenCalled();
        });
  
        it('should throw error with threshold', async () => {
          const slice = makeSlice({
            ...initialState,
            updateRecordTypes: [{ Name: REMOVE_ACCOUNT_TYPE, Id: 1 }],
            planCycleTerritory: 'test',
            account: {
              activityPlan: { apcrApproved: 50, allowedChangeRequestCount: 30 },
              id: 1
            },
            planCycleDates
          });
  
          const store = configureStore({
            reducer: {
              application: slice.reducer,
            },
          });
  
          await store.dispatch(removeActivityPlan(formState));
  
          const errorText = store.getState().application.notification.text;
  
          expect(errorText).toEqual(THRESHOLD_ERROR);
        });
  
        it('should throw error with dates', async () => {
          
          const slice = makeSlice({
            ...initialState,
            updateRecordTypes: [{ Name: REMOVE_ACCOUNT_TYPE, Id: 1 }],
            planCycleTerritory: 'test',
            account: {
              activityPlan: { apcrApproved: 1, allowedChangeRequestCount: 100 },
              id: 1
            },
            planCycleDates: {
              [`${NAMESPACE}PlanCycle__r`]: {
                  ...planCycleDates[`${NAMESPACE}PlanCycle__r`],
                  [`${NAMESPACE}EndDate__c`]: '2021-10-23',
                  
              },
            },
          });
          const store = configureStore({
            reducer: {
              application: slice.reducer,
            },
          });
          await store.dispatch(removeActivityPlan(formState));
          const errorText = store.getState().application.notification.text;
  
          expect(errorText).toEqual(DATES_ERROR(planCycleDates[`${NAMESPACE}PlanCycle__r`][
              `${NAMESPACE}StartDate__c`
            ],
            '2021-10-23'));
        });
      });
  });
});
