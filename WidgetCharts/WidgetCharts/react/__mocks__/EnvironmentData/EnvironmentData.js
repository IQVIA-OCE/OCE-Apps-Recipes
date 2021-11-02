import { NativeModules } from 'react-native';

NativeModules.EnvironmentDataBridge = {
  userID: '',
  timeZone: '',
  locale: '',
  language: '',
  currencyISOCode: '',
  sfInstanceURL: '',
  sfApiVersion: '',
  territory: ''
};

jest.mock('../../bridge/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    userID: jest.fn(),
    timeZone: jest.fn(),
    locale: jest.fn(),
    language: jest.fn(),
    currencyISOCode: jest.fn(),
    sfInstanceURL: jest.fn(),
    sfApiVersion: jest.fn(),
    territory: jest.fn().mockImplementation(() => ({
      "developerName": "G_DM_Baden_Wurttemberg_20C02",
      "name": "G - DM - Baden-Württemberg - 20C02",
      "nameId": "9358d1c6741ad3ed4060052f1133049b"
    })),
  }
}));
