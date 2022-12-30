import React from 'react';
import ReceivedSamplesWidget from './ReceivedSamplesWidget';
import { environment } from 'oce-apps-bridges';
import {
  fetchReceivedSamplesData,
  fetchReceivedSamplesListId
} from '../../../api/ReceivedSamples';
import { render, waitFor } from '@testing-library/react-native';
import moment from 'moment';

jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm', fromNow: () => 'May 3, 2020 06:19 pm'}));
jest.mock('./utils');
jest.mock('../../../api/ReceivedSamples');

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => ({ remove: jest.fn() })),
};

describe('ReceivedSamplesWidget', () => {
  beforeEach(() => {
    environment.userID = jest.fn().mockReturnValue('1');
    fetchReceivedSamplesData.mockReturnValue([
      {
        accountId: '1',
        accountName: 'name',
        address: null,
        conditionOfPackage: 'Undamaged',
        detailsCount: 1,
        fromSalesRepId: '0056F00000A4qfMQAR',
        fromSalesRepName: 'Name',
        id: 'a510w000000CgZQAA0',
        lastModifiedDate: '2020-05-20T11:55:45.0000000',
        receivedDate: '2020-05-20',
        recordTypeDevName: 'AcknowledgementOfShipment',
        recordTypeId: undefined,
        recordTypeName: 'Name',
        shipmentDate: null,
        status: 'In Progress',
        toSalesRepId: '0056F00000B45ezQAB',
        toSalesRepName: 'Name',
        transactionDateTime: '2020-05-20T10:45:12.0000000',
        transactionRepId: null,
        transactionRepName: 'Name',
      },
    ]);
    fetchReceivedSamplesListId.mockReturnValue([[
      {
        detailsCount: 1,
        Id: '1',
        isUrgent: 'urgent',
        lastModifiedDate: undefined,
        recordTypeDevName: 'Order',
        recordTypeName: 'Order',
        status: 'status',
      },
    ]]);
  });

  it('Should render ReceivedSamplesWidget component', async () => {
    const { queryAllByText } = render(<ReceivedSamplesWidget navigation={navigation} />)

    await waitFor(() => {
      expect(queryAllByText(/Undamaged/)).toBeTruthy();
      expect(queryAllByText(/May 3, 2020 06:19 pm/)).toBeTruthy();
    })
  });
});
