import React from 'react';
import InventoriesWidgetContainer from './InventoriesWidgetContainer';
import { render, act } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';
import { fetchInventoryTypes } from '../../../api/Inventories';

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
  it('Should render InventoriesWidgetContainer error', () => {
    fetchInventoryTypes.mockRejectedValueOnce('Error text');
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { findByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <InventoriesWidgetContainer />
      </NavigationContext.Provider>
    );
    act(() => jest.runAllTimers());

    expect(findByText(/Error text/)).toBeTruthy();
  });

  it('Should render InventoriesWidgetContainer component', () => {
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { findAllByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <InventoriesWidgetContainer />
      </NavigationContext.Provider>
    );
    act(() => jest.runAllTimers());

    expect(findAllByText(/Inventories/)).toBeTruthy();
  });
});
