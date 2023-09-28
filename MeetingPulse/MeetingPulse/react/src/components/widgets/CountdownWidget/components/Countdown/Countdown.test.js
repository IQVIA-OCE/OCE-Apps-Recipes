import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Countdown } from './Countdown';

const MEETING = {
  endDate: '2022-01-27T13:45:00.000+0000',
  startDate: '2021-12-01T13:45:00.000+0000',
  status: 'Draft',
};

describe('Countdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render correctly', () => {
    const now = new Date('2021-11-20T13:45:00.000+0000').getTime();

    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => now);

    const startDate = new Date(MEETING.startDate).getTime();
    const { getByTestId } = render(<Countdown endDate={startDate} />);

    expect(getByTestId('countdown-days')).toBeTruthy();
    expect(getByTestId('countdown-hours')).toBeTruthy();
    expect(getByTestId('countdown-mins')).toBeTruthy();
  });

  it('should display correct count of days, hours and minutes', () => {
    const now = new Date('2021-11-20T13:45:00.000+0000').getTime();

    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => now);

    const startDate = new Date(MEETING.startDate).getTime();
    const { getByTestId } = render(<Countdown endDate={startDate} />);

    expect(getByTestId('countdown-days')).toHaveTextContent('11');
    expect(getByTestId('countdown-hours')).toHaveTextContent('0');
    expect(getByTestId('countdown-mins')).toHaveTextContent('0');
  });

  it('should correctly display updated time after some ticks', async () => {
    const now = new Date('2021-11-20T13:45:00.000+0000').getTime();
    const nowPlusOneMinute = new Date('2021-11-20T13:46:00.000+0000').getTime();

    const dateNowSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => now);

    const startDate = new Date(MEETING.startDate).getTime();
    const { getByTestId } = render(<Countdown endDate={startDate} />);

    dateNowSpy.mockReset().mockImplementation(() => nowPlusOneMinute);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByTestId('countdown-days')).toHaveTextContent('10');
    expect(getByTestId('countdown-hours')).toHaveTextContent('23');
    expect(getByTestId('countdown-mins')).toHaveTextContent('59');
    dateNowSpy.mockClear();
  });
});
