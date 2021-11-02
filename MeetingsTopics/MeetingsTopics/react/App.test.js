import React from 'react';
import App from './App';
import { render } from '@testing-library/react-native';
import { NativeModules } from 'react-native';

jest.mock('./bridge/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    locale: () => '',
  },
}));

describe('Application', () => {
  const layout = NativeModules.LayoutBridge.setHeight;

  it('should render correctly', () => {
    const { getByTestId } = render(<App/>);

    expect(getByTestId('loader-wrap')).toBeTruthy();
    expect(layout).not.toHaveBeenCalled();
  });

  it('should render correctly', () => {
    render(<App instanceId='001'/>);

    const layout = NativeModules.LayoutBridge.setHeight;
    expect(layout).toHaveBeenCalled();
    expect(layout).toHaveBeenCalledWith(600, '001');
  });
});
