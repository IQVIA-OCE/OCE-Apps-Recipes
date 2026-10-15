import { useSelector } from 'react-redux';
import {
  approvalRequestsListSelector,
  approvalRequestsParamsSelector,
  approvalRequestsTotalCountSelector,
} from '../../../store/approvalRequests/approvalRequestsSelectors';

export const useApprovalRequestsList = () => {
  const params = useSelector(approvalRequestsParamsSelector);
  const approvalRequests = useSelector(approvalRequestsListSelector);
  const totalCount = useSelector(approvalRequestsTotalCountSelector);

  return {
    params,
    approvalRequests,
    totalCount,
  };
};
