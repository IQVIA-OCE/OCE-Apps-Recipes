import React from 'react';
import Timeline from './Timeline';
import { render } from '@testing-library/react-native';

const items = [
  {
    id: 'a4o9D0000000JiGQAU',
    conditionOfPackage: 'Opened',
    fromSalesRepId: null,
    fromSalesRepName: null,
    lastModifiedDate: '2020-03-12T13:12:56.000+0000',
    receivedDate: '2020-03-12',
    recordTypeName: 'Acknowledgment of Shipment',
    recordTypeDevName: 'AcknowledgementOfShipment',
    shipmentDate: null,
    status: 'In Progress',
    toSalesRepId: null,
    toSalesRepName: null,
    transactionDateTime: '2020-03-12T13:12:45.000+0000',
    transactionRepId: '0056F00000A4qesQAB',
    transactionRepName: 'Oce Admin',
    accountId: null,
    accountName: null,
    address: null,
    detailsCount: 2,
  },
  {
    id: 'a4o9D0000000JiLQAU',
    conditionOfPackage: 'Damaged',
    fromSalesRepId: null,
    fromSalesRepName: null,
    lastModifiedDate: '2020-03-12T09:58:50.000+0000',
    receivedDate: '2020-03-12',
    recordTypeName: 'Acknowledgment of Shipment',
    recordTypeDevName: 'AcknowledgementOfShipment',
    shipmentDate: null,
    status: 'In Progress',
    toSalesRepId: null,
    toSalesRepName: null,
    transactionDateTime: '2020-03-12T09:52:10.000+0000',
    transactionRepId: '0050k0000033QlrAAE',
    transactionRepName: 'Oce Admin plat',
    accountId: null,
    accountName: null,
    address: null,
    detailsCount: 1,
  },
  {
    id: 'a4o9D0000000JiBQAU',
    conditionOfPackage: 'Damaged',
    fromSalesRepId: null,
    fromSalesRepName: null,
    lastModifiedDate: '2020-03-12T09:13:59.000+0000',
    receivedDate: '2020-03-12',
    recordTypeName: 'Acknowledgement of Shipment',
    recordTypeDevName: 'AcknowledgementOfShipment',
    shipmentDate: null,
    status: 'Submitted',
    toSalesRepId: null,
    toSalesRepName: null,
    transactionDateTime: '2020-03-12T09:13:35.000+0000',
    transactionRepId: '0050k0000033QlrAAE',
    transactionRepName: 'Oce Admin plat',
    accountId: null,
    accountName: null,
    address: null,
    detailsCount: 1,
  },
];

jest.mock('moment', () => () => ({ format: () => 'May 3, 2020 06:19 pm', fromNow: () => '2 months ago' }));

describe('Timeline', () => {
  it('Should render Timeline component', () => {
    const { getByText } = render(<Timeline items={items} />);

    expect(getByText(/Opened/)).toBeTruthy();
  });
});
