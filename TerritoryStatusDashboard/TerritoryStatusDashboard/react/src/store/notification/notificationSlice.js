import { createSlice } from '@reduxjs/toolkit';
import { bootstrap } from '../territoryStatus/territoryStatusSlice';
import { getErrorText } from './utils/mappers';

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
    closeNotification: (state) => {
      state.isVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrap.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });
  },
});

export const notificationSliceReducer = notificationSlice.reducer;

export const { closeNotification } = notificationSlice.actions;
