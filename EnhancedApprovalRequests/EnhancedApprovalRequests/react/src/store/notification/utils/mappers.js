export const getErrorText = error => {
  const defaultMessage = 'Something went wrong';

  const errorCode = error.error?.[0]?.errorCode
  const message = error.error?.[0]?.message ?? error.message ?? defaultMessage;

  if (errorCode && message) {
    return `${errorCode}: ${message}`;
  }

  return message;
};
