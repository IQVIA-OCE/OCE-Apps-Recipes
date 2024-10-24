import { environment, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { APPROVAL_REQUEST_STATUS, SORT_ORDER_TO_SOQL_VALUES_MAP } from '../constants';
import { UI_TO_SOQL_FIELD_NAMES_MAP } from '../store/approvalRequests/utils/mappers';

const workItemsCondition = `AND Id in (SELECT ProcessInstanceId from ProcessInstanceWorkItem WHERE ActorId = '${environment.userID()}')`;

export const fetchApprovalRequests = ({ page, rowsPerPage, sortColumn, sortOrder, status }) => {
  const offset = (page - 1) * rowsPerPage;
  const _sortColumn = UI_TO_SOQL_FIELD_NAMES_MAP[sortColumn];
  const _sortOrder = SORT_ORDER_TO_SOQL_VALUES_MAP[sortOrder];
  const query = `SELECT Id, TargetObjectId, TargetObject.Name, TargetObject.Type,\
    SubmittedBy.Name, Status, CreatedDate,\
    (SELECT Comments FROM Steps ORDER BY CreatedDate DESC LIMIT 1)\
    FROM ProcessInstance WHERE Status = '${status}' ${
    status === APPROVAL_REQUEST_STATUS.PENDING ? workItemsCondition : ''
  }\
    ORDER BY ${_sortColumn} ${_sortOrder}\
    LIMIT ${rowsPerPage} OFFSET ${offset}`;

  return sfNetAPI.query(query).then(data => {
    const { records, ...metadata } = data;
    return [records, metadata];
  });
};

export const fetchApprovalRequestsCount = status => {
  const query = `SELECT COUNT() FROM ProcessInstance WHERE Status = '${status}'\
  ${status === APPROVAL_REQUEST_STATUS.PENDING ? workItemsCondition : ''}`;

  return sfNetAPI.query(query).then(({ totalSize }) => {
    return [totalSize];
  });
};

export const fetchAllUsers = () =>
  sfNetAPI.query('SELECT ID, Name from USER ORDER BY Name').then(data => [data.records]);

export const processApprovals = requests => {
  return sfNetAPI.restRequest('process/approvals/', 'POST', {
    requests,
  });
};

export const reassignApprovals = requests => {
  return sfNetAPI.restRequest('composite/sobjects/', 'PATCH', {
    allOrNone: false,
    records: requests,
  });
};

export const fetchProcessInstanceWorkItems = processInstanceIds => {
  const idsString = processInstanceIds.map(x => `'${x}'`).join(', ');
  const query = `SELECT Id FROM ProcessInstanceWorkItem WHERE ActorId = '${environment.userID()}' AND ProcessInstanceId IN (${idsString})`;

  return sfNetAPI.query(query).then(data => {
    const { records, ...metadata } = data;
    return [records, metadata];
  });
};

export const fetchObjectMetadata = () => sfNetAPI.describeGlobal();
