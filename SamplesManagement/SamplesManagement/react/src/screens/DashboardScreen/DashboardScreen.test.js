import React from 'react';
import DashboardScreen from './DashboardScreen';
import { render, act } from '@testing-library/react-native';

jest.useFakeTimers();

const navigation = {
  addListener: jest.fn().mockImplementation(() => ({ remove: jest.fn() }))
};
describe('DashboardScreen', () => {
  it('should render DashboardScreen component', async () => {
    const promise = Promise.resolve();
    const { getByText } = render(<DashboardScreen navigation={navigation} />);

    await act(() => promise);
    expect(getByText(/Samples Management/)).toBeTruthy();
  });
});
