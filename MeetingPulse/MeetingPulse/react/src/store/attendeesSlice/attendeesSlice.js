import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as attendeesApi from '../../api/attendeesApi';
import { mapAttendeesList } from './utils';
import { showErrorNotification } from '../notificationSlice/notificationSlice';

const initialState = {
  count: null,
  list: {
    pending: [],
    accepted: [],
    declined: [],
    other: []
  }
};

export const fetchAttendeesList = createAsyncThunk(
  'attendees/fetchAttendeesList',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { meeting: { meetingId } } = getState();

      const [result] = await attendeesApi.fetchMeetingAttendees(meetingId);

      dispatch(setAttendeesCount(result.length));

      return mapAttendeesList(result);
    } catch (error) {
      dispatch(showErrorNotification(error.message));
      return rejectWithValue(error);
    }
  }
);

const attendeesSlice = createSlice({
  name: 'attendees',
  initialState,
  reducers: {
    setAttendeesCount: (state, action) => {
      state.count = action.payload
    }
  },
  extraReducers: {
    [fetchAttendeesList.fulfilled]: (state, action) => {
      state.list = action.payload;
    }
  }
})

export const { setAttendeesCount } = attendeesSlice.actions;

export default attendeesSlice.reducer
