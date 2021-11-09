import { showErrorNotification } from '../notification/notificationSlice'
import { layoutBridge } from '../../../bridge/Layout/LayoutBridge.native';

const APP_CLOSE_DELAY  = 3000;

export const closeApp = async onError => {
  try {
    await layoutBridge.closeApp();
  } catch (error) {
    onError();
  }
};

export const saveTopicsSuccessMiddleware = store => next => action => {
  if (action.type === 'topicPicker/saveSelectedTopics/fulfilled') {
    const onError = () => {
      store.dispatch(showErrorNotification("Application can't be closed automatically"));
    };

    if (action.payload.wasSomeDataSaved) {
      setTimeout(() => {
        closeApp(onError);
      }, APP_CLOSE_DELAY);
    } else {
      closeApp(onError);
    }
  }
  next(action);
};