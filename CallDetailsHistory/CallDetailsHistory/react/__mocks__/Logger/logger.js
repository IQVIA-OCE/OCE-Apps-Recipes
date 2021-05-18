import { NativeModules } from 'react-native';

export default NativeModules.LoggerBridge = {
  log: jest.fn()
}
