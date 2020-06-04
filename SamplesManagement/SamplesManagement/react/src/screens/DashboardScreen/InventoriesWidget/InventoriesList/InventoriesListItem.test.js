import React from 'react';
import renderer from 'react-test-renderer';
import InventoriesListItem from './InventoriesListItem';

let item;

describe('InventoriesListItem', () => {
  beforeEach(() => {
    item = {
      OCE__SampleInventoryDetails__r: {
        totalSize: 1,
      },
      OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
      OCE__Status__c: 'Submitted',
    };
  });

  it('Should render InventoriesListItem component', () => {
    const tree = renderer.create(<InventoriesListItem item={item} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
