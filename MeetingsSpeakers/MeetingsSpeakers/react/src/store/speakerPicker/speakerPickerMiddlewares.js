import { showErrorNotification } from '../notification/notificationSlice';
import { layoutBridge } from 'oce-apps-bridges';

const APP_CLOSE_DELAY = 3000;

const closeApp = async onError => {
  try {
    await layoutBridge.closeApp();
  } catch (error) {
    onError();
  }
};

export const saveSpeakersSuccessMiddleware = store => next => action => {
  if (action.type === 'speakerPicker/saveInvitedSpeakers/fulfilled') {
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
