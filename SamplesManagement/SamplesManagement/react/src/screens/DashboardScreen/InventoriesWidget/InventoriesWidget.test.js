import React from 'react';
import InventoriesWidget from './InventoriesWidget';
import { useFetcher, useHandleData } from '../../../hooks';
import { render } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      addListener: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

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

describe('InventoriesWidget', () => {
  beforeEach(() => {
    useFetcher.mockReturnValue([
      { loading: false, data: inventories },
      { handleFetch: jest.fn() },
    ]);

    useHandleData.mockImplementation(({ data }) => fn => fn(data));
  });

  it('Should render InventoriesWidget component with list', async () => {
    const navContextValue = {
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn()),
    };

    const { getByText } = render(
      <NavigationContext.Provider value={navContextValue}>
        <InventoriesWidget recordTypes={recordTypes} />
      </NavigationContext.Provider>
    );

    expect(getByText(/Ad Hoc Inventory/)).toBeTruthy();
    expect(getByText(/Audited Inventory/)).toBeTruthy();
    expect(getByText(/Initial Inventory/)).toBeTruthy();
    expect(getByText(/Periodic Inventory/)).toBeTruthy();
  });
});
