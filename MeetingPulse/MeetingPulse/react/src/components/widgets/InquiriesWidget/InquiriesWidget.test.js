import * as inquiriesApi from '../../../api/inquiriesApi';
import * as commonApi from '../../../api/commonApi';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import React from 'react';
import { InquiriesWidget } from './InquiriesWidget';
import { INQUIRIES_MOCK } from '../../../../__mocks__/inquiriesMocks';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

describe('InsightsWidget', () => {
  it('should list render correctly', async () => {
    jest.spyOn(commonApi, 'fetchAllAccounts').mockResolvedValue([[{ Id: '1' }]]);
    jest.spyOn(inquiriesApi, 'fetchInquiryQuestions').mockResolvedValue([INQUIRIES_MOCK]);

    const { findByTestId } = render(
      <Provider store={store}>
        <InquiriesWidget />
      </Provider>
    );

    expect(await findByTestId('inquiries-list')).toBeTruthy();
  });

  it('should render not found text if there are no records', async () => {
    jest.spyOn(commonApi, 'fetchAllAccounts').mockResolvedValue([[{ Id: '1' }]]);
    jest.spyOn(inquiriesApi, 'fetchInquiryQuestions').mockResolvedValue([[]]);

    const { findByTestId } = render(
      <Provider store={store}>
        <InquiriesWidget />
      </Provider>
    );

    expect(await findByTestId('inquiries-not-found')).toBeTruthy();
  });

  it('should render error text', async () => {
    jest.spyOn(commonApi, 'fetchAllAccounts').mockResolvedValue([[{ Id: '1' }]]);
    jest.spyOn(inquiriesApi, 'fetchInquiryQuestions').mockRejectedValue(new Error('An error for testing'));

    const { findByTestId } = render(
      <Provider store={store}>
        <InquiriesWidget />
      </Provider>
    );

    expect(await findByTestId('inquiries-error')).toBeTruthy();
  });
});
