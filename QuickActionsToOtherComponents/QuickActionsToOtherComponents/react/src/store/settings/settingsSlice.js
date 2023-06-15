import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { metadataBridge, sfNetAPI } from 'oce-apps-bridges';
import { LOADING_STATUS, NAMESPACE, PAGE } from '../../constants';
import { isWeb } from '../../utils';

export const initialState = {
  loadingStatus: LOADING_STATUS.IDLE,
  page: null,
  error: null,
};

export const identifyPage = createAsyncThunk(
  'settingsStore/identifyPage',
  async (recordId, { rejectWithValue }) => {
    try {
      if (!recordId) throw new Error('You passed an invalid recordId!');

      let callKeyPrefix;
      let meetingKeyPrefix;

      if (isWeb) {
        const callResponse = await sfNetAPI.metadata(`${NAMESPACE}Call__c`);
        const meetingResponse = await sfNetAPI.metadata(
          `${NAMESPACE}Meeting__c`
        );

        callKeyPrefix = callResponse.objectDescribe.keyPrefix;
        meetingKeyPrefix = meetingResponse.objectDescribe.keyPrefix;
      } else {
        const callResponse = await metadataBridge.describe(
          `${NAMESPACE}Call__c`
        );
        const meetingResponse = await metadataBridge.describe(
          `${NAMESPACE}Meeting__c`
        );

        callKeyPrefix = callResponse.keyPrefix;
        meetingKeyPrefix = meetingResponse.keyPrefix;
      }

      if (recordId.startsWith(callKeyPrefix)) {
        return PAGE.CALL;
      } else if (recordId.startsWith(meetingKeyPrefix)) {
        return PAGE.MEETING;
      } else {
        throw new Error('You added a widget to an unsupported page!');
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'settingsStore',
    initialState: _initialState,
    reducers: {},
    extraReducers: {
      [identifyPage.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [identifyPage.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.page = action.payload;
      },
      [identifyPage.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
    },
  });

export const settingsSlice = makeSlice(initialState);

export const settingsReducer = settingsSlice.reducer;
