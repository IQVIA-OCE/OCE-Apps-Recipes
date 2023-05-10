import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ApolloProgress, Checkbox, Portal, Table, useTheme } from 'apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';

import { loadingStatusSelector } from '../../store/approvalRequests/approvalRequestsSelectors';
import { bootstrap, fetchApprovalRequests } from '../../store/approvalRequests/approvalRequestsSlice';
import { APPROVAL_REQUEST_STATUS, LOADING_STATUS, SORT_ORDER } from '../../constants';
import { ApprovalRequestsHeader } from './ApprovalRequestsHeader/ApprovalRequestsHeader';
import { ApproveRequestModal } from '../ApproveRequestModal/ApproveRequestModal';
import { RejectRequestModal } from '../RejectRequestModal/RejectRequestModal';
import { ReassignRequestModal } from '../ReassignRequestModal/ReassignRequestModal';
import { isIphone, isWeb } from '../../utils';
import { actionsColumn, CheckboxCell, columnsIpad, columnsIphone, DetailRow, expandColumn } from './columns';
import { useApprovalRequestActions } from './hooks/useApprovalRequestActions';
import { useApprovalRequestsList } from './hooks/useApprovalRequestsList';

const IGNORED_SORT_COLUMNS = ['expand', 'comment', 'action', ''];
const DEFAULT_SORT_COLUMN = 'createdDate';

