import { act } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import {
  bootstrap,
  callToDosReducer,
  deleteToDo,
  fetchCallToDos,
  initialState,
  saveToDo,
  setParams,
  setTotalCount,
} from './callToDosSlice';
import * as callToDoApi from '../../api/callToDoApi';
import { COMPLIANCE_TYPES, RECORD_TYPE_EPPV } from '../../__mocks__/complianceMocks';
import { LOADING_STATUS, NAMESPACE } from '../../constants';
import { CALL_MAPPED, CALL_RAW_IOS } from '../../__mocks__/callMocks';
import { CALL_TODOS_MAPPED, CALL_TODOS_RAW_IOS } from '../../__mocks__/callToDosMocks';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
  },
}));

jest.mock('../../api/callToDoApi', () => ({
  fetchCallToDos: jest.fn(),
  fetchCallToDosCount: jest.fn(),
  fetchComplianceTypes: jest.fn(),
  fetchSurveyTypes: jest.fn(),
  fetchByQueryLocator: jest.fn(),
  fetchAllComplianceRecords: jest.fn(),
  fetchCall: jest.fn(),
  fetchAccounts: jest.fn(),
  fetchCallToDoRecordType: jest.fn(),
  saveCallToDo: jest.fn(),
  deleteCallToDo: jest.fn(),
}));

const makeStore = (_initialState = initialState) => {
  return configureStore({
    reducer: {
      callToDos: callToDosReducer,
    },
    preloadedState: {
      callToDos: _initialState,
    },
  });
};

