import React from 'react';
import { testRenderHook } from './testHook';
import { useHandleData } from './useHandleData';
import { Text, View } from 'react-native';
import { ActivityIndicator } from '@oce-apps/apollo-react-native';

describe('useHandleData', () => {
  it('should render Loader', async () => {
    let { UNSAFE_root } = testRenderHook(() =>
      useHandleData({ loading: true, error: '', data: null })()
    );

    expect(UNSAFE_root.findByType(ActivityIndicator)).toBeTruthy();
  });

  it('should render Error', () => {
    const { getByText } = testRenderHook(() =>
      useHandleData({
        loading: false,
        error: { message: 'Error message' },
        data: null,
      })()
    );

    expect(getByText(/Error message/)).toBeTruthy();
  });

  it('should render Error', () => {
    const { getByText } = testRenderHook(() =>
      useHandleData({ loading: false, error: 'error', data: null })()
    );

    expect(getByText(/error/)).toBeTruthy();
  });

  it('should render data', () => {
    const { getByText } = testRenderHook(() =>
      useHandleData({ loading: false, error: '', data: 'data' })(data => (
        <View>
          <Text>{data}</Text>
        </View>
      ))
    );

    expect(getByText(/data/)).toBeTruthy();
  });
});
