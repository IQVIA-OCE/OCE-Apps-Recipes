import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CountdownWidget } from './CountdownWidget';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
    timeZone: () => 'America/Los_Angeles',
  },
}));

const MEETING = {
  endDate: '2022-01-27T13:45:00.000+0000',
  startDate: '2021-12-01T13:45:00.000+0000',
  status: 'Draft',
};

describe('CountdownWidget', () => {
  beforeEach(() => {
    useSelector.mockReturnValue(MEETING);
    jest.useFakeTimers();
  });

  afterEach(() => {
    useSelector.mockReset();
    useDispatch().mockReset();
    jest.useRealTimers();
  });

  it('should make a correct transition pre meeting => in progress', () => {
    const now = new Date('2021-12-01T13:44:00.000+0000').getTime();

    const dateNowSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => now);

    const { getByTestId, queryByTestId } = render(<CountdownWidget />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByTestId('pre-meeting-timer')).toBeTruthy();

    dateNowSpy.mockClear().mockImplementation(() => now + 2 * 60 * 1000);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByTestId('pre-meeting-timer')).toBeNull();
    expect(getByTestId('in-progress-timer')).toBeTruthy();
  });

  it('should make a correct transition in progress => post meeting', () => {
    const now = new Date('2021-12-01T13:44:00.000+0000').getTime();

    const dateNowSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => now + 2 * 60 * 1000);

    const { getByTestId, queryByTestId } = render(<CountdownWidget />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByTestId('in-progress-timer')).toBeTruthy();

    const newDateNow = new Date('2022-01-27T13:46:00.000+0000').getTime();
    dateNowSpy.mockClear().mockImplementation(() => newDateNow);
    useSelector.mockClear().mockReturnValue({
      ...MEETING,
      status: 'Concluded',
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(queryByTestId('in-progress-timer')).toBeNull();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByTestId('post-meeting-timer')).toBeTruthy();
  });

  it('should correctly manage conflicting state', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2022-01-27T13:46:00.000+0000').getTime());
    const { getByTestId } = render(<CountdownWidget />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByTestId('conflict-hint')).toBeTruthy();
  });

  it('should correctly manage cancelled state', () => {
    useSelector.mockClear().mockReturnValue({
      ...MEETING,
      status: 'Cancelled',
    });
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2022-01-27T13:46:00.000+0000').getTime());
    const { getByTestId } = render(<CountdownWidget />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByTestId('cancelled-hint')).toBeTruthy();
  });
});
