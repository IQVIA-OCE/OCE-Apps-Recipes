import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ReportActivitiesScreen } from "./ReportActivitiesScreen";
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_STATUS } from "../../constants";
import {
  mappedReports,
  testTemplates,
} from '../../utils/testData';
import { REPORT_LIMIT } from "../../store/ReconciliationReport/ReconciliationReportSlice";

jest.mock('oce-apps-bridges', () => ({
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

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => fn()),
  getParam: jest
    .fn()
    .mockImplementation(() => false),
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('../../store/ReconciliationReport/ReconciliationReportSlice', () => ({
  fetchReportData: jest.fn(),
  fetchMoreReportData: jest.fn(),
  setAccountData: jest.fn(),
  selectActivityData: jest.fn(),
}));

describe('ReportActivitiesScreen', () => {

  beforeEach( () => {
    useDispatch.mockImplementation(() => dispatch);
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
  });

  it('should render correctly', () => {
    const { getByText } = render(<ReportActivitiesScreen
      route={{params: { account: { accountName: "BRIAN", accountSpecialty: "Family medicine", limitTemplateName: "ItalyClassA", errorMessage: "The limit for rule" }}}} navigation={navigation} />);
    expect(getByText(/BRIAN/i)).toBeTruthy();
  });

  it('should navigate back ny click', () => {
    const { getByText } = render(<ReportActivitiesScreen route={{params: { account: {}}}} navigation={navigation} />);

    const backButton = getByText('Go back')
    expect(backButton).toBeTruthy();
    fireEvent.press(backButton);
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });
});
