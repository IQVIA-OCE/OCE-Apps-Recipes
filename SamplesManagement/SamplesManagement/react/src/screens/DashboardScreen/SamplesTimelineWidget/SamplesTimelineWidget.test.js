import React from 'react';
import SamplesTimelineWidget from './SamplesTimelineWidget';
import { act, render } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';

jest.mock('moment', () => () => ({
  format: () => 'May 3, 2020 06:19 pm',
  fromNow: () => '2 months ago'
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

describe('SamplesTimelineWidget', () => {
  it('Should render SamplesTimelineWidget component', () => {
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { getByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <SamplesTimelineWidget />
      </NavigationContext.Provider>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/Samples Timeline/));
  });
});
