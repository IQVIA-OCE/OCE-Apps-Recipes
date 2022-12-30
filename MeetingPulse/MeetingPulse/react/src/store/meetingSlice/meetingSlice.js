import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as meetingApi from '../../api/meetingApi';
import { mapMeeting } from './utils/mappers';

const initialState = {
  meetingId: null,
  meeting: {},
};

export const fetchMeeting = createAsyncThunk('meeting/fetchMeeting', async (_, { getState, rejectWithValue }) => {
  try {
    const {
      meeting: { meetingId },
    } = getState();

    const [[meeting]] = await meetingApi.fetchMeeting(meetingId);

    return mapMeeting(meeting);
  } catch (error) {
    return rejectWithValue(error);
  }
});

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeetingId: (state, action) => {
      state.meetingId = action.payload;
    },
  },
  extraReducers: {
    [fetchMeeting.fulfilled]: (state, action) => {
      state.meeting = action.payload;
    },
  },
});

export const { setMeetingId } = meetingSlice.actions;

export default meetingSlice.reducer;
