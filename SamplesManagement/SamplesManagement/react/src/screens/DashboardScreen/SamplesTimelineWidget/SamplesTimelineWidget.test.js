import React from 'react';
import SamplesTimelineWidget from './SamplesTimelineWidget';
import { environment } from 'oce-apps-bridges';
import {
  fetchOrdersData,
  fetchTransactionsData,
} from '../../../api/SamplesTimeline';
import { mapOrders, mapTransactions } from './utils';
import moment from 'moment';
import { render } from '@testing-library/react-native';

jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm'}));
jest.mock('./utils');
jest.mock('../../../api/SamplesTimeline');

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => ({ remove: jest.fn() })),
};

describe('SamplesTimelineWidget', () => {
  beforeEach(() => {
    environment.userID = jest.fn().mockReturnValue('1');
    fetchTransactionsData.mockReturnValue([
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
        recordTypeDevName: 'DeveloperName',
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
    fetchOrdersData.mockReturnValue([
      {
        detailsCount: 1,
        id: '1',
        isUrgent: 'urgent',
        lastModifiedDate: undefined,
        recordTypeDevName: 'Order',
        recordTypeName: 'Order',
        status: 'status',
      },
    ]);
    mapTransactions.mockImplementation(d => d);
    mapOrders.mockImplementation(d => d);
  });

  it('Should render SamplesTimelineWidget component', async () => {
    const { getByText } = render(
      <SamplesTimelineWidget navigation={navigation} />
    );

    expect(getByText(/Samples Timeline/));
  });
});
