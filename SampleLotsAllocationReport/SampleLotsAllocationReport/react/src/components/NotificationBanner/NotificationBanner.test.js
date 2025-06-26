import { fireEvent, render } from '@testing-library/react-native';
import { IconButton } from '@oce-apps/apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationBanner } from "./NotificationBanner";

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
    territory: () => '',
    userId: () => '',
  },
}))

describe('ErrorBanner', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) =>
      cb({
        notification: {
          variant: 'error',
          text: 'Test error',
          icon: 'alert-circle',
          isVisible: true,
        },
      })
    );
  });

  test('should render correctly', () => {
    const { getByText } = render(<NotificationBanner />);

    expect(getByText(/Test error/i)).toBeTruthy();
  });

  test('should close banner if user click the button', () => {
    const { getByText, UNSAFE_getByType } = render(<NotificationBanner />);

    fireEvent.press(UNSAFE_getByType(IconButton));

    expect(getByText(/Test error/i)).toBeTruthy();
    expect(useDispatch).toHaveBeenCalled();
  });
});
