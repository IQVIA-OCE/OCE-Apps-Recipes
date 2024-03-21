import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Provider } from '@oce-apps/apollo-react-native';
import { useSelector } from 'react-redux';
import { RejectRequestModal } from './RejectRequestModal';
import { APPROVAL_REQUEST_STATUS } from '../../constants';
import { TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '',
  },
}));

jest.mock('@oce-apps/apollo-react-native/lib/module/components/PressableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('RejectRequestModal', () => {
  beforeEach(() => {
    useSelector.mockImplementationOnce(cb =>
      cb({
        approvalRequests: {
          params: {
            status: APPROVAL_REQUEST_STATUS.PENDING,
          },
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render properly', () => {
    const onReject = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <Provider>
        <RejectRequestModal
          isOpen={true}
          title="Title"
          onReject={onReject}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    expect(getByDisplayValue('')).toBeTruthy();
    expect(getByText(/^cancel$/i)).toBeTruthy();
    expect(getByText(/^reject$/i)).toBeTruthy();
  });

  it('should call reject action and callbacks', async () => {
    const onReject = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <Provider>
        <RejectRequestModal
          isOpen={true}
          title="Title"
          onReject={onReject}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    const commentInputEl = getByDisplayValue('');
    fireEvent.changeText(commentInputEl, 'looks bad');

    const rejectButtonEl = getByText(/^reject$/i);
    fireEvent.press(rejectButtonEl, {
      nativeEvent: {},
      bubbles: true,
    });

    const promise = Promise.resolve();
    await act(() => promise);

    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledWith('looks bad');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle close', () => {
    const onReject = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText } = render(
      <Provider>
        <RejectRequestModal
          isOpen={true}
          title="Title"
          onReject={onReject}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    fireEvent.press(getByText(/^cancel$/i), {
      nativeEvent: {},
      bubbles: true
    })


    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
