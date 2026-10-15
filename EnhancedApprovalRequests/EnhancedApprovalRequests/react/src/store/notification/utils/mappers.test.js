import * as helpers from '../../../utils/common';
import { getErrorText } from './mappers';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
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
      helpers.isWeb = true;
    });

    test('return parsed error message if error is valid', () => {
      expect(getErrorText({ error: [errorObj] })).toEqual(parsedErrorMessage);
    });

    test('return default error message if error is invalid', () => {
      expect(getErrorText({})).toEqual(defaultErrorMessage);
    });
  });

  describe('if native platform', () => {
    beforeEach(() => {
      helpers.isWeb = false;
    });

    test('return parsed error message if error is valid', () => {
      expect(getErrorText({ error: [errorObj] })).toEqual(parsedErrorMessage);
    });

    test('return default error message if error is invalid', () => {
      expect(getErrorText({ error: [{}] })).toEqual(defaultErrorMessage);
    });
  });
});
