import React from 'react';
import SampleTransaction from './SampleTransaction';
import { AppContext } from '../../../AppContext';
import { useFetcher, useBanner, useBoolean } from '../../hooks';
import renderer, { act } from 'react-test-renderer';
import initialFormValues from './initialFormValues';
import { Button } from 'apollo-react-native';

import { saveFormDetails } from '../../api/SampleTransaction';
import { Formik } from 'formik';
import { TouchableOpacity } from 'react-native';

jest.mock('../../hooks');
jest.mock('../../api/SampleTransaction');
jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native');
jest.mock('./initialFormValues');

const products = [
  {
    Id: 'a3J0w0000009SIfEAM',
    Name: '6586-3',
    OCE__ExpirationDate__c: '2020-10-15',
    OCE__IsActive__c: true,
    OCE__Product__c: 'a4Z0w000000CiaxEAC',
    OCE__Product__r: {
      Name: 'ADRAVIL TAB 10 MG Physical',
      OCE__SKU__c: null,
    },
  },
  {
    Id: 'a3J0w0000009SIgEAM',
    Name: '6586-3',
    OCE__ExpirationDate__c: '2020-10-15',
    OCE__IsActive__c: true,
    OCE__Product__c: 'a4Z0w000000CiaxEAC',
    OCE__Product__r: {
      Name: 'ADRAVIL TAB 10 MG Physical',
      OCE__SKU__c: null,
    },
  },
];

const navigation = {
  getParam: jest.fn().mockReturnValue({
    DeveloperName: 'AcknowledgementOfShipment',
    Name: 'Name',
  }),
  navigate: jest.fn(),
};
const setBanner = jest.fn();
const useBannerValue = [
  { variant: '', message: '', visible: false, icon: '' },
  setBanner,
];

describe('SampleTransaction', () => {
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

    initialFormValues.AcknowledgementOfShipment = {
      receivedDate: '',
      conditionOfPackage: '',
      comments: '',
      status: 'In Progress',
      transactionDateTime: '2020-05-25',
      territory: {
        developerName: 'TMAur20A02T',
        name: 'TM - Aur',
        nameId: '1',
      },
      transactionRep: { Name: 'name', Id: undefined },
      user: { Name: 'name', Id: undefined },
    };

    saveFormDetails.mockResolvedValue([{ id: '1' }]);
  });

  it('should render component', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleTransaction navigation={navigation} />
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
        <SampleTransaction navigation={navigation} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(Button)[1].props.onPress());
    await act(async () => await tree.root.findByType(Formik).props.onSubmit());

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(setBanner).toBeCalledWith({
      icon: 'alert-circle',
      message: "Cannot read property 'products' of undefined",
      variant: 'error',
      visible: true,
    });
  });

  it('should submit component', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleTransaction navigation={navigation} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(Button)[1].props.onPress());
    await act(
      async () =>
        await tree.root.findByType(Formik).props.onSubmit({
          products: [{}],
          recordType: { DeveloperName: 'DeveloperName' },
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
          recordType: { DeveloperName: 'TransferOut' },
          fields: {
            toSalesRep: { value: 'toSalesRep' },
            toSalesRepTerritory: 'toSalesRepTerritory',
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
