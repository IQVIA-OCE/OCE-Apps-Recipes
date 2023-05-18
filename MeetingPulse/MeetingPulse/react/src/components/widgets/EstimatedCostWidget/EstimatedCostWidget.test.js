import * as meetingApi from '../../../api/meetingApi';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import React from 'react';
import EstimatedCostWidget from './EstimatedCostWidget';
import { NAMESPACE } from '../../../constants/namespacePrefix';
import { fetchMeeting } from '../../../store/meetingSlice/meetingSlice';

describe('EstimatedCostWidget', () => {
  it('should render correctly', async () => {
    const spy = jest.spyOn(meetingApi, 'fetchMeeting');

    spy.mockResolvedValue({
      [`${NAMESPACE}EstimatedBudget__c`]: 1000,
      CurrencyIsoCode: 'USD'
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <EstimatedCostWidget />
      </Provider>
    );

    const widget = await waitFor(() => getByTestId('EstimatedCost_widget'));

    expect(widget).toBeTruthy();
  });
});
