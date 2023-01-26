import React from 'react';
import App from './App';
import RN from 'react-native';
import {render, act, waitFor} from '@testing-library/react-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Application', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', async () => {
    render(
      <App />
    )
  });

  it('should render properly with dark theme', async () => {
    const mock = jest.fn();

    jest.spyOn(RN, 'useColorScheme').mockImplementation(mock);

    mock.mockReturnValueOnce('dark');

    render(
      <App />
    );
  })
});
