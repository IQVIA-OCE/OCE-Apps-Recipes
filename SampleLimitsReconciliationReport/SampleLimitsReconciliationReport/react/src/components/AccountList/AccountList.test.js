import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render } from "@testing-library/react-native";
import { LOADING_STATUS } from "../../constants";
import { REPORT_LIMIT } from "../../store/ReconciliationReport/ReconciliationReportSlice";
import { mappedReports, testTemplates } from "../../utils/testData";
import { AccountList } from "./AccountList";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

const dispatch = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../store/ReconciliationReport/ReconciliationReportSlice', () => ({
  fetchReportData: jest.fn(),
  fetchMoreReportData: jest.fn(),
  setAccountData: jest.fn(),
}));

describe('AccountList', () => {
  beforeEach(() => {
    useDispatch.mockImplementation(() => dispatch);
  });

  it('should render ListEmptyComponent component', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        reconciliationReport: {
          loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
          limitErrorRecords: [],
          accountRecords: [],
          callActivityRecords: [],
          templates: [],
          params: {
            limit: REPORT_LIMIT,
            offset: 0,
            searchQuery: '',
            templateFilter: '',
            sortField: '',
            sortOrder: '',
          },
          error: null,
        },
      })
    );

    const { getByText } = render(<AccountList />);
    expect(getByText(/No data found/i)).toBeTruthy();
  });

  it('should render AccountList', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        reconciliationReport: {
          loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
          limitErrorRecords: mappedReports,
          accountRecords: mappedReports ,
          callActivityRecords: [],
          templates: testTemplates,
          params: {
            limit: REPORT_LIMIT,
            offset: 0,
            searchQuery: '',
            templateFilter: '',
            sortField: '',
            sortOrder: '',
          },
          error: null,
        },
      })
    );
    const { getByTestId } = render(<AccountList />);

    const accountList = getByTestId('reports-list');
    expect(accountList).toBeTruthy();
  });
});
