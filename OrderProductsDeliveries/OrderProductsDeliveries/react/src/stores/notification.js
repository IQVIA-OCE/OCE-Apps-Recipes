import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  variant: '',
  text: '',
  icon: '',
  visible: false
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showErrorNotification: (state, action) => Object.assign({}, state, {
      variant: 'error',
      icon: 'alert-circle',
      text: action.payload,
      visible: true
    }),
    closeNotification: state => Object.assign({}, state, { visible: false })
  }
});

export default slice.reducer;

export const { showErrorNotification, closeNotification } = slice.actions;
