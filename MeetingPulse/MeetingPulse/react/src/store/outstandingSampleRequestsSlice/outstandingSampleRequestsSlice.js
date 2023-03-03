import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showErrorNotification } from '../notificationSlice/notificationSlice';
import { fetchOutstandingSampleRequests } from '../../api/outstandingSampleRequestsApi';
import { getAttendeesIds, mapOutstandingSampleRequests } from './utils/utils';
import { environment } from 'oce-apps-bridges';
import { LOADING_STATUS } from '../../constants/loadingStatus';

const initialState = {
  loadingStatus: LOADING_STATUS.IDLE,
  count: null,
  list: [],
  error: null
};

export const fetchOutstandingSampleRequestsList = createAsyncThunk(
  'outstandingSampleRequests/fetchOutstandingSampleRequestsList',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
 
      const { attendees } = getState();
      const attendeesIds = getAttendeesIds(attendees.list);

      const [result] = await fetchOutstandingSampleRequests(attendeesIds, environment.userID());

      dispatch(setOutstandingSampleRequestsCount(result.length));

      return mapOutstandingSampleRequests(result);
    } catch (error) {
      dispatch(showErrorNotification(error.message));
      return rejectWithValue(error);
    }
  }
);

const outstandingSampleRequestsSlice = createSlice({
  name: 'outstandingSampleRequests',
  initialState,
  reducers: {
    setOutstandingSampleRequestsCount: (state, action) => {
      state.count = action.payload;
    },
  },
  extraReducers: {
    [fetchOutstandingSampleRequestsList.pending]: state => {
      state.loadingStatus = LOADING_STATUS.PENDING;
      state.error = null;
    },
    [fetchOutstandingSampleRequestsList.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.LOADED;
      state.list = action.payload;
    },
    [fetchOutstandingSampleRequestsList.rejected]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.payload?.userInfo?.NSLocalizedDescription || action.payload.message;
    },
  },
});

export const { setOutstandingSampleRequestsCount } = outstandingSampleRequestsSlice.actions;

export default outstandingSampleRequestsSlice.reducer;
