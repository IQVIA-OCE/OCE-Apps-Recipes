import { fireEvent, render, act, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { APPROVAL_REQUEST_STATUS, SORT_ORDER } from '../../../constants';
import * as commonUtils from '../../../utils/common';
import { ApprovalRequestsHeader } from './ApprovalRequestsHeader';
import { Provider } from '@oce-apps/apollo-react-native';
import { fetchApprovalRequests } from '../../../store/approvalRequests/approvalRequestsSlice';
import { TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '1',
  },
}));

jest.mock('@oce-apps/apollo-react-native/lib/module/components/PressableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../../store/approvalRequests/approvalRequestsSlice', () => ({
  fetchApprovalRequests: jest.fn(),
}));

describe('ApprovalRequestsHeader', () => {
  let params;

  beforeEach(() => {
    useDispatch.mockImplementation(() => () => {});

    params = {
      page: 1,
      rowsPerPage: 5,
      sortColumn: 'CreatedDate',
      sortOrder: SORT_ORDER.DESCENDING,
      status: APPROVAL_REQUEST_STATUS.PENDING,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('(tablet) ', () => {
    beforeEach(() => {
      commonUtils.isMobilePhone = false;
    });

    it('should render properly', () => {
      const { getByTestId } = render(
        <ApprovalRequestsHeader
          params={params}
          isActionDisabled={true}
          onApprove={jest.fn()}
          onReject={jest.fn()}
          onReassign={jest.fn()}
        />
      );

      expect(getByTestId('status-select')).toBeTruthy();
      expect(getByTestId('tablet-actions')).toBeTruthy();
    });

    it('should not render actions if status is not "Pending"', () => {
      const { queryByTestId } = render(
        <ApprovalRequestsHeader
          params={{
            ...params,
            status: APPROVAL_REQUEST_STATUS.APPROVED,
          }}
          isActionDisabled={true}
          onApprove={jest.fn()}
          onReject={jest.fn()}
          onReassign={jest.fn()}
        />
      );

      expect(queryByTestId('tablet-actions')).toBeNull();
    });

    it('should handle status change', async () => {
      const { getByText, findByText } = render(
        <Provider>
          <ApprovalRequestsHeader
            params={params}
            isActionDisabled={true}
            onApprove={jest.fn()}
            onReject={jest.fn()}
            onReassign={jest.fn()}
          />
        </Provider>
      );

      const selectEl = getByText('Items to Approve');
      fireEvent.press(selectEl);

      const statusApprovedItemEl = await findByText('Approved Submitted Requests');
      fireEvent.press(statusApprovedItemEl, {
        nativeEvent: {},
      });

      const promise = Promise.resolve();
      await act(() => promise);

      expect(fetchApprovalRequests).toHaveBeenCalledTimes(1);
    });

    describe('(onApprove) ', () => {
      it('should call', async () => {
        const onApprove = jest.fn();
        const { getByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={false}
              onApprove={onApprove}
              onReject={jest.fn()}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const approveButtonEl = getByText(/^Approve$/i);
        fireEvent.press(approveButtonEl);

        expect(onApprove).toHaveBeenCalledTimes(1);
      });

      it('should not call if there are not selected rows', async () => {
        const onApprove = jest.fn();
        const { getByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={true}
              onApprove={onApprove}
              onReject={jest.fn()}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const approveButtonEl = getByText(/^Approve$/i);
        fireEvent.press(approveButtonEl);

        expect(onApprove).toHaveBeenCalledTimes(0);
      });
    });

    describe('(onReject) ', () => {
      it('should call', async () => {
        const onReject = jest.fn();
        const { getByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={false}
              onApprove={jest.fn()}
              onReject={onReject}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const rejectButtonEl = getByText(/^Reject$/i);
        fireEvent.press(rejectButtonEl);

        expect(onReject).toHaveBeenCalledTimes(1);
      });

      it('should not call if there are not selected rows', async () => {
        const onReject = jest.fn();
        const { getByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={true}
              onApprove={jest.fn()}
              onReject={onReject}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const rejectButtonEl = getByText(/^Reject$/i);
        fireEvent.press(rejectButtonEl);

        expect(onReject).toHaveBeenCalledTimes(0);
      });
    });

    describe('(onReassign) ', () => {
      it('should call', async () => {
        const onReassign = jest.fn();
        const { getByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={false}
              onApprove={jest.fn()}
              onReject={jest.fn()}
              onReassign={onReassign}
            />
          </Provider>
        );

        const reassignButtonEl = getByText(/^Reassign$/i);
        fireEvent.press(reassignButtonEl);

        expect(onReassign).toHaveBeenCalledTimes(1);
      });

      it('should not call if there are not selected rows', async () => {
        const onReassign = jest.fn();
        const { getByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={true}
              onApprove={jest.fn()}
              onReject={jest.fn()}
              onReassign={onReassign}
            />
          </Provider>
        );

        const reassignButtonEl = getByText(/^Reassign$/i);
        fireEvent.press(reassignButtonEl);

        expect(onReassign).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('(phone) ', () => {
    beforeEach(() => {
      commonUtils.isMobilePhone = true;
      jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render properly', () => {
      const { getByTestId } = render(
        <ApprovalRequestsHeader
          params={params}
          isActionDisabled={true}
          onApprove={jest.fn()}
          onReject={jest.fn()}
          onReassign={jest.fn()}
        />
      );

      expect(getByTestId('status-select')).toBeTruthy();
      expect(getByTestId('phone-actions')).toBeTruthy();
    });

    it('should not render actions if status is not "Pending"', () => {
      const { queryByTestId } = render(
        <ApprovalRequestsHeader
          params={{
            ...params,
            status: APPROVAL_REQUEST_STATUS.APPROVED,
          }}
          isActionDisabled={true}
          onApprove={jest.fn()}
          onReject={jest.fn()}
          onReassign={jest.fn()}
        />
      );

      expect(queryByTestId('phone-actions')).toBeNull();
    });

    describe('(onApprove) ', () => {
      it('should call', async () => {
        const onApprove = jest.fn();
        const { getByText, findByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={false}
              onApprove={onApprove}
              onReject={jest.fn()}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const actionsEl = getByText(/Actions/i);
        fireEvent.press(actionsEl);

        const approveOptionEl = await findByText(/^Approve$/i);
        fireEvent.press(approveOptionEl);

        expect(onApprove).toHaveBeenCalledTimes(1);
      });

      it('approve option should not be available if there are not selected rows', async () => {
        const { getByText, queryByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={true}
              onApprove={jest.fn()}
              onReject={jest.fn()}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const actionsEl = getByText(/Actions/i);
        fireEvent.press(actionsEl);

        const promise = Promise.resolve();
        await act(() => promise);

        const approveOptionEl = queryByText(/^Approve$/i);

        expect(approveOptionEl).toBeNull();
      });
    });

    describe('(onReject) ', () => {
      it('should call', async () => {
        const onReject = jest.fn();
        const { getByText, findByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={false}
              onApprove={jest.fn()}
              onReject={onReject}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const actionsEl = getByText(/Actions/i);
        fireEvent.press(actionsEl);

        const rejectOptionEl = await findByText(/^Reject$/i);
        fireEvent.press(rejectOptionEl);

        expect(onReject).toHaveBeenCalledTimes(1);
      });

      it('reject option should not be available if there are not selected rows', async () => {
        const { getByText, queryByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={true}
              onApprove={jest.fn()}
              onReject={jest.fn()}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const actionsEl = getByText(/Actions/i);
        fireEvent.press(actionsEl);

        const promise = Promise.resolve();
        await act(() => promise);

        const rejectOptionEl = queryByText(/^Reject$/i);

        expect(rejectOptionEl).toBeNull();
      });
    });

    describe('(onReassign) ', () => {
      it('should call', async () => {
        const onReassign = jest.fn();
        const { getByText, findByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={false}
              onApprove={jest.fn()}
              onReject={jest.fn()}
              onReassign={onReassign}
            />
          </Provider>
        );

        const actionsEl = getByText(/Actions/i);
        fireEvent.press(actionsEl);

        const reassignOptionEl = await findByText(/^Reassign$/i);
        fireEvent.press(reassignOptionEl);

        expect(onReassign).toHaveBeenCalledTimes(1);
      });

      it('reassign option should not be available if there are not selected rows', async () => {
        const { getByText, queryByText } = render(
          <Provider>
            <ApprovalRequestsHeader
              params={params}
              isActionDisabled={true}
              onApprove={jest.fn()}
              onReject={jest.fn()}
              onReassign={jest.fn()}
            />
          </Provider>
        );

        const actionsEl = getByText(/Actions/i);
        fireEvent.press(actionsEl);

        const promise = Promise.resolve();
        await act(() => promise);

        const reassignOptionEl = queryByText(/^Reassign$/i);

        expect(reassignOptionEl).toBeNull();
      });
    });
  });
});
