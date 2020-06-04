import React from 'react';
import SampleOrder from './SampleOrder';
import { AppContext } from '../../../AppContext';
import { useFetcher, useBanner, useBoolean, useHandleData } from '../../hooks';
import renderer, { act } from 'react-test-renderer';
import { Button } from 'apollo-react-native';

import { saveFormDetails } from '../../api/SampleOrder';
import { Formik } from 'formik';
import { TouchableOpacity } from 'react-native';

jest.mock('../../hooks');
jest.mock('../../api/SampleOrder');
jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native');
jest.mock('./initialFormValues');

const products = [
  {
    Id: 'a4Z0w000000CiapEAC',
    Name: 'PROZALAND 5 MCG 10 Physical',
    OCE__Product__c: 'a4Z0w000000CiaxEAC',
    OCE__ParentProduct__r: {
      Name: 'PROZALAND-DETAIL Sign',
    },
  },
  {
    Id: 'a4Z0w000000CiapEAB',
    Name: 'PROZALAND 10 MCG 10 Physical',
    OCE__Product__c: 'a4Z0w000000CiaxEAC',
    OCE__ParentProduct__r: {
      Name: 'PROZALAND-DETAIL Sign',
    },
  },
];

const navigation = {
  navigate: jest.fn(),
};
const setBanner = jest.fn();
const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
];

describe('SampleOrder', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    useFetcher.mockReturnValue([
      { data: products, loading: false },
      { handleFetch: jest.fn() },
    ]);
    useBanner.mockReturnValue(useBannerValue);
    useBoolean.mockReturnValue([false, { setTrue: jest.fn() }]);
    useHandleData.mockImplementation(({ data }) => fn => fn(data));

    initialFormValues = {
      isUrgent: false,
      comments: '',
      status: 'In Progress',
      territory: {
        developerName: 'TMAur20A02T',
        name: 'TM - Aur',
        nameId: '1',
      },
      user: { Name: 'name', Id: undefined },
      shipTo: null,
    };

    saveFormDetails.mockResolvedValue([{ id: '1' }]);
  });

  it('should render component', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder navigation={navigation} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(TouchableOpacity)[2].props.onPress());
    act(() => tree.root.findAllByType(Button)[0].props.onPress());
    expect(navigation.navigate).toBeCalledWith('Dashboard');

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should show error on save/submit', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder navigation={navigation} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(Button)[1].props.onPress());
    await act(async () => await tree.root.findByType(Formik).props.onSubmit());

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(setBanner).toBeCalledWith({
      icon: 'alert-circle',
      message: "Cannot read property 'fields' of undefined",
      variant: 'error',
      visible: true,
    });
  });

  it('should submit component', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleOrder navigation={navigation} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(Button)[1].props.onPress());
    await act(
      async () =>
        await tree.root.findByType(Formik).props.onSubmit({
          products: [{}],
        })
    );
    jest.advanceTimersByTime(1500);
    expect(navigation.navigate).toBeCalledWith('Dashboard');

    expect(tree.toJSON()).toMatchSnapshot();

    act(() => tree.root.findAllByType(Button)[2].props.onPress());
    await act(
      async () =>
        await tree.root.findByType(Formik).props.onSubmit({
          products: [{}],
          fields: {
            user: {
              Id: '1',
            },
          },
        })
    );
    await act(() => promise);
    expect(saveFormDetails).toHaveBeenCalled();
  });
});
