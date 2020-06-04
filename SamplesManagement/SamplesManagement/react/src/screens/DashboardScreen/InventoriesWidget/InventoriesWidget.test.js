import React from 'react';
import renderer from 'react-test-renderer';
import InventoriesWidget from './InventoriesWidget';

let inventories, recordTypes;

describe('InventoriesWidget', () => {
  beforeEach(() => {
    inventories = {
      all: [
        {
          OCE__SampleInventoryDetails__r: {
            totalSize: 1
          },
          OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
          OCE__Status__c: 'Submitted'
        },
        {
          OCE__SampleInventoryDetails__r: {
            totalSize: 3
          },
          OCE__InventoryDateTime__c: '2020-03-13T17:53:50.000Z',
          OCE__Status__c: 'In Progress'
        }
      ],
      AdHocInventory: [],
      AuditedInventory: [],
      InitialInventory: [],
      PeriodicInventory: [],
    };

    recordTypes = {
      AdHocInventory: {
        Id: '0129D000000IYyPQAW',
        Name: 'Ad Hoc Inventory',
        DeveloperName: 'AdHocInventory',
        IsPersonType: false,
        IsActive: true
      },
      AuditedInventory: {
        Id: '0129D000000IYyQQAW',
        Name: 'Audited Inventory',
        DeveloperName: 'AuditedInventory',
        IsPersonType: false,
        IsActive: true
      },
      InitialInventory: {
        Id: '0129D000000IYyRQAW',
        Name: 'Initial Inventory',
        DeveloperName: 'InitialInventory',
        IsPersonType: false,
        IsActive: true
      },
      PeriodicInventory: {
        Id: '0129D000000IYySQAW',
        Name: 'Periodic Inventory',
        DeveloperName: 'PeriodicInventory',
        IsPersonType: false,
        IsActive: true
      },
    }
  });

  it('Should render InventoriesWidget component with list', () => {
    const tree = renderer
      .create(
        <InventoriesWidget inventories={inventories} recordTypes={recordTypes} error={null}/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Should render InventoriesWidget component error', () => {
    const tree = renderer
      .create(
        <InventoriesWidget inventories={inventories} recordTypes={recordTypes} error={{message: 'error'}}/>
      ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
