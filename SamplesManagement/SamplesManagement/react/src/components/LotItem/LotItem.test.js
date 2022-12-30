import React from 'react';
import renderer, { act } from 'react-test-renderer';
import LotItem from './LotItem';
import { TouchableOpacity } from 'react-native';
import { externalNavigator } from 'oce-apps-bridges';
import { Switch } from 'apollo-react-native';

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
    const tree = renderer.create(
      <LotItem item={item} handleStatusChange={handleStatusChange} />
    );
    act(() => tree.root.findAllByType(TouchableOpacity)[0].props.onPress());
    expect(redirectURL).toEqual(
      `{EndPoint}&retURL=%2Fone%2Fone.app%3F%23%2FsObject%2F${item.lot.productId}%2Fview`
    );

    act(() => tree.root.findAllByType(TouchableOpacity)[1].props.onPress());
    expect(redirectURL).toEqual(
      `{EndPoint}&retURL=%2Fone%2Fone.app%3F%23%2FsObject%2F${item.lotId}%2Fview`
    );

    act(() => tree.root.findByType(Switch).props.onChange());
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
