import React from 'react';
import { testRenderHook } from './testHook';
import { useHandleData } from './useHandleData';
import { Text, View } from 'react-native';

describe('useHandleData', () => {
  it('should render Loader', () => {
    let tree = testRenderHook(() =>
      useHandleData({ loading: true, error: '', data: null })()
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render Error', () => {
    let tree = testRenderHook(() =>
      useHandleData({
        loading: false,
        error: { message: 'error' },
        data: null,
      })()
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render Error', () => {
    let tree = testRenderHook(() =>
      useHandleData({ loading: false, error: 'error', data: null })()
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render data', () => {
    let tree = testRenderHook(() =>
      useHandleData({ loading: false, error: '', data: 'data' })(data => (
        <View>
          <Text>{data}</Text>
        </View>
      ))
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
