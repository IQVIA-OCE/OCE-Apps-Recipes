import React from 'react';
import SampleTransaction, {
  markTransactionAsDuplicate,
} from './SampleTransaction';
import { AppContext } from '../../../AppContext';
import { useFetcher, useBanner, useBoolean } from '../../hooks';
import renderer, { act } from 'react-test-renderer';
import initialFormValues from './initialFormValues';
import { Button } from 'apollo-react-native';

import {
  saveTransaction,
  fetchSampleProducts,
  deleteFormProduct,
} from '../../api/SampleTransaction';
import { Formik } from 'formik';
import { TouchableOpacity } from 'react-native';

jest.mock('../../api/SampleTransaction');
jest.mock('../../../bridge/EnvironmentData/EnvironmentData.native');
jest.mock('./initialFormValues');

jest.mock('../../hooks', () => {
  const originalModule = jest.requireActual('../../hooks');

  return {
    __esModule: true,
    ...originalModule,
    useBanner: jest.fn(),
    useBoolean: jest.fn(),
  };
});

jest.mock('moment', () => {
  const mMoment = {
    format: jest.fn(() => 'Sep 2 2020 09:53 am'),
    add: jest.fn().mockReturnThis(),
  };
  const fn = jest.fn(newMoment => {
    return mMoment;
  });

  return fn;
});

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
    Id: 'a3J0w0000009SIgEAS',
    Name: '6586-2',
    OCE__ExpirationDate__c: '2020-10-15',
    OCE__IsActive__c: true,
    OCE__Product__c: 'a4Z0w000000CiaxEAC',
    OCE__Product__r: {
      Name: 'ADRAVIL TAB 10 MG Physical',
      OCE__SKU__c: null,
    },
  },
];

const navigationToViewMode = {
  getParam: jest.fn().mockImplementation((value, defaultValue) => {
    if (value == 'readonly') return true;
    if (value == 'recordType')
      return {
        DeveloperName: 'AcknowledgementOfShipment',
        Name: 'Name',
      };

    return defaultValue;
  }),
  navigate: jest.fn(),
};
const navigationToEditMode = {
  getParam: jest.fn().mockImplementation((value, defaultValue) => {
    if (value == 'recordType')
      return {
        DeveloperName: 'AcknowledgementOfShipment',
        Name: 'Name',
      };
    if (value == 'id') return 'id';

    return defaultValue;
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
    fetchSampleProducts.mockImplementation(() => [products])
    deleteFormProduct.mockImplementation(() => true)
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

    saveTransaction.mockResolvedValue([{ id: '1' }]);
  });

  it('should render component in edit mode', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleTransaction navigation={navigationToEditMode} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(Button)[0].props.onPress());
    expect(navigationToEditMode.navigate).toBeCalledWith('Dashboard');

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render component in view mode', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleTransaction navigation={navigationToViewMode} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(Button)[0].props.onPress());
    expect(navigationToViewMode.navigate).toBeCalledWith('Dashboard');

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should show error on save/submit', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleTransaction navigation={navigationToEditMode} />
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

  it('should delete transaction', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleTransaction navigation={navigationToViewMode} />
      </AppContext.Provider>
    );

    await act(() => tree.root.findAllByType(Button)[2].props.onPress());

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(setBanner).toBeCalledWith({
      icon: 'checkbox-marked-circle',
      message: 'Successfully deleted.',
      variant: 'success',
      visible: true,
    });
  });

  it('should submit component', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <AppContext.Provider value={{ username: 'name' }}>
        <SampleTransaction navigation={navigationToEditMode} />
      </AppContext.Provider>
    );

    act(() => tree.root.findAllByType(Button)[1].props.onPress());
    await act(
      async () =>
        await tree.root.findByType(Formik).props.onSubmit({
          products: [{}],
          recordType: { DeveloperName: 'AcknowledgementOfShipment', Id: '1' },
          fields: {
            status: 'In Progress',
            transactionRep: { Id: '1' },
            toSalesRep: { value: 'toSalesRep' },
            toSalesRepTerritory: 'toSalesRepTerritory',
            territory: { name: 'Territory' },
            conditionOfPackage: { label: 'label' },
            transactionRep: { Id: '1' },
            user: {
              Id: '1',
            },
          },
        })
    );
    await expect(saveTransaction()).resolves.toEqual([{ id: '1' }]);
    jest.advanceTimersByTime(3000);

    expect(tree.toJSON()).toMatchSnapshot();

    act(() => tree.root.findAllByType(Button)[2].props.onPress());
    await act(
      async () =>
        await tree.root.findByType(Formik).props.onSubmit({
          products: [{ sampleProductId: 'sampleProductId', quantity: '1' }],
          recordType: { DeveloperName: 'AcknowledgementOfShipment', Id: '1' },
          fields: {
            status: 'In Progress',
            transactionRep: { Id: '1' },
            toSalesRep: { value: 'toSalesRep' },
            toSalesRepTerritory: 'toSalesRepTerritory',
            territory: { name: 'Territory' },
            conditionOfPackage: { label: 'label' },
            transactionRep: { Id: '1' },
            user: {
              Id: '1',
            },
          },
        })
    );
    await act(() => promise);
  });
});
