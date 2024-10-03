import { useDispatch } from 'react-redux';
import {
  approveRequests,
  reassignRequests,
  rejectRequests,
} from '../../../store/approvalRequests/approvalRequestsSlice';

export const useApprovalRequestActions = ({ selectedRecord, selectedRows }) => {
  const dispatch = useDispatch();

  const doApprove = comment => {
    let processInstanceIds;

    if (selectedRecord) {
      processInstanceIds = [selectedRecord.id];
    } else {
      processInstanceIds = [...selectedRows];
    }

    return dispatch(
      approveRequests({
        processInstanceIds,
        comment,
      })
    ).unwrap();
  };

  const doReject = comment => {
    let processInstanceIds;

    if (selectedRecord) {
      processInstanceIds = [selectedRecord.id];
    } else {
      processInstanceIds = [...selectedRows];
    }

    return dispatch(
      rejectRequests({
        processInstanceIds,
        comment,
      })
    ).unwrap();
  };

  const doReassign = nextApproverId => {
    let processInstanceIds;

    if (selectedRecord) {
      processInstanceIds = [selectedRecord.id];
    } else {
      processInstanceIds = [...selectedRows];
    }

    return dispatch(
      reassignRequests({
        processInstanceIds,
        nextApproverId,
      })
    ).unwrap();
  };

  return {
    doApprove,
    doReject,
    doReassign,
  };
};
