import React from 'react';
import ManageLots from './ManageLots';
import { useBanner, useBoolean } from '../../hooks';
import * as api from '../../api/ManageLots';
import { normalizeLots } from '../DashboardScreen/ManageLotsWidget/utils';
import { FlatList } from 'react-native';
import { Button } from 'apollo-react-native';
import { render, act, waitFor } from '@testing-library/react-native';

jest.mock('../../hooks');

jest.mock('../DashboardScreen/ManageLotsWidget/utils');

const navigation = {
  navigate: jest.fn(),
};

const setBanner = jest.fn();
const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
];
const data = [
  {
    name: 'LA-000778',
    lotId: 'a1Yf4000000kxHbEAI',
    lastModified: '2020-07-21T11:51:38.000+0000',
    lot: {
      name: 'L-0001',
      productId: 'a22f4000000kaTyAAI',
      product: {
        name: 'OKSF-2834_1',
      },
    },
    expirationDate: null,
    createdDate: '2019-06-22T22:05:40.000+0000',
    isActive: true,
    id: 'a2Af400000ZgLGKEA3',
  },
  {
    name: 'LA-000778',
    lotId: 'a1Yf4000000kxHbEAI',
    lastModified: '2020-07-21T11:51:38.000+0000',
    lot: {
      name: 'L-0003',
      productId: 'a22f4000000kaTyAAI',
      product: {
        name: 'OKSF-23434_2',
      },
    },
    expirationDate: null,
    createdDate: '2019-06-22T22:05:40.000+0000',
    isActive: true,
    id: 'a2Af400000ZgLGKEA2',
  },
];

let changeLotStatus, fetchLotsOffset;

describe('ManageLots', () => {
  beforeEach(() => {
    normalizeLots.mockImplementation(() => d => d);
    fetchLotsOffset = jest
      .spyOn(api, 'fetchLotsOffset')
      .mockReturnValueOnce([[data[0]]])
      .mockReturnValue([[data[1]]]);
    changeLotStatus = jest.spyOn(api, 'changeLotStatus').mockReturnValue();

    useBanner.mockReturnValue(useBannerValue);
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });
  
  it('Should render without error', async () => {
    const { container } = render(<ManageLots navigation={navigation} />)
    
    act(() => container.findByType(FlatList).props.onEndReached());

    act(() =>
      container.findAllByType(Button)[0].props.onPress()
    );
    act(() =>
      container.findAllByType(Button)[1].props.onPress()
    );

    expect(navigation.navigate).toHaveBeenCalled();
    expect(fetchLotsOffset).toHaveBeenCalledTimes(2);
  });
});

describe('ManageLots error', () => {
  beforeEach(() => {
    normalizeLots.mockImplementation(() => d => d);
    jest
      .spyOn(api, 'fetchLotsOffset')
      .mockRejectedValue({ message: 'error message' });

    useBanner.mockReturnValue(useBannerValue);
    useBoolean.mockReturnValue([
      true,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });
  it('Should render with error', async () => {
    const { getByText } = render(<ManageLots navigation={navigation} />)

    await waitFor(() => {
      expect(getByText('error message')).toBeTruthy()
    })
  });
});
