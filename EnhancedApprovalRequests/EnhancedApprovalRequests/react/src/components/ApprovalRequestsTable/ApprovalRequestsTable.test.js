import { fireEvent, render, act, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as commonUtils from '../../utils/common';
import { ApprovalRequestsTable } from './ApprovalRequestsTable';
import { useDispatch, useSelector } from 'react-redux';
import { APPROVAL_REQUEST_STATUS, LOADING_STATUS, SORT_ORDER } from '../../constants';
import { MAPPED_APPROVAL_REQUESTS_MOCK } from '../../../__mocks__/approvalRequestsMocks';
import { Provider, TextInput, Menu, Checkbox, Autocomplete } from 'apollo-react-native';
import { fetchAllUsers } from '../../api/approvalRequestsApi';
import { TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';
import {
  approveRequests,
  fetchApprovalRequests,
  reassignRequests,
  rejectRequests,
} from '../../store/approvalRequests/approvalRequestsSlice';
import { useApprovalRequestsList } from './hooks/useApprovalRequestsList';

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

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

jest.mock('../../store/approvalRequests/approvalRequestsSlice', () => ({
  bootstrap: jest.fn(),
  fetchApprovalRequests: jest.fn(),
  approveRequests: jest.fn(),
  reassignRequests: jest.fn(),
  rejectRequests: jest.fn(),
}));

jest.mock('./hooks/useApprovalRequestsList');

const mockDispatch = () => ({
  unwrap: () => Promise.resolve(),
});

describe('ApprovalRequestsTable', () => {
  beforeEach(() => {
    fetchAllUsers.mockResolvedValueOnce([[{ Id: '1', Name: 'test' }]]);

    useDispatch.mockImplementation(() => mockDispatch);

    useSelector.mockImplementationOnce(cb =>
      cb({
        approvalRequests: {
          loadingStatus: LOADING_STATUS.SUCCESS,
        },
      })
    );

    useApprovalRequestsList.mockImplementation(() => ({
      approvalRequests: MAPPED_APPROVAL_REQUESTS_MOCK,
      totalCount: 6,
      params: {
        page: 1,
        rowsPerPage: 5,
        sortColumn: 'createdDate',
        sortOrder: SORT_ORDER.DESCENDING,
        status: APPROVAL_REQUEST_STATUS.PENDING,
      },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('(iPad) ', () => {
    beforeEach(() => {
      commonUtils.isIphone = false;
    });

    it('should render properly', () => {
      const { getAllByText } = render(
        <Provider>
          <ApprovalRequestsTable />
        </Provider>
      );

      expect(getAllByText(/AI-00000008/i)[0]).toBeTruthy();
      expect(getAllByText(/AI-00000008/i)[1]).toBeTruthy();

      expect(getAllByText(/^Approval Inquiry$/i)[0]).toBeTruthy();
      expect(getAllByText(/^Approval Inquiry$/i)[1]).toBeTruthy();

      expect(getAllByText(/OCEADMIN OCEADMIN/i)[0]).toBeTruthy();
      expect(getAllByText(/OCEADMIN OCEADMIN/i)[1]).toBeTruthy();

      expect(getAllByText('8/2/2022, 1:51 AM')[0]).toBeTruthy();
      expect(getAllByText('8/2/2022, 1:51 AM')[1]).toBeTruthy();
    });

    describe('approve action', () => {
      it('single record', async () => {
        const { getAllByText, UNSAFE_getAllByType, UNSAFE_getAllByProps } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click first actions icon
        const firstActionsIcon = UNSAFE_getAllByProps({ icon: 'dots-vertical' })[0];

        act(() => {
          firstActionsIcon.props.onPress();
        });

        const promise = Promise.resolve();

        // wait for actions menu
        const approveOption = await waitFor(() => UNSAFE_getAllByType(Menu.Item)[0]);
        fireEvent.press(approveOption);

        // wait for modal
        await act(() => promise);

        const commentInput = await waitFor(() => UNSAFE_getAllByType(TextInput)[1]);

        // enter comment
        fireEvent.changeText(commentInput, 'comment');

        // click Approve button in modal
        const modalApproveButton = getAllByText(/^approve$/i)[1];
        fireEvent.press(modalApproveButton);

        await act(() => promise);

        // check args
        expect(approveRequests).toHaveBeenCalledTimes(1);
        expect(approveRequests).toHaveBeenCalledWith({
          processInstanceIds: ['04gO0000001AbhhIAC'],
          comment: 'comment',
        });
      });

      it('selection (one row)', async () => {
        const { getByText, getAllByText, UNSAFE_getAllByType } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click first row checkbox
        const firstRowCheckbox = UNSAFE_getAllByType(Checkbox)[1];

        act(() => {
          firstRowCheckbox.props.onChange();
        });

        const promise = Promise.resolve();
        await act(() => promise);

        // click Approve button
        const approveButton = getByText(/^approve$/i);
        fireEvent.press(approveButton);

        // wait for modal
        await act(() => promise);

        const commentInput = await waitFor(() => UNSAFE_getAllByType(TextInput)[1]);

        // enter comment
        fireEvent.changeText(commentInput, 'comment');

        // click Approve button in modal
        const modalApproveButton = getAllByText(/^approve$/i)[1];
        fireEvent.press(modalApproveButton);

        await act(() => promise);

        // check args
        expect(approveRequests).toHaveBeenCalledTimes(1);
        expect(approveRequests).toHaveBeenCalledWith({
          processInstanceIds: ['04gO0000001AbhhIAC'],
          comment: 'comment',
        });
      });

      it('selection (all rows)', async () => {
        const { getByText, getAllByText, UNSAFE_getAllByType } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click Select all checkbox
        const selectAllCheckbox = UNSAFE_getAllByType(Checkbox)[0];

        act(() => {
          selectAllCheckbox.props.onChange();
        });

        const promise = Promise.resolve();
        await act(() => promise);

        // click Approve button
        const approveButton = getByText(/^approve$/i);
        fireEvent.press(approveButton);

        // wait for modal
        await act(() => promise);

        const commentInput = await waitFor(() => UNSAFE_getAllByType(TextInput)[1]);

        // enter comment
        fireEvent.changeText(commentInput, 'comment');

        // click Approve button in modal
        const modalApproveButton = getAllByText(/^approve$/i)[1];
        fireEvent.press(modalApproveButton);

        await act(() => promise);

        // check args
        expect(approveRequests).toHaveBeenCalledTimes(1);
        expect(approveRequests).toHaveBeenCalledWith({
          processInstanceIds: [
            '04gO0000001AbhhIAC',
            '04gO0000001AbTBIA0',
            '04gO0000001AbT6IAK',
            '04gO0000001AbSxIAK',
            '04gO0000001AbSwIAK',
          ],
          comment: 'comment',
        });
      });
    });

    describe('reject action', () => {
      it('single record', async () => {
        const { getAllByText, UNSAFE_getAllByType, UNSAFE_getAllByProps } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click first actions icon
        const firstActionsIcon = UNSAFE_getAllByProps({ icon: 'dots-vertical' })[0];

        act(() => {
          firstActionsIcon.props.onPress();
        });

        const promise = Promise.resolve();

        // wait for actions menu
        const rejectOption = await waitFor(() => UNSAFE_getAllByType(Menu.Item)[1]);
        fireEvent.press(rejectOption);

        // wait for modal
        await act(() => promise);

        const commentInput = await waitFor(() => UNSAFE_getAllByType(TextInput)[1]);

        // enter comment
        fireEvent.changeText(commentInput, 'comment');

        // click Reject button in modal
        const modalRejectButton = getAllByText(/^reject$/i)[1];
        fireEvent.press(modalRejectButton);

        await act(() => promise);

        // check args
        expect(rejectRequests).toHaveBeenCalledTimes(1);
        expect(rejectRequests).toHaveBeenCalledWith({
          processInstanceIds: ['04gO0000001AbhhIAC'],
          comment: 'comment',
        });
      });

      it('selection (one row)', async () => {
        const { getByText, getAllByText, UNSAFE_getAllByType } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click first row checkbox
        const firstRowCheckbox = UNSAFE_getAllByType(Checkbox)[1];

        act(() => {
          firstRowCheckbox.props.onChange();
        });

        const promise = Promise.resolve();
        await act(() => promise);

        // click Reject button
        const rejectButton = getByText(/^reject$/i);
        fireEvent.press(rejectButton);

        // wait for modal
        await act(() => promise);

        const commentInput = await waitFor(() => UNSAFE_getAllByType(TextInput)[1]);

        // enter comment
        fireEvent.changeText(commentInput, 'comment');

        // click Reject button in modal
        const modalRejectButton = getAllByText(/^reject$/i)[1];
        fireEvent.press(modalRejectButton);

        await act(() => promise);

        // check args
        expect(rejectRequests).toHaveBeenCalledTimes(1);
        expect(rejectRequests).toHaveBeenCalledWith({
          processInstanceIds: ['04gO0000001AbhhIAC'],
          comment: 'comment',
        });
      });

      it('selection (all rows)', async () => {
        const { getByText, getAllByText, UNSAFE_getAllByType } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click Select all checkbox
        const selectAllCheckbox = UNSAFE_getAllByType(Checkbox)[0];

        act(() => {
          selectAllCheckbox.props.onChange();
        });

        const promise = Promise.resolve();
        await act(() => promise);

        // click Reject button
        const rejectButton = getByText(/^reject$/i);
        fireEvent.press(rejectButton);

        // wait for modal
        await act(() => promise);

        const commentInput = await waitFor(() => UNSAFE_getAllByType(TextInput)[1]);

        // enter comment
        fireEvent.changeText(commentInput, 'comment');

        // click Reject button in modal
        const modalRejectButton = getAllByText(/^reject$/i)[1];
        fireEvent.press(modalRejectButton);

        await act(() => promise);

        // check args
        expect(rejectRequests).toHaveBeenCalledTimes(1);
        expect(rejectRequests).toHaveBeenCalledWith({
          processInstanceIds: [
            '04gO0000001AbhhIAC',
            '04gO0000001AbTBIA0',
            '04gO0000001AbT6IAK',
            '04gO0000001AbSxIAK',
            '04gO0000001AbSwIAK',
          ],
          comment: 'comment',
        });
      });
    });

    describe('reassign action', () => {
      it('single record', async () => {
        const { getAllByText, UNSAFE_getAllByType, UNSAFE_getAllByProps } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click first actions icon
        const firstActionsIcon = UNSAFE_getAllByProps({ icon: 'dots-vertical' })[0];

        act(() => {
          firstActionsIcon.props.onPress();
        });

        const promise = Promise.resolve();

        // wait for actions menu
        const reassignOption = await waitFor(() => UNSAFE_getAllByType(Menu.Item)[2]);
        fireEvent.press(reassignOption);

        // wait for modal
        await act(() => promise);

        const userAutocomplete = await waitFor(() => UNSAFE_getAllByType(Autocomplete)[0]);

        // select user
        act(() => {
          userAutocomplete.props.onChange({ value: '1', label: 'test' });
        });

        // click Reassign button in modal
        const modalReassignButton = getAllByText(/^reassign$/i)[1];
        fireEvent.press(modalReassignButton);

        await act(() => promise);

        // check args
        expect(reassignRequests).toHaveBeenCalledTimes(1);
        expect(reassignRequests).toHaveBeenCalledWith({
          processInstanceIds: ['04gO0000001AbhhIAC'],
          nextApproverId: '1',
        });
      });

      it('selection (one row)', async () => {
        const { getByText, getAllByText, UNSAFE_getAllByType } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click first row checkbox
        const firstRowCheckbox = UNSAFE_getAllByType(Checkbox)[1];

        act(() => {
          firstRowCheckbox.props.onChange();
        });

        const promise = Promise.resolve();
        await act(() => promise);

        // click Reassign button
        const reassignButton = getByText(/^reassign$/i);
        fireEvent.press(reassignButton);

        // wait for modal
        await act(() => promise);

        const userAutocomplete = await waitFor(() => UNSAFE_getAllByType(Autocomplete)[0]);

        // select user
        act(() => {
          userAutocomplete.props.onChange({ value: '1', label: 'test' });
        });

        // click Reassign button in modal
        const modalReassignButton = getAllByText(/^reassign$/i)[1];
        fireEvent.press(modalReassignButton);

        await act(() => promise);

        // check args
        expect(reassignRequests).toHaveBeenCalledTimes(1);
        expect(reassignRequests).toHaveBeenCalledWith({
          processInstanceIds: ['04gO0000001AbhhIAC'],
          nextApproverId: '1',
        });
      });

      it('selection (all rows)', async () => {
        const { getByText, getAllByText, UNSAFE_getAllByType } = render(
          <Provider>
            <ApprovalRequestsTable />
          </Provider>
        );

        // click Select all checkbox
        const selectAllCheckbox = UNSAFE_getAllByType(Checkbox)[0];

        act(() => {
          selectAllCheckbox.props.onChange();
        });

        const promise = Promise.resolve();
        await act(() => promise);

        // click Reassign button
        const reassignButton = getByText(/^reassign$/i);
        fireEvent.press(reassignButton);

        // wait for modal
        await act(() => promise);

        const userAutocomplete = await waitFor(() => UNSAFE_getAllByType(Autocomplete)[0]);

        // select user
        act(() => {
          userAutocomplete.props.onChange({ value: '1', label: 'test' });
        });

        // click Reassign button in modal
        const modalReassignButton = getAllByText(/^reassign$/i)[1];
        fireEvent.press(modalReassignButton);

        await act(() => promise);

        // check args
        expect(reassignRequests).toHaveBeenCalledTimes(1);
        expect(reassignRequests).toHaveBeenCalledWith({
          processInstanceIds: [
            '04gO0000001AbhhIAC',
            '04gO0000001AbTBIA0',
            '04gO0000001AbT6IAK',
            '04gO0000001AbSxIAK',
            '04gO0000001AbSwIAK',
          ],
          nextApproverId: '1',
        });
      });
    });

    it('should call onChange', async () => {
      const { getByTestId } = render(
        <Provider>
          <ApprovalRequestsTable />
        </Provider>
      );

      // click next page icon
      const nextPageIcon = getByTestId('next-button');

      fireEvent.press(nextPageIcon, {
        nativeEvent: {},
        bubbles: true,
      });

      const promise = Promise.resolve();
      await act(() => promise);

      expect(fetchApprovalRequests).toHaveBeenLastCalledWith({
        page: 2,
        rowsPerPage: 5,
        sortColumn: 'createdDate',
        sortOrder: 'descending',
        status: 'Pending',
      });
    });
  });
  describe('(iPhone) ', () => {
    beforeEach(() => {
      commonUtils.isIphone = true;
    });

    it('should render properly', () => {
      const { getAllByText } = render(
        <Provider>
          <ApprovalRequestsTable />
        </Provider>
      );

      expect(getAllByText(/AI-00000008/i)[0]).toBeTruthy();
      expect(getAllByText(/AI-00000008/i)[1]).toBeTruthy();

      expect(getAllByText(/^Approval Inquiry$/i)[0]).toBeTruthy();
      expect(getAllByText(/OCEADMIN OCEADMIN/i)[0]).toBeTruthy;
      expect(getAllByText('8/2/2022, 1:51 AM')[0]).toBeTruthy;
    });
  });
});
