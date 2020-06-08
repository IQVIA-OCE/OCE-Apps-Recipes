import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import { NativeModules, NativeEventEmitter } from 'react-native'

describe('LineChartTRXDetails', () => {
  beforeAll(() => {

    NativeModules.ReachabilityBridge = {
      networkReachabilityStatus: jest.fn()
        .mockResolvedValueOnce('ONLINE')
        .mockRejectedValue('ERROR')
    }

    jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => class MockNativeEventEmitter{
      addListener = jest.fn()
        .mockImplementationOnce((event, cb) => {
          cb({
            prevStatus: '0',
            currentStatus: '1'
          })
        })
        .mockImplementationOnce((event, cb) => {
          cb({
            prevStatus: '0',
            currentStatus: '0'
          })
        })
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

  it('should render with networkReachabilityStatus error', () => {
    const tree = renderer.create(
      <App/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render with Call selectedChart', () => {
    const tree = renderer.create(
      <App/>
    );

    const instance = tree.getInstance();

    instance.setState({
      selectedChart: 'Call'
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
