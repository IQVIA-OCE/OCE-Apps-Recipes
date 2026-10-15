import { NativeModules } from 'react-native';

NativeModules.TabItemsFlowHandler = {
  tabItems: jest.fn(),
  navigate: jest.fn()
};

NativeModules.FlowHandler = {
  navigateToNew: jest.fn(),
  navigateToDetails: jest.fn()
};

export default {
  TabItemsFlowHandler: NativeModules.TabItemsFlowHandler,
  FlowHandler: NativeModules.FlowHandler,
}
