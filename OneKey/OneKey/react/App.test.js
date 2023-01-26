import React from 'react';
import App from './App';
import { databaseManager } from 'oce-apps-bridges';
import { _TESTING_ONLY_normalize_keys } from '@react-navigation/core/lib/commonjs/routers/KeyGenerator';
import { render } from '@testing-library/react-native';
import { Provider, DarkTheme } from 'apollo-react-native'

jest.useFakeTimers();

describe('App', () => {
  beforeAll(() => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [], done: true });
  });
  beforeEach(() => {
    jest.useFakeTimers();
    _TESTING_ONLY_normalize_keys();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = render(
        <App />
    )
    expect(tree).toBeTruthy();
  });

  it('should render properly in dark mode', () => {
    const tree = render(
        <Provider theme={DarkTheme}>
          <App />
        </Provider>
    )

    expect(tree).toBeTruthy();
  });
});
