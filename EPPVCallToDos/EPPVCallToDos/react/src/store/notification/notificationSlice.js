import { createSlice } from '@reduxjs/toolkit';
import { getErrorText } from './utils/mappers';
import { bootstrap, deleteToDo, fetchCallToDos, saveToDo } from '../callToDos/callToDosSlice';

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
    showErrorNotification: (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    },
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

    builder.addCase(fetchCallToDos.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });

    builder.addCase(saveToDo.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });

    builder.addCase(saveToDo.fulfilled, (state, action) => {
      const actionType = action.payload.isEdit ? 'edited' : 'created';
      state.variant = 'success';
      state.icon = 'checkbox-marked-circle';
      state.text = `Successfully ${actionType} a Call To-Do`;
      state.isVisible = true;
    });

    builder.addCase(deleteToDo.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = getErrorText(action.payload);
      state.isVisible = true;
    });
  },
});

export const notificationReducer = notificationSlice.reducer;

export const { closeNotification, showErrorNotification } = notificationSlice.actions;
