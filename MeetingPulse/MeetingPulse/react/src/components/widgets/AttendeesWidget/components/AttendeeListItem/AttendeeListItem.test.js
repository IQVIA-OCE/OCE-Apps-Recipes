import React from 'react';
import AttendeeListItem from './AttendeeListItem';
import { render } from '@testing-library/react-native';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

describe('AttendeeListItem', () => {
  it('should render correctly', async () => {
    const { getByText } = render(
      <AttendeeListItem title="test_title" avatarColor="red" avatarText="KK" email="test@gmail.com" subtitle="123" />
    );

    expect(getByText(/test_title/i)).toBeTruthy();
    expect(getByText(/KK/i)).toBeTruthy();
    expect(getByText(/test@gmail.com/i)).toBeTruthy();
    expect(getByText(/123/i)).toBeTruthy();
  });
});
