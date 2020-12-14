import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InventoriesWidget from './InventoriesWidget';
import { useFetcher, useHandleData } from '../../../hooks';
import { TouchableOpacity } from 'react-native';

jest.mock('react-navigation', () => ({
  withNavigation: component => component,
}));

jest.mock('../../../hooks');

let inventories = {
  all: [
    {
      OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
      OCE__Status__c: 'Submitted',
      OCE__Reason__c: 'Reason',
    },
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 3,
      },
      OCE__InventoryDateTime__c: '2020-03-13T17:53:50.000Z',
      OCE__Status__c: 'In Progress',
    },
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 5,
      },
      OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 6,
      },
      OCE__InventoryDateTime__c: '2020-03-13T17:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 7,
      },
      OCE__InventoryDateTime__c: '2020-03-13T18:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 9,
      },
      OCE__InventoryDateTime__c: '2020-03-13T19:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
  ],
  AdHocInventory: [
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 5,
      },
      OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
  ],
  AuditedInventory: [
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 6,
      },
      OCE__InventoryDateTime__c: '2020-03-13T17:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
  ],
  InitialInventory: [
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 7,
      },
      OCE__InventoryDateTime__c: '2020-03-13T18:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
  ],
  PeriodicInventory: [
    {
      OCE__SampleInventoryDetails__r: {
        totalSize: 9,
      },
      OCE__InventoryDateTime__c: '2020-03-13T19:53:50.000Z',
      OCE__Status__c: 'Submitted',
    },
  ],
};

let recordTypes = {
  AdHocInventory: {
    Id: '0129D000000IYyPQAW',
    Name: 'Ad Hoc Inventory',
    DeveloperName: 'AdHocInventory',
    IsPersonType: false,
    IsActive: true,
  },
  AuditedInventory: {
    Id: '0129D000000IYyQQAW',
    Name: 'Audited Inventory',
    DeveloperName: 'AuditedInventory',
    IsPersonType: false,
    IsActive: true,
  },
  InitialInventory: {
    Id: '0129D000000IYyRQAW',
    Name: 'Initial Inventory',
    DeveloperName: 'InitialInventory',
    IsPersonType: false,
    IsActive: true,
  },
  PeriodicInventory: {
    Id: '0129D000000IYySQAW',
    Name: 'Periodic Inventory',
    DeveloperName: 'PeriodicInventory',
    IsPersonType: false,
    IsActive: true,
  },
};

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => fn()),
  getParam: jest
    .fn()
    .mockImplementationOnce(() => false)
    .mockImplementationOnce(() => true),
  navigate: jest.fn(),
};

describe('InventoriesWidget', () => {
  beforeEach(() => {
    useFetcher.mockReturnValue([
      { loading: false, data: inventories },
      { handleFetch: jest.fn() },
    ]);

    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });

  it('Should render InventoriesWidget component with list', async () => {
    let tree;
    const promise = Promise.resolve();
    act(() => {
      tree = renderer.create(
        <InventoriesWidget navigation={navigation} recordTypes={recordTypes} />
      );
    });
    await act(() => promise);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
