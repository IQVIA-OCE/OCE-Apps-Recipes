import React from 'react';
import renderer from 'react-test-renderer';
import { NativeModules } from 'react-native'
import App from './App';

jest.mock("./bridge/Localization/localization.native");

NativeModules.ReachabilityBridge = {
  networkReachabilityStatus: jest.fn()
    .mockResolvedValueOnce('ONLINE')
    .mockRejectedValue('ERROR')
}

describe('Application', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
});
