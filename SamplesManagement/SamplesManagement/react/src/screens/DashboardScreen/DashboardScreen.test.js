import React from 'react';
import DashboardScreen from './DashboardScreen';
import { render, act } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';

jest.useFakeTimers();
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

describe('DashboardScreen', () => {
  it('should render DashboardScreen component', async () => {
    const promise = Promise.resolve();
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };
    const { getByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <DashboardScreen />
      </NavigationContext.Provider>
    );

    await act(() => promise);
    expect(getByText(/Samples Management/)).toBeTruthy();
  });
});
