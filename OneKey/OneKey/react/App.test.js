import React from 'react';
import RN from 'react-native';
import App from './App';
import { databaseManager } from '@oce-apps/oce-apps-bridges';
import { render, act } from '@testing-library/react-native';
import { Provider, DarkTheme } from '@oce-apps/apollo-react-native'

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  databaseManager: {
    fetch: jest.fn(),
  }
}))

jest.useFakeTimers();

describe('App', () => {
  beforeAll(() => {
    databaseManager.fetch.mockResolvedValue({ records: [], done: true });
  });
  beforeEach(() => {
    jest.useFakeTimers({advanceTimers: true});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = render(
        <App />
    )
    expect(tree).toBeTruthy();
  });

  it('should render properly in dark mode', () => {
    const mock = jest.fn();

    jest.spyOn(RN, 'useColorScheme').mockImplementation(mock);

    mock.mockReturnValueOnce('dark');

    const tree = render(
        <Provider theme={DarkTheme}>
          <App />
        </Provider>
    )

    expect(tree).toBeTruthy();
  });
});
