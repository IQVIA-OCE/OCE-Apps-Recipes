import { layoutBridge } from '@oce-apps/oce-apps-bridges';
import { showErrorNotification } from '../notification/notificationSlice';
import { hideLoader } from './budgetPickerSlice';

const APP_CLOSE_DELAY = 3000;

const closeApp = async (onError) => {
  try {
    await layoutBridge.closeApp();
  } catch (error) {
    onError();
  }
};

export const saveBudgetSuccessMiddleware = (store) => (next) => (action) => {
  if (action.type === 'budgetPicker/saveBudget/fulfilled') {
    const onError = () => {
      store.dispatch(
        showErrorNotification(`Application can't be closed automatically`)
      );
      store.dispatch(hideLoader());
    };

    if (action.payload.wasBudgetSaved) {
      setTimeout(() => {
        closeApp(onError);
      }, APP_CLOSE_DELAY);
    } else {
      closeApp(onError);
    }
  }
  next(action);
};
