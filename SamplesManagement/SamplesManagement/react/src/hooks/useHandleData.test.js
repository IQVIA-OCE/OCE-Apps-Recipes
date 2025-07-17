import React from 'react';
import { testRenderHook } from './testHook';
import { useHandleData } from './useHandleData';
import { Text, View } from 'react-native';
import { ActivityIndicator } from '@oce-apps/apollo-react-native';
import { act } from '@testing-library/react-native';

describe('useHandleData', () => {
  it('should render Loader', () => {
    let { UNSAFE_root } = testRenderHook(() =>
      useHandleData({ loading: true, error: '', data: null })()
    );

    expect(UNSAFE_root.findByType(ActivityIndicator)).toBeTruthy();
    act(() => jest.runAllTimers());
  });

  it('should render Error', () => {
    const { getByText } = testRenderHook(() =>
      useHandleData({
        loading: false,
        error: { message: 'Error message' },
        data: null,
      })(),
    );

    expect(getByText(/Error message/)).toBeTruthy();
    act(() => jest.runAllTimers());
  });

  it('should render Error', () => {
    const { getByText } = testRenderHook(() =>
      useHandleData({ loading: false, error: 'error', data: null })(),
    );

    expect(getByText(/error/)).toBeTruthy();
    act(() => jest.runAllTimers());
  });

  it('should render data', () => {
    const { getByText } = testRenderHook(() =>
      useHandleData({ loading: false, error: '', data: 'data' })(data => (
        <View>
          <Text>{data}</Text>
        </View>
      )),
    );

    expect(getByText(/data/)).toBeTruthy();
    act(() => jest.runAllTimers());
  });
});
