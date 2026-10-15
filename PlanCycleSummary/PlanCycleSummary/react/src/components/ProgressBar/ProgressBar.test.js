import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from './ProgressBar';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import * as utils from '../../utils';

jest.mock('luxon', () => ({
  ...jest.requireActual('luxon'),
  DateTime: {
    fromISO: jest.requireActual('luxon').DateTime.fromISO,
    now: () => ({
      toISO: jest.fn(() => '2024-03-22T13:20:34.962+02:00')
    }),
    local: () => ({
      toISO: jest.fn(() => '2024-03-22T13:20:34.962+02:00'),
      setZone: jest.fn()
    }),
  }
}));

describe('ProgressBar', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  it('renders correctly', () => {
    utils.isIphone = true;

    const { getByTestId, findByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar value={33} />
      </Provider>
    );

    let progressBar = getByTestId('progress-bar');

    expect(findByText('March 22')).toBeTruthy();
    expect(progressBar).toBeTruthy();

    utils.isIphone = false;

    rerender(
      <Provider store={store}>
        <ProgressBar />
      </Provider>
    );
    progressBar = getByTestId('progress-bar');

    expect(findByText('March 22')).toBeTruthy();
    expect(progressBar).toBeTruthy();
  });
});
