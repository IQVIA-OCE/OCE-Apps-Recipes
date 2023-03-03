import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as insightsApi from '../../api/insightsApi';
import * as commonApi from '../../api/commonApi';
import { NAMESPACE } from '../../constants/namespacePrefix';
import { groupInsightsByAccounts } from './utils/groupInsightsByAccounts';
import { LOADING_STATUS } from '../../constants/loadingStatus';

export const initialState = {
  loadingStatus: LOADING_STATUS.IDLE,
  count: null,
  accounts: [],
  error: null,
};

export const fetchInsightsList = createAsyncThunk(
  'insights/fetchInsightsList',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const {
        meeting: { meetingId },
      } = getState();
      const [accounts] = await commonApi.fetchAllAccounts(meetingId);
      const accountIds = accounts.map(a => a[`${NAMESPACE}Customer__c`] || a[`${NAMESPACE}Speaker__r.Account__c`]);

      if (!accountIds.length) {
        throw new Error("There are no suitable meeting's account attendees or account-based speakers");
      }

      const [insights] = await insightsApi.fetchInsights(accountIds);

      dispatch(setInsightsCount(insights.length));

      return groupInsightsByAccounts(insights);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setInsightsCount: (state, action) => {
      state.count = action.payload;
    },
  },
  extraReducers: {
    [fetchInsightsList.pending]: state => {
      state.loadingStatus = LOADING_STATUS.PENDING;
      state.error = null;
    },
    [fetchInsightsList.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.LOADED;
      state.accounts = action.payload;
    },
    [fetchInsightsList.rejected]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.payload?.userInfo?.NSLocalizedDescription || action.payload.message;
    },
  },
});

export const { setInsightsCount } = insightsSlice.actions;

export default insightsSlice.reducer;
