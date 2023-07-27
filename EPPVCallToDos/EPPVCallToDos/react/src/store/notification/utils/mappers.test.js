import { getErrorText } from './mappers';
import { Platform } from 'react-native';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '',
  },
}));

const defaultErrorMessage = 'Something went wrong';
const errorObj = { errorCode: 'INVALID_REQUEST', message: 'Test error' };
const parsedErrorMessage = `${errorObj.errorCode}: ${errorObj.message}`;

describe('notificationSlice mappers', () => {
  describe('if platform is WEB', () => {
    beforeEach(() => {
      Platform.OS = 'web';
    });

    test('return parsed error message if error is valid', () => {
      expect(getErrorText({ error: [errorObj] })).toEqual(parsedErrorMessage);
    });

    test('return default error message if error is invalid', () => {
      expect(getErrorText({})).toEqual(defaultErrorMessage);
    });
  });

  describe('if platform is iPhone or iPad', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
    });

    test('return parsed error message if error is valid', () => {
      expect(getErrorText({ error: [errorObj] })).toEqual(parsedErrorMessage);
    });

    test('return default error message if error is invalid', () => {
      expect(getErrorText({ error: [{}] })).toEqual(defaultErrorMessage);
    });
  });
});
