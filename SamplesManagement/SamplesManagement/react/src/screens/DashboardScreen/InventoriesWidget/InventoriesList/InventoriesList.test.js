import React from 'react';
import InventoriesList from './InventoriesList';
import { render } from '@testing-library/react-native';

jest.mock('react-navigation', () => ({
  withNavigation: component => component,
}));

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
    const { getAllByText } = render(<InventoriesList list={list} />);


    expect(getAllByText(/Product Sample Details/)).toBeTruthy();
  });
});
