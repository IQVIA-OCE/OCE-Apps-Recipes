import {
  normalizeProductsHistoryList,
  normalizeProductsList,
} from './utils';
import moment from 'moment';

jest.mock('moment', () => {
  const m = {
    utc: () => m,
    format: (v) => v
  }

  return m
});

describe('utils', () => {

  it('normalizeProductsList: should return normalized products', () => {
    let normalized = normalizeProductsList(
      [
        {
          Name: '6586-3',
          Id: 'a3P0T00000007rwUAA',
          OCE__Product__r: {
            Name: 'ADRAVIL TAB 10 MG Physical',
          },
          OCE__Product__c: 'a4h0T0000004XVtQAM',
          OCE__IsActive__c: true,
        },
        {
          Name: '6586-4',
          Id: 'b3P0T00000007rwUAb',
          OCE__Product__r: {
            Name: 'ADRAVIL TAB 20 MG Physical',
          },
          OCE__Product__c: 'a4h0T0000004XVtQAM',
          OCE__IsActive__c: true,
        },
      ],
      [],
      [
        {
          OCE__IsDiscrepancy__c: true,
          IsDeleted: false,
          Name: 'ID-00000078',
          OCE__PhysicalCount__c: 10,
          OCE__Product__c: 'a4h0T0000004Xa3QAE',
          CreatedDate: '2020-09-25T07:49:22.000+0000',
          OCE__Lot__r: {
            Name: 'B-001-1-1',
          },
          OCE__SystemCount__c: 21,
          Id: 'a510T0000000TpVQAU',
          OCE__Product__r: {
            Name: 'Azelastine 100 MG',
          },
          OCE__SampleInventory__c: 'a520T00000006Q0QAI',
          OCE__Lot__c: 'a3P0T00000007rwUAA',
          OCE__Status__c: 'Submitted',
        },
      ],
      [
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'TransferIn',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'a3P0T00000007rwUAA',
          OCE__Quantity__c: 5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'TransferOut',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'a3P0T00000007rwUAA',
          OCE__Quantity__c: 5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'Adjustment',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: 5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'Adjustment',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: -5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'AcknowledgementOfShipment',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: 0,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'Return',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: 0,
        },
      ]
    );

    expect(normalized).toStrictEqual([
      [
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: undefined,
          lotNumberId: 'a3P0T00000007rwUAA',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-3',
          lotNumber: '6586-3',
          label: 'ADRAVIL TAB 10 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: '10',
          id: 'a510T0000000TpVQAU',
        },
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: '',
          lotNumberId: 'b3P0T00000007rwUAb',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-4',
          lotNumber: '6586-4',
          label: 'ADRAVIL TAB 20 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: null,
        },
      ],
      [
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: undefined,
          lotNumberId: 'a3P0T00000007rwUAA',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-3',
          lotNumber: '6586-3',
          label: 'ADRAVIL TAB 10 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: '10',
          id: 'a510T0000000TpVQAU',
        },
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: '',
          lotNumberId: 'b3P0T00000007rwUAb',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-4',
          lotNumber: '6586-4',
          label: 'ADRAVIL TAB 20 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: null,
        },
      ],
    ]);

    normalized = normalizeProductsList(
      [
        {
          Name: '6586-3',
          Id: 'a3P0T00000007rwUAA',
          OCE__Product__r: {
            Name: 'ADRAVIL TAB 10 MG Physical',
          },
          OCE__Product__c: 'a4h0T0000004XVtQAM',
          OCE__IsActive__c: true,
        },
        {
          Name: '6586-4',
          Id: 'b3P0T00000007rwUAb',
          OCE__Product__r: {
            Name: 'ADRAVIL TAB 20 MG Physical',
          },
          OCE__Product__c: 'a4h0T0000004XVtQAM',
          OCE__IsActive__c: true,
        },
      ],
      [
        {
          OCE__IsDiscrepancy__c: true,
          IsDeleted: false,
          Name: 'ID-00000078',
          OCE__PhysicalCount__c: 10,
          OCE__Product__c: 'a4h0T0000004Xa3QAE',
          CreatedDate: '2020-09-25T07:49:22.000+0000',
          OCE__Lot__r: {
            Name: 'B-001-1-1',
          },
          OCE__SystemCount__c: 21,
          Id: 'a510T0000000TpVQAU',
          OCE__Product__r: {
            Name: 'Azelastine 100 MG',
          },
          OCE__SampleInventory__c: 'a520T00000006Q0QAI',
          OCE__Lot__c: 'a3P0T00000007rwUAA',
          OCE__Status__c: 'In Progress',
        },
      ],
      [],
      [
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'TransferIn',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'a3P0T00000007rwUAA',
          OCE__Quantity__c: 5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'TransferOut',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'a3P0T00000007rwUAA',
          OCE__Quantity__c: 5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'Adjustment',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: 5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'Adjustment',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: -5,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'AcknowledgementOfShipment',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: 0,
        },
        {
          OCE__SampleTransaction__r: {
            RecordType: {
              DeveloperName: 'Return',
            },
            OCE__TransactionDateTime__c: '2020-09-28T11:03:20.000+0000',
          },
          OCE__LotNumber__c: 'b3P0T00000007rwUAb',
          OCE__Quantity__c: 0,
        },
      ]
    );

    expect(normalized).toStrictEqual([
      [
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: '',
          lotNumberId: 'a3P0T00000007rwUAA',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-3',
          lotNumber: '6586-3',
          label: 'ADRAVIL TAB 10 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: null,
        },
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: '',
          lotNumberId: 'b3P0T00000007rwUAb',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-4',
          lotNumber: '6586-4',
          label: 'ADRAVIL TAB 20 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: null,
        },
      ],
      [
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: '',
          lotNumberId: 'a3P0T00000007rwUAA',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-3',
          lotNumber: '6586-3',
          label: 'ADRAVIL TAB 10 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: null,
        },
        {
          deleted: false,
          locked: true,
          hasQuantityError: false,
          discrepancyReason: '',
          lotNumberId: 'b3P0T00000007rwUAb',
          sampleProductId: 'a4h0T0000004XVtQAM',
          detailLabel: '6586-4',
          lotNumber: '6586-4',
          label: 'ADRAVIL TAB 20 MG Physical',
          quantityIn: 5,
          quantityOut: 5,
          openingBalance: 0,
          systemCount: 0,
          physicalQuantity: null,
        },
      ],
    ]);
  });

  it('normalizeProductsHistoryList: should return normalized history', () => {
    const normalized = normalizeProductsHistoryList([
      {
        OCE__SampleTransaction__r: {
          RecordType: 'RecordType',
          OCE__TransactionDateTime__c: 'date',
        },
        OCE__Quantity__c: 1,
        OCE__Product__c: 1,
        OCE__Product__r: {
          Name: 'Name',
        },
        OCE__LotNumber__c: 1,
        OCE__LotNumber__r: {
          Name: 'LotName',
        },
      },
    ]);

    expect(normalized).toStrictEqual([
      {
        lotId: 1,
        lotNumber: 'LotName',
        productId: 1,
        productName: 'Name',
        quantity: 1,
        recordType: 'RecordType',
        transactionDateTime: 'MMM D, YYYY hh:mm A',
      },
    ]);
  });
});
