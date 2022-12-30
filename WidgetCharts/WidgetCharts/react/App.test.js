import React from 'react';
import App from './App';
import renderer, { act } from 'react-test-renderer';
import { NativeModules, NativeEventEmitter } from 'react-native'
import * as constants from './src/constants';

jest.mock(
  './node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js',
);

describe('App', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    NativeModules.ReachabilityBridge = {
      networkReachabilityStatus: jest.fn()
        .mockResolvedValueOnce('ONLINE')
        .mockRejectedValue('ERROR')
    }
  });

  afterAll(() => {
    jest.useRealTimers();
  });


  it('should render properly', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <App/>
        );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render properly ipad version', async () => {
    constants.isIphone = false;

    let tree;

    await act(async () => {
      tree = renderer.create(
        <App/>
        );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render with networkReachabilityStatus error', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <App/>
        );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render with Call selectedChart', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <App/>
        );
    });

    const instance = tree.getInstance();

    try {
      await instance.setState({
        selectedChart: 'Call'
      });
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render App with instanceId', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <App instanceId="123" />
        );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call componentWillUnmount', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <App/>
        );
    });

    const instance = tree.getInstance();

    try {
      await instance.componentWillUnmount();
    } catch (e) {}

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
