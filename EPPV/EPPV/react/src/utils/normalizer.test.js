import { normalizeToDo, normalizeUpdateValues, mapAccount } from './normalizer';
import { Platform } from 'react-native';
import {
  ToDo__c,
  AccountComplianceCycle__c,
  AccountCompliance__c,
  TODO_IOS_RAW,
  TODO_IOS_NORMALIZED,
  TODO_WEB_RAW,
  TODO_WEB_NORMALIZED,
  UPSERT_PAYLOAD_RAW,
  UPSERT_PAYLOAD_NORMALIZED,
} from './../constants';

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  let platform = {
    OS: 'ios',
  };

  const select = jest.fn().mockImplementation((obj) => {
    const value = obj[platform.OS];
    return !value ? obj.default : value;
  });

  platform.select = select;

  return platform;
});

jest.mock('oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
  },
}));

describe('normalizer', () => {
  it('should normalizeToDo for web', () => {
    Platform.OS = 'web';

    const result = normalizeToDo(TODO_WEB_RAW);
    expect(result).toStrictEqual(TODO_WEB_NORMALIZED);
  });

  it('should normalizeToDo for ios', () => {
    Platform.OS = 'ios';

    const result = normalizeToDo(TODO_IOS_RAW);
    expect(result).toStrictEqual(TODO_IOS_NORMALIZED);
  });

  it('should normalize payload data for update request', () => {
    const result = normalizeUpdateValues(
      [ToDo__c, AccountComplianceCycle__c, AccountCompliance__c],
      UPSERT_PAYLOAD_RAW
    );
    expect(result).toStrictEqual(UPSERT_PAYLOAD_NORMALIZED);
  });

  it('should map accounts', () => {
    const result = mapAccount({Id: 'Id', Name: 'Name'});
    expect(result).toStrictEqual({value: 'Id', label: 'Name'});
  });
});
