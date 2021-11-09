import { createSlice } from '@reduxjs/toolkit';
import { localized } from '../../../bridge/Localization/localization';
import { NAMESPACE } from '../../constants';
import {
  bootstrap,
  fetchBudgets,
  fetchMoreBudgets,
  saveBudget,
} from '../budgetPicker/budgetPickerSlice';

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
      state.text = action.payload;
      state.isVisible = true;
    },
    closeNotification: (state) => {
      state.isVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBudgets.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });

    builder.addCase(fetchMoreBudgets.rejected, (state, action) => {
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

    builder.addCase(saveBudget.rejected, (state, action) => {
      state.variant = 'error';
      state.icon = 'alert-circle';
      state.text = action.payload.message;
      state.isVisible = true;
    });

    builder.addCase(saveBudget.fulfilled, (state, action) => {
      state.variant = 'success';
      state.icon = 'checkbox-marked-circle';
      state.text = localized(
        `${NAMESPACE.toLowerCase()}global_savedsuccessfully`,
        'All changes have been saved'
      );
      state.isVisible = true;
    });
  },
});

export const notificationSliceReducer = notificationSlice.reducer;

export const { showErrorNotification, closeNotification } =
  notificationSlice.actions;
