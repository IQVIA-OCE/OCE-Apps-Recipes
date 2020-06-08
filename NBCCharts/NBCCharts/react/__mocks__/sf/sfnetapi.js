import { NativeModules } from 'react-native';

NativeModules.SFNetReactBridge = {
  sendRequest: jest.fn(),
};

export default {
  apiVersion: '1',
  setApiVersion: jest.fn(),
  getApiVersion: jest.fn(),
  sendRequest: jest.fn(),
  describeGlobal: jest.fn(),
  metadata: jest.fn(),
  describe: jest.fn(),
  describeLayout: jest.fn(),
  create: jest.fn(),
  retrieve: jest.fn(),
  upsert: jest.fn(),
  update: jest.fn(),
  del: jest.fn(),
  query: jest.fn(),
  queryMore: jest.fn(),
  search: jest.fn(),
  composite: jest.fn(),
  apexRest: jest.fn(),
  report: jest.fn(),
}
