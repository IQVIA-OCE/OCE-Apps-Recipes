import React from 'react';
import renderer from 'react-test-renderer';
import InventoriesList from './InventoriesList';

let list;
const item = {
  OCE__SampleInventoryDetails__r: {
    totalSize: 1,
  },
  OCE__InventoryDateTime__c: '2020-03-13T16:53:50.000Z',
  OCE__Status__c: 'Submitted',
};
describe('InventoriesList', () => {
  beforeEach(() => {
    list = [item, item, item, item, item, item];
  });

  it('Should render InventoriesList component', () => {
    const tree = renderer.create(<InventoriesList list={list} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
