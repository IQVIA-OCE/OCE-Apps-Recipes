import React from 'react';
import ReceivedSamplesWidget from './ReceivedSamplesWidget';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';

jest.mock('moment', () => () => ({
  format: () => 'May 3, 2020 06:19 pm',
  fromNow: () => 'May 3, 2020 06:19 pm',
}));
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

describe('ReceivedSamplesWidget', () => {
  it('Should render ReceivedSamplesWidget component', async () => {
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { queryAllByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <ReceivedSamplesWidget />
      </NavigationContext.Provider>
    );

    await waitFor(() => {
      expect(queryAllByText(/Undamaged/)).toBeTruthy();
      expect(queryAllByText(/May 3, 2020 06:19 pm/)).toBeTruthy();
    });
  });
});
