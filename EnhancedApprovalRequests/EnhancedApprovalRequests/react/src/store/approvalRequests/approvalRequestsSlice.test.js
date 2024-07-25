import {
  approvalRequestsReducer,
  approveRequests,
  bootstrap,
  fetchApprovalRequests,
  initialState,
  reassignRequests,
  rejectRequests,
  setParams,
  setTotalCount,
} from './approvalRequestsSlice';
import { APPROVAL_REQUEST_STATUS, LOADING_STATUS } from '../../constants';
import { configureStore } from '@reduxjs/toolkit';
import * as approvalRequestsApi from '../../api/approvalRequestsApi';
import { MAPPED_OBJECT_METADATA_MOCK, OBJECT_METADATA_MOCK } from '../../../__mocks__/metadataMocks';
import { APPROVAL_REQUESTS_MOCK, MAPPED_APPROVAL_REQUESTS_MOCK } from '../../../__mocks__/approvalRequestsMocks';
import { WORK_ITEMS_MOCK } from '../../../__mocks__/workItemsMock';

jest.mock('../../api/approvalRequestsApi', () => ({
  fetchApprovalRequests: jest.fn(),
  fetchApprovalRequestsCount: jest.fn(),
  processApprovals: jest.fn(),
  reassignApprovals: jest.fn(),
  fetchProcessInstanceWorkItems: jest.fn(),
  fetchObjectMetadata: jest.fn(),
}));

const makeStore = (_initialState = {}) => {
  return configureStore({
    reducer: {
      approvalRequests: approvalRequestsReducer,
    },
    preloadedState: {
      approvalRequests: _initialState,
    },
  });
};

