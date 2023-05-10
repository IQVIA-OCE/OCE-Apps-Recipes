import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Provider } from 'apollo-react-native';
import { useSelector } from 'react-redux';
import { ApproveRequestModal } from './ApproveRequestModal';
import { APPROVAL_REQUEST_STATUS } from '../../constants';
import { TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '',
  },
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('ApproveRequestModal', () => {
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
    const onApprove = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <Provider>
        <ApproveRequestModal
          isOpen={true}
          title="Title"
          onApprove={onApprove}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    expect(getByDisplayValue('')).toBeTruthy();
    expect(getByText(/^cancel$/i)).toBeTruthy();
    expect(getByText(/^approve$/i)).toBeTruthy();
  });

  it('should call approve action and callbacks', async () => {
    const onApprove = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <Provider>
        <ApproveRequestModal
          isOpen={true}
          title="Title"
          onApprove={onApprove}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    const commentInputEl = getByDisplayValue('');
    fireEvent.changeText(commentInputEl, 'looks good');

    const approveButtonEl = getByText(/^approve$/i);
    fireEvent.press(approveButtonEl, {
      nativeEvent: {},
      bubbles: true,
    });

    const promise = Promise.resolve();
    await act(() => promise);

    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onApprove).toHaveBeenCalledWith('looks good');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle close', () => {
    const onApprove = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText } = render(
      <Provider>
        <ApproveRequestModal
          isOpen={true}
          title="Title"
          onApprove={onApprove}
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
