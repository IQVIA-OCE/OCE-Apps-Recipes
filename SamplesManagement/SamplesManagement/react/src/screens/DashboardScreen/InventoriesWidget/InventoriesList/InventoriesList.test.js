import React from 'react';
import InventoriesList from './InventoriesList';
import { render } from '@testing-library/react-native';
import { NAMESPACE } from '../../../../constants/constants';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native');

useNavigation.mockImplementation(() => jest.fn());

let list;
const item = {
  [`${NAMESPACE}SampleInventoryDetails__r`]: {
    totalSize: 1,
  },
  [`${NAMESPACE}InventoryDateTime__c`]: '2020-03-13T16:53:50.000Z',
  [`${NAMESPACE}Status__c`]: 'Submitted',
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
