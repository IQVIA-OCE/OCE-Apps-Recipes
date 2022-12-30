import React from 'react';
import { NativeModules } from 'react-native';
import App from './App';
import renderer from 'react-test-renderer';
import { _TESTING_ONLY_normalize_keys } from '@react-navigation/core/lib/commonjs/routers/KeyGenerator';
import { NativeModules as RNNativeModules } from "react-native";

jest.mock('oce-apps-bridges/lib/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    territory: () => 'Territory'
  },
}));

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    _TESTING_ONLY_normalize_keys();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = renderer.create(
      <App />
    );

    expect(tree).toMatchSnapshot();
  })

});
