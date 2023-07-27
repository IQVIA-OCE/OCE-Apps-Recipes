import React from 'react';
import { testRenderHook } from './testHook';
import { useHandleData } from './useHandleData';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'apollo-react-native';

describe('useHandleData', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render Loader', async () => {
    let { container } = testRenderHook(() =>
      useHandleData({ loading: true, error: '', data: null })()
    );

    expect(container.findByType(ActivityIndicator)).toBeTruthy();
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
