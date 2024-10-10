import { render } from '@testing-library/react-native';
import { Provider as ApolloProvider } from '@oce-apps/apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startObservingDB, stopObservingDB } from '../api/observers';
import { LOADING_STATUS, PAGE } from '../constants';
import { CallScreen } from '../screens/CallScreen';
import { MeetingScreen } from '../screens/MeetingScreen';
import { initialState as callInitialState } from '../store/call/callSlice';
import { initialState as meetingInitialState } from '../store/meeting/meetingSlice';
import { initialState as settingsInitialState } from '../store/settings/settingsSlice';
import { CustomProgress } from './CustomProgress';
import { ScreenContainer } from './ScreenContainer';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../api/observers', () => ({
  startObservingDB: jest.fn(),
  stopObservingDB: jest.fn(),
}));

describe('ScreenContainer', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(() => jest.fn());
    startObservingDB.mockReset();
    stopObservingDB.mockReset();
  });

  test('should render progress component if page identification is in progress', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        settingsStore: {
          ...settingsInitialState,
          loadingStatus: LOADING_STATUS.PENDING,
        },
      })
    );

    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <ScreenContainer recordId={'111'} />
      </ApolloProvider>
    );

    expect(UNSAFE_getByType(CustomProgress)).toBeTruthy();
  });

  test('should render CallScreen component if widget on call record page', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        settingsStore: {
          ...settingsInitialState,
          page: PAGE.CALL,
        },
        callStore: {
          ...callInitialState,
          loadingStatus: LOADING_STATUS.PENDING,
        },
      })
    );

    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <ScreenContainer recordId={'111'} />
      </ApolloProvider>
    );

    expect(UNSAFE_getByType(CallScreen)).toBeTruthy();
  });

  test('should render MeetingScreen component if widget on meeting record page', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        settingsStore: {
          ...settingsInitialState,
          page: PAGE.MEETING,
        },
        meetingStore: {
          ...meetingInitialState,
          loadingStatus: LOADING_STATUS.PENDING,
        },
      })
    );

    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <ScreenContainer recordId={'111'} />
      </ApolloProvider>
    );

    expect(UNSAFE_getByType(MeetingScreen)).toBeTruthy();
  });

  test('should render some text if widget on unsupported page', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        settingsStore: {
          ...settingsInitialState,
        },
      })
    );

    const { queryByText } = render(
      <ApolloProvider>
        <ScreenContainer recordId={'111'} />
      </ApolloProvider>
    );

    expect(
      queryByText(/The widget should be added to the Meeting or Call page./i)
    ).toBeTruthy();
  });
});
