import { NativeModules } from 'react-native';

export default NativeModules.DatabaseManager = {
  fetch: jest.fn(),
};
