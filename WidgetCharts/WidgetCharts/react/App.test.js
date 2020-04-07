import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import { NativeModules } from 'react-native'

describe('LineChartTRXDetails', () => {
  beforeAll(() => {

    NativeModules.ReachabilityBridge = {
      networkReachabilityStatus: jest.fn().mockImplementationOnce(() => Promise.resolve(42))
    }

    jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => class MockNativeEventEmitter{
      addListener = () => jest.fn()
      removeListener = () => jest.fn()
      removeAllListeners = () => jest.fn()
    });

  });

  it('should render properly', () => {
    const tree = renderer.create(
      <App/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
