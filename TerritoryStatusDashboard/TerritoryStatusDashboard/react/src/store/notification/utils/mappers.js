import { isWeb } from '../../../utils';

export const getErrorText = (error) => {
  const defaultMessage = 'Something went wrong';

  if (isWeb) {
    const { errorCode, message } = error;
    return !errorCode && !message ? defaultMessage : `${errorCode}: ${message}`;
  } else {
    const { error: [{ errorCode, message }] } = error;
    return !errorCode && !message ? defaultMessage : `${errorCode}: ${message}`;
  }
};
