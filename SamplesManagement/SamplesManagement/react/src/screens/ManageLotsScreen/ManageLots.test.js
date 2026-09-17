import React from 'react';
import ManageLots from './ManageLots';
import { useBanner, useBoolean } from '../../hooks';
import * as api from '../../api/ManageLots';
import { FlatList } from 'react-native';
import { Button } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';

jest.mock('../../hooks');

const navigation = {
  navigate: jest.fn(),
};

const setBanner = jest.fn();
const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
];

describe('ManageLots', () => {
  beforeEach(() => {
    useBanner.mockReturnValue(useBannerValue);
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });

  it('Should render without error', () => {
    const { UNSAFE_root } = render(<ManageLots navigation={navigation} />)
    act(() => jest.runAllTimers());

    api.fetchLotsOffset.mockResolvedValueOnce([[],{"totalSize":0,"done":true}]);
    fireEvent(UNSAFE_root.findByType(FlatList), 'onEndReached');
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(Button)[0]);
    fireEvent.press(UNSAFE_root.findAllByType(Button)[1]);
    act(() => jest.runAllTimers());

    expect(navigation.navigate).toHaveBeenCalled();
    expect(api.fetchLotsOffset).toHaveBeenCalledTimes(2);
  });

  it('Should render with error', () => {
    api.fetchLotsOffset
      .mockRejectedValueOnce({ message: 'error message' });

    const { getByText } = render(<ManageLots navigation={navigation} />);
    act(() => jest.runAllTimers());

    expect(getByText('error message')).toBeTruthy();
  });
});