export const ApprovalRequestsTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loadingStatus = useSelector(loadingStatusSelector);
  const { approvalRequests, totalCount, params } = useApprovalRequestsList();
  const { page, rowsPerPage, sortColumn, sortOrder, status } = params;

  const [selectedRecord, setSelectedRecord] = useState(null); // single
  const [selectedRows, setSelectedRows] = useState([]); // multiple

  const currentApprovalRequestsIds = approvalRequests.map(x => x.id);
  const currentSelectedRows = selectedRows.filter(sr => currentApprovalRequestsIds.includes(sr));

  const { doApprove, doReject, doReassign } = useApprovalRequestActions({
    selectedRecord,
    selectedRows: currentSelectedRows,
  });
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  const [expandedRows, setExpandedRows] = useState([]);

  const handleToggleRow = id => {
    setExpandedRows(expandedRows =>
      expandedRows.includes(id) ? expandedRows.filter(expandedRowId => expandedRowId !== id) : [...expandedRows, id]
    );
  };

  const isBootstrapping = loadingStatus === LOADING_STATUS.BOOTSTRAPPING;
  const isLoading = loadingStatus === LOADING_STATUS.PENDING;
  const isStatusPending = status === APPROVAL_REQUEST_STATUS.PENDING;

  useEffect(() => {
    dispatch(bootstrap());
  }, []);

  useEffect(() => {
    if (!isBootstrapping) handleFetch(1, rowsPerPage, DEFAULT_SORT_COLUMN, SORT_ORDER.DESCENDING, status);
  }, [isBootstrapping]);

  const handleFetch = (page = 1, rowsPerPage, sortColumn, sortOrder, status) => {
    dispatch(
      fetchApprovalRequests({
        page,
        rowsPerPage,
        sortColumn,
        sortOrder,
        status,
      })
    );
  };

  const handleSelectRow = id => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const getCheckAllStatus = () => {
    if (approvalRequests.length > 0 && currentApprovalRequestsIds.every(id => selectedRows.includes(id)))
      return 'checked';
    if (selectedRows.length > 0 && currentApprovalRequestsIds.some(id => selectedRows.includes(id)))
      return 'indeterminate';

    return 'unchecked';
  };

  const handleToggleSelectAllRows = () => {
    if (!currentApprovalRequestsIds.every(id => selectedRows.includes(id))) {
      setSelectedRows(sr => [...sr, ...currentApprovalRequestsIds]);
    } else {
      setSelectedRows(sr => sr.filter(x => !currentApprovalRequestsIds.includes(x)));
    }
  };

  const selectionColumn = {
    header: (
      <View
        style={[isWeb && { position: 'absolute', top: 6 }]}
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
      >
        <Checkbox onChange={handleToggleSelectAllRows} status={getCheckAllStatus()} />
      </View>
    ),
    accessor: '',
    customCell: CheckboxCell,
  };

  const columns = [
    expandColumn,
    isStatusPending && selectionColumn,
    ...(isIphone ? columnsIphone : columnsIpad),
    isStatusPending && actionsColumn,
  ].filter(Boolean);

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleReassign = () => {
    setIsReassignModalOpen(true);
  };

  const getColumnWidth = () => {
    const EXPAND_COLUMN_WIDTH = 45;
    const CHECKBOX_COLUMN_WIDTH = 50;
    const ACTIONS_COLUMN_WIDTH = 50;

    if (isIphone) {
      if (isStatusPending) {
        return [EXPAND_COLUMN_WIDTH, CHECKBOX_COLUMN_WIDTH, 'auto', ACTIONS_COLUMN_WIDTH];
      }

      return [EXPAND_COLUMN_WIDTH, 'auto', ACTIONS_COLUMN_WIDTH];
    }

    if (isStatusPending) {
      return [EXPAND_COLUMN_WIDTH, CHECKBOX_COLUMN_WIDTH, 250, 'auto', 'auto', 'auto', 'auto', ACTIONS_COLUMN_WIDTH];
    }

    return [EXPAND_COLUMN_WIDTH, 250, 'auto', 'auto', 'auto', 'auto', ACTIONS_COLUMN_WIDTH];
  };

  if (isBootstrapping) {
    return (
      <View style={[styles.bigLoaderWrap, { backgroundColor: theme.colors.surface }]} testID="loader-wrap">
        <ApolloProgress />
      </View>
    );
  }

  const getApproveModalTitle = () => {
    if (selectedRecord) {
      return `Approve ${selectedRecord?.label} - ${selectedRecord?.name}`;
    }

    if (currentSelectedRows.length === 1) {
      const selectedRequest = approvalRequests.find(x => x.id === currentSelectedRows[0]);

      return `Approve ${selectedRequest?.label} - ${selectedRequest?.name}`;
    }

    return `Approve ${currentSelectedRows.length} Approval Requests`;
  };
  const getRejectModalTitle = () => {
    if (selectedRecord) {
      return `Reject ${selectedRecord?.label} - ${selectedRecord?.name}`;
    }

    if (currentSelectedRows.length === 1) {
      const selectedRequest = approvalRequests.find(x => x.id === currentSelectedRows[0]);

      return `Reject ${selectedRequest?.label} - ${selectedRequest?.name}`;
    }

    return `Reject ${currentSelectedRows.length} Approval Requests`;
  };
  const getReassignModalTitle = () => {
    if (selectedRecord || currentSelectedRows.length === 1) {
      return 'Reassign Approval Request';
    }

    return `Reassign ${currentSelectedRows.length} Approval Requests`;
  };

  const isActionEnabled = selectedRows.length > 0 && currentApprovalRequestsIds.some(id => selectedRows.includes(id));

  return (
    <ScrollView>
      <Table
        columns={columns}
        rows={approvalRequests.map(row => ({
          ...row,
          selectedRows,
          handleSelectRow,
          handleToggleRow,
          expanded: expandedRows.includes(row.id),
          onApprove: () => {
            setSelectedRecord(row);
            handleApprove();
          },
          onReject: () => {
            setSelectedRecord(row);
            handleReject();
          },
          onReassign: () => {
            setSelectedRecord(row);
            handleReassign();
          },
        }))}
        size={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        sortedColumn={sortColumn || DEFAULT_SORT_COLUMN}
        sortOrder={sortOrder}
        rowsPerPageOptions={[5, 10, 15]}
        isLoading={isLoading}
        onChange={(page, rowsPerPage, sortColumn, sortOrder) => {
          if (IGNORED_SORT_COLUMNS.includes(sortColumn)) return;

          handleFetch(page, rowsPerPage, sortColumn, sortOrder, status);
        }}
        stripedRows
        inlinePagination
        CustomHeader={() => (
          <ApprovalRequestsHeader
            params={params}
            isActionDisabled={!isActionEnabled}
            onApprove={handleApprove}
            onReject={handleReject}
            onReassign={handleReassign}
          />
        )}
        columnWidth={getColumnWidth()}
        phoneProps={{ columnsNumber: 4 }}
        ExpandableComponent={props => <DetailRow {...props} />}
        nextButtonProps={{ testID: 'next-button' }}
      />
      <Portal>
        <ApproveRequestModal
          isOpen={isApproveModalOpen}
          title={getApproveModalTitle()}
          onApprove={doApprove}
          onSuccess={() => {
            setSelectedRows([]);
          }}
          onClose={() => {
            setSelectedRecord(null);
            setIsApproveModalOpen(false);
          }}
        />
        <RejectRequestModal
          isOpen={isRejectModalOpen}
          title={getRejectModalTitle()}
          onReject={doReject}
          onSuccess={() => {
            setSelectedRows([]);
          }}
          onClose={() => {
            setSelectedRecord(null);
            setIsRejectModalOpen(false);
          }}
        />
        <ReassignRequestModal
          isOpen={isReassignModalOpen}
          title={getReassignModalTitle()}
          onReassign={doReassign}
          onSuccess={() => {
            setSelectedRows([]);
          }}
          onClose={() => {
            setSelectedRecord(null);
            setIsReassignModalOpen(false);
          }}
        />
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bigLoaderWrap: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
