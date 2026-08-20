import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ButtonGroup, MenuButton, Select, Title } from '@oce-apps/apollo-react-native';
import { useDispatch } from 'react-redux';
import { fetchApprovalRequests } from '../../../store/approvalRequests/approvalRequestsSlice';
import { isMobilePhone } from '../../../utils';
import { APPROVAL_REQUEST_STATUS } from '../../../constants';

const STATUS_SELECT_OPTIONS = [
  {
    value: APPROVAL_REQUEST_STATUS.PENDING,
    label: 'Items to Approve',
  },
  {
    value: APPROVAL_REQUEST_STATUS.APPROVED,
    label: 'Approved Submitted Requests',
  },
  {
    value: APPROVAL_REQUEST_STATUS.REJECTED,
    label: 'Rejected Submitted Requests',
  },
];

export const ApprovalRequestsHeader = ({ params, isActionDisabled, onApprove, onReject, onReassign }) => {
  const dispatch = useDispatch();
  const { rowsPerPage, sortOrder, sortColumn, status } = params;

  const handleStatusChange = ({ value }) => {
    dispatch(
      fetchApprovalRequests({
        page: 1,
        rowsPerPage,
        sortOrder,
        sortColumn,
        status: value,
      })
    );
  };

  const value = STATUS_SELECT_OPTIONS.find(o => o.value === status);

  const isStatusPending = status === APPROVAL_REQUEST_STATUS.PENDING;
  const actionsWrapperStyle = isMobilePhone ? {} : { flexDirection: 'row', justifyContent: 'space-between' };

  return (
    <View style={styles.root}>
      <Title style={{ marginBottom: 12 }}>Approval Requests</Title>
      <View style={actionsWrapperStyle}>
        <View testID="status-select">
          <Select
            options={STATUS_SELECT_OPTIONS}
            value={value}
            onChange={handleStatusChange}
            canDeselect={false}
            hideDropdownPlaceholder={true}
            style={{ width: isMobilePhone ? '100%' : 340, marginBottom: isMobilePhone ? 20 : 0 }}
          />
        </View>
        {isMobilePhone && isStatusPending && (
          <View testID="phone-actions">
            <MenuButton
              buttonText="Actions"
              size="small"
              menuItems={[
                {
                  text: 'Approve',
                  onPress: onApprove,
                },
                {
                  text: 'Reject',
                  onPress: onReject,
                },
                {
                  text: 'Reassign',
                  onPress: onReassign,
                },
              ]}
              disabled={isActionDisabled}
            />
          </View>
        )}
        {!isMobilePhone && isStatusPending && (
          <View testID="tablet-actions">
            <ButtonGroup
              buttonProps={[
                {
                  label: 'Approve',
                  mode: 'outlined',
                  onPress: onApprove,
                  disabled: isActionDisabled,
                },
                {
                  label: 'Reject',
                  mode: 'outlined',
                  onPress: onReject,
                  disabled: isActionDisabled,
                },
                {
                  label: 'Reassign',
                  mode: 'outlined',
                  onPress: onReassign,
                  disabled: isActionDisabled,
                },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 8,
    flex: 1,
  },
});
