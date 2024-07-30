import React from 'react';
import StorageLocationWidget from './StorageLocationWidget';
import { IconButton } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import {
  NavigationContext,
} from '@react-navigation/native';
import { fetchDefaultLocation } from '../../../api/StorageLocation';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
      addListener: jest.fn(),
      setParams: jest.fn(),
    }),
    useRoute: jest.fn(() => ({
      params: {
        refreshLocationWidget: false,
      },
    }))
  };
});

describe('StorageLocationWidget', () => {
  it('Should render StorageLocationWidget component', () => {
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { getByTestId, UNSAFE_root } = render(
      <NavigationContext.Provider value={navContextValue}>
        <StorageLocationWidget />
      </NavigationContext.Provider>
    );

    act(() => jest.runAllTimers());

    expect(getByTestId('StorageLocationWidget')).toBeTruthy();

    fireEvent.press(UNSAFE_root.findByType(IconButton));
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  it('Should refresh default address', () => {
    const navContextValue = {
      isFocused: () => true,
      addListener: jest.fn(() => jest.fn()),
    };
    const { getByTestId } = render(
      <NavigationContext.Provider value={navContextValue}>
        <StorageLocationWidget />
      </NavigationContext.Provider>
    );

    act(() => jest.runAllTimers());
    expect(getByTestId('StorageLocationWidget')).toBeTruthy();
    expect(fetchDefaultLocation).toHaveBeenCalled();
  });
});
