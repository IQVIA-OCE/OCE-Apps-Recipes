import { createSlice } from '@reduxjs/toolkit';
import { getErrorText } from './utils/mappers';
import {
  approveRequests, bootstrap,
  fetchApprovalRequests,
  reassignRequests,
  rejectRequests,
} from '../approvalRequests/approvalRequestsSlice';

export const initialState = {
  variant: '',
  text: '',
  icon: '',
  isVisible: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    closeNotification: state => {
      state.isVisible = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(bootstrap.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });

    builder.addCase(fetchApprovalRequests.pending, state => {
      state.variant = '';
      state.icon = '';
      state.text = '';
      state.isVisible = false;
    });
    builder.addCase(fetchApprovalRequests.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });

    builder.addCase(approveRequests.pending, state => {
      state.variant = '';
      state.icon = '';
      state.text = '';
      state.isVisible = false;
    });
    builder.addCase(approveRequests.fulfilled, state => {
      state.variant = 'success';
      state.icon = 'checkbox-marked-circle';
      state.text = 'Approved successfully';
      state.isVisible = true;
    });
    builder.addCase(approveRequests.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });

    builder.addCase(rejectRequests.pending, state => {
      state.variant = '';
      state.icon = '';
      state.text = '';
      state.isVisible = false;
    });
    builder.addCase(rejectRequests.fulfilled, state => {
      state.variant = 'success';
      state.icon = 'checkbox-marked-circle';
      state.text = 'Rejected successfully';
      state.isVisible = true;
    });
    builder.addCase(rejectRequests.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });

    builder.addCase(reassignRequests.pending, state => {
      state.variant = '';
      state.icon = '';
      state.text = '';
      state.isVisible = false;
    });
    builder.addCase(reassignRequests.fulfilled, state => {
      state.variant = 'success';
      state.icon = 'checkbox-marked-circle';
      state.text = 'Reassigned successfully';
      state.isVisible = true;
    });
    builder.addCase(reassignRequests.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });
  },
});

export const notificationSliceReducer = notificationSlice.reducer;

export const { closeNotification } = notificationSlice.actions;
