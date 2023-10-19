import { createSlice } from '@reduxjs/toolkit';
import {
  callBootstrap,
  createNewInquiry,
  fetchInquiries,
  fetchOrders,
  fetchStoreCheck,
  setCallPermissions,
} from '../call/callSlice';
import {
  fetchCalls,
  fetchMeetingAttendees,
  meetingBootstrap,
} from '../meeting/meetingSlice';
import { identifyPage } from '../settings/settingsSlice';

export const initialState = {
  notifications: [],
};

const errorNotification = {
  variant: 'error',
  icon: 'alert-circle',
  text: '',
  isVisible: true,
};

const warningNotification = {
  variant: 'warning',
  icon: 'alert',
  text: '',
  isVisible: true,
};

const successNotification = {
  variant: 'success',
  icon: 'checkbox-marked-circle',
  text: '',
  isVisible: true,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showErrorNotification: (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload,
      });
    },
    showWarningNotification: (state, action) => {
      state.notifications.push({
        ...warningNotification,
        text: action.payload,
      });
    },
    closeNotification: (state, action) => {
      state.notifications.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(identifyPage.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(callBootstrap.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(fetchInquiries.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(fetchStoreCheck.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(setCallPermissions.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(meetingBootstrap.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(fetchCalls.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(fetchMeetingAttendees.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(createNewInquiry.rejected, (state, action) => {
      state.notifications.push({
        ...errorNotification,
        text: action.payload.message,
      });
    });

    builder.addCase(createNewInquiry.fulfilled, (state) => {
      state.notifications.push({
        ...successNotification,
        text: 'New Inquiry has been created!',
      });
    });
  },
});

export const notificationReducer = notificationSlice.reducer;

export const {
  showErrorNotification,
  showWarningNotification,
  closeNotification,
} = notificationSlice.actions;
