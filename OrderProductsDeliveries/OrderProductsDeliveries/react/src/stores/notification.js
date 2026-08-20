import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  variant: '',
  text: '',
  icon: '',
  visible: false
};

const notificationSlice = (_initialState) => createSlice({
  name: 'notification',
  initialState: _initialState,
  reducers: {
    showErrorNotification: (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload;
      state.visible = true;
    },
    closeNotification: (state, action) => {
      state.visible = false;
    },
  }
});

export const notification = notificationSlice(initialState);

export const { showErrorNotification, closeNotification } =
    notification.actions;

export const notificationReducer = notification.reducer;