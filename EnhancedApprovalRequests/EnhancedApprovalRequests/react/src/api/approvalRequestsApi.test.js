import {
  fetchAllUsers,
  fetchApprovalRequests,
  fetchApprovalRequestsCount, fetchObjectMetadata, fetchProcessInstanceWorkItems,
  processApprovals, reassignApprovals,
} from './approvalRequestsApi';
import { sfNetAPI } from 'oce-apps-bridges';
import { APPROVAL_REQUEST_STATUS } from '../constants';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    userID: () => '',
  },
  sfNetAPI: {
    query: jest.fn(),
    restRequest: jest.fn(),
    describeGlobal: jest.fn(),
  },
}));

describe('approvalRequestsApi', () => {
  beforeEach(() => {
    sfNetAPI.query.mockResolvedValue({
      records: [],
      totalSize: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchApprovalRequests', () => {
    it('with status Pending', async () => {
      await fetchApprovalRequests({
        page: 1,
        rowsPerPage: 5,
        sortColumn: 'CreatedDate',
        sortOrder: 'ASC',
        status: APPROVAL_REQUEST_STATUS.PENDING,
      });

      expect(sfNetAPI.query).toHaveBeenCalled();
    });

    it('with status not Pending', async () => {
      await fetchApprovalRequests({
        page: 1,
        rowsPerPage: 5,
        sortColumn: 'CreatedDate',
        sortOrder: 'ASC',
        status: APPROVAL_REQUEST_STATUS.APPROVED,
      });

      expect(sfNetAPI.query).toHaveBeenCalled();
    });
  })

  describe('fetchApprovalRequestsCount', () => {
    it('with status Pending', async () => {
      await fetchApprovalRequestsCount(APPROVAL_REQUEST_STATUS.PENDING);

      expect(sfNetAPI.query).toHaveBeenCalled();
    });

    it('with status not Pending', async () => {
      await fetchApprovalRequestsCount(APPROVAL_REQUEST_STATUS.APPROVED);

      expect(sfNetAPI.query).toHaveBeenCalled();
    });
  })

  it('fetchAllUsers', async () => {
    await fetchAllUsers();

    expect(sfNetAPI.query).toHaveBeenCalled();
  });

  it('processApprovals', async () => {
    await processApprovals([]);

    expect(sfNetAPI.restRequest).toHaveBeenCalled();
  })

  it('reassignApprovals', async () => {
    await reassignApprovals([]);

    expect(sfNetAPI.restRequest).toHaveBeenCalled();
  })

  it('fetchProcessInstanceWorkItems', async () => {
    await fetchProcessInstanceWorkItems(['1']);

    expect(sfNetAPI.query).toHaveBeenCalled();
  })

  it('fetchObjectMetadata', async () => {
    await fetchObjectMetadata();

    expect(sfNetAPI.describeGlobal).toHaveBeenCalled();
  })
});
