import React from 'react';
import RN from 'react-native';
import { App } from './App';
import { render } from '@testing-library/react-native';
import * as approvalRequestsApi from './src/api/approvalRequestsApi';
import { OBJECT_METADATA_MOCK } from './__mocks__/metadataMocks';
import { APPROVAL_REQUESTS_MOCK } from './__mocks__/approvalRequestsMocks';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn(),
    describeGlobal: jest.fn(),
  },
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => '',
    userID: () => '',
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
}));

jest.mock('./src/api/approvalRequestsApi', () => ({
  fetchApprovalRequests: jest.fn(),
  fetchApprovalRequestsCount: jest.fn(),
  processApprovals: jest.fn(),
  reassignApprovals: jest.fn(),
  fetchProcessInstanceWorkItems: jest.fn(),
  fetchObjectMetadata: jest.fn(),
  fetchAllUsers: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    approvalRequestsApi.fetchObjectMetadata.mockResolvedValueOnce(OBJECT_METADATA_MOCK);
    approvalRequestsApi.fetchAllUsers.mockResolvedValueOnce([[{ Id: '1', Name: 'test' }]]);
    approvalRequestsApi.fetchApprovalRequests.mockResolvedValueOnce([APPROVAL_REQUESTS_MOCK]);
    approvalRequestsApi.fetchApprovalRequestsCount.mockResolvedValueOnce([6]);
  });

  it('should render properly', async () => {
    const { findByText } = render(<App />);

    const title = await findByText(/Approval Requests/i);

    expect(title).toBeTruthy();
  });

  it('should render properly in dark mode', async () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');

    const { findByText } = render(<App />);

    const title = await findByText(/Approval Requests/i);

    expect(title).toBeTruthy();
  });
});
