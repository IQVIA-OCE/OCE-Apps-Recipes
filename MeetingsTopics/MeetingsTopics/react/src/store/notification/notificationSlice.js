import { createSlice } from '@reduxjs/toolkit';
import { bootstrap, fetchTopics, fetchMoreTopics, saveSelectedTopics } from '../topicPicker/topicPickerSlice';
import { localized } from 'oce-apps-bridges';
import { NAMESPACE } from '../../constants';

export const initialState = {
  variant: '',
  text: '',
  icon: '',
  isVisible: false,
};

const notificationSlice = _initialState =>
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
    closeNotification:  (state, action) => {
      state.isVisible = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTopics.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });

    builder.addCase(fetchMoreTopics.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });

    builder.addCase(saveSelectedTopics.fulfilled, (state, { payload }) => {
      if (payload.wasSomeDataSaved) {
        if (payload.ignoredWFConditions.length) {
          state.variant = 'warning';
          state.icon = 'checkbox-marked-circle';
          state.text = localized(
            `${NAMESPACE.toLowerCase()}all_changes_saved_with_warning`,
            'All changes have been saved, but %1$@ workflow context conditions were ignored.'
          ).replace('%1$@', String(payload.ignoredWFConditions.length));
          state.isVisible = true;
        } else {
          state.variant = 'success';
          state.icon = 'checkbox-marked-circle';
          state.text = localized(`${NAMESPACE}all_changes_have_been_saved`, 'All changes have been saved');
          state.isVisible = true;
        }
      }
    });
    builder.addCase(saveSelectedTopics.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });

    builder.addCase(bootstrap.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });
  },
});

export const notification = notificationSlice(initialState);

export const { showErrorNotification, closeNotification } = notification.actions;

export const notificationReducer = notification.reducer;
