import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ReceivedSamplesWidget from './ReceivedSamplesWidget';
import { environment } from 'oce-apps-bridges';
import {
  fetchReceivedSamplesData,
  fetchReceivedSamplesListId
} from '../../../api/ReceivedSamples';
import { mapReceivedSamples } from './utils';
import moment from 'moment';

jest.mock('moment', () => () => ({format: () => 'May 3, 2020 06:19 pm'}));
jest.mock('./utils');
jest.mock('../../../api/ReceivedSamples');

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => fn()),
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
    fetchReceivedSamplesListId.mockReturnValue([
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
  });
  it('Should render ReceivedSamplesWidget component', async () => {
    let tree;
    const promise = Promise.resolve();
    act(() => {
      tree = renderer.create(<ReceivedSamplesWidget navigation={navigation} />);
    });
    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
