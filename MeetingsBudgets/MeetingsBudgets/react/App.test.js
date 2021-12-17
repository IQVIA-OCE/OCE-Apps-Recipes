import { render } from '@testing-library/react-native';
import React from 'react';
import { App } from './App';
import { layoutBridge } from './bridge/Layout/LayoutBridge';

jest.mock('./bridge/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => 'TEST_',
    sfApiVersion: () => '1',
    locale: () => 'en_US',
  },
}));
jest.mock('./bridge/Layout/LayoutBridge', () => ({
  layoutBridge: {
    setHeight: jest.fn(),
  },
}));

describe('Application', () => {
  test('should call setHeight from NativeModules.LayoutBridge if App receive instanceId', () => {
    render(<App instanceId={'00000A1'} />);

    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(600);
  });
});
