import { fireEvent, render } from '@testing-library/react-native';
import { IconButton } from '@oce-apps/apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationBanner } from './NotificationBanner';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('NotificationBanner', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) =>
      cb({
        notification: {
          notifications: [
            {
              variant: 'error',
              text: 'Test error',
              icon: 'alert-circle',
              isVisible: true,
            },
          ],
        },
      })
    );
  });

  test('should render properly', () => {
    const { queryByText } = render(<NotificationBanner />);

    expect(queryByText(/Test error/i)).toBeTruthy();
  });

  test('should close banner if user click the button', () => {
    const { queryByText, UNSAFE_queryByType } = render(<NotificationBanner />);

    expect(queryByText(/Test error/i)).toBeTruthy();

    fireEvent.press(UNSAFE_queryByType(IconButton));

    expect(useDispatch).toHaveBeenCalled();
  });
});
