import React from 'react';
import { render } from '@testing-library/react-native';
import PieChart from './PieChart';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  isIphone: false
}));

describe('PieChart', () => {
  beforeEach(() => {
    useSelector.mockReturnValueOnce(10) // workedDays
      .mockReturnValueOnce(5) // daysToClose
      .mockReturnValueOnce(20) // totDays
      .mockReturnValueOnce(25) // workingDays
      .mockReturnValueOnce({ startDate: '2024-01-01', endDate: '2024-01-31' }) // planCycle
      .mockReturnValueOnce(8) // hoursInWorkDay
      .mockReturnValueOnce(16); // holidayHours
  });

  test('displays correct total working days', () => {
    const { getByText } = render(<PieChart />);
    expect(getByText('Total Working Days 25')).toBeTruthy();
  });

  test('displays correct chart text', () => {
    const { getByText } = render(<PieChart />);
    expect(getByText('31\n Days')).toBeTruthy();
  });

  test('displays correct legend items', () => {
    const { getByText } = render(<PieChart />);

    expect(getByText('10 Worked Days')).toBeTruthy();
    expect(getByText('5 Working Days Remaining')).toBeTruthy();
    expect(getByText('2 Holidays')).toBeTruthy();
    expect(getByText('20 TOT Days')).toBeTruthy();
  });
});
