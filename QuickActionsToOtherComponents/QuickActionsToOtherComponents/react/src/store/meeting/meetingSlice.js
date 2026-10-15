import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as meetingApi from '../../api/meetingApi';
import { LOADING_STATUS } from '../../constants';
import {
  callsMapperForMeeting,
  meetingAttendeesMapper,
  meetingMapper,
} from '../../utils';

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  meetingObj: null,
  calls: {
    data: [],
    totalSize: 0,
  },
  meetingAttendees: [],
  error: null,
};

export const meetingBootstrap = createAsyncThunk(
  'meetingStore/meetingBootstrap',
  async (recordId, { rejectWithValue }) => {
    try {
      const {
        records: [record],
      } = await meetingApi.fetchMeeting(recordId);

      return meetingMapper(record);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCalls = createAsyncThunk(
  'meetingStore/fetchCalls',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        meetingStore: { meetingObj },
      } = getState();
      const { records, totalSize } = await meetingApi.fetchCalls(meetingObj.id);

      return {
        data: callsMapperForMeeting(records),
        totalSize: totalSize,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMeetingAttendees = createAsyncThunk(
  'meetingStore/fetchMeetingAttendees',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        meetingStore: { meetingObj },
      } = getState();
      const { records } = await meetingApi.fetchMeetingAttendees(meetingObj.id);

      return meetingAttendeesMapper(records);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'meetingStore',
    initialState: _initialState,
    reducers: {},
    extraReducers: {
      [meetingBootstrap.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.BOOTSTRAPPING;
        state.error = null;
      },
      [meetingBootstrap.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.meetingObj = action.payload;
      },
      [meetingBootstrap.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchCalls.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchCalls.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.calls = action.payload;
      },
      [fetchCalls.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchMeetingAttendees.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchMeetingAttendees.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.meetingAttendees = action.payload;
      },
      [fetchMeetingAttendees.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
    },
  });

export const meetingSlice = makeSlice(initialState);

export const meetingReducer = meetingSlice.reducer;
