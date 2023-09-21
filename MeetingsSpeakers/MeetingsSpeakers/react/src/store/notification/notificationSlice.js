import { createSlice } from '@reduxjs/toolkit';
import { bootstrap, fetchMoreSpeakers, fetchSpeakers, saveInvitedSpeakers } from '../speakerPicker/speakerPickerSlice';
import { localized } from 'oce-apps-bridges';
import { LOCALIZATION_NAMESPACE } from '../../constants';

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
  extraReducers: builder => {
    builder.addCase(fetchSpeakers.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });

    builder.addCase(fetchMoreSpeakers.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });

    builder.addCase(saveInvitedSpeakers.rejected, (state, action) => {
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

    builder.addCase(saveInvitedSpeakers.fulfilled, (state, { payload }) => {
      if (payload.wasSomeDataSaved) {
        if (payload.warning) {
          state.variant = 'warning';
          state.icon = 'alert';
          state.text = payload.warning;
          state.isVisible = true;
        } else {
          state.variant = 'success';
          state.icon = 'checkbox-marked-circle';
          state.text = localized(`${LOCALIZATION_NAMESPACE}all_changes_have_been_saved`, 'All changes have been saved');
          state.isVisible = true;
        }
      }
    });
  },
});

export const notificationSliceReducer = notificationSlice.reducer;

export const { showErrorNotification, showWarningNotification, closeNotification } = notificationSlice.actions;
