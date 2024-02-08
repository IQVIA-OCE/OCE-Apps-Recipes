import React from 'react';
import { Provider } from 'react-redux';
import * as outstandingSampleRequestsApi from '../../../api/outstandingSampleRequestsApi';
import OutstandingSampleRequestsWidget from './OutstandingSampleRequestsWidget';
import { render, waitFor } from '@testing-library/react-native';
import store from '../../../store/store';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => ''
  },
}));

describe('OutstandingSampleRequestsWidget', () => {

    const mockApiResult = [
        {
          Account__c: '001O000001keIaMIAU',
          Account__r: { AccountFullName__c: 'AARON MORITA' },
          Call__c: 'a2KO000000I6bvLMAR',
          Id: 'a6cO0000000GMMHIA4',
          Quantity__c: 0,
          Sample__r: { Id: 'a4sO00000000sXCIAY', Name: 'QA Market' },
          attributes: {
            type: 'CallSampleRequest__c',
            url: '/services/data/v50.0/sobjects/CallSampleRequest__c/a6cO0000000GMMHIA4',
          },
        },
      ]
    it('should render correctly', async () => {
        const spy = jest.spyOn(outstandingSampleRequestsApi, 'fetchOutstandingSampleRequests');

        spy.mockResolvedValue([mockApiResult]);

        const { getByTestId } = render(
        <Provider store={store}>
            <OutstandingSampleRequestsWidget />
        </Provider>
        );

        const widget = await waitFor(() => getByTestId('OutstandingSR_widget'));

        expect(widget).toBeTruthy();
    });
});
