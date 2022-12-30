import React from 'react';
import { NativeModules } from 'react-native';
import { sfNetAPI } from 'oce-apps-bridges';
import { render } from '@testing-library/react-native';
import App from './App';

jest.useFakeTimers();

let Platform;

NativeModules.LayoutBridge = {
  setHeight: jest.fn()
};

NativeModules.ReachabilityBridge = {
  networkReachabilityStatus: jest.fn()
    .mockResolvedValueOnce('ONLINE')
    .mockRejectedValue('ERROR')
}

jest.mock('oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  environment: {
    namespace: jest.fn()
  }
}))

describe('Application', () => {
  beforeEach(() => {
    Platform = require('react-native').Platform;
  });

  const layout = NativeModules.LayoutBridge.setHeight;
  it('should render properly', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('loader-wrap')).toBeTruthy();
    expect(layout).not.toHaveBeenCalled();
  })
  it('should render properly', () => {
    render(<App instanceId='001' />);
    const layout = NativeModules.LayoutBridge.setHeight;
    expect(layout).toHaveBeenCalled();
    expect(layout).toHaveBeenCalledWith(600, '001');
  })
  it('should render properly in web', () => {
    render(<App instanceId='001' />);
    const layout = NativeModules.LayoutBridge.setHeight;
    expect(layout).toHaveBeenCalled();
    expect(layout).toHaveBeenCalledWith(600, '001');
  })
});

