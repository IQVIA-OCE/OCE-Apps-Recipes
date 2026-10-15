import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as inquiriesApi from '../../api/inquiriesApi';
import * as commonApi from '../../api/commonApi';
import { NAMESPACE } from '../../constants/namespacePrefix';
import { groupQuestionsByInquiriesAndAccounts } from './utils/groupQuestionsByInquiriesAndAccounts';
import { LOADING_STATUS } from '../../constants/loadingStatus';

export const initialState = {
  loadingStatus: LOADING_STATUS.IDLE,
  count: null,
  accounts: [],
  error: null,
};

export const fetchAccountsWithInquiryQuestions = createAsyncThunk(
  'inquiries/fetchAccountsWithInquiryQuestions',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const {
        meeting: { meetingId },
      } = getState();
      const [accounts] = await commonApi.fetchAllAccounts(meetingId);
      const accountIds = accounts.map(a => a[`${NAMESPACE}Customer__c`] || a[`${NAMESPACE}Speaker__r.${NAMESPACE}Account__c`]);

      if (!accountIds.length) {
        throw new Error("There are no suitable meeting's account attendees or account-based speakers");
      }

      const [questions] = await inquiriesApi.fetchInquiryQuestions(accountIds);

      const accountsWithInquiries = groupQuestionsByInquiriesAndAccounts(questions);
      const inquiriesCount = accountsWithInquiries.reduce((acc, current) => {
        return acc + current.inquiries?.length ?? 0;
      }, 0);
      dispatch(setInquiriesCount(inquiriesCount));

      return accountsWithInquiries;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    setInquiriesCount: (state, action) => {
      state.count = action.payload;
    },
  },
  extraReducers: {
    [fetchAccountsWithInquiryQuestions.pending]: state => {
      state.loadingStatus = LOADING_STATUS.PENDING;
      state.error = null;
    },
    [fetchAccountsWithInquiryQuestions.fulfilled]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.LOADED;
      state.accounts = action.payload;
    },
    [fetchAccountsWithInquiryQuestions.rejected]: (state, action) => {
      state.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.payload?.userInfo?.NSLocalizedDescription || action.payload.message;
    },
  },
});

export const { setInquiriesCount } = inquiriesSlice.actions;

export default inquiriesSlice.reducer;
