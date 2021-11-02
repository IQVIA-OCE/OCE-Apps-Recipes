import { NativeModules } from 'react-native';

export default NativeModules.LayoutBridge = {
  setHeight: jest.fn(),
};
