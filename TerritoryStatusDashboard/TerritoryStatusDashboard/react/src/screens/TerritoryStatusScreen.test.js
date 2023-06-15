import { render } from '@testing-library/react-native';
import { ApolloProgress, Provider as ApolloProvider } from 'apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_STATUS } from '../constants';
import { COLLECTED_DATA } from '../mocks/territoryStatusTestData';
import * as helpers from '../utils/helpers';
import { TerritoryStatusScreen } from './TerritoryStatusScreen';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('TerritoryStatusScreen', () => {
  beforeEach(() => {
    useSelector.mockReset();
    useDispatch.mockReset();
    useDispatch.mockImplementation(() => jest.fn());
  });

  test('should render properly', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        territoryStatus: {
          loadingStatus: LOADING_STATUS.SUCCESS,
          collectedData: COLLECTED_DATA,
        },
      }),
    );

    const { queryByText } = render(
      <ApolloProvider>
        <TerritoryStatusScreen />
      </ApolloProvider>
    );

    expect(queryByText(/Territory Status/i)).toBeTruthy();
    expect(queryByText(/Accounts/i)).toBeTruthy();
    expect(queryByText(/New Enrollments/i)).toBeTruthy();
  });

  test('should render ApolloProgress component if loading status is PENDING', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        territoryStatus: {
          loadingStatus: LOADING_STATUS.PENDING,
          collectedData: COLLECTED_DATA,
        },
      }),
    );

    const { UNSAFE_queryByType } = render(
      <ApolloProvider>
        <TerritoryStatusScreen />
      </ApolloProvider>
    );

    expect(UNSAFE_queryByType(ApolloProgress)).toBeTruthy();
  });

  test('should render with styles for wide screens when Platform.OS is WEB', () => {
    helpers.isMobilePhone = false;
    helpers.isWeb = true;
    useSelector.mockImplementation((cb) =>
      cb({
        territoryStatus: {
          loadingStatus: LOADING_STATUS.SUCCESS,
          collectedData: COLLECTED_DATA,
        },
      }),
    );

    const { queryByText, queryByTestId } = render(
      <ApolloProvider>
        <TerritoryStatusScreen testID="app-screen" />
      </ApolloProvider>
    );

    expect(queryByText(/Territory Status/i)).toBeTruthy();
    expect(queryByText(/Accounts/i)).toBeTruthy();
    expect(queryByTestId('app-screen').props.style[0].borderRadius).toBe(10);
  });
});
