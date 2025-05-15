import React from 'react';
import DashboardScreen from './DashboardScreen';
import { render, act } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';

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
  it('should render DashboardScreen component', () => {
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };
    const { getByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <DashboardScreen />
      </NavigationContext.Provider>
    );

    act(() => jest.runAllTimers());

    expect(getByText(/Samples Management/)).toBeTruthy();
    expect(getByText(/Manage Lots/)).toBeTruthy();
    expect(getByText(/Samples Storage Location/)).toBeTruthy();
    expect(getByText(/Samples Timeline/)).toBeTruthy();
    expect(getByText(/Disbursements/)).toBeTruthy();
    expect(getByText(/Inventories/)).toBeTruthy();
    expect(getByText(/Received Samples/)).toBeTruthy();
    act(() => jest.runAllTimers());
  });
});
