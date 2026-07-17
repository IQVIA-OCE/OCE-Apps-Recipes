import { mapCall, mapCallToDos } from './mappers';
import { Platform } from 'react-native';
import { CALL_MAPPED, CALL_RAW_IOS, CALL_RAW_WEB } from '../../../__mocks__/callMocks';
import { CALL_TODOS_MAPPED, CALL_TODOS_RAW_IOS, CALL_TODOS_RAW_WEB } from '../../../__mocks__/callToDosMocks';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
  },
}));

describe('mappers', () => {
  describe('mapCallToDos', () => {
    it('ios', () => {
      Platform.OS = 'ios';
      const result = mapCallToDos(CALL_TODOS_RAW_IOS);

      expect(result).toStrictEqual(CALL_TODOS_MAPPED);
    });

    it('web', () => {
      Platform.OS = 'web';
      const result = mapCallToDos(CALL_TODOS_RAW_WEB);

      expect(result).toStrictEqual(CALL_TODOS_MAPPED);
    });
  });

  describe('mapCall', () => {
    it('ios', () => {
      Platform.OS = 'ios';
      const result = mapCall(CALL_RAW_IOS);

      expect(result).toStrictEqual(CALL_MAPPED);
    });

    it('web', () => {
      Platform.OS = 'web';
      const result = mapCall(CALL_RAW_WEB);

      expect(result).toStrictEqual(CALL_MAPPED);
    });
  });
});
