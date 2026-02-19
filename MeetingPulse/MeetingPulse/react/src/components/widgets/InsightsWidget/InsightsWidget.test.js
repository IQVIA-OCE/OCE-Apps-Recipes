import * as insightsApi from '../../../api/insightsApi';
import * as commonApi from '../../../api/commonApi';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import React from 'react';
import { InsightsWidget } from './InsightsWidget';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

const INSIGHTS_LIST_MOCK = [
  {
    id: 'a3JO0000000BRbdMAG',
    insightAccountName: '_Southern Baptist Hospital of Florida, Inc',
    name: 'test insight',
    parentInsightId: 'a3JO0000000BRbiMAG',
    text: 'lorem ipsum',
  },
];

describe('InsightsWidget', () => {
  it('should list render correctly', async () => {
    jest.spyOn(commonApi, 'fetchAllAccounts').mockResolvedValue([[{ Id: '1' }]]);
    jest.spyOn(insightsApi, 'fetchInsights').mockResolvedValue([INSIGHTS_LIST_MOCK]);

    const { findByTestId } = render(
      <Provider store={store}>
        <InsightsWidget />
      </Provider>
    );

    expect(await findByTestId('insights-list')).toBeTruthy();
  });

  it('should render not found text if there are no records', async () => {
    jest.spyOn(commonApi, 'fetchAllAccounts').mockResolvedValue([[{ Id: '1' }]]);
    jest.spyOn(insightsApi, 'fetchInsights').mockResolvedValue([[]]);

    const { findByTestId } = render(
      <Provider store={store}>
        <InsightsWidget />
      </Provider>
    );

    expect(await findByTestId('insights-not-found')).toBeTruthy();
  });

  it('should render error text', async () => {
    jest.spyOn(commonApi, 'fetchAllAccounts').mockResolvedValue([[{ Id: '1' }]]);
    jest.spyOn(insightsApi, 'fetchInsights').mockRejectedValue(new Error('An error for testing'));

    const { findByTestId } = render(
      <Provider store={store}>
        <InsightsWidget />
      </Provider>
    );

    expect(await findByTestId('insights-error')).toBeTruthy();
  });
});
