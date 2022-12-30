import React from 'react';
import { NativeModules } from 'react-native'
import App from './App';
import { render } from '@testing-library/react-native';
import { layoutBridge } from "oce-apps-bridges";

NativeModules.ReachabilityBridge = {
  networkReachabilityStatus: jest.fn()
    .mockResolvedValueOnce('ONLINE')
    .mockRejectedValue('ERROR')
}

describe('Application', () => {
  it('should render properly', () => {
    const { getByTestId } = render(
      <App />
    );
    expect(layoutBridge.setHeight).not.toHaveBeenCalled();
    expect(getByTestId('loader-wrap')).toBeTruthy();
  })
  it('should render properly  with instance id', () => {
    const instanceId = '556E3984-FA45-4594-B13E-FCE318926540';
    const { getByTestId } = render(
      <App instanceId={instanceId} recordId={null} />
    );
    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(500);
    expect(getByTestId('loader-wrap')).toBeTruthy();
  });
});


