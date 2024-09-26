import React from 'react';
import DashboardScreen from './DashboardScreen';
import { render } from '@testing-library/react-native';
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
    const { findByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <DashboardScreen />
      </NavigationContext.Provider>
    );

    expect(findByText(/Samples Management/)).toBeTruthy();
    expect(findByText(/Manage Lots/)).toBeTruthy();
    expect(findByText(/Samples Storage Location/)).toBeTruthy();
    expect(findByText(/Samples Timeline/)).toBeTruthy();
    expect(findByText(/Disbursements/)).toBeTruthy();
    expect(findByText(/Inventories/)).toBeTruthy();
    expect(findByText(/Received Samples/)).toBeTruthy();
  });
});
