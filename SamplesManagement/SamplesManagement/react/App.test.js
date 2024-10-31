import React from 'react';
import App from './App';
import RN from 'react-native';
import { render, act } from '@testing-library/react-native';

describe('Application', () => {
  it('should render properly', () => {
    const {findByText} = render(<App />);
    act(() => jest.runAllTimers());

    expect(findByText(/Samples Management/)).toBeTruthy();
    expect(findByText(/Manage Lots/)).toBeTruthy();
    expect(findByText(/Disbursements/)).toBeTruthy();
    expect(findByText(/Samples Storage Location/)).toBeTruthy();
    expect(findByText(/Inventories/)).toBeTruthy();
    expect(findByText(/Samples Timeline/)).toBeTruthy();
    expect(findByText(/Received Samples/)).toBeTruthy();
  });

  it('should render properly with dark theme', () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValueOnce('dark');

    const {findByText} = render(<App />);
    act(() => jest.runAllTimers());

    expect(findByText(/Samples Management/)).toBeTruthy();
    expect(findByText(/Manage Lots/)).toBeTruthy();
    expect(findByText(/Disbursements/)).toBeTruthy();
    expect(findByText(/Samples Storage Location/)).toBeTruthy();
    expect(findByText(/Inventories/)).toBeTruthy();
    expect(findByText(/Samples Timeline/)).toBeTruthy();
    expect(findByText(/Received Samples/)).toBeTruthy();
  })
});
