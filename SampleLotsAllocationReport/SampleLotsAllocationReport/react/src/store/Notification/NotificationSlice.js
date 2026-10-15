import { createSlice } from '@reduxjs/toolkit';
import {
  bootstrap
} from '../SamplesLotAllocationReport/SamplesLotAllocationReportSlice';

export const initialState = {
  variant: '',
  text: '',
  icon: '',
  isVisible: false,
};

const notificationSlice = (_initialState) =>
  createSlice({
    name: 'notification',
    initialState: _initialState,
    reducers: {
      showErrorNotification: (state, action) => {
        state.variant = 'error';
        state.icon = 'alert-circle';
        state.text = action.payload;
        state.isVisible = true;
      },
      closeNotification: (state, action) => {
        state.isVisible = false;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(bootstrap.rejected, (state, action) => {
        state.variant = 'error';
        state.icon = 'alert-circle';
        state.text = action.payload.message;
        state.isVisible = true;
      });
    },
  });

export const notification = notificationSlice(initialState);

export const { showErrorNotification, closeNotification } =
  notification.actions;

export const notificationReducer = notification.reducer;
