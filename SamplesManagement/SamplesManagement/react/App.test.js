import React from 'react';
import App from './App';
import RN from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

describe('Application', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useFakeTimers({ advanceTimers: true })
  });
  it('should render properly', async () => {
    const {getByText, findByText} = render(<App />);

    await waitFor(() => findByText(/Samples Management/));

    expect(getByText(/Samples Management/)).toBeTruthy();
    expect(getByText(/Manage Lots/)).toBeTruthy();
    expect(getByText(/Disbursements/)).toBeTruthy();
    expect(getByText(/Samples Storage Location/)).toBeTruthy();
    expect(getByText(/Inventories/)).toBeTruthy();
    expect(getByText(/Samples Timeline/)).toBeTruthy();
    expect(getByText(/Received Samples/)).toBeTruthy();
  });

  it('should render properly with dark theme', async () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValueOnce('dark');

    const {getByText, findByText} = render(<App />);

    await waitFor(() => findByText(/Samples Management/));

    expect(getByText(/Samples Management/)).toBeTruthy();
    expect(getByText(/Manage Lots/)).toBeTruthy();
    expect(getByText(/Disbursements/)).toBeTruthy();
    expect(getByText(/Samples Storage Location/)).toBeTruthy();
    expect(getByText(/Inventories/)).toBeTruthy();
    expect(getByText(/Samples Timeline/)).toBeTruthy();
    expect(getByText(/Received Samples/)).toBeTruthy();
  })
});
