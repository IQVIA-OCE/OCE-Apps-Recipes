import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Autocomplete, Provider } from 'apollo-react-native';
import { useSelector } from 'react-redux';
import { ReassignRequestModal } from './ReassignRequestModal';
import { APPROVAL_REQUEST_STATUS } from '../../constants';
import { TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';
import { fetchAllUsers } from '../../api/approvalRequestsApi';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '',
  },
}));

jest.mock('../../api/approvalRequestsApi', () => ({
  fetchAllUsers: jest.fn(),
}));

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('ReassignRequestModal', () => {
  beforeEach(() => {
    fetchAllUsers.mockResolvedValue([[]]);

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

  it('should render properly', async () => {
    const onReassign = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText, UNSAFE_getByType } = render(
      <Provider>
        <ReassignRequestModal
          isOpen={true}
          title="Title"
          onReassign={onReassign}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    const promise = Promise.resolve();
    await act(() => promise);

    expect(UNSAFE_getByType(Autocomplete)).toBeTruthy();
    expect(getByText(/^cancel$/i)).toBeTruthy();
    expect(getByText(/^reassign$/i)).toBeTruthy();
  });

  it('should call reassign action and callbacks', async () => {
    const onReassign = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText, UNSAFE_getByType } = render(
      <Provider>
        <ReassignRequestModal
          isOpen={true}
          title="Title"
          onReassign={onReassign}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    const autocompleteEl = UNSAFE_getByType(Autocomplete);
    act(() => {
      autocompleteEl.props.onChange({ label: 'user', value: '1' });
    });

    const reassignButtonEl = getByText(/^reassign$/i);
    fireEvent.press(reassignButtonEl, {
      nativeEvent: {},
      bubbles: true,
    });

    const promise = Promise.resolve();
    await act(() => promise);

    expect(onReassign).toHaveBeenCalledTimes(1);
    expect(onReassign).toHaveBeenCalledWith('1');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle close', () => {
    const onReassign = jest.fn();
    const onSuccess = jest.fn();
    const onClose = jest.fn();
    const { getByText } = render(
      <Provider>
        <ReassignRequestModal
          isOpen={true}
          title="Title"
          onReassign={onReassign}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Provider>
    );

    fireEvent.press(getByText(/^cancel$/i), {
      nativeEvent: {},
      bubbles: true,
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
