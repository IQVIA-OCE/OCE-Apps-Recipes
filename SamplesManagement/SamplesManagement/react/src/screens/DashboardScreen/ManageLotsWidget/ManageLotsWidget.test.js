import React from 'react';
import ManageLotsWidget from './ManageLotsWidget';
import { BannerContext } from '../BannerContext';
import { useFetcher, useHandleData } from '../../../hooks';

import LotItem from '../../../components/LotItem/LotItem';
import ViewAll from "../../../components/ViewAll/ViewAll";
jest.mock('../../../hooks');
jest.mock('../../../api/ManageLots');

import { render, act } from '@testing-library/react-native';

const lots = [
  {
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
          url:
            '/services/data/v43.0/sobjects/OCE__Product__c/a22f4000000kaTyAAI',
        },
      },
    },
    expirationDate: null,
    createdDate: '2019-06-22T22:05:40.000+0000',
    isActive: true,
    id: 'a2Af400000ZgLGKEA3',
  },
];

const navigation = {
  addListener: jest.fn().mockImplementation((_, fn) => fn()),
  getParam: jest
    .fn()
    .mockImplementation(() => false),
  navigate: jest.fn(),
};
const handleFetch = jest.fn();

describe('ManageLotsWidget', () => {
  beforeAll(() => {
    useFetcher
      .mockReturnValueOnce([lots, { handleFetch }])
      .mockReturnValue([[], { handleFetch }]);
    useHandleData.mockImplementation(data => fn => fn(data));
  });

  it('should render component', async () => {
    const promise = Promise.resolve();
    const { container, getByText } = render(
      <BannerContext.Provider value={[{}, jest.fn()]}>
        <ManageLotsWidget navigation={navigation} />
      </BannerContext.Provider>
    );

    await act(() => container.findByType(LotItem).props.handleStatusChange());

    act(() => container.findByType(ViewAll).props.onPress());

    await act(() => promise);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(getByText(/L-0001/)).toBeTruthy();
  });

  it('should render empty component message', async () => {
    const { getByText } = render(
      <BannerContext.Provider value={[{}, jest.fn()]}>
        <ManageLotsWidget navigation={navigation} />
      </BannerContext.Provider>
    );

    expect(getByText(/No active Lots available./)).toBeTruthy();
  });
});