describe('callToDosSlice', () => {
  describe('async thunks', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('bootstrap', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api', async () => {
        callToDoApi.fetchCall.mockResolvedValueOnce({ records: [CALL_RAW_IOS] });
        callToDoApi.fetchComplianceTypes.mockResolvedValueOnce(COMPLIANCE_TYPES);

        await store.dispatch(bootstrap(CALL_RAW_IOS.Id));

        expect(callToDoApi.fetchCall).toHaveBeenCalledTimes(1);
        expect(callToDoApi.fetchComplianceTypes).toHaveBeenCalledTimes(1);
      });

      it('should return a success action with payload', async () => {
        callToDoApi.fetchCall.mockResolvedValueOnce({ records: [CALL_RAW_IOS] });
        callToDoApi.fetchComplianceTypes.mockResolvedValueOnce(COMPLIANCE_TYPES);

        const successAction = await store.dispatch(bootstrap(CALL_RAW_IOS.Id));

        expect(successAction.payload).toStrictEqual({
          call: CALL_MAPPED,
          complianceTypes: COMPLIANCE_TYPES,
        });
      });

      it('should return a fail action with error', async () => {
        callToDoApi.fetchCall.mockRejectedValueOnce('Expected error in bootstrap');

        const failAction = await store.dispatch(bootstrap(CALL_RAW_IOS.Id));

        expect(failAction.payload).toBe('Expected error in bootstrap');
      });
    });

    describe('fetchCallToDos', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api', async () => {
        callToDoApi.fetchCallToDos.mockResolvedValueOnce({ records: CALL_TODOS_RAW_IOS });
        callToDoApi.fetchCallToDosCount.mockResolvedValueOnce(1);

        await store.dispatch(
          fetchCallToDos({
            callId: 'a2W0k000002LNqnEAG',
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'complianceName',
            sortOrder: 'ascending',
          })
        );

        expect(callToDoApi.fetchCallToDos).toHaveBeenCalledTimes(1);
        expect(callToDoApi.fetchCallToDosCount).toHaveBeenCalledTimes(1);
      });

      it('should return a success action with payload', async () => {
        callToDoApi.fetchCallToDos.mockResolvedValueOnce({ records: CALL_TODOS_RAW_IOS });
        callToDoApi.fetchCallToDosCount.mockResolvedValueOnce(1);

        const successAction = await store.dispatch(
          fetchCallToDos({
            callId: 'a2W0k000002LNqnEAG',
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'complianceName',
            sortOrder: 'ascending',
          })
        );

        expect(successAction.payload).toStrictEqual(CALL_TODOS_MAPPED);
      });

      it('should return a fail action with error', async () => {
        callToDoApi.fetchCallToDos.mockRejectedValueOnce('Expected error in fetchCallToDos');

        const failAction = await store.dispatch(
          fetchCallToDos({
            callId: 'a2W0k000002LNqnEAG',
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'complianceName',
            sortOrder: 'ascending',
          })
        );

        expect(failAction.payload).toBe('Expected error in fetchCallToDos');
      });
    });

    describe('saveToDo', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it('should call api with new todo param', async () => {
        callToDoApi.fetchCallToDoRecordType.mockResolvedValueOnce(RECORD_TYPE_EPPV);
        callToDoApi.fetchCallToDos.mockResolvedValueOnce({ records: CALL_TODOS_RAW_IOS });
        callToDoApi.fetchCallToDosCount.mockResolvedValueOnce(1);

        await store.dispatch(
          saveToDo({
            id: null,
            callId: 'a2W0k000002LNqnEAG',
            compliance: 'a2f0k0000006r0pAAA',
            complianceType: 'EPPV',
            interviewee: null,
            otherInterviewee: '',
            surveyType: 'Face To Face',
          })
        );

        const promise = Promise.resolve();
        await act(() => promise);

        expect(callToDoApi.saveCallToDo).toHaveBeenCalledTimes(1);
        expect(callToDoApi.saveCallToDo).toHaveBeenCalledWith({
          [`${NAMESPACE}Call__c`]: 'a2W0k000002LNqnEAG',
          [`${NAMESPACE}Compliance__c`]: 'a2f0k0000006r0pAAA',
          [`${NAMESPACE}SurveyType__c`]: 'Face To Face',
          [`${NAMESPACE}Interviewee__c`]: null,
          [`${NAMESPACE}IntervieweeOther__c`]: '',
          RecordTypeId: '0120k000000QjJDAA0',
          sObject: `${NAMESPACE}CallToDo__c`,
        });
        expect(callToDoApi.fetchCallToDos).toHaveBeenCalledTimes(1);
        expect(callToDoApi.fetchCallToDosCount).toHaveBeenCalledTimes(1);
      });

      it('should call api with updated todo param', async () => {
        callToDoApi.fetchCallToDoRecordType.mockResolvedValueOnce(RECORD_TYPE_EPPV);
        callToDoApi.fetchCallToDos.mockResolvedValueOnce({ records: CALL_TODOS_RAW_IOS });
        callToDoApi.fetchCallToDosCount.mockResolvedValueOnce(1);

        await store.dispatch(
          saveToDo({
            id: '1',
            callId: 'a2W0k000002LNqnEAG',
            compliance: 'a2f0k0000006r0pAAA',
            complianceType: 'EPPV',
            interviewee: null,
            otherInterviewee: '',
            surveyType: 'Face To Face',
          })
        );

        const promise = Promise.resolve();
        await act(() => promise);

        expect(callToDoApi.saveCallToDo).toHaveBeenCalledTimes(1);
        expect(callToDoApi.saveCallToDo).toHaveBeenCalledWith({
          [`${NAMESPACE}Call__c`]: 'a2W0k000002LNqnEAG',
          [`${NAMESPACE}Compliance__c`]: 'a2f0k0000006r0pAAA',
          [`${NAMESPACE}SurveyType__c`]: 'Face To Face',
          [`${NAMESPACE}Interviewee__c`]: null,
          [`${NAMESPACE}IntervieweeOther__c`]: '',
          RecordTypeId: '0120k000000QjJDAA0',
          id: '1',
        });
        expect(callToDoApi.fetchCallToDos).toHaveBeenCalledTimes(1);
        expect(callToDoApi.fetchCallToDosCount).toHaveBeenCalledTimes(1);
      });

      it('should return a fail action with error', async () => {
        callToDoApi.fetchCallToDoRecordType.mockRejectedValueOnce('Expected error in saveToDo');

        const failAction = await store.dispatch(
          saveToDo({
            callId: 'a2W0k000002LNqnEAG',
            compliance: 'a2f0k0000006r0pAAA',
            complianceType: 'EPPV',
            interviewee: '0010k00001UXI2AAAX',
            otherInterviewee: 'Test',
            surveyType: 'Face To Face',
          })
        );

        expect(failAction.payload).toBe('Expected error in saveToDo');
      });
    });

    describe('deleteToDo', () => {
      let store;

      beforeEach(() => {
        store = makeStore();
      });

      it("should call api delete method with record's id", async () => {
        callToDoApi.fetchCallToDos.mockResolvedValueOnce({ records: CALL_TODOS_RAW_IOS });
        callToDoApi.fetchCallToDosCount.mockResolvedValueOnce(1);

        await store.dispatch(deleteToDo('1'));

        expect(callToDoApi.deleteCallToDo).toHaveBeenCalledTimes(1);
        expect(callToDoApi.deleteCallToDo).toHaveBeenCalledWith('1');
        expect(callToDoApi.fetchCallToDos).toHaveBeenCalledTimes(1);
        expect(callToDoApi.fetchCallToDosCount).toHaveBeenCalledTimes(1);
      });

      it('should return a fail action with error', async () => {
        callToDoApi.deleteCallToDo.mockRejectedValueOnce('Expected error in deleteToDo');

        const failAction = await store.dispatch(deleteToDo('1'));

        expect(failAction.payload).toBe('Expected error in deleteToDo');
      });
    });
  });

  describe('reducers', () => {
    it('setTotalCount', () => {
      const nextState = callToDosReducer(initialState, setTotalCount(1));

      expect(nextState.list.totalCount).toBe(1);
    });

    it('setParams', () => {
      const params = {
        callId: 'a2W0k000002LNqnEAG',
        page: 1,
        rowsPerPage: 5,
        sortColumn: 'complianceName',
        sortOrder: 'ascending',
      };
      const nextState = callToDosReducer(initialState, setParams(params));

      expect(nextState.list.params).toBe(params);
    });

    it('fetchCallToDos.pending', () => {
      const nextState = callToDosReducer(initialState, fetchCallToDos.pending());

      expect(nextState.list.loadingStatus).toBe(LOADING_STATUS.PENDING);
    });

    it('fetchCallToDos.fulfilled', () => {
      const nextState = callToDosReducer(initialState, fetchCallToDos.fulfilled(CALL_TODOS_MAPPED));

      expect(nextState.list.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(nextState.list.items).toBe(CALL_TODOS_MAPPED);
    });

    it('fetchCallToDos.rejected', () => {
      const nextState = callToDosReducer(initialState, fetchCallToDos.rejected());

      expect(nextState.list.loadingStatus).toBe(LOADING_STATUS.FAILED);
    });

    it('bootstrap.fulfilled', () => {
      const nextState = callToDosReducer(
        initialState,
        bootstrap.fulfilled({ call: CALL_MAPPED, complianceTypes: COMPLIANCE_TYPES })
      );

      expect(nextState.call).toBe(CALL_MAPPED);
      expect(nextState.complianceTypes).toBe(COMPLIANCE_TYPES);
    });

    it('bootstrap.rejected', () => {
      const nextState = callToDosReducer(initialState, bootstrap.rejected());

      expect(nextState.list.loadingStatus).toBe(LOADING_STATUS.FAILED);
    });

    it('saveToDo.pending', () => {
      const nextState = callToDosReducer(initialState, saveToDo.pending());

      expect(nextState.formLoadingStatus).toBe(LOADING_STATUS.SUBMITTING);
    });

    it('saveToDo.fulfilled', () => {
      const nextState = callToDosReducer(initialState, saveToDo.fulfilled());

      expect(nextState.formLoadingStatus).toBe(LOADING_STATUS.SUCCESS);
    });

    it('saveToDo.rejected', () => {
      const nextState = callToDosReducer(initialState, saveToDo.rejected());

      expect(nextState.formLoadingStatus).toBe(LOADING_STATUS.FAILED);
    });
  });
});
