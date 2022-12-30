import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showErrorNotification } from '../notificationSlice/notificationSlice';
import { fetchOutstandingSampleRequests } from '../../api/outstandingSampleRequestsApi';
import { getAttendeesIds, mapOutstandingSampleRequests } from './utils/utils';
import { environment } from 'oce-apps-bridges';

const initialState = {
  count: null,
  list: [],
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
      console.log(54, error);
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
    [fetchOutstandingSampleRequestsList.fulfilled]: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setOutstandingSampleRequestsCount } = outstandingSampleRequestsSlice.actions;

export default outstandingSampleRequestsSlice.reducer;
