import { APPROVAL_REQUEST_STATUS, LOADING_STATUS } from '../../constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as approvalRequestsApi from '../../api/approvalRequestsApi';
import { mapApprovalRequests, mapObjectMetadata } from './utils/mappers';

const DEFAULT_LIMIT = 5;

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  list: [],
  totalCount: 0,
  params: {
    page: 1,
    rowsPerPage: DEFAULT_LIMIT,
    status: APPROVAL_REQUEST_STATUS.PENDING,
    sortColumn: null,
    sortOrder: null,
  },
  objectMetadataMap: {},
};

export const bootstrap = createAsyncThunk('approvalRequests/boostrap', async (_, { rejectWithValue }) => {
  try {
    const { sobjects } = await approvalRequestsApi.fetchObjectMetadata();

    return mapObjectMetadata(sobjects);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchApprovalRequests = createAsyncThunk(
  'approvalRequests/fetchApprovalRequests',
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        approvalRequests: { objectMetadataMap },
      } = getState();

      const [[records], [totalCount]] = await Promise.all([
        approvalRequestsApi.fetchApprovalRequests(params),
        approvalRequestsApi.fetchApprovalRequestsCount(params.status),
      ]);

      dispatch(setTotalCount(totalCount));
      dispatch(setParams(params));

      return mapApprovalRequests(records, objectMetadataMap);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const approveRequests = createAsyncThunk(
  'approvalRequests/approveRequests',
  async ({ processInstanceIds, comment }, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        approvalRequests: { params: fetchListParams },
      } = getState();

      const [workItems] = await approvalRequestsApi.fetchProcessInstanceWorkItems(processInstanceIds);
      const requests = workItems.map(item => ({
        actionType: 'Approve',
        contextId: item.Id,
        comments: comment,
      }));

      await approvalRequestsApi.processApprovals(requests);
      dispatch(fetchApprovalRequests(fetchListParams));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const rejectRequests = createAsyncThunk(
  'approvalRequests/rejectRequests',
  async ({ processInstanceIds, comment }, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        approvalRequests: { params: fetchListParams },
      } = getState();

      const [workItems] = await approvalRequestsApi.fetchProcessInstanceWorkItems(processInstanceIds);
      const requests = workItems.map(item => ({
        actionType: 'Reject',
        contextId: item.Id,
        comments: comment,
      }));

      await approvalRequestsApi.processApprovals(requests);
      dispatch(fetchApprovalRequests(fetchListParams));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const reassignRequests = createAsyncThunk(
  'approvalRequests/reassignRequests',
  async ({ processInstanceIds, nextApproverId }, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        approvalRequests: { params: fetchListParams },
      } = getState();

      const [workItems] = await approvalRequestsApi.fetchProcessInstanceWorkItems(processInstanceIds);
      const requests = workItems.map(item => ({
        attributes: { type: 'ProcessInstanceWorkitem' },
        id: item.Id,
        ActorId: nextApproverId,
      }));

      await approvalRequestsApi.reassignApprovals(requests);
      dispatch(fetchApprovalRequests(fetchListParams));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const slice = createSlice({
  name: 'approvalRequests',
  initialState,
  reducers: {
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setParams: (state, action) => {
      state.params = action.payload;
    },
  },
  extraReducers: {
    [bootstrap.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.IDLE;
      state.objectMetadataMap = action.payload;
    },
    [bootstrap.rejected]: state => {
      state.loadingStatus = LOADING_STATUS.FAILED;
    },

    [fetchApprovalRequests.pending]: state => {
      state.loadingStatus = LOADING_STATUS.PENDING;
    },
    [fetchApprovalRequests.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.SUCCESS;
      state.list = action.payload;
    },
    [fetchApprovalRequests.rejected]: state => {
      state.loadingStatus = LOADING_STATUS.FAILED;
    },

    [approveRequests.pending]: state => {
      state.loadingStatus = LOADING_STATUS.SUBMITTING;
    },
    [approveRequests.rejected]: state => {
      state.loadingStatus = LOADING_STATUS.FAILED;
    },
    [rejectRequests.pending]: state => {
      state.loadingStatus = LOADING_STATUS.SUBMITTING;
    },
    [rejectRequests.rejected]: state => {
      state.loadingStatus = LOADING_STATUS.FAILED;
    },
    [reassignRequests.pending]: state => {
      state.loadingStatus = LOADING_STATUS.SUBMITTING;
    },
    [reassignRequests.rejected]: state => {
      state.loadingStatus = LOADING_STATUS.FAILED;
    },
  },
});

export const approvalRequestsReducer = slice.reducer;

export const { setTotalCount, setParams } = slice.actions;
