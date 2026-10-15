import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_STATUS } from "../../constants";
import { REPORT_LIMIT } from "../../store/ReconciliationReport/ReconciliationReportSlice";
import { ReportAccountsScreen } from "./ReportAccountsScreen";
import { mappedReports, testTemplates } from '../../utils/testData';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../api/reportApi');

jest.mock('../../store/ReconciliationReport/ReconciliationReportSlice', () => ({
  bootstrap: jest.fn(),
  fetchReportData: jest.fn(),
  setAccountData: jest.fn(),
}));

jest.mock('../../utils/dateTimeFormat', () => ({
  formatDate: (date) => date,
}));

const dispatch = jest.fn();

describe('ReportAccountsScreen', () => {
  beforeEach(() => {
    useDispatch.mockImplementation(() => dispatch);
    useSelector.mockImplementation((cb) =>
      cb({
        reconciliationReport: {
          loadingStatus: LOADING_STATUS.PENDING,
          limitErrorRecords: mappedReports,
          accountRecords: mappedReports,
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
  });

  it('should render empty ReportAccountsScreen component', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        reconciliationReport: {
          loadingStatus: LOADING_STATUS.PENDING,
          limitErrorRecords: [],
          accountRecords: [] ,
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

    const { getByText } = render(<ReportAccountsScreen />);
    expect(getByText(/No data found/i)).toBeTruthy();
  });
});

