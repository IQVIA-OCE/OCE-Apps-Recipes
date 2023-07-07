import React from 'react';
import SampleTransaction, {
} from './SampleTransaction';
import { AppContext } from '../../AppContext';
import { useBanner, useBoolean } from '../../hooks';
import initialFormValues from './initialFormValues';
import { Button, Provider } from 'apollo-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  saveTransaction,
  fetchSampleProducts,
  deleteFormProduct,
} from '../../api/SampleTransaction';
import { Formik } from 'formik';
import { render, act } from '@testing-library/react-native';

jest.mock('../../api/SampleTransaction');
jest.mock('./initialFormValues');
jest.mock('@react-navigation/native');

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

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
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

const mockedNavigate = jest.fn();

useNavigation.mockImplementation(() => ({
  navigate: mockedNavigate
}));

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

  it('should render component in edit mode', () => {
    useRoute.mockReturnValue({
      params: {
        id: 'id',
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    })

    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    )
    act(() => container.findAllByType(Button)[0].props.onPress());
    
    expect(mockedNavigate).toBeCalledWith('Dashboard');

  });

  it('should render component in view mode', async () => {
    useRoute.mockReturnValue({
      params: {
        readonly: true,
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    );
    
    act(() => container.findAllByType(Button)[0].props.onPress());
    expect(mockedNavigate).toBeCalledWith('Dashboard');
  });

  it('should show error on save/submit', async () => {
    useRoute.mockReturnValue({
      params: {
        id: 'id',
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    )

    act(() => container.findAllByType(Button)[1].props.onPress());

    await act(async () => await container.findByType(Formik).props.onSubmit());

    expect(setBanner).toBeCalledWith({
      icon: 'alert-circle',
      message: expect.stringMatching(/Cannot read/),
      variant: 'error',
      visible: true,
    });
  });

  it('should delete transaction', async () => {
    useRoute.mockReturnValue({
      params: {
        readonly: true,
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    );

    await act(() => container.findAllByType(Button)[2].props.onPress());

    expect(setBanner).toBeCalledWith({
      icon: 'checkbox-marked-circle',
      message: 'Successfully deleted.',
      variant: 'success',
      visible: true,
    });
  });

  it('should submit component', async () => {
    useRoute.mockReturnValue({
      params: {
        id: 'id',
        recordType: {
          DeveloperName: 'AcknowledgementOfShipment',
          Name: 'Name'
        }
      }
    });

    const { container } = render(
      <AppContext.Provider value={{ username: 'name' }}>
        <Provider>
          <SampleTransaction />
        </Provider>
      </AppContext.Provider>
    );


    act(() => container.findAllByType(Button)[1].props.onPress());

    await act(
      async () =>
        await container.findByType(Formik).props.onSubmit({
          products: [{}],
          recordType: { DeveloperName: 'AcknowledgementOfShipment', Id: '1' },
          fields: {
            status: 'In Progress',
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

    act(() => container.findAllByType(Button)[2].props.onPress());

    await act(
      async () =>
        await container.findByType(Formik).props.onSubmit({
          products: [{ sampleProductId: 'sampleProductId', quantity: '1' }],
          recordType: { DeveloperName: 'AcknowledgementOfShipment', Id: '1' },
          fields: {
            status: 'In Progress',
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
  });
});
