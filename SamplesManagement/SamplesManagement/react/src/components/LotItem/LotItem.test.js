import React from 'react';
import LotItem from './LotItem';
import { externalNavigator } from '@oce-apps/oce-apps-bridges';
import {render, act, fireEvent} from '@testing-library/react-native';

const item = {
  attributes: {
    type: 'OCE__SampleLotAllocation__c',
    url:
      '/services/data/v43.0/sobjects/OCE__SampleLotAllocation__c/a2Af400000ZgLGKEA3',
  },
  name: 'LA-000778',
  lotId: 'a1Yf4000000kxHbEAI',
  lastModified: '2020-07-21T11:51:38.000+0000',
  lot: {
    name: 'L-0001',
    attributes: {
      url: '/services/data/v43.0/sobjects/OCE__Lot__c/a1Yf4000000kxHbEAI',
      type: 'OCE__Lot__c',
    },
    productId: 'a22f4000000kaTyAAI',
    product: {
      name: 'OKSF-2834_1',
      attributes: {
        type: 'OCE__Product__c',
        url: '/services/data/v43.0/sobjects/OCE__Product__c/a22f4000000kaTyAAI',
      },
    },
  },
  expirationDate: null,
  createdDate: '2019-06-22T22:05:40.000+0000',
  isActive: true,
  id: 'a2Af400000ZgLGKEA3',
};
const handleStatusChange = jest.fn();
let redirectURL;

describe('LotItem', () => {
  beforeEach(() => {
    externalNavigator.open.mockImplementation(arg => {
      redirectURL = arg;
    });
  });
  it('should render component', () => {
    const { getByTestId } = render(
      <LotItem item={item} handleStatusChange={handleStatusChange} />
    );

    act(() => fireEvent.press(getByTestId('navigateToProduct')));

    expect(redirectURL).toEqual(
      `{EndPoint}&retURL=%2Fone%2Fone.app%3F%23%2FsObject%2F${item.lot.productId}%2Fview`
    );

    act(() => fireEvent.press(getByTestId('navigateToLot')));
    expect(redirectURL).toEqual(
      `{EndPoint}&retURL=%2Fone%2Fone.app%3F%23%2FsObject%2F${item.lotId}%2Fview`
    );

    act(() => fireEvent(getByTestId('statusChangeSwitch'), 'onChange'));

    expect(handleStatusChange).toBeCalled();
  });
});
