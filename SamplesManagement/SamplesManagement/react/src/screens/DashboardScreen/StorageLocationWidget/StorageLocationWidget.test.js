import React from 'react';
import StorageLocationWidget from './StorageLocationWidget';
import { environment } from 'oce-apps-bridges';
import { useFetcher, useHandleData } from '../../../hooks';
import { IconButton } from 'apollo-react-native';
import { render, act } from '@testing-library/react-native';
import {
  useNavigation,
  useRoute,
  NavigationContext,
} from '@react-navigation/native';

jest.mock('../../../hooks');
jest.mock('../../../api/StorageLocation');

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
      addListener: jest.fn(),
    }),
    useRoute: jest
      .fn()
      .mockReturnValueOnce({
        params: {
          refreshLocationWidget: false,
        },
      })
      .mockReturnValueOnce({
        params: {
          refreshLocationWidget: true,
        },
      }),
  };
});

let handleFetch;

describe('StorageLocationWidget', () => {
  beforeEach(() => {
    handleFetch = jest.fn();
    environment.userID = jest.fn().mockReturnValue('1');
    useFetcher.mockReturnValueOnce(['Default address 1', { handleFetch }]);
    useHandleData.mockImplementation(d => fn => fn(d));
  });

  it('Should render StorageLocationWidget component', async () => {
    const promise = Promise.resolve();
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { getByTestId, container } = render(
      <NavigationContext.Provider value={navContextValue}>
        <StorageLocationWidget />
      </NavigationContext.Provider>
    );

    await act(() => promise);

    expect(getByTestId('StorageLocationWidget')).toBeTruthy();

    container.findByType(IconButton).props.onPress();
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  it('Should refresh default address', async () => {
    const promise = Promise.resolve();
    const navContextValue = {
      isFocused: () => true,
      addListener: jest.fn(() => jest.fn()),
    };
    const { getByTestId } = render(
      <NavigationContext.Provider value={navContextValue}>
        <StorageLocationWidget />
      </NavigationContext.Provider>
    );

    await act(() => promise);
    expect(getByTestId('StorageLocationWidget')).toBeTruthy();
    expect(handleFetch).toHaveBeenCalled();
  });
});
