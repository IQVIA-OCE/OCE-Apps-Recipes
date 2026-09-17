import React from 'react';
import RN, { NativeModules } from 'react-native';
import { layoutBridge } from '@oce-apps/oce-apps-bridges';
import { render } from '@testing-library/react-native';
import App from './App';

jest.useFakeTimers();

let Platform;


NativeModules.ReachabilityBridge = {
  networkReachabilityStatus: jest.fn()
    .mockResolvedValueOnce('ONLINE')
    .mockRejectedValue('ERROR')
}

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  environment: {
    namespace: jest.fn()
  },
  layoutBridge: {
    setHeight: jest.fn()
  }
}))

describe('Application', () => {
  beforeEach(() => {
    Platform = require('react-native').Platform;
  });

  const layout = layoutBridge.setHeight;
  it('should render properly', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('loader-wrap')).toBeTruthy();
    expect(layout).not.toHaveBeenCalled();
  })
  it('should render properly', () => {
    render(<App instanceId='001' />);
    const layout = layoutBridge.setHeight;
    expect(layout).toHaveBeenCalled();
    expect(layout).toHaveBeenCalledWith(600, '001');
  })
  it('should render properly in web', () => {
    render(<App instanceId='001' />);
    const layout = layoutBridge.setHeight;
    expect(layout).toHaveBeenCalled();
    expect(layout).toHaveBeenCalledWith(600, '001');
  })
  it('should render with dark theme', () => {
    const mock = jest.fn();

    jest.spyOn(RN, 'useColorScheme').mockImplementation(mock);

    mock.mockReturnValueOnce('dark');
    render(
      <App />
    )
  })
});

