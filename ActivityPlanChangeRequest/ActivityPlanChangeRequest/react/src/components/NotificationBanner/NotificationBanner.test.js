import React from 'react';
import { useSelector } from 'react-redux'
import { render } from '@testing-library/react-native';
import NotificationBanner from './NotificationBanner';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('Header', () => {
  beforeAll(() => {
    useSelector
      .mockImplementationOnce(() => ({
        isVisible: true,
        variant: 'error',
        text: 'TestNotification'
      }))
  });

  it('should render correctly', () => {
    const { getByText } = render(
      <NotificationBanner />
    );

    expect(getByText(/TestNotification/i)).toBeTruthy();
  })
})
