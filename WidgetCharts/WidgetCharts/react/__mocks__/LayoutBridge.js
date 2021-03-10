import { NativeModules } from 'react-native';

NativeModules.LayoutBridge = {
  setHeight: jest.fn()
};
