import React from 'react';
import { render, act } from '@testing-library/react-native';
import { TimeAgo } from './TimeAgo';
import { Text } from 'react-native';

const MEETING = {
  endDate: '2022-01-27T13:45:00.000+0000',
  startDate: '2021-12-01T13:45:00.000+0000',
  status: 'Draft',
};

const startDate = new Date(MEETING.startDate).getTime();
const endDate = new Date(MEETING.endDate).getTime();

describe('TimeAgo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render correctly with start date and end date', () => {
    const now = new Date(MEETING.startDate).getTime();

    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => now);

    const { getByTestId } = render(
      <TimeAgo
        title="In Progress"
        startDate={startDate}
        endDate={endDate}
        getSubtitle={({ timer }) => <Text>Ends in {timer}</Text>}
      />
    );

    expect(getByTestId('timeago-days')).toBeTruthy();
    expect(getByTestId('timeago-hours')).toBeTruthy();
    expect(getByTestId('timeago-mins')).toBeTruthy();
  });

  it('should render correctly with only start date', () => {
    const now = new Date(MEETING.startDate).getTime();

    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => now);

    const { getByTestId } = render(
      <TimeAgo title="Has Ended" startDate={startDate} getSubtitle={({ timer }) => <Text>Ends in {timer}</Text>} />
    );

    expect(getByTestId('timeago-days')).toBeTruthy();
    expect(getByTestId('timeago-hours')).toBeTruthy();
    expect(getByTestId('timeago-mins')).toBeTruthy();
  });

  it('should display correct count of days, hours and minutes', () => {
    const now = new Date(MEETING.startDate).getTime();

    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => now);

    const { getByTestId } = render(
      <TimeAgo
        title="In Progress"
        startDate={startDate}
        endDate={endDate}
        getSubtitle={({ timer }) => <Text>Ends in {timer}</Text>}
      />
    );

    expect(getByTestId('timeago-days')).toHaveTextContent('57');
    expect(getByTestId('timeago-hours')).toHaveTextContent('0');
    expect(getByTestId('timeago-mins')).toHaveTextContent('0');
  });

  it('should correctly display updated time after some ticks', async () => {
    const now = new Date(MEETING.startDate).getTime();
    const newNow = new Date('2021-12-02T15:50:00.000+0000').getTime();

    const dateNowSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => now);

    const { getByTestId } = render(
      <TimeAgo
        title="In Progress"
        startDate={startDate}
        endDate={endDate}
        getSubtitle={({ timer }) => <Text>Ends in {timer}</Text>}
      />
    );

    dateNowSpy.mockReset().mockImplementation(() => newNow);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByTestId('timeago-days')).toHaveTextContent('55');
    expect(getByTestId('timeago-hours')).toHaveTextContent('2');
    expect(getByTestId('timeago-mins')).toHaveTextContent('5');
    dateNowSpy.mockClear();
  });
});
