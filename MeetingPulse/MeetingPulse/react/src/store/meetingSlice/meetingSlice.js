import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as meetingApi from '../../api/meetingApi';
import { LOADING_STATUS } from '../../constants/loadingStatus';
import { mapMeeting } from './utils/mappers';

const initialState = {
  meetingId: null,
  meeting: {},
  loadingStatus: LOADING_STATUS.IDLE,
  error: null
};

export const fetchMeeting = createAsyncThunk('meeting/fetchMeeting', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const {
      meeting: { meetingId },
    } = getState();

    const [[meeting]] = await meetingApi.fetchMeeting(meetingId);
    const [[estimatedBudget]] = await meetingApi.fetchEstimatedExpense(meetingId);

    if (!meeting) {
      throw new Error("Error: There are no suitable meeting");
    }
    
    meeting.estimatedBudget = estimatedBudget.Amount;

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
      state.loadingStatus = LOADING_STATUS.LOADED;
    },
    [fetchMeeting.rejected]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.payload?.userInfo?.NSLocalizedDescription || action.payload.message;
    },
    [fetchMeeting.pending]: state => {
      state.loadingStatus = LOADING_STATUS.PENDING;
      state.error = null;
    },
  },
});

export const { setMeetingId } = meetingSlice.actions;

export default meetingSlice.reducer;
