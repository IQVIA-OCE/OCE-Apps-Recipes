import React from 'react';
import App from './App';
import { render } from '@testing-library/react-native';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => ''
  },
}));

describe('App', () => {
  it('should render correctly', () => {
    const rendered = render(
      <App />
    );

    expect(rendered).toBeTruthy();
  });

  it('should render with meeting id', () => {
    const { getByText } = render(
      <App recordId="123" />
    );

    expect(getByText(/Attendees/)).toBeTruthy();
  });
});
