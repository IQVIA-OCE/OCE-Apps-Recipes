import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  variant: '',
  text: '',
  icon: '',
  isVisible: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showErrorNotification: (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload;
      state.isVisible = true;
    },
    closeNotification: state => {
      state.isVisible = false;
    },
  },
});

export const { showErrorNotification, closeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;

