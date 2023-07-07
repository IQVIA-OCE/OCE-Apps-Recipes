import React from 'react';
import InventoriesWidgetContainer from './InventoriesWidgetContainer';
import { useFetcher, useHandleData } from '../../../hooks';
import { render, act } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';

jest.mock('../../../hooks');

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      addListener: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

describe('InventoriesWidgetContainer', () => {
  beforeAll(() => {
    useFetcher
      .mockReturnValueOnce([
        { loading: false, error: 'Error text' },
        { handleFetch: jest.fn() },
      ])
      .mockReturnValue([
        { loading: false, data: { all: [] } },
        { handleFetch: jest.fn() },
      ]);

    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });

  it('Should render InventoriesWidgetContainer error', async () => {
    const promise = Promise.resolve();
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { getByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <InventoriesWidgetContainer />
      </NavigationContext.Provider>
    );

    await act(() => promise);
    expect(getByText(/Error text/)).toBeTruthy();
  });

  it('Should render InventoriesWidgetContainer component', () => {
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { getAllByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <InventoriesWidgetContainer />
      </NavigationContext.Provider>
    );

    expect(getAllByText(/Inventories/)).toBeTruthy();
  });
});