describe('approveRequestsSlice', () => {
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
        approvalRequestsApi.fetchObjectMetadata.mockResolvedValueOnce(OBJECT_METADATA_MOCK);

        await store.dispatch(bootstrap());

        expect(approvalRequestsApi.fetchObjectMetadata).toHaveBeenCalledTimes(1);
      });

      it('should return a success action with payload', async () => {
        approvalRequestsApi.fetchObjectMetadata.mockResolvedValueOnce(OBJECT_METADATA_MOCK);

        const successAction = await store.dispatch(bootstrap());

        expect(successAction.payload).toStrictEqual(MAPPED_OBJECT_METADATA_MOCK);
      });

      it('should return a fail action with error', async () => {
        approvalRequestsApi.fetchObjectMetadata.mockRejectedValueOnce('Expected error in bootstrap');

        const failAction = await store.dispatch(bootstrap());

        expect(failAction.payload).toBe('Expected error in bootstrap');
      });
    });

    describe('fetchApprovalRequests', () => {
      let store;

      beforeEach(() => {
        store = makeStore({
          ...initialState,
          objectMetadataMap: MAPPED_OBJECT_METADATA_MOCK,
        });
      });

      it('should call api', async () => {
        approvalRequestsApi.fetchApprovalRequests.mockResolvedValueOnce([APPROVAL_REQUESTS_MOCK]);
        approvalRequestsApi.fetchApprovalRequestsCount.mockResolvedValueOnce([6]);

        await store.dispatch(
          fetchApprovalRequests({
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'CreatedDate',
            sortOrder: 'ASC',
            status: APPROVAL_REQUEST_STATUS.PENDING,
          })
        );

        expect(approvalRequestsApi.fetchApprovalRequests).toHaveBeenCalledTimes(1);
        expect(approvalRequestsApi.fetchApprovalRequestsCount).toHaveBeenCalledTimes(1);
      });

      it('should return a success action with payload', async () => {
        approvalRequestsApi.fetchApprovalRequests.mockResolvedValueOnce([APPROVAL_REQUESTS_MOCK]);
        approvalRequestsApi.fetchApprovalRequestsCount.mockResolvedValueOnce([6]);

        const successAction = await store.dispatch(
          fetchApprovalRequests({
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'CreatedDate',
            sortOrder: 'ASC',
            status: APPROVAL_REQUEST_STATUS.PENDING,
          })
        );

        expect(successAction.payload).toStrictEqual(MAPPED_APPROVAL_REQUESTS_MOCK);
      });

      it('should return a fail action with error', async () => {
        approvalRequestsApi.fetchApprovalRequests.mockRejectedValueOnce('Expected error in fetchApprovalRequests');

        const failAction = await store.dispatch(
          fetchApprovalRequests({
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'CreatedDate',
            sortOrder: 'ASC',
            status: APPROVAL_REQUEST_STATUS.PENDING,
          })
        );

        expect(failAction.payload).toBe('Expected error in fetchApprovalRequests');
      });
    });

    describe('approveRequests', () => {
      let store;

      beforeEach(() => {
        store = makeStore({
          ...initialState,
          params: {
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'CreatedDate',
            sortOrder: 'ASC',
            status: APPROVAL_REQUEST_STATUS.PENDING,
          },
          objectMetadataMap: MAPPED_OBJECT_METADATA_MOCK,
        });
      });

      it('should call api with params', async () => {
        approvalRequestsApi.fetchProcessInstanceWorkItems.mockResolvedValueOnce([WORK_ITEMS_MOCK]);
        approvalRequestsApi.fetchApprovalRequests.mockResolvedValueOnce([APPROVAL_REQUESTS_MOCK]);
        approvalRequestsApi.fetchApprovalRequestsCount.mockResolvedValueOnce([6]);

        await store.dispatch(approveRequests({ processInstanceIds: ['04gO0000001AbhhIAC'], comment: 'looks good' }));

        expect(approvalRequestsApi.processApprovals).toHaveBeenCalledTimes(1);
        expect(approvalRequestsApi.processApprovals).toHaveBeenCalledWith([
          {
            actionType: 'Approve',
            comments: 'looks good',
            contextId: '04iO0000001JrjgIAC',
          },
        ]);
        // refetch
        expect(approvalRequestsApi.fetchApprovalRequests).toHaveBeenCalledTimes(1);
      });

      it('should return a fail action with error', async () => {
        approvalRequestsApi.fetchProcessInstanceWorkItems.mockRejectedValueOnce('Expected error in approveRequests');

        const failAction = await store.dispatch(
          approveRequests({ processInstanceIds: ['04gO0000001AbhhIAC'], comment: 'looks good' })
        );

        expect(failAction.payload).toBe('Expected error in approveRequests');
      });
    });

    describe('rejectRequests', () => {
      let store;

      beforeEach(() => {
        store = makeStore({
          ...initialState,
          params: {
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'CreatedDate',
            sortOrder: 'ASC',
            status: APPROVAL_REQUEST_STATUS.PENDING,
          },
          objectMetadataMap: MAPPED_OBJECT_METADATA_MOCK,
        });
      });

      it('should call api with params', async () => {
        approvalRequestsApi.fetchProcessInstanceWorkItems.mockResolvedValueOnce([WORK_ITEMS_MOCK]);
        approvalRequestsApi.fetchApprovalRequests.mockResolvedValueOnce([APPROVAL_REQUESTS_MOCK]);
        approvalRequestsApi.fetchApprovalRequestsCount.mockResolvedValueOnce([6]);

        await store.dispatch(rejectRequests({ processInstanceIds: ['04gO0000001AbhhIAC'], comment: 'looks bad' }));

        expect(approvalRequestsApi.processApprovals).toHaveBeenCalledTimes(1);
        expect(approvalRequestsApi.processApprovals).toHaveBeenCalledWith([
          {
            actionType: 'Reject',
            comments: 'looks bad',
            contextId: '04iO0000001JrjgIAC',
          },
        ]);
        // refetch
        expect(approvalRequestsApi.fetchApprovalRequests).toHaveBeenCalledTimes(1);
      });

      it('should return a fail action with error', async () => {
        approvalRequestsApi.fetchProcessInstanceWorkItems.mockRejectedValueOnce('Expected error in rejectRequests');

        const failAction = await store.dispatch(
          rejectRequests({ processInstanceIds: ['04gO0000001AbhhIAC'], comment: 'looks bad' })
        );

        expect(failAction.payload).toBe('Expected error in rejectRequests');
      });
    });

    describe('reassignRequests', () => {
      let store;

      beforeEach(() => {
        store = makeStore({
          ...initialState,
          params: {
            page: 1,
            rowsPerPage: 5,
            sortColumn: 'CreatedDate',
            sortOrder: 'ASC',
            status: APPROVAL_REQUEST_STATUS.PENDING,
          },
          objectMetadataMap: MAPPED_OBJECT_METADATA_MOCK,
        });
      });

      it('should call api with params', async () => {
        approvalRequestsApi.fetchProcessInstanceWorkItems.mockResolvedValueOnce([WORK_ITEMS_MOCK]);
        approvalRequestsApi.fetchApprovalRequests.mockResolvedValueOnce([APPROVAL_REQUESTS_MOCK]);
        approvalRequestsApi.fetchApprovalRequestsCount.mockResolvedValueOnce([6]);

        await store.dispatch(
          reassignRequests({ processInstanceIds: ['04gO0000001AbhhIAC'], nextApproverId: '0052v00000d4JPPAA2' })
        );

        expect(approvalRequestsApi.reassignApprovals).toHaveBeenCalledTimes(1);
        expect(approvalRequestsApi.reassignApprovals).toHaveBeenCalledWith([
          {
            ActorId: '0052v00000d4JPPAA2',
            attributes: { type: 'ProcessInstanceWorkitem' },
            id: '04iO0000001JrjgIAC',
          },
        ]);
        // refetch
        expect(approvalRequestsApi.fetchApprovalRequests).toHaveBeenCalledTimes(1);
      });

      it('should return a fail action with error', async () => {
        approvalRequestsApi.fetchProcessInstanceWorkItems.mockRejectedValueOnce('Expected error in reassignApprovals');

        const failAction = await store.dispatch(
          reassignRequests({ processInstanceIds: ['04gO0000001AbhhIAC'], nextApproverId: '0052v00000d4JPPAA2' })
        );

        expect(failAction.payload).toBe('Expected error in reassignApprovals');
      });
    });
  });

  describe('reducers', () => {
    it('bootstrap.fulfilled', () => {
      const metadataMap = { name: { label: 'label' } };
      const nextState = approvalRequestsReducer(initialState, bootstrap.fulfilled(metadataMap));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.IDLE);
      expect(nextState.objectMetadataMap).toStrictEqual(metadataMap);
    });

    it('bootstrap.rejected', () => {
      const nextState = approvalRequestsReducer(initialState, bootstrap.rejected());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
    });

    it('fetchApprovalRequests.pending', () => {
      const nextState = approvalRequestsReducer(initialState, fetchApprovalRequests.pending());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.PENDING);
    });

    it('fetchApprovalRequests.fulfilled', () => {
      const nextState = approvalRequestsReducer(initialState, fetchApprovalRequests.fulfilled([{ id: '1' }]));

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUCCESS);
      expect(nextState.list).toStrictEqual([{ id: '1' }]);
    });

    it('fetchApprovalRequests.rejected', () => {
      const nextState = approvalRequestsReducer(initialState, fetchApprovalRequests.rejected());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
    });

    it('approveRequests.pending', () => {
      const nextState = approvalRequestsReducer(initialState, approveRequests.pending());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUBMITTING);
    });
    it('approveRequests.rejected', () => {
      const nextState = approvalRequestsReducer(initialState, approveRequests.rejected());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
    });

    it('rejectRequests.pending', () => {
      const nextState = approvalRequestsReducer(initialState, rejectRequests.pending());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUBMITTING);
    });
    it('rejectRequests.rejected', () => {
      const nextState = approvalRequestsReducer(initialState, rejectRequests.rejected());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
    });

    it('reassignRequests.pending', () => {
      const nextState = approvalRequestsReducer(initialState, reassignRequests.pending());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.SUBMITTING);
    });
    it('reassignRequests.rejected', () => {
      const nextState = approvalRequestsReducer(initialState, reassignRequests.rejected());

      expect(nextState.loadingStatus).toBe(LOADING_STATUS.FAILED);
    });

    it('setTotalCount', () => {
      const nextState = approvalRequestsReducer(initialState, setTotalCount(1));

      expect(nextState.totalCount).toBe(1);
    });

    it('setParams', () => {
      const params = {
        page: 1,
        rowsPerPage: 5,
        sortColumn: 'CreatedDate',
        sortOrder: 'ASC',
        status: APPROVAL_REQUEST_STATUS.PENDING,
      };
      const nextState = approvalRequestsReducer(initialState, setParams(params));

      expect(nextState.params).toStrictEqual(params);
    });
  });
});
